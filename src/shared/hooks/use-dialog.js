'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for a drawer or lightbox: focus moves in and is trapped,
 * Esc closes, page scroll is locked, focus returns to the opener on close.
 * `bodyFlag` sets `data-<flag>="open"` on <body> so other chrome can react.
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {{ bodyFlag?: string, onKey?: (event: KeyboardEvent) => void }} [options]
 */
export function useDialog(open, onClose, options = {}) {
  const ref = useRef(/** @type {HTMLElement | null} */ (null));
  const closeRef = useRef(onClose);
  const keyRef = useRef(options.onKey);
  const { bodyFlag } = options;

  useEffect(() => {
    closeRef.current = onClose;
    keyRef.current = options.onKey;
  });

  useEffect(() => {
    if (!open) return undefined;
    const opener = /** @type {HTMLElement | null} */ (document.activeElement);
    const root = ref.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    if (bodyFlag) document.body.dataset[bodyFlag] = 'open';
    const first = root?.querySelector(FOCUSABLE);
    if (first instanceof HTMLElement) first.focus();

    /** @param {KeyboardEvent} event */
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      keyRef.current?.(event);
      if (event.key !== 'Tab' || !root) return;
      const items = Array.from(root.querySelectorAll(FOCUSABLE)).filter(
        (el) => el instanceof HTMLElement,
      );
      if (items.length === 0) return;
      const head = /** @type {HTMLElement} */ (items[0]);
      const tail = /** @type {HTMLElement} */ (items[items.length - 1]);
      if (event.shiftKey && document.activeElement === head) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && document.activeElement === tail) {
        event.preventDefault();
        head.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (bodyFlag) delete document.body.dataset[bodyFlag];
      opener?.focus?.();
    };
  }, [open, bodyFlag]);

  return ref;
}
