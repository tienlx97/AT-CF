#!/usr/bin/env node
// Print a built page to PDF in headless Chrome (A4, CSS page size) and report
// its page count: `node harness/ui/print-pdf.mjs --root out --path /menu-in/ --out <file.pdf>`.
// Exits 1 unless the PDF has exactly --pages pages (default 1).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).flatMap((v, i, a) => (v.startsWith('--') ? [[v.slice(2), a[i + 1]]] : [])));
const root = resolve(args.root ?? 'out');
const out = resolve(args.out ?? 'harness/runs/print.pdf');
const want = Number(args.pages ?? 1);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const server = createServer((req, res) => {
  let file = join(root, decodeURIComponent((req.url ?? '/').split('?')[0]));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const chromePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium']
  .filter(Boolean).find((p) => existsSync(p));
const profile = mkdtempSync(join(tmpdir(), 'print-'));
const chrome = spawn(chromePath, ['--headless=new', `--user-data-dir=${profile}`, '--remote-debugging-port=0', '--no-first-run', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((ok) => {
  let text = '';
  chrome.stderr.on('data', (c) => { text += c; const m = text.match(/DevTools listening on (ws:\/\/\S+)/); if (m) ok(m[1]); });
});
const ws = new WebSocket(wsUrl);
await new Promise((ok) => ws.addEventListener('open', ok, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id) pending.get(m.id)?.(m.result ?? m); });
const send = (method, params = {}, sessionId) => new Promise((ok) => { pending.set(++id, ok); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const { targetId } = await send('Target.createTarget', { url: `http://127.0.0.1:${server.address().port}${args.path ?? '/menu-in/'}` });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await new Promise((ok) => setTimeout(ok, 2500));
await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true }, sessionId);
const { data } = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true }, sessionId);
mkdirSync(dirname(out), { recursive: true });
const pdf = Buffer.from(data, 'base64');
writeFileSync(out, pdf);
const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
const box = pdf.toString('latin1').match(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/);
console.log(`${out}: ${pages} page(s), MediaBox ${box ? `${box[1]}x${box[2]} pt` : 'unknown'} (A4 = 595.92x842.88)`);
ws.close(); chrome.kill(); server.close();
process.exit(pages === want ? 0 : 1);
