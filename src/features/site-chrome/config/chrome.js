import { normalizePath } from '@/shared/api/routes.js';

/** Routes whose first screen has hero media, used only for the over-hero state. */
export const HERO_ROUTES = Object.freeze(['/']);

/** Scroll threshold for the over-hero state; never changes navbar geometry. */
export const SOLID_AFTER = 24;

/** Routes printed or shown without site chrome (the A4 menu). */
export const BARE_ROUTES = Object.freeze(['/menu-in']);

/** @param {string} pathname */
export function isBareRoute(pathname) {
  return BARE_ROUTES.includes(normalizePath(pathname));
}

/** @param {string} pathname */
export function startsOverHero(pathname) {
  return HERO_ROUTES.includes(normalizePath(pathname));
}
