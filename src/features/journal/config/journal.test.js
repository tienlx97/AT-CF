import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { journalDate, journalEntries } from './journal.js';

test('owner journal has unique static routes, newest first and existing illustrations', () => {
  assert.equal(journalEntries.length, 6);
  assert.equal(new Set(journalEntries.map((entry) => entry.id)).size, 6);
  assert.deepEqual(
    journalEntries.map((entry) => entry.date),
    journalEntries
      .map((entry) => entry.date)
      .sort()
      .reverse(),
  );
  for (const entry of journalEntries) {
    assert.match(entry.id, /^[a-z0-9-]+$/);
    assert.ok(entry.story.length > 0);
    assert.ok(Number.isFinite(Date.parse(entry.date)));
    for (const media of entry.media) {
      assert.equal(media.type, 'image');
      assert.ok(existsSync(`public${media.src}`), media.src);
    }
  }
  assert.match(journalDate('2026-06-30'), /2026/);
});
