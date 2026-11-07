#!/usr/bin/env node
// Static SEO check of the export: titles, descriptions, canonical, Open Graph,
// JSON-LD, sitemap, robots, icons. `node harness/ui/check-seo.mjs [out]` — exit 1 on a failure.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? 'out';
let failed = 0;
const check = (/** @type {string} */ name, /** @type {unknown} */ ok, detail = '') => {
  if (!ok) failed += 1;
  console.log(`${ok ? '✔' : '✘'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const meta = (/** @type {string} */ html, /** @type {string} */ key) =>
  html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1] ?? null;

const pages = {
  '/': /Anh Tú Coffee — Cà phê pha máy nguyên chất, mang đi \| Bình Tân, TP\.HCM/,
  '/menu/': /^Menu — Anh Tú Coffee/,
  '/hinh-anh/': /^Hình ảnh — Anh Tú Coffee/,
  '/lien-he/': /^Liên hệ — Anh Tú Coffee/,
  '/menu-in/': /^Menu in A4/,
};
for (const [path, title] of Object.entries(pages)) {
  const html = readFileSync(join(root, path, 'index.html'), 'utf8');
  const t = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  check(`${path} title`, title.test(t), t);
  const d = meta(html, 'description') ?? '';
  check(`${path} description 70–170 chars`, d.length >= 70 && d.length <= 170, `${d.length}`);
  check(`${path} og:image 1200x630`, /\/og\.png$/.test(meta(html, 'og:image') ?? '') && meta(html, 'og:image:width') === '1200');
  check(`${path} og:title`, Boolean(meta(html, 'og:title')));
  check(`${path} twitter large card`, meta(html, 'twitter:card') === 'summary_large_image');
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  check(`${path} canonical`, canonical.endsWith(path), canonical);
  check(`${path} lang vi`, /<html lang="vi"/.test(html));
  if (path === '/menu-in/') check(`${path} noindex`, /noindex/.test(meta(html, 'robots') ?? ''));
}
const home = readFileSync(join(root, 'index.html'), 'utf8');
const ld = home.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
let data = null;
try {
  data = ld ? JSON.parse(ld) : null;
} catch (error) {
  check('JSON-LD parses', false, String(error));
}
check('JSON-LD CafeOrCoffeeShop', data?.['@type'] === 'CafeOrCoffeeShop');
check('JSON-LD priceRange', data?.priceRange === '8.000đ–20.000đ', data?.priceRange);
check('JSON-LD hours', data?.openingHoursSpecification?.length === 2);
const sitemap = existsSync(join(root, 'sitemap.xml')) ? readFileSync(join(root, 'sitemap.xml'), 'utf8') : '';
check('sitemap.xml has 4 urls', (sitemap.match(/<loc>/g) ?? []).length === 4);
const robots = existsSync(join(root, 'robots.txt')) ? readFileSync(join(root, 'robots.txt'), 'utf8') : '';
check('robots.txt points to sitemap', /Sitemap: .*sitemap\.xml/.test(robots));
for (const file of ['og.png', 'icon.svg', 'apple-icon.png', 'manifest.webmanifest', 'favicon.ico']) {
  check(`${file} exported`, existsSync(join(root, file)));
}
console.log(failed ? `✘ ${failed} SEO check(s) failed` : '✔ SEO checks passed');
process.exit(failed ? 1 : 0);
