import { GALLERY_GROUPS } from '@/shared/config/media-groups.js';

/** Items shown before "Xem thêm", and added per click. */
export const PAGE_SIZE = 24;

export const FILTERS = Object.freeze([
  { id: 'tat-ca', label: 'Tất cả' },
  ...GALLERY_GROUPS.map(({ id, label }) => ({ id, label })),
]);

/**
 * Items for a filter ("video" = every clip; "tat-ca" = everything).
 * @param {readonly import('@/shared/types/media').MediaItem[]} items
 * @param {string} filter
 */
export function filterItems(items, filter) {
  if (filter === 'tat-ca') return [...items];
  if (filter === 'video') return items.filter((item) => item.type === 'video');
  return items.filter((item) => item.group === filter && item.type === 'image');
}

/**
 * Count per filter, for the labels ("Pha chế 12").
 * @param {readonly import('@/shared/types/media').MediaItem[]} items
 */
export function filterCounts(items) {
  return Object.fromEntries(
    FILTERS.map((f) => [f.id, filterItems(items, f.id).length]),
  );
}

/** A filter id from the ?nhom= query, defaulting to "tat-ca". @param {string | null | undefined} value */
export function parseFilter(value) {
  return FILTERS.some((f) => f.id === value)
    ? /** @type {string} */ (value)
    : 'tat-ca';
}
