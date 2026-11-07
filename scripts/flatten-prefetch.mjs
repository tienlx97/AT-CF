#!/usr/bin/env node
// Next 16 static export writes segment prefetch data as
//   out/menu/__next.menu/__PAGE__.txt
// but the client router requests
//   out/menu/__next.menu.__PAGE__.txt
// so every client navigation logs a 404 (and falls back to a full load).
// After `next build`, copy each file under a `__next.*` folder to the
// dotted name the client asks for. Idempotent; never deletes anything.
import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} dir  folder that may hold `__next.<segment>` folders
 * @returns {number} files written
 */
export function flattenPrefetch(dir) {
  let written = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith('__next.')) {
      written += flattenInto(path, dir, entry.name);
    } else {
      written += flattenPrefetch(path);
    }
  }
  return written;
}

/** @param {string} folder @param {string} target @param {string} prefix */
function flattenInto(folder, target, prefix) {
  let written = 0;
  for (const name of readdirSync(folder)) {
    const source = join(folder, name);
    const dotted = `${prefix}.${name}`;
    if (statSync(source).isDirectory()) {
      written += flattenInto(source, target, dotted);
    } else if (!existsSync(join(target, dotted))) {
      copyFileSync(source, join(target, dotted));
      written += 1;
    }
  }
  return written;
}

if (
  import.meta.url ===
  `file://${process.argv[1]?.replace(/\\/g, '/').replace(/^(?=[A-Za-z]:)/, '/')}`
) {
  const root = process.argv[2] ?? 'out';
  if (!existsSync(root)) {
    console.error(`${root}/ not found: run next build first`);
    process.exit(1);
  }
  console.log(`flatten-prefetch: ${flattenPrefetch(root)} file(s) written`);
}
