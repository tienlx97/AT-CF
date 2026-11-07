'use client';

import { Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/shared/components/logo';
import { useScrolled } from '@/shared/hooks/use-scrolled';

import { SOLID_AFTER, startsOverHero } from '../config/chrome';
import { useHeaderCta } from '../hooks/use-header-cta';
import { MobileDrawer } from './mobile-drawer';
import { NavLinks } from './nav-links';

/** One compact brand-green navbar, fixed in the same position on every route. */
export function Header() {
  const pathname = usePathname() ?? '/';
  const scrolled = useScrolled(SOLID_AFTER);
  const [open, setOpen] = useState(false);
  const cta = useHeaderCta();
  const overHero = startsOverHero(pathname) && !scrolled;

  return (
    <>
      <a href="#noi-dung" className="skip-link">
        Bỏ qua đến nội dung
      </a>
      <header
        data-over-hero={overHero ? 'true' : 'false'}
        className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-brand-ink text-white"
      >
        <div
          data-nav-surface
          className="site-wrap flex h-16 items-center justify-between gap-3 bg-brand-ink md:h-[4rem] lg:gap-6"
        >
          <Link
            href="/"
            aria-label="Anh Tú Coffee, trang chủ"
            className="shrink-0"
          >
            <Logo tone="white" size="nav" />
          </Link>
          <nav aria-label="Chính" className="hidden xl:block">
            <NavLinks
              className="flex items-center gap-4 whitespace-nowrap lg:gap-8"
              linkClassName="text-[0.9375rem] font-semibold"
            />
          </nav>
          <div className="flex items-center gap-2">
            {cta ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden min-h-11 whitespace-nowrap items-center gap-2 rounded-[2px] border-[1.5px] border-white/60 px-4 text-[0.9375rem] font-bold transition duration-150 hover:-translate-y-px hover:border-white hover:bg-white hover:text-brand-ink active:translate-y-px sm:inline-flex lg:px-5"
              >
                <ShoppingBag aria-hidden="true" className="size-4" />
                {cta.label}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Mở menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-[2px] border-[1.5px] border-white/50 hover:border-white hover:bg-white/10 xl:hidden"
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
