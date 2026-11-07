import assert from 'node:assert/strict';
import { test } from 'node:test';

import { categoryAnchor, formatDate } from './menu-page.js';

test('anchors and dates', () => {
  assert.equal(categoryAnchor('ca-phe'), 'nhom-ca-phe');
  assert.equal(formatDate('2026-11-07'), '07/11/2026');
  assert.equal(formatDate('bad'), 'bad');
});
