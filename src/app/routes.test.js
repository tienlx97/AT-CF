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

test('root layout sets lang="vi" and preloads the Vietnamese font file', () => {
  const layout = readFileSync(file('layout.jsx'), 'utf8');
  assert.match(layout, /lang="vi"/);
  assert.match(layout, /montserrat-vietnamese-wght-normal\.woff2/);
  assert.match(layout, /rel="preload"/);
  const css = readFileSync(file('globals.css'), 'utf8');
  // Vietnamese letters (Ữ Ặ Ỷ: U+1EA0–1EF9) and đ map to the preloaded file.
  assert.match(css, /montserrat-vietnamese-wght-normal\.woff2[\s\S]*?U\+1EA0-1EF9/);
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
