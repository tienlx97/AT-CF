'use client';

import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

/** Screen-only toolbar: back to the site and print. Hidden in print. */
export function PrintToolbar() {
  return (
    <div className="print-hidden sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-brand-ink/10 bg-surface px-4 py-3">
      <Link
        href="/menu/"
        className="inline-flex min-h-11 items-center gap-2 font-bold"
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
        Về trang menu
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-12 items-center gap-2 rounded-[2px] bg-brand px-6 font-bold text-white transition hover:-translate-y-px hover:bg-brand-ink"
      >
        <Printer aria-hidden="true" className="size-5" />
        In menu
      </button>
    </div>
  );
}
