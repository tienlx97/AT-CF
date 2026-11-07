import { MapPin, Utensils } from 'lucide-react';

import { heroSlides } from '@/shared/api/media';
import { Button } from '@/shared/components/button';
import { site } from '@/shared/config/site';

import { HeroSlider } from './hero-slider';

/**
 * Near-full-screen slider: photos and clips from
 * media-src/hero behind a left-weighted shade, a tracked eyebrow over a large
 * brand title, one outlined category line and two actions. The copy stays
 * still while the media changes. The intro's fact card overlaps its lower edge.
 */
export function Hero() {
  const slides = heroSlides();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-brand-ink text-white"
    >
      {slides.length ? <HeroSlider slides={slides} /> : null}
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />

      <div className="hero-copy site-wrap pt-24 pb-44 md:pt-28 md:pb-40 lg:pb-36">
        <div className="relative isolate lg:max-w-[32rem]">
          <div
            data-overlay="true"
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-28 -inset-y-20 -z-10 hidden bg-[radial-gradient(closest-side,rgba(8,12,22,0.54)_0%,rgba(8,12,22,0.48)_60%,rgba(8,12,22,0)_100%)] lg:block"
          />
          <h1 id="hero-title">
            <span className="hero-rise block text-[clamp(0.8125rem,1.2vw,1rem)] leading-normal font-bold tracking-[0.14em] uppercase">
              CAFE PHA MÁY
            </span>
            <span className="hero-rise hero-title mt-3 block text-[clamp(3rem,7.5vw,7rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">
              {site.brandMain}
            </span>
          </h1>
          <p className="hero-rise mt-6 inline-block rounded-[2px] border-[1.5px] border-white/60 px-4 py-2 text-[clamp(0.8125rem,3.4vw,1rem)] font-semibold tracking-[0.06em] uppercase">
            100% NGUYÊN CHẤT - ORGANIC
          </p>
          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/menu/" variant="light">
              <Utensils aria-hidden="true" className="size-5" />
              Xem thực đơn
            </Button>
            <Button href={site.mapUrl} variant="outlineLight">
              <MapPin aria-hidden="true" className="size-5" />
              Chỉ đường
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
