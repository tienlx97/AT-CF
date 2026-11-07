import { Printer, ShoppingBag } from 'lucide-react';

import { formatPrice } from '@/shared/api/format';
import { priceRange, visibleCategories } from '@/shared/api/menu';
import { headerCta } from '@/shared/api/order-links';
import { Button } from '@/shared/components/button';
import { menu } from '@/shared/config/menu';
import { site } from '@/shared/config/site';

import { categoryAnchor, formatDate } from '../config/menu-page';
import { CategoryTabs } from './category-tabs';
import { MenuCategory } from './menu-category';

/** The full /menu page. */
export function MenuPage() {
  const categories = visibleCategories();
  const range = priceRange();
  const order = headerCta(site.order);
  return (
    <>
      <header className="bg-surface-alt pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="site-wrap menu-page-head">
          <div>
            <p className="label-caps text-brand">Cà phê pha máy · Mang đi</p>
            <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
              Thực đơn Anh Tú
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-brand-ink">
              Giá từ {formatPrice(range.min)} đến {formatPrice(range.max)} một
              ly. Cập nhật {formatDate(menu.updatedAt)}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            {order ? (
              <Button href={order.href}>
                <ShoppingBag aria-hidden="true" className="size-5" />
                {order.label}
              </Button>
            ) : null}
            <Button href="/menu-in/" variant="secondary">
              <Printer aria-hidden="true" className="size-5" />
              Xem menu in A4
            </Button>
          </div>
        </div>
      </header>
      <CategoryTabs
        tabs={categories.map((c) => ({
          id: categoryAnchor(c.id),
          label: c.name,
        }))}
      />
      {categories.map((category, index) => (
        <MenuCategory
          key={category.id}
          category={category}
          first={index === 0}
        />
      ))}
    </>
  );
}
