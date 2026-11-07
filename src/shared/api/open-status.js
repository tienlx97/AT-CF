import { shortTime } from './format.js';

/** @param {string} hhmm */
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Minutes since midnight of `date` in `timeZone`, independent of the browser zone.
 * @param {Date} date
 * @param {string} timeZone
 */
export function minutesInZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const pick = (/** @type {string} */ type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return pick('hour') * 60 + pick('minute');
}

/**
 * Counter sales → online sales → closed, from the hours in site.json.
 * @param {Date} date
 * @param {import('@/shared/types/site').Hours} hours
 * @returns {import('@/shared/types/site').OpenStatus}
 */
export function getOpenStatus(date, hours) {
  const now = minutesInZone(date, hours.timeZone);
  const { store, online } = hours;
  if (now >= toMinutes(store.open) && now < toMinutes(store.close)) {
    return { state: 'open', until: store.close, reopensAt: null, label: `Đang mở cửa · đến ${shortTime(store.close)}` };
  }
  if (now >= toMinutes(online.open) && now < toMinutes(online.close)) {
    return { state: 'online', until: online.close, reopensAt: null, label: `Đang bán online · đến ${shortTime(online.close)}` };
  }
  return { state: 'closed', until: null, reopensAt: store.open, label: `Đã đóng cửa · mở lại ${shortTime(store.open)}` };
}