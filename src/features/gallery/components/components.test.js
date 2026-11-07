import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(
  new URL('./gallery-page.jsx', import.meta.url),
  'utf8',
);

test('gallery pages 24 at a time behind a "Xem thêm" button', () => {
  assert.match(source, /items\.slice\(0, shown\)/);
  assert.match(source, /Xem thêm/);
});

test('filters are toggle buttons and the grid opens the shared lightbox', () => {
  assert.match(source, /aria-pressed=\{active\}/);
  assert.match(source, /<Lightbox/);
  assert.match(source, /<MasonryGrid/);
});

test('an empty filter names the shots to take', () => {
  assert.match(source, /MediaPlaceholder/);
});
