'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { parseFilter } from '../config/gallery.js';

const EVENT = 'gallery-filter';

/** @param {() => void} onChange */
function subscribe(onChange) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

const read = () =>
  parseFilter(new URLSearchParams(window.location.search).get('nhom'));

/**
 * The active filter, kept in ?nhom= so a link like /hinh-anh/?nhom=video works
 * and Back restores it (static export: read in the browser, not at build).
 */
export function useGalleryFilter() {
  const filter = useSyncExternalStore(subscribe, read, () => 'tat-ca');
  const setFilter = useCallback((/** @type {string} */ next) => {
    const url = new URL(window.location.href);
    if (next === 'tat-ca') url.searchParams.delete('nhom');
    else url.searchParams.set('nhom', next);
    window.history.pushState(null, '', url);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return /** @type {const} */ ([filter, setFilter]);
}
