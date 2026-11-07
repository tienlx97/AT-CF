import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatPhone, formatPrice, shortTime, telHref, zaloHref } from './format.js';

test('prices use dot thousands and đ', () => {
  assert.equal(formatPrice(20000), '20.000đ');
  assert.equal(formatPrice(8000), '8.000đ');
  assert.equal(formatPrice(1250000), '1.250.000đ');
  assert.equal(formatPrice(Number.NaN), '');
});

test('phone links and display', () => {
  assert.equal(formatPhone('0932311434'), '0932 311 434');
  assert.equal(telHref('0932 311 434'), 'tel:+84932311434');
  assert.equal(zaloHref('0932311434'), 'https://zalo.me/0932311434');
});

test('short time drops the leading zero', () => {
  assert.equal(shortTime('05:30'), '5:30');
  assert.equal(shortTime('20:00'), '20:00');
});