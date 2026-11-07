import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

import { pageMetadata } from '../shared/config/page-meta.js';

const at = (/** @type {string} */ rel) => new URL(rel, import.meta.url);

test('page metadata carries canonical, OG and noindex when asked', () => {
  const meta = /** @type {any} */ (
    pageMetadata({ path: '/x/', title: 'T', description: 'D', index: false })
  );
  assert.equal(meta.alternates.canonical, '/x/');
  assert.equal(meta.openGraph.images[0].width, 1200);
  assert.equal(meta.robots.index, false);
});

test('share image and icons are generated from the logo', () => {
  for (const rel of [
    '../../public/og.png',
    '../../public/icon-192.png',
    '../../public/icon-512.png',
    './apple-icon.png',
    './favicon.ico',
  ]) {
    assert.ok(existsSync(at(rel)), rel);
  }
  const png = readFileSync(at('../../public/og.png'));
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
