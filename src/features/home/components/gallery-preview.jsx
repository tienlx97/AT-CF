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
  { label: 'Ảnh mặt tiền quán, dù xanh' },
  { label: 'Ảnh máy pha cà phê' },
  { label: 'Ảnh ly cà phê muối' },
  { label: 'Ảnh tem ly mang đi' },
  { label: 'Ảnh khách lấy ly buổi sáng' },
  { label: 'Ảnh quầy pha chế' },
  { label: 'Ảnh bàn ghế trước quán' },
  { label: 'Ảnh rót cà phê' },
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
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {WANTED.map((shot) => (
                <li key={shot.label}>
                  <MediaPlaceholder label={shot.label} ratio="1 / 1" />
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
