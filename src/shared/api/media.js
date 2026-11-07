import { MEDIA_ITEMS } from '../config/media.js';

/** @typedef {import('../types/media.js').MediaItem} MediaItem */

/**
 * @param {MediaItem} item
 * @param {'avif' | 'webp'} format
 */
export function srcSet(item, format) {
  return item.widths.map((w) => `${item.src}-${w}.${format} ${w}w`).join(', ');
}

/** Largest WebP, the <img> fallback. @param {MediaItem} item */
export function fallbackSrc(item) {
  const widest = Math.max(...item.widths);
  return `${item.src}-${widest}.webp`;
}

/** @param {readonly MediaItem[]} [items] */
export function heroMedia(items = MEDIA_ITEMS) {
  const heroes = items.filter(
    (item) => item.role === 'hero' && item.type === 'video',
  );
  return {
    landscape: heroes.find((item) => item.orientation !== 'portrait') ?? null,
    portrait: heroes.find((item) => item.orientation === 'portrait') ?? null,
  };
}

/**
 * Photo for a menu item ("menu/ca-phe-muoi"), or null when not supplied yet.
 * @param {string | undefined} key
 * @param {readonly MediaItem[]} [items]
 */
export function menuImage(key, items = MEDIA_ITEMS) {
  if (!key) return null;
  return items.find((item) => item.id === key && item.type === 'image') ?? null;
}

/** Photos and clips shown in the gallery (no hero, no menu shots). @param {readonly MediaItem[]} [items] */
export function galleryItems(items = MEDIA_ITEMS) {
  return items.filter(
    (item) => item.role === 'gallery' || item.role === 'reel',
  );
}

/** Vertical clips for the reels strip, featured first, at most `limit`. */
export function reels(limit = 8, items = MEDIA_ITEMS) {
  const clips = items.filter(
    (item) => item.role === 'reel' && item.type === 'video',
  );
  return [...clips]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

/**
 * Best photos for the home preview: featured first, then the rest, at most
 * `limit`, skipping ids already shown elsewhere on the page.
 * @param {number} [limit]
 * @param {readonly MediaItem[]} [items]
 * @param {readonly string[]} [exclude]
 */
export function galleryPreview(limit = 12, items = MEDIA_ITEMS, exclude = []) {
  const photos = items.filter(
    (item) =>
      item.role === 'gallery' &&
      item.type === 'image' &&
      !exclude.includes(item.id),
  );
  return [...photos]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

/**
 * First featured photo of a group, else its first photo (intro picture).
 * @param {string} group
 * @param {readonly MediaItem[]} [items]
 */
export function leadPhoto(group, items = MEDIA_ITEMS) {
  const photos = items.filter(
    (item) =>
      item.role === 'gallery' && item.type === 'image' && item.group === group,
  );
  return photos.find((item) => item.featured) ?? photos[0] ?? null;
}

/**
 * Smallest video source that still fills `wanted` short-side pixels.
 * @param {MediaItem} item
 * @param {number} wanted
 */
export function videoSource(item, wanted) {
  const list = [...(item.videos ?? [])].sort((a, b) => a.height - b.height);
  return list.find((v) => v.height >= wanted) ?? list[list.length - 1] ?? null;
}
