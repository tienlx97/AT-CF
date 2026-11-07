'use client';

import { useState } from 'react';

import { galleryItems } from '@/shared/api/media';
import { Button } from '@/shared/components/button';
import { Lightbox } from '@/shared/components/lightbox';
import { MasonryGrid } from '@/shared/components/masonry-grid';
import { MediaPlaceholder } from '@/shared/components/media-placeholder';

import {
  filterCounts,
  filterItems,
  FILTERS,
  PAGE_SIZE,
} from '../config/gallery';
import { useGalleryFilter } from '../hooks/use-gallery-filter';

const WANTED = {
  'tat-ca': 'Ảnh và video của quán',
  'pha-che': 'Ảnh quầy, máy pha, rót cà phê',
  'do-uong': 'Ảnh ly nước, tem ly',
  'khong-gian': 'Ảnh mặt tiền, dù xanh, bàn ghế',
  'khach-hang': 'Ảnh khách, không khí buổi sáng',
  video: 'Video dọc quay tại quán',
};

/** Full gallery: filters, masonry, 24 at a time, lightbox. */
export function GalleryPage() {
  const all = galleryItems();
  const counts = filterCounts(all);
  const [filter, setFilter] = useGalleryFilter();
  const [shownFor, setShownFor] = useState({ filter, count: PAGE_SIZE });
  const [index, setIndex] = useState(/** @type {number | null} */ (null));
  const shown = shownFor.filter === filter ? shownFor.count : PAGE_SIZE;
  const items = filterItems(all, filter);
  const visible = items.slice(0, shown);

  return (
    <>
      <header className="bg-surface-alt pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="site-wrap">
          <p className="label-caps text-brand">Hình ảnh · Video</p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
            Hình ảnh Anh Tú Coffee
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-ink">
            Quầy pha máy, những ly mang đi và buổi sáng ở quán. Bấm vào ảnh để
            xem lớn.
          </p>
        </div>
      </header>
      <nav
        aria-label="Lọc theo nhóm"
        className="sticky top-16 z-30 border-b border-brand-ink/10 bg-surface/95 backdrop-blur md:top-[4rem]"
      >
        <ul className="site-wrap flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <li key={f.id} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(f.id);
                    setShownFor({ filter: f.id, count: PAGE_SIZE });
                    // A shorter list would leave the visitor in the footer.
                    document
                      .getElementById('anh-va-video')
                      ?.scrollIntoView({ block: 'start' });
                  }}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-5 text-[0.9375rem] font-bold transition-colors duration-150 ${
                    active
                      ? 'border-brand-ink/30 bg-brand text-white'
                      : 'border-brand-ink/15 bg-surface-alt text-brand-ink hover:border-brand-ink/40 hover:bg-brand-ink/10'
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-sm font-semibold ${active ? 'text-white/90' : 'text-brand-ink/80'}`}
                  >
                    {counts[f.id]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <section
        id="anh-va-video"
        aria-label="Ảnh và video"
        className="scroll-mt-36 py-10 md:scroll-mt-40 md:py-14"
      >
        <div className="site-wrap">
          {visible.length ? (
            <MasonryGrid items={visible} onOpen={setIndex} eager={2} />
          ) : (
            <div className="mx-auto max-w-md">
              <MediaPlaceholder
                label={`Chờ ${WANTED[/** @type {keyof typeof WANTED} */ (filter)]}`}
                ratio="4 / 3"
              />
            </div>
          )}
          {shown < items.length ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-sm text-brand-ink/80" aria-live="polite">
                Đang xem {visible.length} / {items.length}
              </p>
              <Button
                variant="secondary"
                onClick={() =>
                  setShownFor({ filter, count: shown + PAGE_SIZE })
                }
              >
                Xem thêm {Math.min(PAGE_SIZE, items.length - shown)} ảnh
              </Button>
            </div>
          ) : null}
        </div>
      </section>
      <Lightbox
        items={visible}
        index={index}
        onIndex={setIndex}
        onClose={() => setIndex(null)}
      />
    </>
  );
}
