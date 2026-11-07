#!/usr/bin/env node
// Share image and app icons from the unchanged logo files (ANH-TU-PROMP.md 7):
//   public/og.png              1200x630, brand green, white logo, name, a cup photo when one exists
//   public/apple-icon.png      180x180 (copied to src/app/apple-icon.png for Next metadata)
//   public/icon-192.png, icon-512.png, icon-maskable-512.png  (web manifest)
//   src/app/favicon.ico        32x32 PNG-in-ICO
// Re-run after changing the logo or adding media: `pnpm brand`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

import { BRAND_COLORS } from '../src/shared/config/brand.js';

const ROOT = join(import.meta.dirname, '..');
const logoWhite = readFileSync(join(ROOT, 'assets/logo/leaf-mark-white.svg'));
const logo = readFileSync(join(ROOT, 'assets/logo/leaf-mark.svg'));
const site = JSON.parse(readFileSync(join(ROOT, 'src/data/site.json'), 'utf8'));
const media = existsSync(join(ROOT, 'src/data/media.json'))
  ? JSON.parse(readFileSync(join(ROOT, 'src/data/media.json'), 'utf8')).items
  : [];

/** @param {Buffer} svg @param {number} size */
const mark = (svg, size) =>
  sharp(svg, { density: 400 })
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

/** Square icon: logo centred on a ground, `pad` share of the side left empty. */
async function icon(size, ground, svg, pad) {
  const inner = Math.round(size * (1 - pad));
  return sharp({
    create: { width: size, height: size, channels: 4, background: ground },
  })
    .composite([{ input: await mark(svg, inner), gravity: 'center' }])
    .png()
    .toBuffer();
}

async function ogImage() {
  const W = 1200;
  const H = 630;
  // A real cup photo on the right half when the owner has one (menu or featured drink).
  const photo =
    media.find((m) => m.type === 'image' && m.role === 'menu' && m.featured) ??
    media.find((m) => m.type === 'image' && m.role === 'menu') ??
    media.find((m) => m.type === 'image' && m.group === 'do-uong');
  const layers = [];
  const textWidth = photo ? 640 : W;
  if (photo) {
    const file = join(
      ROOT,
      'public',
      `${photo.src.replace(/^\//, '')}-${Math.max(...photo.widths)}.webp`,
    );
    if (existsSync(file)) {
      layers.push({
        input: await sharp(file)
          .resize(W - textWidth, H, { fit: 'cover' })
          .png()
          .toBuffer(),
        left: textWidth,
        top: 0,
      });
    }
  }
  const text = `<svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${H}">
    <style>
      .main { font: 800 104px Montserrat, 'Segoe UI', Arial, sans-serif; fill: #fff; letter-spacing: -2px }
      .sub { font: 700 30px Montserrat, 'Segoe UI', Arial, sans-serif; fill: #fff; letter-spacing: 14px }
      .line { font: 600 30px Montserrat, 'Segoe UI', Arial, sans-serif; fill: #fff; opacity: .9 }
    </style>
    <text x="80" y="372" class="main">${site.brandMain}</text>
    <text x="86" y="424" class="sub">${site.brandSub}</text>
    <text x="80" y="520" class="line">Cà phê pha máy · Mang đi · ${site.address.district}</text>
  </svg>`;
  layers.push({ input: await mark(logoWhite, 150), left: 80, top: 110 });
  layers.push({ input: Buffer.from(text), left: 0, top: 0 });
  return sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: BRAND_COLORS.brand,
    },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Single-image ICO holding a 32x32 PNG (supported by every current browser). */
function ico(png) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

const white = BRAND_COLORS.surface;
writeFileSync(join(ROOT, 'public/og.png'), await ogImage());
const apple = await icon(180, white, logo, 0.22);
writeFileSync(join(ROOT, 'src/app/apple-icon.png'), apple);
writeFileSync(
  join(ROOT, 'public/icon-192.png'),
  await icon(192, white, logo, 0.16),
);
writeFileSync(
  join(ROOT, 'public/icon-512.png'),
  await icon(512, white, logo, 0.16),
);
writeFileSync(
  join(ROOT, 'public/icon-maskable-512.png'),
  await icon(512, BRAND_COLORS.brand, logoWhite, 0.4),
);
writeFileSync(
  join(ROOT, 'src/app/favicon.ico'),
  ico(await icon(32, white, logo, 0.04)),
);
console.log(
  'brand assets: public/og.png, icons, src/app/apple-icon.png, src/app/favicon.ico',
);
