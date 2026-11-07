#!/usr/bin/env node
// Browser flow checks for the static export (`out/`), no extra dependency:
// serves the folder on 127.0.0.1, drives headless Chrome over CDP and runs a
// flow module's checks at each requested width. Writes screenshots and
// result.json to --out; exits 1 when any check fails.
//
//   node harness/ui/flow.mjs --flow harness/ui/flows/site-chrome.mjs \
//     --root out --widths 390,1440 --out harness/runs/ui-<task>
//
// A flow module exports `default async function (page, { width, check })`.
// `page` offers: goto(path), eval(expr), click(selector), press(key),
// tap(selector), scrollTo(y), wait(ms), shot(name), emulate({ reducedMotion, saveData }).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]?.startsWith('--') ? 'true' : all[index + 1]]);
    return pairs;
  }, []),
);
const root = resolve(args.root ?? 'out');
const outDir = resolve(args.out ?? 'harness/runs/ui-flow');
const widths = (args.widths ?? '390,1440').split(',').map(Number);
if (!args.flow) throw new Error('--flow <module> is required');
if (!existsSync(join(root, 'index.html'))) throw new Error(`${root}/index.html missing: run pnpm build first`);
mkdirSync(outDir, { recursive: true });

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4',
  '.json': 'application/json', '.txt': 'text/plain', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml',
};
const requests = [];
const missing = new Set();
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  requests.push(url);
  let file = join(root, url);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!file.startsWith(root) || !existsSync(file)) {
    missing.add(url);
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(existsSync(join(root, '404.html')) ? readFileSync(join(root, '404.html')) : 'not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const origin = `http://127.0.0.1:${server.address().port}`;

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((path) => existsSync(path));
  if (!found) throw new Error('No Chrome/Edge found; set CHROME_PATH');
  return found;
}

const profile = mkdtempSync(join(tmpdir(), 'ui-flow-'));
const chrome = spawn(findChrome(), ['--headless=new', `--user-data-dir=${profile}`, '--remote-debugging-port=0',
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((ok, fail) => {
  let text = '';
  chrome.stderr.on('data', (chunk) => {
    text += chunk;
    const match = text.match(/DevTools listening on (ws:\/\/\S+)/);
    if (match) ok(match[1]);
  });
  setTimeout(() => fail(new Error('Chrome did not start')), 20000);
});

const ws = new WebSocket(wsUrl);
await new Promise((ok) => ws.addEventListener('open', ok, { once: true }));
let nextId = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { ok, fail } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) fail(new Error(`${msg.error.message}`));
    else ok(msg.result);
  } else if (msg.method) listeners.forEach((listener) => listener(msg));
});
const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
  const id = ++nextId;
  pending.set(id, { ok, fail });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

const results = [];
let failed = 0;
const flow = (await import(pathToFileURL(resolve(args.flow)).href)).default;

for (const width of widths) {
  const height = width < 600 ? 844 : 900;
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const s = (method, params) => send(method, params, sessionId);
  const consoleErrors = [];
  listeners.length = 0;
  listeners.push((msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === 'Runtime.exceptionThrown') consoleErrors.push(msg.params.exceptionDetails.text);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') consoleErrors.push(msg.params.entry.text);
  });
  await s('Page.enable');
  await s('Runtime.enable');
  await s('Log.enable');
  await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  if (width < 600) await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await s('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    return result.value;
  };
  const page = {
    width,
    origin,
    requests,
    consoleErrors,
    async goto(path) {
      requests.length = 0;
      await s('Page.navigate', { url: `${origin}${path}` });
      await sleep(300);
      await evaluate('new Promise((ok) => document.readyState === "complete" ? ok() : addEventListener("load", ok))');
      await evaluate('document.fonts.ready.then(() => true)');
      await sleep(400);
    },
    eval: evaluate,
    async emulate({ reducedMotion = false, saveData = false } = {}) {
      await s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }] });
      await s('Page.addScriptToEvaluateOnNewDocument', {
        source: saveData ? 'Object.defineProperty(navigator, "connection", { value: { saveData: true } });' : '',
      });
    },
    async click(selector) {
      const box = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
      if (!box) throw new Error(`No element for ${selector}`);
      await sleep(100);
      for (const type of ['mousePressed', 'mouseReleased']) {
        await s('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
      }
      await sleep(300);
    },
    async swipe(fromX, toX, y) {
      await s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: fromX, y }] });
      for (let i = 1; i <= 6; i++) {
        await s('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: fromX + ((toX - fromX) * i) / 6, y }] });
      }
      await s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(400);
    },
    async press(key) {
      const codes = { Escape: 27, Tab: 9, ArrowRight: 39, ArrowLeft: 37, Enter: 13 };
      const base = { key, code: key, windowsVirtualKeyCode: codes[key] ?? 0 };
      await s('Input.dispatchKeyEvent', { type: 'keyDown', ...base });
      await s('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
      await sleep(250);
    },
    async scrollTo(y) {
      await evaluate(`window.scrollTo(0, ${y})`);
      await sleep(400);
    },
    wait: sleep,
    async shot(name, { full = false } = {}) {
      let clip;
      if (full) {
        const h = await evaluate('document.documentElement.scrollHeight');
        clip = { x: 0, y: 0, width, height: h, scale: 1 };
      }
      const { data } = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full, ...(clip ? { clip } : {}) });
      const file = join(outDir, `${width}-${name}.png`);
      writeFileSync(file, Buffer.from(data, 'base64'));
      return file;
    },
  };
  const check = (name, ok, detail = '') => {
    results.push({ width, name, ok: Boolean(ok), detail });
    if (!ok) failed += 1;
    console.log(`${ok ? '✔' : '✘'} [${width}] ${name}${detail ? ` — ${detail}` : ''}`);
  };
  try {
    await flow(page, { width, check });
  } catch (error) {
    check('flow completed', false, error.message);
  }
  // --pending lists routes a later task builds; their prefetch 404s are expected until then.
  const pending = (args.pending ?? '').split(',').filter(Boolean);
  const realMissing = [...missing].filter((url) => !pending.includes(url));
  const pendingOnly = realMissing.length === 0;
  const errors = consoleErrors.filter((text) => !(pendingOnly && /status of 404/.test(text)));
  check('no console errors / 404s', errors.length === 0 && realMissing.length === 0, [...errors.slice(0, 2), ...realMissing].join(' | '));
  missing.clear();
  await send('Target.closeTarget', { targetId });
}

writeFileSync(join(outDir, 'result.json'), JSON.stringify({ flow: args.flow, widths, failed, results }, null, 2));
ws.close();
chrome.kill();
server.close();
await sleep(500);
try { rmSync(profile, { recursive: true, force: true }); } catch { /* profile still locked by Chrome on Windows */ }
console.log(failed ? `✘ ${failed} check(s) failed` : '✔ all checks passed');
process.exit(failed ? 1 : 0);
