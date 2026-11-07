import { formatPrice, shortTime } from '@/shared/api/format';
import { leadPhoto } from '@/shared/api/media';
import { priceRange, visibleCategories } from '@/shared/api/menu';
import { MediaPlaceholder } from '@/shared/components/media-placeholder';
import { ResponsiveImage } from '@/shared/components/responsive-image';
import { site } from '@/shared/config/site';

/** The intro's photo pair; the gallery preview skips them so no photo shows twice. */
export function introPhotos() {
  return [leadPhoto('pha-che'), leadPhoto('do-uong')];
}

const WANTED = ['Ảnh quầy pha máy', 'Ảnh ly cà phê mang đi'];

/** Useful shop facts; coffee pricing stays distinct from bottled drinks. */
function facts() {
  const coffee = visibleCategories().find((category) => category.id === 'ca-phe');
  const startingPrice = coffee
    ? Math.min(...coffee.items.map((item) => item.price))
    : priceRange().min;
  return [
    { label: 'Cà phê nguyên chất', value: '100%' },
    {
      label: 'Bán tại quầy',
      value: `${shortTime(site.hours.store.open)} – ${shortTime(site.hours.store.close)}`,
    },
    { label: coffee ? 'Cà phê từ' : 'Đồ uống từ', value: formatPrice(startingPrice) },
  ];
}

/**
 * Compact practical facts, a short introduction to the take-away stall,
 * then photographs of preparation and drinks.
 */
export function Intro() {
  const photos = introPhotos();
  return (
    <section aria-labelledby="gioi-thieu" className="bg-surface-alt pb-0">
      <div className="site-wrap relative z-10 -mt-8 md:-mt-12">
        <dl className="grid divide-y divide-brand-ink/10 rounded-[2px] bg-surface shadow-[0_4px_24px_rgb(31_61_49/0.08)] md:grid-cols-3 md:divide-x md:divide-y-0">
          {facts().map((fact) => (
            <div
              key={fact.label}
              className="flex items-center justify-between gap-4 px-5 py-5 md:flex-col md:items-start md:gap-2 md:px-7 md:py-6"
            >
              <dt className="text-sm leading-snug font-semibold">{fact.label}</dt>
              <dd className="shrink-0 text-xl leading-snug font-bold whitespace-nowrap text-brand tabular-nums md:text-2xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="site-wrap py-16 text-center md:py-20">
        <p className="label-caps flex items-center justify-center gap-4 text-brand">
          <span aria-hidden="true" className="h-px w-12 bg-brand/50" />
          Giới thiệu
          <span aria-hidden="true" className="h-px w-12 bg-brand/50" />
        </p>
        <h2
          id="gioi-thieu"
          className="mx-auto mt-4 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight md:text-5xl"
        >
          Cà phê mang đi trên Đường A8
        </h2>
        <span
          aria-hidden="true"
          className="mx-auto mt-6 block h-1 w-20 bg-brand [clip-path:polygon(0_0,100%_0,calc(100%-6px)_100%,6px_100%)]"
        />
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed md:text-xl">
          {site.intro}
        </p>
      </div>

      <div className="grid sm:grid-cols-2">
        {photos.map((photo, index) =>
          photo ? (
            <div key={photo.id} className="zoom-frame aspect-[4/3] md:aspect-[16/11]">
              <ResponsiveImage item={photo} fill sizes="(min-width: 640px) 50vw, 100vw" />
            </div>
          ) : (
            <MediaPlaceholder
              key={WANTED[index]}
              label={WANTED[index]}
              ratio="16 / 11"
              tone="brand"
              className={index === 1 ? 'border-t border-white/15 sm:border-t-0 sm:border-l' : ''}
            />
          ),
        )}
      </div>
    </section>
  );
}
