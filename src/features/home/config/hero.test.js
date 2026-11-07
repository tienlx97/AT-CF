import assert from 'node:assert/strict';
import { test } from 'node:test';

import { heroFor, shouldPlayHeroVideo, SLOGAN_OPTIONS } from './hero.js';

test('no hero video under reduced motion or Save-Data', () => {
  assert.equal(
    shouldPlayHeroVideo({ reducedMotion: false, saveData: false }),
    true,
  );
  assert.equal(
    shouldPlayHeroVideo({ reducedMotion: true, saveData: false }),
    false,
  );
  assert.equal(
    shouldPlayHeroVideo({ reducedMotion: false, saveData: true }),
    false,
  );
});

test('portrait falls back to landscape and back', () => {
  const landscape = /** @type {any} */ ({ id: 'l' });
  const portrait = /** @type {any} */ ({ id: 'p' });
  assert.equal(heroFor({ landscape, portrait }, 'portrait')?.id, 'p');
  assert.equal(heroFor({ landscape, portrait: null }, 'portrait')?.id, 'l');
  assert.equal(heroFor({ landscape: null, portrait }, 'landscape')?.id, 'p');
  assert.equal(heroFor({ landscape: null, portrait: null }, 'landscape'), null);
});

test('five slogan options, all short', () => {
  assert.equal(SLOGAN_OPTIONS.length, 5);
  for (const slogan of SLOGAN_OPTIONS) assert.ok(slogan.length <= 45, slogan);
});
