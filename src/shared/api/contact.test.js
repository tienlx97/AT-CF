import assert from 'node:assert/strict';
import { test } from 'node:test';

import { directionsUrl, hoursRows, mapEmbedUrl } from './contact.js';

const geo = { lat: 10.8052243, lng: 106.589173 };

test('map embed and directions use the shop coordinates', () => {
  const embed = mapEmbedUrl(geo, 'Anh Tú Coffee');
  assert.match(embed, /^https:\/\/maps\.google\.com\/maps\?/);
  assert.match(embed, /output=embed/);
  assert.match(embed, /10\.8052243,106\.589173/);
  assert.equal(
    directionsUrl(geo),
    'https://www.google.com/maps/dir/?api=1&destination=10.8052243,106.589173',
  );
});

test('hours rows in order', () => {
  const rows = hoursRows({
    timeZone: 'Asia/Ho_Chi_Minh',
    store: { open: '05:30', close: '11:00', label: 'quán' },
    online: { open: '11:00', close: '20:00', label: 'online' },
  });
  assert.deepEqual(
    rows.map((r) => r.id),
    ['store', 'online'],
  );
  assert.equal(rows[0].from, '05:30');
});
