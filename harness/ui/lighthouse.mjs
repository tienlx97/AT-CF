#!/usr/bin/env node
// Lighthouse mobile (default config = Moto G Power, slow 4G) on the static
// export served locally. Writes HTML+JSON reports per route to --out and fails
// unless every category is >= --min (default 90).
//   node harness/ui/lighthouse.mjs --root out --out harness/runs/lighthouse-<date> [--routes /,/menu/]
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { brotliCompressSync, constants as zlibConstants } from 'node:zlib';

const run = promisify(execFile);

const args = Object.fromEntries(process.argv.slice(2).flatMap((v, i, a) => (v.startsWith('--') ? [[v.slice(2), a[i + 1]]] : [])));
const root = resolve(args.root ?? 'out');
const out = resolve(args.out ?? 'harness/runs/lighthouse');
const min = Number(args.min ?? 90);
const routes = (args.routes ?? '/,/menu/,/hinh-anh/,/lien-he/').split(',');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.woff2': 'font/woff2',
  '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};
mkdirSync(out, { recursive: true });

// Serve like a static host: gzip-free but with long cache headers for hashed assets.
const server = createServer((req, res) => {
  let file = join(root, decodeURIComponent((req.url ?? '/').split('?')[0]));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/html' });
    return void res.end(readFileSync(join(root, '404.html')));
  }
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  const headers = { 'content-type': type };
  if (file.includes(`${join('_next', 'static')}`) || file.includes(join('public', 'media'))) headers['cache-control'] = 'public, max-age=31536000, immutable';
  let body = readFileSync(file);
  // Vercel, Netlify and Cloudflare Pages all serve text with brotli; measure it the same way.
  if (/^(text\/|application\/(json|xml|manifest))|svg/.test(type) && /\bbr\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = brotliCompressSync(body, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 } });
    headers['content-encoding'] = 'br';
    headers.vary = 'accept-encoding';
  }
  res.writeHead(200, headers);
  res.end(body);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

const rows = [];
let failed = 0;
for (const route of routes) {
  const name = route === '/' ? 'home' : route.replace(/\//g, '');
  const base = join(out, name);
  // Run the local CLI with node directly (no shell, so the Chrome flags stay one
  // argument) and asynchronously: a sync call would block this process's server.
  await run(process.execPath, ['node_modules/lighthouse/cli/index.js', `${origin}${route}`, '--quiet', '--output=json',
    '--output=html', `--output-path=${base}`, '--chrome-flags=--headless=new --no-first-run',
    '--only-categories=performance,accessibility,best-practices,seo', '--max-wait-for-load=60000'],
  { timeout: 240000, maxBuffer: 1 << 26 });
  const report = JSON.parse(readFileSync(`${base}.report.json`, 'utf8'));
  const score = (/** @type {string} */ id) => Math.round((report.categories[id]?.score ?? 0) * 100);
  const audit = (/** @type {string} */ id) => report.audits[id]?.numericValue ?? 0;
  const row = {
    route,
    performance: score('performance'),
    accessibility: score('accessibility'),
    bestPractices: score('best-practices'),
    seo: score('seo'),
    lcpMs: Math.round(audit('largest-contentful-paint')),
    cls: Number(audit('cumulative-layout-shift').toFixed(3)),
    totalKB: Math.round(audit('total-byte-weight') / 1024),
  };
  rows.push(row);
  const bad = ['performance', 'accessibility', 'bestPractices', 'seo'].filter((k) => row[k] < min);
  if (bad.length || row.lcpMs >= 2500 || row.cls >= 0.1) failed += 1;
  const failing = Object.values(report.audits).filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual');
  row.failingAudits = failing.map((a) => a.id);
}
writeFileSync(join(out, 'summary.json'), JSON.stringify({ min, rows }, null, 2));
console.table(rows.map(({ failingAudits, ...r }) => r));
for (const row of rows) if (row.failingAudits.length) console.log(`${row.route} audits below 0.9: ${row.failingAudits.join(', ')}`);
server.close();
console.log(failed ? `✘ ${failed} route(s) below target` : `✔ all routes ≥ ${min}, LCP < 2.5 s, CLS < 0.1`);
process.exit(failed ? 1 : 0);
