// harness/progress-rotate.mjs keeps PROGRESS.md short without losing history,
// and task context still finds a change's history after it was archived.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const test = require('node:test');

const root = path.resolve(__dirname, '../..');
const load = (file) => import(pathToFileURL(path.join(root, file)).href);

const progress = [
  '# Progress Log',
  '',
  '## 2026-11-06 — alpha: task 1.2',
  '- newest',
  '',
  '## 2026-09-03 — alpha: task 1.1',
  '- old, September',
  '```bash',
  '# not a heading: inside a fence',
  '```',
  '',
  '---',
  '',
  '## Harness gaps (standing)',
  '- a gap',
  '',
  '## 2026-11-01 — beta',
  '- appended at the bottom, still recent',
  '',
  '# 2026-08-30 — gamma',
  '- old, August, single-# heading',
  '',
].join('\n');

test('rotation moves only old entries, keeps standing sections, loses nothing and is idempotent', async () => {
  const { rotate, parseProgress } = await load('harness/progress-rotate.mjs');
  const first = rotate(progress, {}, { today: '2026-11-07', days: 14 });
  assert.equal(first.moved, 2);
  assert.equal(first.kept, 2);
  assert.deepEqual(Object.keys(first.archives).sort(), ['2026-08', '2026-09']);
  // Newest first, standing sections after the dated ones.
  const kept = parseProgress(first.progress).entries.map((entry) => entry.body.split('\n', 1)[0]);
  assert.deepEqual(kept, ['## 2026-11-06 — alpha: task 1.2', '## 2026-11-01 — beta', '## Harness gaps (standing)']);
  assert.match(first.archives['2026-09'], /# not a heading: inside a fence/);
  // Every original line survives in exactly one file.
  const all = first.progress + Object.values(first.archives).join('');
  for (const line of progress.split('\n').filter((line) => line && line !== '---' && line !== '# Progress Log')) {
    assert.ok(all.includes(line), `lost: ${line}`);
  }
  // A second run moves nothing and does not grow the preamble.
  const second = rotate(first.progress, first.archives, { today: '2026-11-07', days: 14 });
  assert.equal(second.moved, 0);
  assert.equal(second.progress, first.progress);
  // Later rotations append to an existing month, newest first.
  const later = rotate(first.progress, first.archives, { today: '2026-12-31', days: 14 });
  const november = parseProgress(later.archives['2026-11']).entries.map((entry) => entry.date);
  assert.deepEqual(november, ['2026-11-06', '2026-11-01']);
});

test('task context finds a change history in the monthly archive', async (t) => {
  const { taskContext } = await load('harness/lib/workflow.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'progress-archive-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), text);
  };
  write('openspec/changes/alpha/proposal.md', '# Alpha\n**Status:** in-progress\n');
  write('openspec/changes/alpha/tasks.md', '- [x] 1.1 Done\n- [ ] 1.2 Next\n');
  write('openspec/changes/alpha/specs/main/spec.md', 'Spec.');
  write('harness/PROGRESS.md', '# Progress Log\n\n## 2026-11-06 — alpha: task 1.2 started\n- now\n');
  write('harness/progress/2026-09.md', '# Progress archive — 2026-09\n\n## 2026-09-03 — alpha: task 1.1\n- archived\n');
  const context = taskContext(dir, 'alpha');
  assert.equal(context.historyExcerpts.length, 2);
  assert.match(context.historyExcerpts[0], /task 1\.2 started/);
  assert.match(context.historyExcerpts[1], /archived/);
  assert.ok(context.sources.includes('openspec/changes/alpha/specs/main/spec.md'), 'sources use forward slashes on every OS');
});
