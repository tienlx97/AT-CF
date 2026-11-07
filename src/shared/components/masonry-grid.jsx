import { Play } from 'lucide-react';

import { ResponsiveImage } from './responsive-image';

/**
 * CSS-columns masonry of photos and clip posters. Each tile is a button that
 * opens the lightbox at its index; images are lazy except the first `eager`.
 * @param {{
 *   items: import('@/shared/types/media').MediaItem[], onOpen: (index: number) => void,
 *   eager?: number, columns?: string
 * }} props
 */
export function MasonryGrid({
  items,
  onOpen,
  eager = 0,
  columns = 'columns-2 md:columns-3 lg:columns-4',
}) {
  return (
    <ul className={`${columns} gap-3 md:gap-4`}>
      {items.map((item, index) => (
        <li key={item.id} className="mb-3 break-inside-avoid md:mb-4">
          <button
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`${item.type === 'video' ? 'Xem video' : 'Xem ảnh lớn'}: ${item.alt}`}
            className="group zoom-frame relative block w-full bg-surface-alt"
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
          >
            {item.type === 'video' ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- static poster from pnpm media */}
                <img
                  src={item.poster}
                  alt=""
                  width={item.width}
                  height={item.height}
                  loading={index < eager ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-brand-ink shadow-lg">
                    <Play
                      aria-hidden="true"
                      className="ml-0.5 size-5"
                      fill="currentColor"
                    />
                  </span>
                </span>
              </>
            ) : (
              <ResponsiveImage
                item={item}
                fill
                priority={index < eager}
                highPriority={index === 0 && eager > 0}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
