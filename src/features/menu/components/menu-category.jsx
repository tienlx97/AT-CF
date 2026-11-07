import { categoryOptions } from '@/shared/api/menu';

import { categoryAnchor } from '../config/menu-page';
import { MenuItemCard } from './menu-item-card';

/**
 * One category: heading, its options, then the items — rows on phones,
 * a 4-column grid on desktop; works from 1 to 30+ items.
 * @param {{ category: import('@/shared/types/menu').MenuCategory, first?: boolean }} props
 */
export function MenuCategory({ category, first = false }) {
  const options = categoryOptions(category);
  return (
    <section
      id={categoryAnchor(category.id)}
      className="scroll-mt-36 py-14 md:scroll-mt-40 md:py-20"
    >
      <div className="site-wrap">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {category.name}
            </h2>
            {category.description ? (
              <p className="mt-2 text-base text-brand-ink/75">
                {category.description}
              </p>
            ) : null}
          </div>
          <p className="text-sm font-semibold text-brand-ink/70">
            {category.items.length} món
          </p>
        </div>
        {options.length ? (
          <dl className="mt-6 grid gap-x-8 gap-y-2 border-y border-brand-ink/10 py-4 text-base md:flex">
            {options.map((option) => (
              <div key={option.id} className="flex flex-wrap gap-x-2">
                <dt className="font-bold">{option.label}:</dt>
                <dd className="text-brand-ink/80">
                  {option.values.join(' · ')}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="mt-6 grid gap-x-12 border-b border-brand-ink/10 md:grid-cols-2">
          {category.items.map((item, index) => (
            <div key={item.id} className="border-t border-brand-ink/10">
              <MenuItemCard
                item={item}
                layout="row"
                priority={first && index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
