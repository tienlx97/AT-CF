import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { BRAND_COLORS } from './brand.js';
import { BUDGETS, GALLERY_GROUPS, IMAGE_WIDTHS } from './media-groups.js';
import { NAV_LINKS, site, validateSite } from './site.js';

test('site.json carries the confirmed shop facts', () => {
  assert.equal(site.phone, '0932311434');
  assert.equal(site.hours.store.open, '05:30');
  assert.equal(site.hours.online.close, '20:00');
  assert.equal(NAV_LINKS.length, 5);
});

test('missing required fields fail the build with their names', () => {
  assert.throws(() => validateSite({ name: 'x' }), /thiếu trường: brandMain/);
});

test('brand.js mirrors the @theme tokens in globals.css', () => {
  const css = readFileSync(
    new URL('../../app/globals.css', import.meta.url),
    'utf8',
  ).toLowerCase();
  for (const [token, value] of Object.entries({
    brand: BRAND_COLORS.brand,
    'brand-ink': BRAND_COLORS.brandInk,
    surface: BRAND_COLORS.surface,
    'surface-alt': BRAND_COLORS.surfaceAlt,
  })) {
    assert.ok(css.includes(`--color-${token}: ${value.toLowerCase()};`), token);
  }
});

test('gallery filters and media budgets match the brief', () => {
  assert.deepEqual(
    GALLERY_GROUPS.map((g) => g.label),
    ['Pha chế', 'Đồ uống', 'Không gian quán', 'Khách hàng', 'Video'],
  );
  assert.deepEqual([...IMAGE_WIDTHS], [480, 960, 1600]);
  assert.equal(BUDGETS.heroMobile, 2 * 1024 * 1024);
});

