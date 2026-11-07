const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { linuxOnly } = require('./support/platform.cjs');
const root = path.resolve(__dirname, '../..');

// runner.sh also takes a machine lock shared by every harness gate. Give the nested
// runs in this file their own, or they would queue behind the gate running them.
process.env.HARNESS_MACHINE_LOCK = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'machine-lock-')), 'verify.lock');

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness test '));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'harness/checks'), { recursive: true });
  fs.cpSync(path.join(root, 'harness/lib'), path.join(dir, 'harness/lib'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), '{}');
  return dir;
}
function run(dir, body, env = {}) {
  return spawnSync('bash', ['-c', `set -uo pipefail\nsource harness/lib/runner.sh\n${body}`], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, HARNESS_CHANGE: '', ...env }, timeout: 15000,
  });
}
function summary(dir) {
  const run = fs.readdirSync(path.join(dir, 'harness/runs')).find((name) => !name.startsWith('.'));
  return JSON.parse(fs.readFileSync(path.join(dir, 'harness/runs', run, 'summary.json'), 'utf8'));
}
test('runner records pass, failed command and missing script; keeps collecting evidence', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const result = run(dir, 'step good true\nstep broken bash -c "exit 7"\nrequire_step missing lint\nstep later true');
  assert.equal(result.status, 1, result.stderr);
  const report = summary(dir);
  assert.equal(report.status, 'failed');
  assert.deepEqual(report.steps.map((step) => step.exitCode), [0, 7, 1, 0]);
  assert.ok(report.steps.every((step) => step.durationSeconds >= 0 && step.log.endsWith('.log')));
  assert.ok(report.durationSeconds >= 0);
});
test('runner records a successful run and revision metadata without dumping environment', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const result = run(dir, 'step good true', { HARNESS_TEST_SECRET: 'never-record-this' });
  assert.equal(result.status, 0, result.stderr);
  const report = summary(dir);
  assert.equal(report.status, 'passed');
  assert.equal(report.revision, null);
  assert.equal(report.nodeVersion, process.version);
  assert.ok(!JSON.stringify(report).includes('never-record-this'));
});
test('runner times out hung commands and still runs the following step', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const result = run(dir, 'step hung sleep 20\nstep later true', { HARNESS_STEP_TIMEOUT_SECONDS: '1' });
  assert.equal(result.status, 1, result.stderr);
  assert.deepEqual(summary(dir).steps.map((step) => step.exitCode), [124, 0]);
});
test('runner rejects concurrent verification before starting a step', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const result = run(dir, 'step locked bash -c "source harness/lib/runner.sh"');
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /Another verification/);
  assert.equal(fs.readdirSync(path.join(dir, 'harness/runs')).filter((name) => !name.startsWith('.')).length, 1);
  assert.equal(run(dir, 'step after true').status, 0, 'lock must release after exit');
});
test('runner marks trapped termination interrupted', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const result = run(dir, 'step before true\nkill -TERM $$');
  assert.equal(result.status, 143, result.stderr);
  assert.equal(summary(dir).status, 'interrupted');
});
test('runner rejects timeout configurations that disable the bound', (t) => {
  const dir = fixture(t);
  for (const value of ['0', '-1', 'invalid']) {
    assert.equal(run(dir, 'step good true', { HARNESS_STEP_TIMEOUT_SECONDS: value }).status, 1);
  }
});
test('structure rejects empty reports and violations even when depcruise exits zero', (t) => {
  const dir = fixture(t);
  fs.copyFileSync(path.join(root, 'harness/checks/structure.sh'), path.join(dir, 'harness/checks/structure.sh'));
  fs.mkdirSync(path.join(dir, 'bin'));
  fs.writeFileSync(path.join(dir, 'bin/pnpm'), '#!/bin/sh\ncat report.json\n', { mode: 0o755 });
  for (const [report, expected] of [
    [{ modules: [], summary: { totalCruised: 0, error: 0 } }, 1],
    [{ modules: [{}], summary: { totalCruised: 1, error: 1, violations: ['bad import'] } }, 1],
    [{ modules: [{}], summary: { totalCruised: 1 } }, 1],
    [{ modules: [{}], summary: { totalCruised: 1, error: 0 } }, 0],
  ]) {
    fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report));
    const result = spawnSync('bash', ['harness/checks/structure.sh'], {
      cwd: dir, encoding: 'utf8', env: { ...process.env, PATH: `${dir}/bin:${process.env.PATH}` },
    });
    assert.equal(result.status, expected, result.stdout + result.stderr);
  }
});
test('quality gate fails on missing assets, empty manifest and over-budget bytes', (t) => {
  const dir = fixture(t);
  fs.copyFileSync(path.join(root, 'harness/checks/quality.mjs'), path.join(dir, 'harness/checks/quality.mjs'));
  fs.mkdirSync(path.join(dir, '.next'));
  const invoke = () => spawnSync(process.execPath, ['harness/checks/quality.mjs'], { cwd: dir, encoding: 'utf8', env: { ...process.env, NEXT_DIST_DIR: '.next' } });
  const manifest = (files) => fs.writeFileSync(path.join(dir, '.next/build-manifest.json'), JSON.stringify({ rootMainFiles: files }));
  assert.equal(invoke().status, 1);
  manifest([]);
  assert.equal(invoke().status, 1);
  manifest(['missing.js']);
  const missing = invoke();
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /missing bundle asset/);
  fs.writeFileSync(path.join(dir, '.next/ok.js'), 'console.log("ok");');
  manifest(['ok.js']);
  assert.equal(invoke().status, 0);
  const { randomBytes } = require('node:crypto');
  fs.writeFileSync(path.join(dir, '.next/large.js'), randomBytes(300 * 1024));
  manifest(['large.js']);
  assert.equal(invoke().status, 1);
});

