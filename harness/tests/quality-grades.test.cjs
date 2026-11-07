// harness/quality-grades.mjs: the grading rubric is mechanical, and the stored
// harness/quality-grades.json agrees with its own metrics (ENTROPY.md).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const test = require('node:test');

const root = path.resolve(__dirname, '../..');
const load = () => import(pathToFileURL(path.join(root, 'harness/quality-grades.mjs')).href);
const clean = { sourceFiles: 14, testFiles: 2, lines: 900, lintWarnings: 0, autofixWarnings: 0, bigFiles: 0 };

test('rubric: A is clean and tested, B is minor drift, C is debt', async () => {
  const { grade } = await load();
  assert.equal(grade(clean), 'A');
  assert.equal(grade({ ...clean, autofixWarnings: 3 }), 'B', 'autofixable warnings only → B');
  assert.equal(grade({ ...clean, testFiles: 1 }), 'B', 'fewer than 1 test per 7 files → B');
  assert.equal(grade({ ...clean, bigFiles: 2 }), 'B');
  assert.equal(grade({ ...clean, lintWarnings: 5 }), 'C');
  assert.equal(grade({ ...clean, bigFiles: 3 }), 'C');
  assert.equal(grade({ ...clean, testFiles: 0 }), 'C', 'no tests in a unit of 10+ files');
  assert.equal(grade({ ...clean, sourceFiles: 3, testFiles: 0 }), 'A', 'tiny units need no test');
});

test('stored grades follow the rubric from the stored metrics and cover every unit', async () => {
  const { grade, units } = await load();
  const stored = JSON.parse(fs.readFileSync(path.join(root, 'harness/quality-grades.json'), 'utf8'));
  assert.deepEqual(Object.keys(stored.grades).sort(), units(root), 'a unit was added or removed: rerun node harness/quality-grades.mjs');
  for (const [unit, metrics] of Object.entries(stored.metrics)) assert.equal(stored.grades[unit], grade(metrics), unit);
  assert.deepEqual(Object.keys(stored.rubric).sort(), ['A', 'B', 'C']);
});
