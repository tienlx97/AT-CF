'use client';

import { useSyncExternalStore } from 'react';

import { shouldPlayHeroVideo } from '../config/hero.js';

const QUERIES = ['(prefers-reduced-motion: reduce)', '(max-width: 767px)'];

/** @param {() => void} onChange */
function subscribe(onChange) {
  const lists = QUERIES.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener('change', onChange));
  return () =>
    lists.forEach((list) => list.removeEventListener('change', onChange));
}

/** @returns {'landscape' | 'portrait' | 'none'} */
function snapshot() {
  const reduced = window.matchMedia(QUERIES[0]).matches;
  const connection = /** @type {{ saveData?: boolean } | undefined} */ (
    /** @type {any} */ (navigator).connection
  );
  if (
    !shouldPlayHeroVideo({
      reducedMotion: reduced,
      saveData: Boolean(connection?.saveData),
    })
  )
    return 'none';
  return window.matchMedia(QUERIES[1]).matches ? 'portrait' : 'landscape';
}

/**
 * Which hero video may play: never under prefers-reduced-motion or Save-Data;
 * the portrait file under 768px. The static HTML (server snapshot) has none,
 * so only the poster is in the page until the browser decides.
 * @returns {'landscape' | 'portrait' | null}
 */
export function useHeroVideo() {
  const value = useSyncExternalStore(
    subscribe,
    snapshot,
    () => /** @type {const} */ ('none'),
  );
  return value === 'none' ? null : value;
}
