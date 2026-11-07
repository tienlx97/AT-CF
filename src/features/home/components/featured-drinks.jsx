import Link from 'next/link';

import { formatPrice } from '@/shared/api/format';
import { menuImage } from '@/shared/api/media';
import { featuredItems } from '@/shared/api/menu';
import { ResponsiveImage } from '@/shared/components/responsive-image';

import { SectionHead } from './section-head';

/** 3–4 drinks marked `featured` in menu.json: large photo, name, price. */
export function FeaturedDrinks() {
  const items = featuredItems(4);
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="mon-noi-bat"
      className="bg-surface-alt py-20 md:py-28"
    >
      <div className="site-wrap">
        <SectionHead
          id="mon-noi-bat"
          label="Món nổi bật"
          title="Ly được gọi nhiều nhất"
          lead="Giá một ly mang đi, pha ngay khi bạn gọi."
          link={{ href: '/menu/', label: 'Xem cả menu' }}
        />
        <ul
          className={`mt-12 grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-6 ${items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}
        >
          {items.map((item) => {
            const photo = menuImage(item.image);
            return (
              <li key={item.id}>
                <Link
                  href="/menu/"
                  className="group block transition-transform duration-200 hover:-translate-y-0.5"
                  aria-label={`${item.name}, ${formatPrice(item.price)}`}
                >
                  <div className="zoom-frame relative aspect-[4/5] bg-surface">
                    {photo ? (
                      <ResponsiveImage
                        item={photo}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center">
                        <span className="label-caps leading-relaxed text-brand-ink/55">
                          Ảnh ly {item.name}
                        </span>
                      </div>
                    )}
                    {item.bestseller ? (
                      <span className="absolute top-3 left-3 rounded-[2px] bg-brand px-2 py-1 text-[0.6875rem] font-bold tracking-[0.12em] text-white uppercase">
                        Bán chạy
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-lg font-extrabold text-brand tabular-nums">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
