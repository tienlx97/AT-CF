'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { CLIP_MAX_MS, SLIDE_MS, wrapSlide } from '../config/hero.js';

const REDUCED = '(prefers-reduced-motion: reduce)';

/** @param {() => void} onChange */
function subscribe(onChange) {
  const list = window.matchMedia(REDUCED);
  list.addEventListener('change', onChange);
  document.addEventListener('visibilitychange', onChange);
  return () => {
    list.removeEventListener('change', onChange);
    document.removeEventListener('visibilitychange', onChange);
  };
}

/** Autoplay is allowed when motion is welcome and the tab is visible. */
const motionOk = () =>
  !window.matchMedia(REDUCED).matches && document.visibilityState === 'visible';

/**
 * Slider state: current index, go/next/prev, and a pause the visitor controls
 * (WCAG 2.2.2). Photos advance after SLIDE_MS; a clip slide waits for the
 * component to call `next()` on `ended`, with CLIP_MAX_MS as a safety net.
 * Never autoplays under prefers-reduced-motion or in a hidden tab.
 * @param {number} count
 * @param {(index: number) => boolean} isClip
 */
export function useHeroSlider(count, isClip) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const allowed = useSyncExternalStore(subscribe, motionOk, () => false);
  const playing = allowed && !paused && count > 1;

  const go = useCallback(
    (/** @type {number} */ target) => setIndex(wrapSlide(target, 0, count)),
    [count],
  );
  const next = useCallback(
    () => setIndex((i) => wrapSlide(i, 1, count)),
    [count],
  );
  const prev = useCallback(
    () => setIndex((i) => wrapSlide(i, -1, count)),
    [count],
  );

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setTimeout(next, isClip(index) ? CLIP_MAX_MS : SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, next, isClip]);

  return {
    index,
    playing,
    canPlay: allowed,
    go,
    next,
    prev,
    toggle: () => setPaused((p) => !p),
  };
}
