const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const test = require('node:test');
const { linuxOnly } = require('./support/platform.cjs');
const root = path.resolve(__dirname, '../..');

// runner.sh also takes a machine lock shared by every harness gate. Give the nested
// runs in this file their own, or they would queue behind the gate running them.
process.env.HARNESS_MACHINE_LOCK = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'machine-lock-')), 'verify.lock');
const workflow = import(pathToFileURL(path.join(root, 'harness/lib/workflow.mjs')).href);
function git(dir, ...args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}
function write(dir, file, text) {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  fs.writeFileSync(path.join(dir, file), text);
}
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow test '));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q');
  write(dir, 'src/example.js', 'export const value = 1;');
  write(dir, 'openspec/changes/example/proposal.md', '# Example\n**Status:** in-progress\n\nA task.');
  write(dir, 'openspec/changes/example/tasks.md', '- [x] 1.1 Earlier task\n- [ ] 1.2 Next task\n- [ ] 1.3 Later task\n');
  write(dir, 'openspec/changes/example/specs/main/spec.md', 'Expected behavior.');
  write(dir, 'harness/PROGRESS.md', '# Progress\n');
  write(dir, '.gitignore', 'harness/runs/\n');
  fs.cpSync(path.join(root, 'harness/lib'), path.join(dir, 'harness/lib'), { recursive: true });
  fs.copyFileSync(path.join(root, 'harness/task.mjs'), path.join(dir, 'harness/task.mjs'));
  git(dir, 'add', '.');
  git(dir, '-c', 'user.name=Harness Test', '-c', 'user.email=harness@example.invalid', 'commit', '-qm', 'fixture');
  return dir;
}
function run(dir, body, change = '') {
  return spawnSync('bash', ['-c', `set -uo pipefail\nsource harness/lib/runner.sh\n${body}`], {
    cwd: dir, encoding: 'utf8', timeout: 20000,
    env: { ...process.env, HARNESS_CHANGE: change },
  });
}
function latest(dir) {
  return 'harness/runs/' + fs.readdirSync(path.join(dir, 'harness/runs')).filter((name) => !name.startsWith('.')).sort().at(-1);
}
function report(dir) { return JSON.parse(fs.readFileSync(path.join(dir, latest(dir), 'summary.json'), 'utf8')); }

