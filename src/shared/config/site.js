import siteData from '@/data/site.json' with { type: 'json' };

const REQUIRED = ['name', 'brandMain', 'brandSub', 'phone', 'zalo', 'address', 'geo', 'hours', 'order'];

/**
 * The owner-edited `src/data/site.json`, checked once at build time so a typo
 * fails the build with a clear message instead of rendering a broken page.
 * @param {Record<string, unknown>} data
 * @returns {import('@/shared/types/site').Site}
 */
export function validateSite(data) {
  const missing = REQUIRED.filter((key) => data[key] === undefined || data[key] === null);
  if (missing.length > 0) {
    throw new Error(`src/data/site.json thiếu trường: ${missing.join(', ')}`);
  }
  return /** @type {import('@/shared/types/site').Site} */ (Object.freeze(data));
}

export const site = validateSite(siteData);

export const NAV_LINKS = Object.freeze([
  { href: '/', label: 'Trang chủ' },
  { href: '/menu/', label: 'Menu' },
  { href: '/hinh-anh/', label: 'Hình ảnh' },
  { href: '/lien-he/', label: 'Liên hệ' },
]);