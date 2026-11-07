import Link from 'next/link';

import { formatPrice } from '@/shared/api/format';
import { menuImage } from '@/shared/api/media';
import { visibleCategories } from '@/shared/api/menu';
import { Button } from '@/shared/components/button';
import { ResponsiveImage } from '@/shared/components/responsive-image';

/** A product-led menu preview, ready for the owner's isolated cup photographs. */
export function FeaturedDrinks() {
  const categories = visibleCategories();
  const coffee = categories.find((category) => category.id === 'ca-phe');
  const items = [
    ...(coffee?.items ?? categories.flatMap((category) => category.items)),
  ]
    .sort(
      (a, b) =>
        Number(b.available) - Number(a.available) ||
        Number(b.featured) - Number(a.featured),
    )
    .slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="mon-noi-bat"
      className="bg-surface-alt py-20 md:py-28"
    >
      <div className="site-wrap text-center">
        <h2
          id="mon-noi-bat"
          className="text-3xl font-semibold tracking-tight md:text-[2.75rem]"
        >
          Thực đơn
        </h2>
        <nav
          aria-label="Nhóm thực đơn"
          className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu/#nhom-${category.id}`}
              className="nav-link inline-flex min-h-11 items-center text-base font-semibold text-brand-ink"
            >
              {category.name}
            </Link>
          ))}
        </nav>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-12 md:grid-cols-4 md:gap-x-8">
          {items.map((item) => {
            const photo = menuImage(item.image);
            return (
              <li key={item.id}>
                <Link
                  href="/menu/"
                  className="group block transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="zoom-frame mx-auto aspect-[4/5] w-full max-w-[16rem] p-3 md:p-5">
                    {photo ? (
                      <ResponsiveImage
                        item={photo}
                        fill
                        fit="contain"
                        imgClassName="object-bottom"
                        sizes="(min-width: 768px) 24vw, 48vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-surface p-4">
                        <span className="label-caps leading-relaxed text-brand-ink/80">
                          Ảnh ly {item.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 text-base leading-snug font-semibold md:text-xl">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-base font-semibold text-brand tabular-nums">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-10">
          <Button href="/menu/" variant="secondary">
            Xem thực đơn
          </Button>
        </div>
      </div>
    </section>
  );
}
