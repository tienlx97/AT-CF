'use client';

import { Menu, Phone, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/shared/components/logo';
import { useScrolled } from '@/shared/hooks/use-scrolled';

import { SOLID_AFTER, startsOverHero } from '../config/chrome';
import { useHeaderCta } from '../hooks/use-header-cta';
import { MobileDrawer } from './mobile-drawer';
import { NavLinks } from './nav-links';

/** Fixed site header: transparent over a hero, solid white once scrolled. */
export function Header() {
  const pathname = usePathname() ?? '/';
  const scrolled = useScrolled(SOLID_AFTER);
  const [open, setOpen] = useState(false);
  const cta = useHeaderCta();
  const overHero = startsOverHero(pathname) && !scrolled;
  const Icon = cta.kind === 'order' ? ShoppingBag : Phone;

  return (
    <>
      <a href="#noi-dung" className="skip-link">
        Bỏ qua đến nội dung
      </a>
      <header
        data-over-hero={overHero ? 'true' : 'false'}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
          overHero
            ? 'bg-transparent text-white'
            : 'border-b border-brand-ink/10 bg-surface/95 text-brand-ink shadow-[0_1px_12px_rgb(0_0_0/0.06)] backdrop-blur'
        }`}
      >
        <div className="site-wrap flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Link
            href="/"
            aria-label="Anh Tú Coffee, trang chủ"
            className="shrink-0"
          >
            <Logo tone={overHero ? 'white' : 'brand'} />
          </Link>
          <nav aria-label="Chính" className="hidden md:block">
            <NavLinks
              className="flex items-center gap-6 whitespace-nowrap lg:gap-8"
              linkClassName="text-[0.9375rem] font-semibold"
            />
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={cta.href}
              className={`hidden min-h-11 items-center gap-2 rounded-[2px] px-5 text-[0.9375rem] font-bold transition duration-150 hover:-translate-y-px active:translate-y-px sm:inline-flex ${
                overHero
                  ? 'bg-white text-brand-ink hover:bg-surface-alt'
                  : 'bg-brand text-white hover:bg-brand-ink'
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {cta.label}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Mở menu"
              className={`-mr-2 inline-flex size-11 items-center justify-center rounded-[2px] md:hidden ${
                overHero ? 'hover:bg-white/10' : 'hover:bg-surface-alt'
              }`}
            >
              <Menu aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={open} onClose={() => setOpen(false)} cta={cta} />
    </>
  );
}
