'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';

import { reels } from '@/shared/api/media';
import { Lightbox } from '@/shared/components/lightbox';
import { VideoPoster } from '@/shared/components/video-poster';

import { SectionHead } from './section-head';

const WANTED_SHOTS = [
  'Video dọc rót cà phê muối',
  'Video dọc máy pha chiết espresso',
  'Video dọc khách lấy ly mang đi',
  'Video dọc dù xanh buổi sáng',
];

/**
 * Vertical clips as a horizontal strip of posters; tapping one loads and
 * plays it in the lightbox. Nothing of a clip loads before the tap.
 */
export function Reels() {
  const clips = reels(8);
  const [index, setIndex] = useState(/** @type {number | null} */ (null));
  return (
    <section
      aria-labelledby="video-ngan"
      className="overflow-hidden bg-surface-alt py-16 md:py-20"
    >
      <div className="site-wrap">
        <SectionHead
          id="video-ngan"
          label="Video ngắn"
          title="Pha cà phê tại quầy"
          link={
            clips.length
              ? { href: '/hinh-anh/?nhom=video', label: 'Xem tất cả video' }
              : undefined
          }
        />
      </div>
      <ul className="site-wrap mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-4">
        {clips.length
          ? clips.map((clip, i) => (
              <li
                key={clip.id}
                className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <VideoPoster
                  item={clip}
                  onPlay={() => setIndex(i)}
                  className="aspect-[9/16] overflow-hidden rounded-xl"
                />
              </li>
            ))
          : WANTED_SHOTS.map((shot) => (
              <li
                key={shot}
                className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <div
                  role="img"
                  aria-label={`Chờ video: ${shot.toLowerCase()}`}
                  className="relative flex aspect-[9/16] flex-col items-center justify-center gap-5 rounded-xl border border-brand-ink/10 bg-brand-ink p-6 text-center text-white"
                >
                  <Play aria-hidden="true" className="size-7 text-white/90" />
                  <span className="label-caps leading-relaxed text-white/90">
                    {shot}
                  </span>
                </div>
              </li>
            ))}
      </ul>
      <Lightbox
        items={clips}
        index={index}
        onIndex={setIndex}
        onClose={() => setIndex(null)}
      />
    </section>
  );
}
