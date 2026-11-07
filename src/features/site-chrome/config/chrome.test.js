import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isBareRoute, SOLID_AFTER, startsOverHero } from './chrome.js';

test('only home is identified as a hero route', () => {
  assert.equal(startsOverHero('/'), true);
  assert.equal(startsOverHero('/menu/'), false);
  assert.ok(SOLID_AFTER > 0);
});

test('the print menu renders without chrome, with or without slash', () => {
  assert.equal(isBareRoute('/menu-in'), true);
  assert.equal(isBareRoute('/menu-in/'), true);
  assert.equal(isBareRoute('/menu/'), false);
});
