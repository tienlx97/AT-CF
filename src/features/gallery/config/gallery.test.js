import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  filterCounts,
  filterItems,
  FILTERS,
  PAGE_SIZE,
  parseFilter,
} from './gallery.js';

/** @returns {any} */
const item = (
  /** @type {string} */ id,
  /** @type {string} */ group,
  type = 'image',
) => ({ id, group, type });
const items = [
  item('a', 'pha-che'),
  item('b', 'do-uong'),
  item('c', 'video', 'video'),
  item('d', 'pha-che'),
];

test('filters match the brief', () => {
  assert.deepEqual(
    FILTERS.map((f) => f.label),
    ['Tất cả', 'Pha chế', 'Đồ uống', 'Không gian quán', 'Khách hàng', 'Video'],
  );
  assert.equal(PAGE_SIZE, 24);
});

test('filtering by group and video', () => {
  assert.equal(filterItems(items, 'tat-ca').length, 4);
  assert.deepEqual(
    filterItems(items, 'pha-che').map((i) => i.id),
    ['a', 'd'],
  );
  assert.deepEqual(
    filterItems(items, 'video').map((i) => i.id),
    ['c'],
  );
  assert.deepEqual(filterCounts(items), {
    'tat-ca': 4,
    'pha-che': 2,
    'do-uong': 1,
    'khong-gian': 0,
    'khach-hang': 0,
    video: 1,
  });
});

test('query parsing falls back to all', () => {
  assert.equal(parseFilter('video'), 'video');
  assert.equal(parseFilter('xyz'), 'tat-ca');
  assert.equal(parseFilter(null), 'tat-ca');
});
