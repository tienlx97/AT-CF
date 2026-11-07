import assert from 'node:assert/strict';
import { test } from 'node:test';

import { counterLabel, stepIndex, swipeStep } from './lightbox.js';

test('steps wrap at both ends', () => {
  assert.equal(stepIndex(0, -1, 5), 4);
  assert.equal(stepIndex(4, 1, 5), 0);
  assert.equal(stepIndex(2, 1, 5), 3);
  assert.equal(stepIndex(0, 1, 0), 0);
});

test('counter is 1-based', () => {
  assert.equal(counterLabel(4, 120), '5 / 120');
});

test('swipe left goes next, right goes back, vertical or short is ignored', () => {
  assert.equal(swipeStep(-80, 5), 1);
  assert.equal(swipeStep(80, 5), -1);
  assert.equal(swipeStep(-20, 0), 0);
  assert.equal(swipeStep(-60, 90), 0);
});
