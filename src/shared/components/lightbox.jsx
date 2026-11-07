'use client';

import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { counterLabel, stepIndex, swipeStep } from '@/shared/api/lightbox';
import { videoSource } from '@/shared/api/media';
import { useDialog } from '@/shared/hooks/use-dialog';

import { ResponsiveImage } from './responsive-image';

const CONTROL =
  'inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-white';

/**
 * Full-screen viewer for photos and clips: arrows / swipe / ← → keys, Esc
 * closes, "5 / 120" counter, caption, sound toggle; a video only loads here
 * and stops when the viewer closes or moves on.
 * @param {{
 *   items: import('@/shared/types/media').MediaItem[], index: number | null,
 *   onIndex: (index: number) => void, onClose: () => void
 * }} props
 */
export function Lightbox({ items, index, onIndex, onClose }) {
  const open = index !== null && items.length > 0;
  const length = items.length;
  const current = open ? items[index] : null;
  const [muted, setMuted] = useState(true);
  const touch = useRef(/** @type {{ x: number, y: number } | null} */ (null));
  const videoRef = useRef(/** @type {HTMLVideoElement | null} */ (null));

  const go = (/** @type {number} */ step) => {
    if (index !== null) onIndex(stepIndex(index, step, length));
  };
  const ref = useDialog(open, onClose, {
    bodyFlag: 'lightbox',
    onKey: (event) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    },
  });

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      // Stop and release the stream when the item changes or the viewer closes.
      video?.pause();
      video?.removeAttribute('src');
      video?.load();
    };
  }, [current?.id, open]);

  if (!open || !current) return null;
  const source =
    current.type === 'video'
      ? videoSource(current, current.orientation === 'portrait' ? 720 : 1080)
      : null;
  const text = current.caption || current.alt;

  return (
    <div
      ref={/** @type {import('react').Ref<HTMLDivElement>} */ (ref)}
      role="dialog"
      aria-modal="true"
      aria-label={`Xem ${current.type === 'video' ? 'video' : 'ảnh'} ${counterLabel(index ?? 0, length)}`}
      className="fixed inset-0 z-[70] flex flex-col bg-black text-white"
      onTouchStart={(event) => {
        const t = event.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touch.current;
        const t = event.changedTouches[0];
        touch.current = null;
        if (!start || !t || length < 2) return;
        const step = swipeStep(t.clientX - start.x, t.clientY - start.y);
        if (step) go(step);
      }}
    >
      <div className="flex items-center justify-between gap-3 p-3 md:p-4">
        <p
          className="min-w-16 px-2 text-sm font-semibold tabular-nums"
          aria-live="polite"
          data-lightbox-counter
        >
          {counterLabel(index ?? 0, length)}
        </p>
        <div className="flex items-center gap-2">
          {current.type === 'video' ? (
            <button
              type="button"
              className={CONTROL}
              onClick={() => setMuted((m) => !m)}
              aria-pressed={!muted}
              aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
            >
              {muted ? (
                <VolumeX aria-hidden="true" className="size-5" />
              ) : (
                <Volume2 aria-hidden="true" className="size-5" />
              )}
            </button>
          ) : null}
          <button
            type="button"
            className={CONTROL}
            onClick={onClose}
            aria-label="Đóng"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20">
        {current.type === 'video' && source ? (
          <video
            key={current.id}
            ref={videoRef}
            src={source.src}
            poster={current.poster}
            className="max-h-full max-w-full"
            controls
            autoPlay
            playsInline
            muted={muted}
            preload="metadata"
          />
        ) : current.type === 'image' ? (
          <div className="flex h-full max-h-full w-full items-center justify-center">
            <ResponsiveImage
              key={current.id}
              item={current}
              priority
              sizes="100vw"
              className="max-h-full"
              imgClassName="max-h-[calc(100svh-10rem)] w-auto max-w-full object-contain"
            />
          </div>
        ) : null}
        {length > 1 ? (
          <>
            <button
              type="button"
              className={`${CONTROL} absolute top-1/2 left-2 -translate-y-1/2 max-md:hidden`}
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </button>
            <button
              type="button"
              className={`${CONTROL} absolute top-1/2 right-2 -translate-y-1/2 max-md:hidden`}
              onClick={() => go(1)}
              aria-label="Ảnh sau"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </button>
          </>
        ) : null}
      </div>

      <p className="min-h-16 px-5 py-4 text-center text-base leading-relaxed text-white/85">
        {text}
      </p>
    </div>
  );
}
