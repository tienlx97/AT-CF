'use client';

import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { mapEmbedUrl } from '@/shared/api/contact';
import { site } from '@/shared/config/site';

/**
 * A still card until the visitor asks for the map (or it scrolls near the
 * viewport on desktop); only then is the Google Maps iframe created.
 * @param {{ className?: string }} props
 */
export function LazyMap({ className = '' }) {
  const [show, setShow] = useState(false);
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    const el = ref.current;
    // Phones on 4G load it only on tap; wide screens when it comes into view.
    if (!el || window.matchMedia('(max-width: 767px)').matches)
      return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative aspect-[4/3] w-full overflow-hidden bg-surface-alt ${className}`}
      data-map
    >
      {show ? (
        <iframe
          title={`Bản đồ đến ${site.name}`}
          src={mapEmbedUrl(site.geo, site.name)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-brand text-white">
            <MapPin aria-hidden="true" className="size-7" />
          </span>
          <p className="max-w-xs text-base font-semibold">
            {site.address.street}, {site.address.district}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setShow(true)}
              className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-brand-ink/30 bg-surface px-5 font-bold transition hover:-translate-y-px hover:border-brand-ink"
            >
              Xem bản đồ
            </button>
            <a
              href={site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-brand px-5 font-bold text-white transition hover:-translate-y-px hover:bg-brand-ink"
            >
              Mở Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
