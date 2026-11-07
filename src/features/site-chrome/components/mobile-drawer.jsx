'use client';

import { MapPin, ShoppingBag, X } from 'lucide-react';

import { shortTime } from '@/shared/api/format';
import { Logo } from '@/shared/components/logo';
import { site } from '@/shared/config/site';
import { useDialog } from '@/shared/hooks/use-dialog';

import { NavLinks } from './nav-links';

/**
 * Full-screen menu sheet for phones.
 * @param {{ open: boolean, onClose: () => void, cta: { label: string, href: string } | null }} props
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
      className="fixed inset-0 z-50 flex flex-col bg-surface text-brand-ink xl:hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between bg-brand-ink px-4 text-white">
        <Logo tone="white" />
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-[2px] border-[1.5px] border-white/50 hover:border-white hover:bg-white/10"
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
        {cta ? (
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] border-[1.5px] border-brand-ink/30 bg-brand px-6 font-bold text-white"
          >
            <ShoppingBag aria-hidden="true" className="size-5" />
            {cta.label}
          </a>
        ) : null}
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
      </div>
    </div>
  );
}
