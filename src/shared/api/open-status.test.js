import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getOpenStatus } from './open-status.js';

const hours = {
  timeZone: 'Asia/Ho_Chi_Minh',
  store: { open: '05:30', close: '11:00', label: '' },
  online: { open: '11:00', close: '20:00', label: '' },
};
// VN is UTC+7 all year: 05:30 VN = 22:30 UTC the previous day.
const vn = (/** @type {string} */ hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(2026, 10, 7, h - 7, m));
};

test('before opening is closed with reopen time', () => {
  const status = getOpenStatus(vn('05:29'), hours);
  assert.equal(status.state, 'closed');
  assert.equal(status.label, 'Đã đóng cửa · mở lại 5:30');
});

test('counter hours from 05:30 to before 11:00', () => {
  assert.equal(getOpenStatus(vn('05:30'), hours).label, 'Đang mở cửa · đến 11:00');
  assert.equal(getOpenStatus(vn('10:59'), hours).state, 'open');
});

test('online hours from 11:00 to before 20:00', () => {
  assert.equal(getOpenStatus(vn('11:00'), hours).label, 'Đang bán online · đến 20:00');
  assert.equal(getOpenStatus(vn('19:59'), hours).state, 'online');
});

test('closed from 20:00', () => {
  assert.equal(getOpenStatus(vn('20:00'), hours).state, 'closed');
  assert.equal(getOpenStatus(vn('23:00'), hours).state, 'closed');
});

test('uses Vietnam time, not the browser zone', () => {
  // 23:00 UTC on the 7th is 06:00 on the 8th in Vietnam.
  assert.equal(getOpenStatus(new Date('2026-11-07T23:00:00Z'), hours).state, 'open');
});