import assert from 'node:assert/strict';
import { test } from 'node:test';

import site from '../../../data/site.json' with { type: 'json' };
import { headerCta } from '../../../shared/api/order-links.js';

test('with the shipped site.json (no order links yet) the header always calls', () => {
  for (const state of ['open', 'online', 'closed', null]) {
    assert.equal(headerCta(site.order, /** @type {any} */ (state)), 'call');
  }
});
