'use client';

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { videoSource } from '@/shared/api/media';
import { ResponsiveImage } from '@/shared/components/responsive-image';

import { CLIP_MAX_MS, SLIDE_MS, wrapSlide } from '../config/hero.js';
import { useHeroSlider } from '../hooks/use-hero-slider.js';
import { useHeroVideo } from '../hooks/use-hero-video.js';

/** @typedef {import('@/shared/types/media').MediaItem} MediaItem */

/**
 * The hero's media layer (owner request, after giaoyeniz.com): photos and
 * clips cross-fade with a slow push-in, dash indicators with a progress fill,
 * round prev/next buttons and a pause button. Slide 1 is server-rendered as
 * the LCP image; later slides mount one step ahead, a clip's file only when
 * its slide is shown and only if motion and data allow (else its poster).
 * @param {{ slides: readonly MediaItem[] }} props
 */
export function HeroSlider({ slides }) {
  const isClip = useCallback(
    (/** @type {number} */ i) => slides[i]?.type === 'video',
    [slides],
  );
  const slider = useHeroSlider(slides.length, isClip);
  const variant = useHeroVideo();
  const [reached, setReached] = useState(() => new Set([0]));
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const { index, next, prev } = slider;

  if (!reached.has(index)) setReached(new Set(reached).add(index));

  // Swipe anywhere on the hero (the copy sits above this layer).
  useEffect(() => {
    const section = rootRef.current?.closest('section');
    if (!section || slides.length < 2) return undefined;
    let startX = 0;
    let startY = 0;
    const down = (/** @type {TouchEvent} */ e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const up = (/** @type {TouchEvent} */ e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
        (dx < 0 ? next : prev)();
    };
    section.addEventListener('touchstart', down, { passive: true });
    section.addEventListener('touchend', up, { passive: true });
    return () => {
      section.removeEventListener('touchstart', down);
      section.removeEventListener('touchend', up);
    };
  }, [next, prev, slides.length]);

  const upcoming = wrapSlide(index, 1, slides.length);

  return (
    <div ref={rootRef} className="contents">
      <div className="hero-slides absolute inset-0 -z-20">
        {slides.map((item, i) => {
          const active = i === index;
          const mounted = reached.has(i) || i === upcoming;
          return (
            <div
              key={item.id}
              aria-hidden={!active}
              data-active={active || undefined}
              className="hero-slide absolute inset-0"
            >
              {mounted ? (
                item.type === 'video' ? (
                  <HeroClip
                    item={item}
                    play={active && variant !== null && slider.canPlay}
                    wanted={variant === 'portrait' ? 720 : 1080}
                    paused={!slider.playing}
                    onEnded={next}
                  />
                ) : (
                  <ResponsiveImage
                    item={item}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                  />
                )
              ) : null}
            </div>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-[6.5rem] z-10 md:bottom-[7rem] lg:bottom-[9rem]">
          <div className="site-wrap flex items-center justify-end gap-3 sm:gap-4 [&>*]:pointer-events-auto">
            <div className="mr-auto text-sm font-bold tracking-[0.14em] text-white tabular-nums sm:mr-2">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span className="text-white/60"> / {String(slides.length).padStart(2, '0')}</span>
            </div>
            <ol className="flex items-center gap-2" aria-label="Chọn ảnh">
              {slides.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => slider.go(i)}
                    aria-label={`Ảnh ${i + 1}`}
                    aria-current={i === index || undefined}
                    className="hero-dash group flex h-11 items-center"
                  >
                    <span className="relative block h-[3px] w-4 overflow-hidden bg-white/45 transition-[width] duration-500 group-aria-[current]:w-10 sm:group-aria-[current]:w-12">
                      {i === index ? (
                        <span
                          key={`${index}-${slider.playing}`}
                          data-running={slider.playing || undefined}
                          className="hero-dash__fill absolute inset-0 bg-white"
                          style={{
                            animationDuration: `${
                              item.type === 'video'
                                ? Math.min((item.duration ?? 0) * 1000 || CLIP_MAX_MS, CLIP_MAX_MS)
                                : SLIDE_MS
                            }ms`,
                          }}
                        />
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="flex items-center gap-2">
              {slider.canPlay ? (
                <RoundButton
                  label={slider.playing ? 'Tạm dừng trình chiếu' : 'Tiếp tục trình chiếu'}
                  onClick={slider.toggle}
                >
                  {slider.playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                </RoundButton>
              ) : null}
              <RoundButton label="Ảnh trước" onClick={prev}>
                <ChevronLeft className="size-5" />
              </RoundButton>
              <RoundButton label="Ảnh sau" onClick={next}>
                <ChevronRight className="size-5" />
              </RoundButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** @param {{ label: string, onClick: () => void, children: import('react').ReactNode }} props */
function RoundButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-white/60 text-white transition-colors hover:bg-white hover:text-brand-ink [&_svg]:pointer-events-none"
    >
      <span aria-hidden="true" className="contents">
        {children}
      </span>
    </button>
  );
}

/**
 * A hero clip: poster always; the file is attached only while `play`.
 * @param {{ item: MediaItem, play: boolean, wanted: number, paused: boolean, onEnded: () => void }} props
 */
function HeroClip({ item, play, wanted, paused, onEnded }) {
  const ref = useRef(/** @type {HTMLVideoElement | null} */ (null));
  const source = play ? videoSource(item, wanted) : null;

  useEffect(() => {
    const video = ref.current;
    if (!video || !source) return;
    if (paused) video.pause();
    else video.play().catch(() => {});
  }, [paused, source]);

  return (
    <video
      ref={ref}
      key={source?.src ?? 'poster'}
      src={source?.src}
      poster={item.poster}
      muted
      playsInline
      autoPlay={!paused}
      preload="none"
      onEnded={onEnded}
      className="h-full w-full object-cover"
      style={{
        backgroundImage: item.blur ? `url(${item.blur})` : undefined,
        backgroundSize: 'cover',
      }}
    />
  );
}
