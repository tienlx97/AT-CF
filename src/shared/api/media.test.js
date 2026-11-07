import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  fallbackSrc,
  galleryItems,
  galleryPreview,
  heroMedia,
  leadPhoto,
  menuImage,
  reels,
  srcSet,
  videoSource,
} from './media.js';

/** @returns {any} */
const item = (/** @type {Record<string, unknown>} */ fields) => ({
  type: 'image',
  role: 'gallery',
  group: 'khong-gian',
  src: '/media/x',
  widths: [480, 960],
  featured: false,
  orientation: 'landscape',
  ...fields,
});

const items = [
  item({ id: 'hero/ngang', type: 'video', role: 'hero', group: 'hero' }),
  item({
    id: 'hero/doc',
    type: 'video',
    role: 'hero',
    group: 'hero',
    orientation: 'portrait',
  }),
  item({ id: 'menu/bac-xiu', role: 'menu', group: 'menu' }),
  item({ id: 'g/1' }),
  item({ id: 'g/2', featured: true, group: 'pha-che' }),
  item({
    id: 'v/1',
    type: 'video',
    role: 'reel',
    group: 'video',
    orientation: 'portrait',
  }),
  item({
    id: 'v/2',
    type: 'video',
    role: 'reel',
    group: 'video',
    featured: true,
  }),
];

test('srcset and fallback', () => {
  const photo = item({ id: 'a' });
  assert.equal(
    srcSet(photo, 'avif'),
    '/media/x-480.avif 480w, /media/x-960.avif 960w',
  );
  assert.equal(fallbackSrc(photo), '/media/x-960.webp');
});

test('hero picks landscape and portrait', () => {
  const hero = heroMedia(items);
  assert.equal(hero.landscape?.id, 'hero/ngang');
  assert.equal(hero.portrait?.id, 'hero/doc');
  assert.deepEqual(heroMedia([]), { landscape: null, portrait: null });
});

test('menu image by key, missing is null', () => {
  assert.equal(menuImage('menu/bac-xiu', items)?.id, 'menu/bac-xiu');
  assert.equal(menuImage('menu/none', items), null);
  assert.equal(menuImage(undefined, items), null);
});

test('gallery, reels and preview ordering', () => {
  assert.deepEqual(
    galleryItems(items).map((i) => i.id),
    ['g/1', 'g/2', 'v/1', 'v/2'],
  );
  assert.deepEqual(
    reels(8, items).map((i) => i.id),
    ['v/2', 'v/1'],
  );
  assert.deepEqual(
    galleryPreview(1, items).map((i) => i.id),
    ['g/2'],
  );
  assert.deepEqual(
    galleryPreview(5, items, ['g/2']).map((i) => i.id),
    ['g/1'],
  );
  assert.equal(leadPhoto('pha-che', items)?.id, 'g/2');
  assert.equal(leadPhoto('khach-hang', items), null);
});

test('video source picks the smallest that fills', () => {
  const clip = item({
    videos: [
      { src: 'a-1080', height: 1080 },
      { src: 'a-720', height: 720 },
    ],
  });
  assert.equal(videoSource(clip, 700)?.src, 'a-720');
  assert.equal(videoSource(clip, 900)?.src, 'a-1080');
  assert.equal(videoSource(clip, 2000)?.src, 'a-1080');
});
