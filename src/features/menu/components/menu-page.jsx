import { Phone, Printer } from 'lucide-react';

import { formatPhone, formatPrice, telHref } from '@/shared/api/format';
import { priceRange, visibleCategories } from '@/shared/api/menu';
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
  return (
    <>
      <header className="bg-surface-alt pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="site-wrap">
          <p className="label-caps text-brand">Cà phê pha máy · Mang đi</p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
            Menu Anh Tú Coffee
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-ink/80">
            Giá từ {formatPrice(range.min)} đến {formatPrice(range.max)} một ly.
            Cập nhật {formatDate(menu.updatedAt)}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={telHref(site.phone)}>
              <Phone aria-hidden="true" className="size-5" />
              Gọi đặt món {formatPhone(site.phone)}
            </Button>
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
