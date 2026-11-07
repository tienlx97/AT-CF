// Guards for the DeepSeek Harness adoption (ADR-0004): the project overlay keeps
// data egress off and credentials out, and shared Engram memory is secret-scanned.
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const zlib = require('node:zlib');
const test = require('node:test');

const root = path.resolve(__dirname, '../..');
const readOverlay = (name) => fs.readFileSync(path.join(root, 'harness/dsh', name), 'utf8').replace(/\r\n/g, '\n');
const overlay = readOverlay('project.cordis.patch.yml');
const subagents = readOverlay('project.subagents.cordis.patch.yml');
const code = (text) => text.split('\n').filter((line) => !line.trimStart().startsWith('#')).join('\n');

test('dsh overlay disables DeepSeek request add-ons and wires Engram over MCP', () => {
  for (const row of ['session-log-deepseek', 'plugin-package-inventory-deepseek']) {
    assert.match(overlay, new RegExp(`^- id: ${row}\\n  disabled: true$`, 'm'), `${row} must stay disabled`);
  }
  assert.match(overlay, /serverName: engram\n\s+transport: stdio\n\s+command: engram\n\s+args: \[mcp\]/);
});

test('dsh overlays never carry credentials or widen the sandbox', () => {
  for (const body of [code(overlay), code(subagents)]) {
    assert.doesNotMatch(body, /api[_-]?key|authorization|bearer|secret|token|password|env:/i);
    assert.doesNotMatch(body, /danger|bypass|policy:\s*never|permissionMode:\s*(never|auto)\b/i);
  }
});

test('dsh overlays leave the driver model to each person (ADR-0004)', () => {
  // --patch overlays apply after the profile layer that Settings → Models writes,
  // so any model row here would silently override every person's choice.
  for (const body of [code(overlay), code(subagents)]) {
    assert.doesNotMatch(body, /id:\s*['"]?(agent-default-model|llm-pi-ai)\b/);
    assert.doesNotMatch(body, /dsh-(agent-default-model|llm-pi-ai|llm-deepseek)/);
    // dsh-plugin-subscriptions is allowed only in a person's own profile (ADR-0004).
    assert.doesNotMatch(body, /dsh-plugin-subscriptions|id:\s*['"]?llm-subscriptions\b/);
    assert.doesNotMatch(body, /^\s*(provider|model|providers|reasoningEffort):/m);
  }
});

test('subagent overlay delegates to Codex and Claude Code in sandboxed, non-bypass modes', () => {
  const body = code(subagents);
  assert.match(body, /^- id: subagent-codex\n {2}config:\n {4}permissionMode: approve-for-me$/m);
  assert.match(body, /^- id: subagent-claude-code\n {2}config:\n {4}permissionMode: acceptEdits$/m);
  // The installed bundles insert these rows; inserting them again would duplicate ids.
  assert.doesNotMatch(body, /insert:/);
});

test('project-task skill runs the Engram session lifecycle and shares it via engram sync', () => {
  const skill = fs.readFileSync(path.join(root, '.agents/skills/project-task/SKILL.md'), 'utf8');
  for (const tool of ['mem_current_project', 'mem_session_start', 'mem_context', 'mem_search', 'mem_save', 'mem_session_finalize']) {
    assert.match(skill, new RegExp(`\`${tool}\``), `skill must name ${tool}`);
  }
  assert.match(skill, /`engram sync`/);
  assert.match(skill, /`engram sync --import`/);
  assert.match(skill, /Never in memory/);
  // Engram 3.x refuses updates/deletes without the owning project.
  assert.match(skill, /expected_project: anh-tu-coffee/);
  assert.doesNotMatch(skill, /`mem_session_summary`|`mem_session_end`/, 'finalize replaces summary + end');
});

test('memory secret check scans gzipped Engram chunks', async (t) => {
  const { resolveBash } = await import(pathToFileURL(path.join(root, 'harness/lib/windows.mjs')).href);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-secrets-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'harness/checks'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.engram/chunks'), { recursive: true });
  fs.copyFileSync(path.join(root, 'harness/checks/memory-secrets.sh'), path.join(dir, 'harness/checks/memory-secrets.sh'));
  const run = () => spawnSync(resolveBash(), ['harness/checks/memory-secrets.sh'], { cwd: dir, encoding: 'utf8' });
  fs.writeFileSync(path.join(dir, '.engram/chunks/a.jsonl.gz'), zlib.gzipSync('{"title":"layer rules"}\n'));
  assert.equal(run().status, 0);
  fs.writeFileSync(path.join(dir, '.engram/chunks/b.jsonl.gz'), zlib.gzipSync(`{"title":"key ${'sk-'}${'a'.repeat(24)}"}\n`));
  const leaked = run();
  assert.equal(leaked.status, 1);
  assert.match(leaked.stdout, /b\.jsonl\.gz/);
});
