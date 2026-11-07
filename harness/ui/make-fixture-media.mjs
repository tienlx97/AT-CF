#!/usr/bin/env node
// Test-only stand-in media for UI flows while the owner's photos are not in
// media-src/ yet. Writes plain coloured, numbered frames (never shipped:
// run `pnpm media` with MEDIA_SRC pointing here, check, then restore
// src/data/media.json and delete public/media).
//
//   node harness/ui/make-fixture-media.mjs <dir> [--photos 14] [--clips 0] [--hero]
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

const [dir = 'tmp-fixture', ...rest] = process.argv.slice(2);
const flag = (/** @type {string} */ name, fallback = 0) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(rest[i + 1] ?? 1);
};
const photos = flag('photos', 14);
const clips = flag('clips', 0);
const groups = ['pha-che', 'do-uong', 'khong-gian', 'khach-hang'];
const sizes = [[3000, 2000], [2000, 2500], [2400, 2400], [1800, 2700]];

for (let i = 0; i < photos; i++) {
  const group = groups[i % groups.length];
  const [w, h] = sizes[i % sizes.length];
  const hue = (i * 37) % 360;
  mkdirSync(join(dir, 'gallery', group), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="hsl(${hue},30%,42%)"/><circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 3}" fill="hsl(${(hue + 140) % 360},35%,68%)"/><text x="50%" y="54%" font-family="sans-serif" font-size="${w / 7}" text-anchor="middle" fill="white">${i + 1}</text></svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(join(dir, 'gallery', group, `anh-${i + 1}.jpg`));
}
if (clips) mkdirSync(join(dir, 'video'), { recursive: true });
for (let i = 0; i < clips; i++) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `testsrc2=size=720x1280:rate=30`, '-f', 'lavfi',
    '-i', `sine=frequency=${250 + i * 40}`, '-t', '4', '-shortest', join(dir, 'video', `clip-${i + 1}.mp4`)]);
}
if (rest.includes('--hero')) {
  mkdirSync(join(dir, 'hero'), { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'testsrc2=size=1920x1080:rate=30', '-t', '8', join(dir, 'hero', 'ngang.mp4')]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'testsrc2=size=1080x1920:rate=30', '-t', '8', join(dir, 'hero', 'doc.mp4')]);
}
console.log(`fixture media: ${photos} photos, ${clips} clips${rest.includes('--hero') ? ', hero' : ''} in ${dir}`);
