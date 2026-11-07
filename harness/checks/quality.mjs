#!/usr/bin/env node
// Measurable quality gate — checks the numbers in openspec/project.md against
// the actual build output. Run after `next build` (see harness/verify.sh).
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// `new URL(...).pathname` is a URL component, not a filesystem path: it
// percent-encodes (a checkout under "VIBE CODE" became "VIBE%20CODE") and on
// Windows leaves a leading slash before the drive letter. Both make every
// path derived from it miss, so this gate reported "run `next build`" even
// with a fresh build sitting right there. fileURLToPath is the
// platform-correct conversion.
const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const BUNDLE_THRESHOLD_KB = 250;
const BUILD_DIR = process.env.NEXT_DIST_DIR || '.next';

function fail(message) {
  console.error(`✘ ${message}`);
  process.exitCode = 1;
}

const manifestPath = join(ROOT, BUILD_DIR, 'build-manifest.json');
if (!existsSync(manifestPath)) {
  fail(`missing ${manifestPath} — run \`next build\` before verify:quality`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const sharedFiles = [...new Set([...(manifest.rootMainFiles ?? []), ...(manifest.polyfillFiles ?? [])])];
if (sharedFiles.length === 0) {
  fail('no shared JS files found in build-manifest.json (rootMainFiles/polyfillFiles)');
  process.exit(1);
}

let totalGzipBytes = 0;
for (const file of sharedFiles) {
  const filePath = join(ROOT, BUILD_DIR, file);
  if (!existsSync(filePath)) {
    fail(`missing bundle asset: ${file}`);
    process.exit(1);
  }
  totalGzipBytes += gzipSync(readFileSync(filePath)).length;
}

const totalKb = totalGzipBytes / 1024;
console.log(`Shared JS bundle (gzip): ${totalKb.toFixed(1)} kB (threshold: ${BUNDLE_THRESHOLD_KB} kB)`);

if (totalKb > BUNDLE_THRESHOLD_KB) {
  fail(`shared JS bundle ${totalKb.toFixed(1)} kB (gzip) exceeds ${BUNDLE_THRESHOLD_KB} kB threshold`);
  process.exit(1);
}

console.log('✔ quality thresholds met');
