import Image from 'next/image';

import { formatPrice, shortTime } from '@/shared/api/format';
import { leadPhoto } from '@/shared/api/media';
import { priceRange, visibleCategories } from '@/shared/api/menu';
import { ResponsiveImage } from '@/shared/components/responsive-image';
import { site } from '@/shared/config/site';

/** Keep the reserved gallery selection stable when the introduction changes. */
export function introPhotos() {
  return [leadPhoto('pha-che'), leadPhoto('do-uong')];
}

/** Useful shop facts; coffee pricing stays distinct from bottled drinks. */
function facts() {
  const coffee = visibleCategories().find(
    (category) => category.id === 'ca-phe',
  );
  const startingPrice = coffee
    ? Math.min(...coffee.items.map((item) => item.price))
    : priceRange().min;
  return [
    { label: 'Cà phê nguyên chất', value: '100%' },
    {
      label: 'Bán tại quầy',
      value: `${shortTime(site.hours.store.open)} – ${shortTime(site.hours.store.close)}`,
    },
    {
      label: coffee ? 'Cà phê từ' : 'Đồ uống từ',
      value: formatPrice(startingPrice),
    },
  ];
}

/** Server-rendered editorial introduction: our real stall, not another cafe. */
export function Intro() {
  const preparation = introPhotos()[0];
  return (
    <section aria-labelledby="gioi-thieu" className="home-about bg-surface">
      <div className="site-wrap py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <p className="label-caps text-brand">Về Anh Tú</p>
            <h2
              id="gioi-thieu"
              className="mt-5 max-w-xl text-[2.5rem] leading-[1.12] font-semibold tracking-tight sm:text-5xl xl:text-[4rem]"
            >
              Cà phê pha máy.
              <br />
              Nguyên chất.
              <br />
              Tiện mang đi.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-relaxed">
              {site.intro}
            </p>
            <a
              href="/menu/"
              className="link-arrow mt-7 inline-flex min-h-11 items-center gap-3 font-semibold text-brand"
            >
              Xem thực đơn <span aria-hidden="true">→</span>
            </a>
            <dl className="mt-10 w-full divide-y divide-brand-ink/15 border-t border-brand-ink/15 lg:mt-auto lg:pt-8 lg:border-t-0">
              {facts().map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4"
                >
                  <dt className="text-base">{fact.label}</dt>
                  <dd className="text-lg font-semibold whitespace-nowrap text-brand tabular-nums">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-3 gap-4 self-start lg:gap-6">
            <a
              href="/lien-he/"
              aria-label="Xem địa chỉ quầy Anh Tú Coffee"
              className="zoom-frame col-span-3 block aspect-[4/3] overflow-hidden bg-surface-alt"
            >
              <Image
                src="/diary/quan/xe-ca-phe.jpg"
                alt="Quầy cà phê mang đi Anh Tú trên Đường A8"
                width={1400}
                height={1867}
                sizes="(min-width: 1024px) 46vw, 94vw"
                loading="lazy"
                className="h-full w-full object-cover object-[35%_70%]"
              />
            </a>
            {preparation ? (
              <div className="zoom-frame col-span-2 aspect-[2/1] overflow-hidden">
                <ResponsiveImage
                  item={preparation}
                  fill
                  sizes="(min-width: 1024px) 30vw, 62vw"
                />
              </div>
            ) : null}
            <div
              aria-hidden="true"
              className="flex items-end justify-end text-right text-sm leading-relaxed font-semibold tracking-[0.16em] text-brand"
            >
              ANH TÚ
              <br />
              COFFEE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
