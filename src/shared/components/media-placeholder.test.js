import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Components are JSX (not runnable under plain node --test); these guard the
// brand rules the components must keep.
const read = (/** @type {string} */ name) =>
  readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');

test('logo uses the unchanged brand files, never a redrawn mark', () => {
  const source = read('logo.jsx');
  assert.match(source, /\/brand\/leaf-mark\.svg/);
  assert.match(source, /\/brand\/leaf-mark-white\.svg/);
  assert.doesNotMatch(source, /<path/);
});

test('placeholder names the shot and uses the surface-alt token', () => {
  const source = read('media-placeholder.jsx');
  assert.match(source, /bg-surface-alt/);
  assert.match(source, /aria-label=\{`Chờ ảnh:/);
});

test('buttons are at least 48px tall (44px touch target rule)', () => {
  assert.match(read('button.jsx'), /min-h-12/);
});
