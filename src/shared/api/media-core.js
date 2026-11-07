import { ALT_WORDS, GALLERY_GROUPS } from '../config/media-groups.js';

/**
 * File name → URL-safe slug: no diacritics, no spaces, lowercase ("Mặt Tiền 01.JPG" → "mat-tien-01").
 * @param {string} name
 */
export function slugify(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const IMAGE_EXT = /\.(jpe?g|png|webp|heic|heif|avif|tiff?)$/i;
const VIDEO_EXT = /\.(mp4|mov|m4v|webm|mkv|avi|3gp)$/i;

/** @param {string} file */
export function mediaType(file) {
  if (IMAGE_EXT.test(file)) return 'image';
  if (VIDEO_EXT.test(file)) return 'video';
  return null;
}

/**
 * Where a source file belongs, from its path under media-src/ ("/" separated).
 * Returns null for files the site does not use.
 * @param {string} relPath
 * @returns {{ id: string, role: import('../types/media.js').MediaRole, group: import('../types/media.js').MediaGroup, type: 'image' | 'video', slug: string } | null}
 */
export function classify(relPath) {
  const parts = relPath.split('/').filter(Boolean);
  const file = parts[parts.length - 1] ?? '';
  const type = mediaType(file);
  if (!type || file.startsWith('.')) return null;
  const slug = slugify(file);
  const [top, sub] = parts;
  if (top === 'hero' && parts.length === 2)
    return { id: `hero/${slug}`, role: 'hero', group: 'hero', type, slug };
  if (top === 'menu' && parts.length === 2 && type === 'image')
    return { id: `menu/${slug}`, role: 'menu', group: 'menu', type, slug };
  if (top === 'video' && parts.length === 2 && type === 'video')
    return { id: `video/${slug}`, role: 'reel', group: 'video', type, slug };
  if (top === 'gallery' && parts.length === 3) {
    const known = GALLERY_GROUPS.find(
      (group) => group.id === slugify(sub ?? ''),
    );
    if (!known || known.id === 'video') return null;
    const role = type === 'video' ? 'reel' : 'gallery';
    const group =
      type === 'video'
        ? 'video'
        : /** @type {import('../types/media.js').MediaGroup} */ (known.id);
    return { id: `gallery/${known.id}/${slug}`, role, group, type, slug };
  }
  return null;
}

/** @param {number} width @param {number} height */
export function orientationOf(width, height) {
  if (Math.abs(width - height) / Math.max(width, height, 1) < 0.05)
    return 'square';
  return width > height ? 'landscape' : 'portrait';
}

/**
 * Suggested Vietnamese alt text from the folder and file name; the owner edits it later.
 * @param {string} relPath
 */
export function suggestAlt(relPath) {
  const info = classify(relPath);
  if (!info) return '';
  const original = (relPath.split('/').pop() ?? '').replace(/\.[^.]+$/, '');
  const hasDiacritics = original.normalize('NFD') !== original || /[đĐ]/.test(original);
  let topic = '';
  if (hasDiacritics) {
    topic = original
      .replace(/[-_]+/g, ' ')
      .replace(/\s*\d+$/, '')
      .trim()
      .toLowerCase();
  } else {
    const words = [];
    let rest = info.slug.replace(/-?\d+$/, '');
    const keys = Object.keys(ALT_WORDS).sort((a, b) => b.length - a.length);
    while (rest) {
      const key = keys.find((k) => rest === k || rest.startsWith(`${k}-`));
      if (key) {
        words.push(ALT_WORDS[/** @type {keyof typeof ALT_WORDS} */ (key)]);
        rest = rest.slice(key.length).replace(/^-/, '');
      } else {
        rest = rest.replace(/^[^-]+-?/, '');
      }
    }
    topic = words.join(' ');
  }
  const subject = GALLERY_GROUPS.find(
    (group) => group.id === info.group,
  )?.subject;
  if (info.role === 'menu') return `Ly ${topic || 'đồ uống'} của Anh Tú Coffee`;
  if (info.role === 'hero') return `Video pha cà phê tại quầy Anh Tú Coffee`;
  if (info.type === 'video')
    return `Video ${topic || 'tại quán'} ở Anh Tú Coffee`;
  const head = topic
    ? topic.charAt(0).toUpperCase() + topic.slice(1)
    : `Ảnh ${subject}`;
  return `${head} tại Anh Tú Coffee`;
}

/**
 * Merge fresh processing results into the existing manifest. Owner-edited
 * fields (alt, caption, featured, group) survive; files gone from media-src
 * disappear; order follows the previous manifest, new files appended by id.
 * @param {import('../types/media.js').MediaItem[]} previous
 * @param {import('../types/media.js').MediaItem[]} fresh
 */
export function mergeManifest(previous, fresh) {
  const old = new Map(previous.map((item) => [item.id, item]));
  const freshIds = new Set(fresh.map((item) => item.id));
  const merged = fresh.map((item) => {
    const before = old.get(item.id);
    if (!before) return item;
    return {
      ...item,
      alt: before.alt || item.alt,
      caption: before.caption ?? item.caption,
      featured: before.featured ?? item.featured,
      group: before.group ?? item.group,
    };
  });
  const order = new Map(
    previous
      .filter((item) => freshIds.has(item.id))
      .map((item, index) => [item.id, index]),
  );
  return merged.sort((a, b) => {
    const ia = order.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const ib = order.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return ia === ib ? a.id.localeCompare(b.id) : ia - ib;
  });
}

/** @param {number} bytes */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Widths to generate for an image: never upscale; the original width is kept
 * when it is smaller than the largest size.
 * @param {number} originalWidth
 * @param {readonly number[]} widths
 */
export function plannedWidths(originalWidth, widths) {
  const fit = widths.filter((w) => w <= originalWidth);
  if (fit.length < widths.length && !fit.includes(originalWidth))
    fit.push(originalWidth);
  return fit.length ? fit : [originalWidth];
}
