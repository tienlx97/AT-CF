'use client';

import { MapPin, Utensils } from 'lucide-react';

import { shortTime } from '@/shared/api/format';
import { heroMedia, videoSource } from '@/shared/api/media';
import { Button } from '@/shared/components/button';
import { StatusBadge } from '@/shared/components/status-badge';
import { site } from '@/shared/config/site';

import { HERO_HEIGHT, heroFor } from '../config/hero';
import { useHeroVideo } from '../hooks/use-hero-video';

/** Full-screen hero: video (or its poster) under a green veil, the shop's facts and two actions. */
export function Hero() {
  const hero = heroMedia();
  const variant = useHeroVideo();
  const posterLandscape = hero.landscape?.poster ?? hero.portrait?.poster;
  const posterPortrait = hero.portrait?.poster ?? hero.landscape?.poster;
  const playing = variant ? heroFor(hero, variant) : null;
  const source =
    playing && variant ? videoSource(playing, HERO_HEIGHT[variant]) : null;
  const { store, online } = site.hours;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-brand-ink text-white"
    >
      {posterLandscape ? (
        <picture className="absolute inset-0 -z-20">
          {posterPortrait ? (
            <source media="(max-width: 767px)" srcSet={posterPortrait} />
          ) : null}
          {}
          <img
            src={posterLandscape}
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </picture>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 flex items-start justify-end p-6 pt-24"
        >
          <span className="label-caps max-w-[18rem] text-right leading-relaxed text-white/45">
            Chờ video hero: rót cà phê tại quầy, dù xanh của quán
          </span>
        </div>
      )}
      {source ? (
        <video
          key={source.src}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={source.src}
          poster={playing?.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-brand-ink/65"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-linear-to-t from-brand-ink/85 to-transparent"
      />

      <div className="site-wrap pt-28 pb-14 md:pb-20">
        <StatusBadge />
        <h1
          id="hero-title"
          className="mt-5 max-w-[14ch] text-[2.5rem] leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Cà phê pha máy mang đi ở {site.address.district}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed font-medium text-white/90 md:text-xl">
          {site.tagline} Bán tại quán {shortTime(store.open)} –{' '}
          {shortTime(store.close)}, đặt online đến {shortTime(online.close)}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/menu/" variant="light">
            <Utensils aria-hidden="true" className="size-5" />
            Xem menu
          </Button>
          <Button href={site.mapUrl} variant="outlineLight">
            <MapPin aria-hidden="true" className="size-5" />
            Chỉ đường
          </Button>
        </div>
        <p className="label-caps mt-10 hidden text-white/70 md:block">
          {site.address.street} · {site.address.district} · {site.address.city}
        </p>
      </div>
    </section>
  );
}
