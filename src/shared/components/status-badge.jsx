'use client';

import { shortTime } from '@/shared/api/format';
import { site } from '@/shared/config/site';
import { useOpenStatus } from '@/shared/hooks/use-open-status';

const DOT = {
  open: 'bg-emerald-400',
  online: 'bg-amber-300',
  closed: 'bg-neutral-400',
};

/**
 * "Đang mở cửa · đến 11:00" etc. Before mount (static HTML) it shows the
 * day's span so the line never reads wrong.
 * @param {{ tone?: 'light' | 'dark', className?: string }} props
 */
export function StatusBadge({ tone = 'light', className = '' }) {
  const status = useOpenStatus();
  const label =
    status?.label ??
    `Mở cửa ${shortTime(site.hours.store.open)} – ${shortTime(site.hours.online.close)}`;
  const skin =
    tone === 'light'
      ? 'bg-black/35 text-white ring-1 ring-white/25'
      : 'bg-surface text-brand-ink ring-1 ring-brand-ink/10';
  return (
    <p
      className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold ${skin} ${className}`}
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${status ? DOT[status.state] : 'bg-neutral-300'}`}
      />
      {label}
    </p>
  );
}
