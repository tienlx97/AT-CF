#!/usr/bin/env node
// Keeps harness/PROGRESS.md small enough to read at the start of every session.
// Dated entries older than the window move, unchanged, to
// harness/progress/<YYYY-MM>.md (newest first). The standing sections
// ("Harness gaps", "Discovered") stay in PROGRESS.md. Nothing is rewritten or
// dropped: every entry ends up in exactly one file.
//
//   node harness/progress-rotate.mjs [--days 14] [--today 2026-11-07]
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATED = /^#{1,2} (\d{4})-(\d{2})-(\d{2})\b/;

/**
 * Split a progress document into its title line and entries. An entry starts at
 * a `#`/`##` heading outside a fenced code block; text before the first entry
 * (the title and the generated preamble) is not an entry.
 */
export function parseProgress(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const chunks = [];
  let current = null;
  let fenced = false;
  let title = '';
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const heading = !fenced && /^#{1,2} /.test(line);
    if (heading && !current && !title && /^# /.test(line) && !DATED.test(line)) {
      title = line;
      continue;
    }
    if (heading) {
      current = [line];
      chunks.push(current);
    } else if (current) current.push(line);
  }
  const entries = chunks.map((chunk, order) => {
    const match = chunk[0].match(DATED);
    const body = chunk.join('\n').replace(/\n*(---\n*)?$/, '\n');
    return { body, order, date: match ? `${match[1]}-${match[2]}-${match[3]}` : null };
  });
  return { title: title || '# Progress Log', entries };
}

function byNewest(a, b) {
  return a.date === b.date ? a.order - b.order : a.date < b.date ? 1 : -1;
}

function join_(entries) {
  return entries.map((entry) => entry.body).join('\n');
}

/**
 * Rotate in memory. `archives` maps `YYYY-MM` to that month's existing archive text.
 * Returns the new PROGRESS text and the new archive texts that changed.
 */
export function rotate(progressText, archives, { today, days }) {
  const cutoff = new Date(`${today}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  const cutoffDay = cutoff.toISOString().slice(0, 10);
  const { title, entries } = parseProgress(progressText);
  const keep = entries.filter((entry) => entry.date && entry.date >= cutoffDay).sort(byNewest);
  const standing = entries.filter((entry) => !entry.date);
  const old = entries.filter((entry) => entry.date && entry.date < cutoffDay);
  const changed = {};
  const months = [...new Set(old.map((entry) => entry.date.slice(0, 7)))];
  for (const month of months) {
    const existing = archives[month] ? parseProgress(archives[month]).entries : [];
    const moved = old.filter((entry) => entry.date.startsWith(month));
    const merged = [...moved, ...existing.map((entry) => ({ ...entry, order: entry.order + moved.length }))].sort(byNewest);
    changed[month] = `# Progress archive — ${month}\n\nMoved from harness/PROGRESS.md by harness/progress-rotate.mjs; entries unchanged, newest first.\n\n${join_(merged)}`;
  }
  const progress = `${title}\n\nEntries newer than ${days} days, newest first. Older ones: harness/progress/<YYYY-MM>.md\n(\`node harness/progress-rotate.mjs\`). Add new entries at the top.\n\n${join_([...keep, ...standing])}`;
  return { progress, archives: changed, moved: old.length, kept: keep.length };
}

function main(argv) {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const option = (name, fallback) => {
    const index = argv.indexOf(name);
    return index === -1 ? fallback : argv[index + 1];
  };
  const days = Number(option('--days', '14'));
  const today = option('--today', new Date().toISOString().slice(0, 10));
  if (!Number.isInteger(days) || days < 1 || !/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    console.error('usage: node harness/progress-rotate.mjs [--days N] [--today YYYY-MM-DD]');
    process.exit(2);
  }
  const progressFile = join(root, 'harness/PROGRESS.md');
  const archiveDir = join(root, 'harness/progress');
  const archives = {};
  if (existsSync(archiveDir)) {
    for (const name of readdirSync(archiveDir)) {
      const month = name.match(/^(\d{4}-\d{2})\.md$/)?.[1];
      if (month) archives[month] = readFileSync(join(archiveDir, name), 'utf8');
    }
  }
  const before = readFileSync(progressFile, 'utf8');
  const result = rotate(before, archives, { today, days });
  if (result.moved === 0) {
    console.log(`progress-rotate: nothing older than ${days} days`);
    return;
  }
  mkdirSync(archiveDir, { recursive: true });
  for (const [month, text] of Object.entries(result.archives)) writeFileSync(join(archiveDir, `${month}.md`), text);
  writeFileSync(progressFile, result.progress);
  const lines = result.progress.split('\n').length;
  console.log(`progress-rotate: moved ${result.moved} entries into ${Object.keys(result.archives).sort().join(', ')}; PROGRESS.md keeps ${result.kept} entries (${lines} lines)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
