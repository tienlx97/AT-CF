import { normalizePath } from '@/shared/api/routes.js';

/** Routes whose first screen is a dark hero: the header starts transparent there. */
export const HERO_ROUTES = Object.freeze(['/']);

/** Pixels scrolled before the header turns solid. */
export const SOLID_AFTER = 24;

/** Anchor of the order-online block on the home page. */
export const ORDER_ANCHOR = '/#dat-online';
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
