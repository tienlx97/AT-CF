import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (/** @type {string} */ name) =>
  readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');

test('hero slider: first photo is the priority image, clips load only when shown', () => {
  const source = read('hero-slider.jsx');
  assert.ok(source.includes('priority={i === 0}'));
  assert.ok(source.includes('const source = play ? videoSource'));
  assert.match(source, /preload="none"/);
  assert.match(source, /muted/);
  assert.match(source, /Tạm dừng trình chiếu/);
  assert.ok(source.includes('useHeroVideo()'));
});

test('hero copy stays short without duplicated practical details', () => {
  const source = read('hero.jsx');
  assert.doesNotMatch(
    source,
    /StatusBadge|shortTime|site\.hours|site\.tagline|site\.address\.street/,
  );
  assert.ok(source.includes('heroSlides()'));
  assert.match(source, /site\.brandMain/);
  assert.doesNotMatch(source, /site\.brandSub/);
  assert.equal((source.match(/<p\b/g) ?? []).length, 1);
  assert.match(source, /items-end/);
});

test('intro splash is CSS-only, decorative, once per session and skipped under reduced motion', () => {
  const source = read('intro-splash.jsx');
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /sessionStorage/);
  assert.doesNotMatch(source, /use client|setInterval|<video|useEffect/);
  assert.match(source, /location\.pathname!=='\/'/);
  const css = readFileSync(new URL('../../../app/globals.css', import.meta.url), 'utf8');
  assert.match(css, /\.intro-splash \{[^}]*pointer-events: none/);
  assert.match(
    css,
    /prefers-reduced-motion: reduce\) \{\s*\.intro-splash \{\s*display: none/,
  );
});

test('intro facts come from site.json and menu.json', () => {
  const source = read('intro.jsx');
  assert.match(source, /priceRange\(\)/);
  assert.match(source, /site\.hours\.store\.open/);
  assert.match(source, /site\.hours\.store\.close/);
  assert.match(source, /visibleCategories\(\)/);
});

test('hero actions are Xem thực đơn and Chỉ đường', () => {
  const source = read('hero.jsx');
  assert.ok(source.includes('Xem thực đơn'));
  assert.ok(source.includes('Chỉ đường'));
});

test('reels show placeholders naming the shots when no clips exist', () => {
  const source = read('reels.jsx');
  assert.match(source, /Video dọc rót cà phê muối/);
  assert.match(source, /<Lightbox/);
});

test('home menu uses category data and preserves whole cup images', () => {
  const source = read('featured-drinks.jsx');
  assert.match(source, /visibleCategories\(\)/);
  assert.match(source, /fit="contain"/);
  assert.doesNotMatch(source, /\d{2}\.000đ/);
});
