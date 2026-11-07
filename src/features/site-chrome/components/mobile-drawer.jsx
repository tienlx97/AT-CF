'use client';

import { MapPin, Phone, X } from 'lucide-react';

import { formatPhone, shortTime, telHref } from '@/shared/api/format';
import { Logo } from '@/shared/components/logo';
import { site } from '@/shared/config/site';
import { useDialog } from '@/shared/hooks/use-dialog';

import { NavLinks } from './nav-links';

/**
 * Full-screen menu sheet for phones.
 * @param {{ open: boolean, onClose: () => void, cta: { label: string, href: string } }} props
 */
export function MobileDrawer({ open, onClose, cta }) {
  const ref = useDialog(open, onClose, { bodyFlag: 'drawer' });
  if (!open) return null;
  const { store, online } = site.hours;
  return (
    <div
      ref={/** @type {import('react').Ref<HTMLDivElement>} */ (ref)}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu điều hướng"
      className="fixed inset-0 z-50 flex flex-col bg-surface text-brand-ink md:hidden"
    >
      <div className="flex h-16 items-center justify-between px-6">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-[2px] hover:bg-surface-alt"
          aria-label="Đóng menu"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </div>
      <nav aria-label="Chính" className="flex-1 overflow-y-auto px-6 pt-4">
        <NavLinks
          onNavigate={onClose}
          className="divide-y divide-brand-ink/10 border-y border-brand-ink/10"
          linkClassName="after:hidden flex min-h-14 items-center text-2xl font-extrabold tracking-tight aria-[current=page]:text-brand"
        />
        <a
          href={cta.href}
          onClick={onClose}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-brand px-6 font-bold text-white"
        >
          <Phone aria-hidden="true" className="size-5" />
          {cta.label}
        </a>
      </nav>
      <div className="space-y-2 bg-surface-alt px-6 py-6 text-base">
        <p className="flex gap-2">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-brand"
          />
          {site.address.street}, {site.address.district}
        </p>
        <p>
          {shortTime(store.open)} – {shortTime(store.close)} tại quán ·{' '}
          {shortTime(online.open)} – {shortTime(online.close)} online
        </p>
        <p>
          <a
            href={telHref(site.phone)}
            className="font-bold underline underline-offset-4"
          >
            {formatPhone(site.phone)}
          </a>
        </p>
      </div>
    </div>
  );
}
