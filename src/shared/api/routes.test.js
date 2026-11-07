import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isCurrentPath, normalizePath } from './routes.js';

test('normalizes trailing slashes, queries and hashes', () => {
  assert.equal(normalizePath('/menu/'), '/menu');
  assert.equal(normalizePath('/'), '/');
  assert.equal(normalizePath(''), '/');
  assert.equal(normalizePath('/menu/?a=1#b'), '/menu');
});

test('home only matches itself; sections match their subpaths', () => {
  assert.equal(isCurrentPath('/', '/'), true);
  assert.equal(isCurrentPath('/menu/', '/'), false);
  assert.equal(isCurrentPath('/menu', '/menu/'), true);
  assert.equal(isCurrentPath('/menu-in/', '/menu/'), false);
});
