import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validateMenu } from '../config/menu.js';
import {
  categoryOptions,
  featuredItems,
  priceRange,
  visibleCategories,
} from './menu.js';

const base = {
  currency: 'VND',
  updatedAt: '2026-11-07',
  options: [{ id: 'ice', label: 'Đá', values: ['Ít đá'] }],
  categories: [
    {
      id: 'a',
      name: 'A',
      optionIds: ['ice'],
      items: [
        { id: 'x', name: 'X', price: 20000, featured: true, available: false },
        { id: 'y', name: 'Y', price: 8000, featured: true },
      ],
    },
    { id: 'empty', name: 'Trống', items: [] },
  ],
};

test('validation fills defaults', () => {
  const menu = validateMenu(base);
  assert.equal(menu.categories[0].items[1].available, true);
  assert.equal(menu.categories[1].optionIds.length, 0);
});

test('validation explains mistakes in Vietnamese', () => {
  const broken = structuredClone(base);
  broken.categories[0].items[0].price = /** @type {any} */ ('20.000');
  broken.categories[0].items[1].id = 'x';
  broken.categories[0].optionIds = ['sugar'];
  assert.throws(
    () => validateMenu(broken),
    (error) => {
      const message = /** @type {Error} */ (error).message;
      return (
        /price/.test(message) &&
        /bị trùng/.test(message) &&
        /tùy chọn không có: sugar/.test(message)
      );
    },
  );
});

test('featured items put available ones first', () => {
  const menu = validateMenu(base);
  assert.deepEqual(
    featuredItems(4, menu).map((i) => i.id),
    ['y', 'x'],
  );
});

test('options, range and visible categories', () => {
  const menu = validateMenu(base);
  assert.deepEqual(
    categoryOptions(menu.categories[0], menu).map((o) => o.id),
    ['ice'],
  );
  assert.deepEqual(priceRange(menu), { min: 8000, max: 20000 });
  assert.deepEqual(
    visibleCategories(menu).map((c) => c.id),
    ['a'],
  );
});

test('the shipped menu is valid and has 13 items, price range 8.000–20.000', async () => {
  const { menu } = await import('../config/menu.js');
  assert.equal(menu.categories.flatMap((c) => c.items).length, 13);
  assert.deepEqual(priceRange(menu), { min: 8000, max: 20000 });
  assert.ok(featuredItems(4, menu).length >= 3);
});
