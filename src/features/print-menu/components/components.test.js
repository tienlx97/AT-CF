import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (/** @type {string} */ rel) =>
  readFileSync(new URL(rel, import.meta.url), 'utf8');

test('the sheet reads menu.json through the shared readers', () => {
  const source = read('./print-menu.jsx');
  assert.match(source, /visibleCategories\(\)/);
  assert.match(source, /formatPrice\(item\.price\)/);
  assert.doesNotMatch(source, /\d{2}\.000đ/);
});

test('print CSS: A4 portrait page and screen-only toolbar', () => {
  const css = read('../../../app/globals.css');
  assert.match(css, /size: A4 portrait/);
  assert.match(css, /\.print-hidden \{\s*display: none !important;/);
  assert.match(read('./print-button.jsx'), /print-hidden/);
});

test('/menu-in has no site chrome', () => {
  assert.match(read('../../site-chrome/config/chrome.js'), /'\/menu-in'/);
});
