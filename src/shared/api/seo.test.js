import assert from 'node:assert/strict';
import { test } from 'node:test';

import site from '../../data/site.json' with { type: 'json' };
import { cafeJsonLd, SITEMAP_ROUTES } from './seo.js';

test('JSON-LD describes the cafe as the brief asks', () => {
  const ld = cafeJsonLd(/** @type {any} */ (site), { min: 8000, max: 20000 });
  assert.equal(ld['@type'], 'CafeOrCoffeeShop');
  assert.equal(ld.priceRange, '8.000đ–20.000đ');
  assert.equal(ld.telephone, '+84932311434');
  assert.deepEqual(ld.geo, {
    '@type': 'GeoCoordinates',
    latitude: 10.8052243,
    longitude: 106.589173,
  });
  assert.deepEqual(
    ld.openingHoursSpecification.map((o) => `${o.opens}-${o.closes}`),
    ['05:30-11:00', '11:00-20:00'],
  );
  assert.equal(ld.menu, `${site.siteUrl}/menu/`);
  assert.deepEqual(ld.sameAs, ['https://www.facebook.com/anhtucoffee2025']);
});

test('sitemap lists the four public routes, not the print menu', () => {
  assert.deepEqual(
    SITEMAP_ROUTES.map((r) => r.path),
    ['/', '/menu/', '/hinh-anh/', '/lien-he/'],
  );
});
