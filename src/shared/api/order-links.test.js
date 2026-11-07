import assert from 'node:assert/strict';
import { test } from 'node:test';

import { headerCta, orderPlatforms } from './order-links.js';

const both = { shopeefood: 'https://shopeefood.vn/x', grabfood: 'https://food.grab.com/y' };

test('empty links are hidden', () => {
  assert.deepEqual(orderPlatforms({ shopeefood: '', grabfood: '' }), []);
  assert.deepEqual(orderPlatforms({ shopeefood: both.shopeefood, grabfood: ' ' }).map((p) => p.id), ['shopeefood']);
});

test('header shows order online only with both links during online hours', () => {
  assert.equal(headerCta(both, 'online'), 'order-online');
  assert.equal(headerCta(both, 'open'), 'call');
  assert.equal(headerCta({ ...both, grabfood: '' }, 'online'), 'call');
  assert.equal(headerCta(both, null), 'call');
});