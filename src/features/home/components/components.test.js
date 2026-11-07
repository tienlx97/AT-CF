import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (/** @type {string} */ name) =>
  readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');

test('hero video is muted, looped, inline and only rendered once chosen', () => {
  const source = read('hero.jsx');
  for (const attr of ['autoPlay', 'muted', 'loop', 'playsInline'])
    assert.ok(source.includes(attr), attr);
  assert.match(source, /\{source \? \(\s*<video/);
  assert.match(source, /fetchPriority="high"/);
});

test('hero actions are Xem menu and Chỉ đường', () => {
  const source = read('hero.jsx');
  assert.ok(source.includes('Xem menu'));
  assert.ok(source.includes('Chỉ đường'));
});

test('reels show placeholders naming the shots when no clips exist', () => {
  const source = read('reels.jsx');
  assert.match(source, /Video dọc rót cà phê muối/);
  assert.match(source, /<Lightbox/);
});

test('featured drinks come from menu.json, never hard-coded', () => {
  const source = read('featured-drinks.jsx');
  assert.match(source, /featuredItems\(4\)/);
  assert.doesNotMatch(source, /\d{2}\.000đ/);
});