test('task parsing selects first unchecked task outside fenced examples and rejects ambiguity', async (t) => {
  const { parseTasks, taskContext } = await workflow;
  assert.deepEqual(parseTasks('```md\n- [ ] 0.1 Example\n```\n- [x] 1.1 Done\n- [ ] 1.2 Next').map((task) => task.id), ['1.1', '1.2']);
  assert.throws(() => parseTasks('- [ ] 1.1 A\n- [ ] 1.1 B'), /Duplicate/);
  assert.throws(() => parseTasks('- [ ] Unnumbered'), /numbered/);
  const dir = fixture(t);
  assert.equal(taskContext(dir, 'example').task.id, '1.2');
  assert.throws(() => taskContext(dir, '../archive'), /slug/);
  write(dir, 'openspec/changes/example/tasks.md', '- [x] 1.1 Done');
  assert.throws(() => taskContext(dir, 'example'), /No unchecked/);
});
test('context stays bounded, points to omitted material, and ignores unrelated history', async (t) => {
  const { taskContext } = await workflow;
  const dir = fixture(t);
  write(dir, 'openspec/changes/example/proposal.md', 'A'.repeat(20000));
  write(dir, 'harness/PROGRESS.md', Array.from({ length: 20 }, (_, i) => `## example ${i}\n${'B'.repeat(10000)}\n`).join('') + '## unrelated\nDO NOT INCLUDE');
  const context = taskContext(dir, 'example');
  assert.equal(context.proposalExcerpt.length, 1800);
  assert.equal(context.historyExcerpts.length, 3);
  assert.ok(context.historyExcerpts.every((part) => part.length <= 600));
  assert.ok(context.sources.includes('openspec/changes/example/specs/main/spec.md'));
  assert.ok(!JSON.stringify(context).includes('DO NOT INCLUDE'));
  assert.ok(JSON.stringify(context).length < 6000);
});
test('input digest catches tracked/untracked edits, delete, rename and mode, but survives identical commit', async (t) => {
  const { fingerprint } = await workflow;
  const dir = fixture(t);
  const initial = fingerprint(dir).digest;
  write(dir, 'src/example.js', 'changed');
  assert.notEqual(fingerprint(dir).digest, initial);
  write(dir, 'src/example.js', 'export const value = 1;');
  assert.equal(fingerprint(dir).digest, initial);
  write(dir, 'src/new file.js', 'new');
  const added = fingerprint(dir).digest;
  assert.notEqual(added, initial);
  git(dir, 'add', '.');
  git(dir, '-c', 'user.name=Harness Test', '-c', 'user.email=harness@example.invalid', 'commit', '-qm', 'new file');
  assert.equal(fingerprint(dir).digest, added);
  if (process.platform !== 'win32') { // Windows has no executable bit to change
    fs.chmodSync(path.join(dir, 'src/new file.js'), 0o755);
    assert.notEqual(fingerprint(dir).digest, added);
    fs.chmodSync(path.join(dir, 'src/new file.js'), 0o644);
  }
  fs.renameSync(path.join(dir, 'src/new file.js'), path.join(dir, 'src/renamed.js'));
  assert.notEqual(fingerprint(dir).digest, added);
  fs.unlinkSync(path.join(dir, 'src/renamed.js'));
  assert.equal(fingerprint(dir).digest, initial);
});
test('input digest hashes Git-normalized content, so CRLF Windows and LF Linux checkouts agree', async (t) => {
  const { fingerprint } = await workflow;
  const dir = fixture(t);
  git(dir, 'config', 'core.autocrlf', 'true');
  write(dir, 'src/lines.js', 'const a = 1;\nconst b = 2;\n');
  const lf = fingerprint(dir);
  assert.equal(lf.algorithm, 'sha256-v2');
  write(dir, 'src/lines.js', 'const a = 1;\r\nconst b = 2;\r\n');
  assert.equal(fingerprint(dir).digest, lf.digest);
  write(dir, 'src/lines.js', 'const a = 1;\r\nconst b = 3;\r\n');
  assert.notEqual(fingerprint(dir).digest, lf.digest);
});
test('task context reads CRLF tasks/proposal like LF ones (same task, same contract digest)', async (t) => {
  const { taskContext } = await workflow;
  const dir = fixture(t);
  const lf = taskContext(dir, 'example');
  for (const file of ['tasks.md', 'proposal.md']) {
    const target = path.join(dir, 'openspec/changes/example', file);
    fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace(/\n/g, '\r\n'));
  }
  const crlf = taskContext(dir, 'example');
  assert.equal(crlf.task.id, '1.2');
  assert.equal(crlf.task.title, lf.task.title);
  assert.equal(crlf.contractDigest, lf.contractDigest);
});
test('administrative updates do not stale code, but task/proposal/spec changes invalidate evidence', async (t) => {
  const { fingerprint, taskContext } = await workflow;
  const dir = fixture(t);
  const inputs = fingerprint(dir).digest;
  const contract = taskContext(dir, 'example').contractDigest;
  write(dir, 'harness/PROGRESS.md', 'Closing record');
  write(dir, '.engram/manifest.json', '{"chunks":[]}');
  write(dir, 'openspec/changes/example/handoff.md', 'Facts');
  write(dir, 'openspec/changes/example/tasks.md', '- [x] 1.1 Earlier task\n- [x] 1.2 Next task\n');
  write(dir, 'openspec/changes/example/proposal.md', '# Example\n**Status:** done\n\nA task.');
  assert.equal(fingerprint(dir).digest, inputs);
  assert.equal(taskContext(dir, 'example', '1.2').contractDigest, contract);
  write(dir, 'openspec/changes/example/proposal.md', '# Different requirement');
  assert.notEqual(taskContext(dir, 'example', '1.2').contractDigest, contract);
  write(dir, 'openspec/changes/example/tasks.md', '- [x] 1.2 Different task\n');
  assert.notEqual(taskContext(dir, 'example', '1.2').contractDigest, contract);
  write(dir, 'openspec/changes/example/specs/main/spec.md', 'Different scenario');
  assert.notEqual(fingerprint(dir).digest, inputs);
});
test('bound run saves context and ordered events; read-only handoff diagnoses stale evidence', { skip: linuxOnly }, async (t) => {
  const { inspectRun } = await workflow;
  const dir = fixture(t);
  const result = run(dir, 'step sample true', 'example');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const summary = report(dir);
  assert.equal(summary.task.id, '1.2');
  assert.equal(summary.activeStep, null);
  const events = fs.readFileSync(path.join(dir, latest(dir), 'events.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.deepEqual(events.map((event) => event.type), ['run-started', 'step-started', 'step-finished', 'run-finished']);
  assert.equal(inspectRun(dir, latest(dir)).fresh, true);
  const invoke = (command) => spawnSync(process.execPath, ['harness/task.mjs', command, latest(dir)], { cwd: dir, encoding: 'utf8' });
  assert.equal(invoke('status').status, 0);
  assert.match(invoke('handoff').stdout, /example \/ 1.2/);
  write(dir, 'src/example.js', 'after verification');
  assert.equal(invoke('status').status, 1);
  assert.match(invoke('handoff').stdout, /not current/);
  assert.equal(report(dir).status, 'passed', 'inspection never rewrites historical evidence');
});
test('changing verification inputs during a green step makes the whole run fail', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const result = run(dir, 'step mutate bash -c \'echo changed >> src/example.js\'', 'example');
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.equal(report(dir).steps[0].exitCode, 0);
  assert.equal(report(dir).inputChangedDuringRun, true);
  assert.equal(report(dir).status, 'failed');
});
test('interrupted active step remains observable and cannot certify completion', { skip: linuxOnly }, async (t) => {
  const { inspectRun } = await workflow;
  const dir = fixture(t);
  const result = run(dir, 'node harness/lib/evidence.mjs step-start pending\nkill -TERM $$', 'example');
  assert.equal(result.status, 143, result.stderr);
  assert.equal(report(dir).activeStep, 'pending');
  assert.equal(report(dir).status, 'interrupted');
  assert.equal(inspectRun(dir, latest(dir)).fresh, false);
});
test('legacy, running and failed reports never count as current passing evidence', async (t) => {
  const { fingerprint, inspectRun } = await workflow;
  const dir = fixture(t);
  for (const [schemaVersion, status, exitCode] of [[1, 'passed', 0], [2, 'running', 0], [2, 'failed', 1]]) {
    write(dir, 'harness/runs/fixture/summary.json', JSON.stringify({ schemaVersion, status, exitCode, inputs: fingerprint(dir), steps: [{ name: 'sample', exitCode: 0 }] }));
    assert.equal(inspectRun(dir, 'harness/runs/fixture').fresh, false);
  }
});
