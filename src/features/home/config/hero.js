/**
 * The hero video never plays for visitors who asked for less motion or less data.
 * @param {{ reducedMotion: boolean, saveData: boolean }} prefs
 */
export function shouldPlayHeroVideo({ reducedMotion, saveData }) {
  return !reducedMotion && !saveData;
}

/**
 * Pick the file for a variant, falling back to the other orientation.
 * @param {{ landscape: import('@/shared/types/media').MediaItem | null, portrait: import('@/shared/types/media').MediaItem | null }} hero
 * @param {'landscape' | 'portrait'} variant
 */
export function heroFor(hero, variant) {
  return variant === 'portrait'
    ? (hero.portrait ?? hero.landscape)
    : (hero.landscape ?? hero.portrait);
}

/** Short side in px wanted per variant (720p phone, 1080p desktop). */
export const HERO_HEIGHT = Object.freeze({ portrait: 720, landscape: 1080 });

/** Slogan options proposed to the owner (brief section 12); the first is in site.json. */
export const SLOGAN_OPTIONS = Object.freeze([
  'Cà phê pha máy. Nguyên chất mỗi sáng.',
  'Ghé nhanh, mang đi, ngon trọn ngày.',
  'Ly cà phê pha máy cho người đi làm sớm.',
  'Nguyên chất từ hạt, pha máy từng ly.',
  'Sáng mua tại quán, chiều đặt online.',
]);

/** How long a photo slide stays (ms); a clip stays until it ends, at most CLIP_MAX_MS. */
export const SLIDE_MS = 6000;
export const CLIP_MAX_MS = 20000;

/** Next slide index, wrapping both ways. @param {number} index @param {number} step @param {number} count */
export function wrapSlide(index, step, count) {
  if (count <= 0) return 0;
  return (((index + step) % count) + count) % count;
}
