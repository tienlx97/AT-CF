import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// JSX cannot run under plain node --test; these lock the media and a11y rules
// the components must keep (ANH-TU-PROMP.md 6.3 and 8).
const read = (/** @type {string} */ name) =>
  readFileSync(new URL(`./${name}`, import.meta.url), 'utf8');

test('responsive image: picture with avif+webp, size, lazy unless priority', () => {
  const source = read('responsive-image.jsx');
  for (const part of [
    'type="image/avif"',
    'type="image/webp"',
    'width={item.width}',
    'height={item.height}',
    'decoding="async"',
  ]) {
    assert.ok(source.includes(part), part);
  }
  assert.match(source, /loading=\{priority \? 'eager' : 'lazy'\}/);
});

test('video poster never loads the video itself', () => {
  const source = read('video-poster.jsx');
  assert.doesNotMatch(source, /<video/);
  assert.match(source, /loading="lazy"/);
});

test('lightbox: modal dialog, Esc via useDialog, hides contact bar, stops video', () => {
  const source = read('lightbox.jsx');
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /bodyFlag: 'lightbox'/);
  assert.match(source, /ArrowRight/);
  assert.match(source, /\.pause\(\)/);
  assert.match(source, /aria-label=\{muted \? 'Bật tiếng' : 'Tắt tiếng'\}/);
});

test('status badge announces changes politely', () => {
  assert.match(read('status-badge.jsx'), /aria-live="polite"/);
});
