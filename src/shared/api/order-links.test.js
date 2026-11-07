import assert from 'node:assert/strict';
import { test } from 'node:test';

import { headerCta, orderPlatforms } from './order-links.js';

const links = {
  shopeefood: 'https://shopeefood.vn/anh-tu',
  grabfood: 'https://food.grab.com/another',
};
test('only ShopeeFood is exposed even when another vendor is configured', () => {
  assert.deepEqual(orderPlatforms(links), [
    { id: 'shopeefood', label: 'ShopeeFood', href: links.shopeefood },
  ]);
});
test('empty and unsafe links do not create purchase or contact fallbacks', () => {
  for (const shopeefood of ['', ' ', 'javascript:alert(1)', 'tel:123']) {
    assert.deepEqual(orderPlatforms({ ...links, shopeefood }), []);
    assert.equal(headerCta({ ...links, shopeefood }), null);
  }
});
test('the purchase action goes directly to the configured external platform', () => {
  assert.deepEqual(headerCta(links), {
    label: 'Đặt qua ShopeeFood',
    href: links.shopeefood,
    kind: 'order',
  });
});
