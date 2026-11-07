import { Play } from 'lucide-react';

/**
 * A clip's poster with a play button. Nothing of the video loads until the
 * visitor presses it (`onPlay` opens the lightbox).
 * @param {{
 *   item: import('@/shared/types/media').MediaItem, onPlay: () => void, className?: string, label?: string
 * }} props
 */
export function VideoPoster({ item, onPlay, className = '', label }) {
  const duration = item.duration
    ? `${Math.floor(item.duration / 60)}:${String(Math.round(item.duration % 60)).padStart(2, '0')}`
    : '';
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`${duration ? `${duration} ` : ''}${label ?? `Xem video: ${item.alt}`}`}
      className={`group zoom-frame relative block w-full bg-brand-ink ${className}`}
      style={{
        backgroundImage: item.blur ? `url(${item.blur})` : undefined,
        backgroundSize: 'cover',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static poster from pnpm media */}
      <img
        src={item.poster}
        alt=""
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full border-[1.5px] border-brand-ink/20 bg-white/90 text-brand-ink shadow-lg transition duration-150 group-hover:scale-105">
          <Play
            aria-hidden="true"
            className="ml-0.5 size-6"
            fill="currentColor"
          />
        </span>
      </span>
      {duration ? (
        <span className="absolute right-2 bottom-2 rounded-[2px] bg-black/60 px-1.5 py-0.5 text-xs font-semibold text-white">
          {duration}
        </span>
      ) : null}
    </button>
  );
}
