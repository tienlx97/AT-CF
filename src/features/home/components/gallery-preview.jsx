'use client';

import { useState } from 'react';

import { galleryPreview } from '@/shared/api/media';
import { Button } from '@/shared/components/button';
import { Lightbox } from '@/shared/components/lightbox';
import { MasonryGrid } from '@/shared/components/masonry-grid';
import { MediaPlaceholder } from '@/shared/components/media-placeholder';

import { introPhoto } from './intro';
import { SectionHead } from './section-head';

const WANTED = [
  { label: 'Ảnh mặt tiền quán, dù xanh', ratio: '4 / 5' },
  { label: 'Ảnh máy pha cà phê', ratio: '1 / 1' },
  { label: 'Ảnh ly cà phê muối', ratio: '4 / 5' },
  { label: 'Ảnh tem ly mang đi', ratio: '1 / 1' },
  { label: 'Ảnh khách lấy ly buổi sáng', ratio: '4 / 3' },
  { label: 'Ảnh quầy pha chế', ratio: '4 / 5' },
  { label: 'Ảnh bàn ghế trước quán', ratio: '1 / 1' },
  { label: 'Ảnh rót cà phê', ratio: '4 / 5' },
];

/** The 8–12 best photos as masonry, each opening the lightbox, then a link to /hinh-anh. */
export function GalleryPreview() {
  const lead = introPhoto();
  const photos = galleryPreview(12, undefined, lead ? [lead.id] : []);
  const [index, setIndex] = useState(/** @type {number | null} */ (null));
  return (
    <section aria-labelledby="hinh-anh-quan" className="py-20 md:py-28">
      <div className="site-wrap">
        <SectionHead
          id="hinh-anh-quan"
          label="Hình ảnh"
          title="Quán, quầy pha và những ly mang đi"
          link={{ href: '/hinh-anh/', label: 'Xem tất cả ảnh' }}
        />
        <div className="mt-12">
          {photos.length ? (
            <MasonryGrid items={photos} onOpen={setIndex} />
          ) : (
            <ul className="columns-2 gap-3 md:columns-4 md:gap-4">
              {WANTED.map((shot) => (
                <li
                  key={shot.label}
                  className="mb-3 break-inside-avoid md:mb-4"
                >
                  <MediaPlaceholder label={shot.label} ratio={shot.ratio} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-10 md:hidden">
          <Button href="/hinh-anh/" variant="secondary" className="w-full">
            Xem tất cả ảnh
          </Button>
        </div>
      </div>
      <Lightbox
        items={photos}
        index={index}
        onIndex={setIndex}
        onClose={() => setIndex(null)}
      />
    </section>
  );
}
