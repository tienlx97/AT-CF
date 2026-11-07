import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

// The five routes of the brief (ANH-TU-PROMP.md section 4) and their metadata.
const ROUTES = {
  '/': 'page.jsx',
  '/menu': 'menu/page.jsx',
  '/hinh-anh': 'hinh-anh/page.jsx',
  '/lien-he': 'lien-he/page.jsx',
  '/menu-in': 'menu-in/page.jsx',
};

const file = (/** @type {string} */ rel) =>
  new URL(`./${rel}`, import.meta.url);

test('every built route has a Vietnamese title and description', () => {
  for (const [route, rel] of Object.entries(ROUTES)) {
    if (!existsSync(file(rel))) continue; // built by a later change
    const source = readFileSync(file(rel), 'utf8');
    if (route === '/') continue; // home uses the root layout metadata
    assert.match(source, /title:/, `${route} title`);
    assert.match(source, /description:/, `${route} description`);
  }
});

test('root layout sets lang="vi" and the Vietnamese font subset', () => {
  const layout = readFileSync(file('layout.jsx'), 'utf8');
  assert.match(layout, /lang="vi"/);
  assert.match(layout, /'vietnamese'/);
});

test('globals.css declares exactly the four brand colour tokens', () => {
  const css = readFileSync(file('globals.css'), 'utf8');
  const tokens = [...css.matchAll(/--color-([a-z-]+):/g)].map((m) => m[1]);
  assert.deepEqual(tokens.sort(), [
    'brand',
    'brand-ink',
    'surface',
    'surface-alt',
  ]);
});
