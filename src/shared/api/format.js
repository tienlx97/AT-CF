/**
 * 20000 → "20.000đ" (Vietnamese thousands separator, no space before đ).
 * @param {number} value
 */
export function formatPrice(value) {
  if (!Number.isFinite(value)) return '';
  const digits = String(Math.round(Math.abs(value))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${value < 0 ? '-' : ''}${digits}đ`;
}

/**
 * "0932311434" → "0932 311 434".
 * @param {string} phone
 */
export function formatPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

/**
 * "0932311434" → "tel:+84932311434".
 * @param {string} phone
 */
export function telHref(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return `tel:+84${digits.startsWith('0') ? digits.slice(1) : digits}`;
}

/** @param {string} zalo */
export function zaloHref(zalo) {
  return `https://zalo.me/${String(zalo).replace(/\D/g, '')}`;
}

/**
 * "05:30" → "5:30" (how the shop writes times on signs).
 * @param {string} hhmm
 */
export function shortTime(hhmm) {
  return hhmm.replace(/^0(\d)/, '$1');
}