test('full gate runs each test suite once and blocks quality after failed build', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  fs.copyFileSync(path.join(root, 'harness/verify.sh'), path.join(dir, 'harness/verify.sh'));
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src/app.js'), '// application fixture');
  for (const file of ['audit-harness.sh', 'checks/project-readiness.sh', 'checks/memory-secrets.sh', 'checks/structure.sh']) {
    fs.writeFileSync(path.join(dir, 'harness', file), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  }
  for (const file of ['no-format-churn.mjs']) {
    fs.writeFileSync(path.join(dir, 'harness/checks', file), '');
  }
  const scripts = Object.fromEntries(['theme:build', 'lint', 'typecheck', 'test:harness', 'test:unit', 'build', 'verify:quality'].map((name) => [name, 'fixture']));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts }));
  fs.mkdirSync(path.join(dir, 'bin'));
  fs.writeFileSync(path.join(dir, 'bin/pnpm'), '#!/bin/sh\nif [ "$2" = build ]; then exit 2; fi\nexit 0\n', { mode: 0o755 });
  const result = spawnSync('bash', ['harness/verify.sh'], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, PATH: `${dir}/bin:${process.env.PATH}` }, timeout: 15000,
  });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  const steps = summary(dir).steps;
  assert.equal(steps.filter((step) => step.name === 'harness-tests').length, 1);
  assert.equal(steps.filter((step) => step.name === 'unit-tests').length, 1);
  assert.equal(steps.find((step) => step.name === 'build').exitCode, 2);
  assert.ok(!steps.some((step) => step.name === 'quality-thresholds'));
  assert.match(result.stdout, /blocked by failed build/);
});

test('unit wrapper discovers nested files with spaces, excludes harness, fails on empty/failing suite', (t) => {
  const dir = fixture(t);
  fs.copyFileSync(path.join(root, 'harness/test-unit.sh'), path.join(dir, 'harness/test-unit.sh'));
  fs.writeFileSync(path.join(dir, 'harness/register-node-alias.mjs'), '');
  fs.mkdirSync(path.join(dir, 'src/nested folder'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'harness/excluded.test.cjs'), 'throw new Error("must not run");');
  // A nested node --test inherits the parent runner's IPC context otherwise.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const invoke = () => spawnSync('bash', ['harness/test-unit.sh'], { cwd: dir, encoding: 'utf8', env, timeout: 10000 });
  assert.equal(invoke().status, 1, 'empty suite must not be green');
  const file = path.join(dir, 'src/nested folder/example.test.cjs');
  fs.writeFileSync(file, 'require("node:test")("application fixture", () => {});');
  const pass = invoke();
  assert.equal(pass.status, 0, pass.stdout + pass.stderr);
  assert.match(pass.stdout, /application fixture/);
  fs.writeFileSync(file, 'throw new Error("fixture failure");');
  assert.equal(invoke().status, 1);
});


test('quality gate reads the isolated build directory instead of stale default output', (t) => {
  const dir = fixture(t);
  fs.copyFileSync(path.join(root, 'harness/checks/quality.mjs'), path.join(dir, 'harness/checks/quality.mjs'));
  fs.mkdirSync(path.join(dir, '.next-isolated'));
  fs.writeFileSync(path.join(dir, '.next-isolated/build-manifest.json'), JSON.stringify({rootMainFiles:['ok.js']}));
  fs.writeFileSync(path.join(dir, '.next-isolated/ok.js'), 'console.log("isolated");');
  const result = spawnSync(process.execPath, ['harness/checks/quality.mjs'], {cwd:dir, encoding:'utf8',env:{...process.env,NEXT_DIST_DIR:'.next-isolated'}});
  assert.equal(result.status,0,result.stderr);
  fs.unlinkSync(path.join(dir, '.next-isolated/ok.js'));
  const missing = spawnSync(process.execPath, ['harness/checks/quality.mjs'], {cwd:dir, encoding:'utf8',env:{...process.env,NEXT_DIST_DIR:'.next-isolated'}});
  assert.equal(missing.status,1);
  assert.match(missing.stderr,/missing bundle asset/);
});

test('runner queues on the shared machine lock and gives up after the wait limit', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const holder = require('node:child_process').spawn('flock', [process.env.HARNESS_MACHINE_LOCK, 'sleep', '10'], { stdio: 'ignore' });
  t.after(() => holder.kill());
  spawnSync('sleep', ['0.3']);
  const result = run(dir, 'echo REACHED', { HARNESS_LOCK_WAIT_SECONDS: '1' });
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /Waiting for another harness gate/);
  assert.match(result.stderr, /Gave up after 1s/);
  assert.doesNotMatch(result.stdout, /REACHED/);
});

test('a helper left running by a step does not keep the locks', { skip: linuxOnly }, (t) => {
  const dir = fixture(t);
  const result = run(dir, "step leaves-helper bash -c 'sleep 30 >/dev/null 2>&1 &'");
  assert.equal(result.status, 0, result.stderr);
  for (const file of [process.env.HARNESS_MACHINE_LOCK, path.join(dir, 'harness/runs/.verify.lock')]) {
    const probe = spawnSync('flock', ['-n', file, 'true']);
    assert.equal(probe.status, 0, `${file} still held after the gate exited`);
  }
});
