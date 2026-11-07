import assert from 'node:assert/strict';
import { test } from 'node:test';

import site from '../../../data/site.json' with { type: 'json' };
import { headerCta } from '../../../shared/api/order-links.js';

test('the shipped action uses the owner-authorized temporary ShopeeFood link', () => {
  const action = headerCta(site.order);
  assert.ok(action);
  assert.equal(action?.href, site.order.shopeefood);
  assert.equal(action?.label, 'Đặt qua ShopeeFood');
  assert.equal(action?.kind, 'order');
  assert.match(action.href, /^https:\/\/shopeefood\.vn\//);
});
