import { categoryAnchor } from '../config/menu-page';
import { MenuItemCard } from './menu-item-card';

/** @param {{ category: import('@/shared/types/menu').MenuCategory, first?: boolean }} props */
export function MenuCategory({ category, first = false }) {
  return (
    <section
      id={categoryAnchor(category.id)}
      className="scroll-mt-36 py-12 md:scroll-mt-40 md:py-16"
    >
      <div className="site-wrap">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {category.name}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {category.items.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              priority={first && index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
