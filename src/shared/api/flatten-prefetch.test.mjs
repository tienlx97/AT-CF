import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { flattenPrefetch } from '../../../scripts/flatten-prefetch.mjs';

test('copies nested prefetch files to the dotted names the client requests', () => {
  const root = mkdtempSync(join(tmpdir(), 'flatten-'));
  mkdirSync(join(root, 'menu', '__next.menu'), { recursive: true });
  writeFileSync(join(root, 'menu', '__next.menu', '__PAGE__.txt'), 'x');
  mkdirSync(join(root, '__next.!abc', 'inner'), { recursive: true });
  writeFileSync(join(root, '__next.!abc', 'inner', '__PAGE__.txt'), 'y');
  assert.equal(flattenPrefetch(root), 2);
  assert.ok(existsSync(join(root, 'menu', '__next.menu.__PAGE__.txt')));
  assert.ok(existsSync(join(root, '__next.!abc.inner.__PAGE__.txt')));
  assert.equal(flattenPrefetch(root), 0);
});
