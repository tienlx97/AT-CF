import mediaData from '../../data/media.json' with { type: 'json' };

/** @type {import('../types/media.js').MediaItem[]} */
export const MEDIA_ITEMS = Object.freeze(
  /** @type {any} */ (mediaData).items ?? [],
);
