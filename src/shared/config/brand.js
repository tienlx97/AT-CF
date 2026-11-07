/**
 * Hex mirror of the `@theme` tokens in src/app/globals.css, for places CSS
 * classes cannot reach (viewport theme colour, manifest, generated images).
 * This is the only JS file allowed to hold hex colours (eslint.config.mjs);
 * keep it identical to globals.css.
 */
export const BRAND_COLORS = Object.freeze({
  brand: '#2F6F55',
  brandInk: '#1F3D31',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0EC',
});