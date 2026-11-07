import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  classify,
  formatBytes,
  mergeManifest,
  orientationOf,
  plannedWidths,
  slugify,
  suggestAlt,
} from './media-core.js';

test('slugify strips Vietnamese marks, spaces and case', () => {
  assert.equal(slugify('Mặt Tiền 01.JPG'), 'mat-tien-01');
  assert.equal(slugify('Đá riêng__ly lớn.jpeg'), 'da-rieng-ly-lon');
  assert.equal(slugify('  ca phe muoi .png'), 'ca-phe-muoi');
});

test('classify maps folders to role and group', () => {
  assert.deepEqual(classify('gallery/khong-gian/Mặt Tiền 01.JPG'), {
    id: 'gallery/khong-gian/mat-tien-01',
    role: 'gallery',
    group: 'khong-gian',
    type: 'image',
    slug: 'mat-tien-01',
  });
  assert.equal(classify('menu/ca-phe-muoi.jpg')?.id, 'menu/ca-phe-muoi');
  assert.equal(classify('hero/ngang.mp4')?.role, 'hero');
  assert.equal(classify('video/rot-ca-phe.MOV')?.group, 'video');
  assert.equal(classify('gallery/pha-che/clip.mp4')?.role, 'reel');
  assert.equal(classify('gallery/la/x.jpg'), null);
  assert.equal(classify('notes.txt'), null);
  assert.equal(classify('menu/.DS_Store'), null);
});

test('orientation', () => {
  assert.equal(orientationOf(1920, 1080), 'landscape');
  assert.equal(orientationOf(1080, 1920), 'portrait');
  assert.equal(orientationOf(1000, 1020), 'square');
});

test('suggested alt is Vietnamese and meaningful', () => {
  assert.equal(
    suggestAlt('gallery/khong-gian/mat-tien-01.jpg'),
    'Mặt tiền quán tại Anh Tú Coffee',
  );
  assert.equal(
    suggestAlt('gallery/pha-che/rot-ca-phe-muoi-2.jpg'),
    'Rót cà phê muối tại Anh Tú Coffee',
  );
  assert.equal(
    suggestAlt('gallery/khach-hang/IMG_2041.jpg'),
    'Ảnh khách hàng tại Anh Tú Coffee',
  );
  assert.equal(
    suggestAlt('gallery/do-uong/Ly bạc xỉu 3.jpg'),
    'Ly bạc xỉu tại Anh Tú Coffee',
  );
  assert.equal(suggestAlt('menu/bac-xiu.jpg'), 'Ly bạc xỉu của Anh Tú Coffee');
});

test('merge keeps owner edits, drops removed files, keeps order', () => {
  const base = {
    type: 'image',
    role: 'gallery',
    group: 'khong-gian',
    caption: '',
    featured: false,
    alt: 'auto',
  };
  const previous = [
    { ...base, id: 'b', alt: 'Sửa tay', caption: 'Chú thích', featured: true },
    { ...base, id: 'gone' },
    { ...base, id: 'a' },
  ];
  const fresh = [
    { ...base, id: 'a', width: 2 },
    { ...base, id: 'b', width: 1 },
    { ...base, id: 'c' },
  ];
  const merged = mergeManifest(
    /** @type {any} */ (previous),
    /** @type {any} */ (fresh),
  );
  assert.deepEqual(
    merged.map((i) => i.id),
    ['b', 'a', 'c'],
  );
  assert.equal(merged[0].alt, 'Sửa tay');
  assert.equal(merged[0].caption, 'Chú thích');
  assert.equal(merged[0].featured, true);
  assert.equal(/** @type {any} */ (merged[0]).width, 1);
});

test('planned widths never upscale', () => {
  assert.deepEqual(plannedWidths(4000, [480, 960, 1600]), [480, 960, 1600]);
  assert.deepEqual(plannedWidths(1200, [480, 960, 1600]), [480, 960, 1200]);
  assert.deepEqual(plannedWidths(300, [480, 960, 1600]), [300]);
});

test('bytes', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2.0 KB');
  assert.equal(formatBytes(3 * 1024 * 1024), '3.00 MB');
});
