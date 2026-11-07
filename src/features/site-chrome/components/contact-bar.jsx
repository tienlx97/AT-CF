import { MessageCircle, Phone } from 'lucide-react';

import { telHref, zaloHref } from '@/shared/api/format';
import { site } from '@/shared/config/site';

const PILL =
  'inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-base font-bold shadow-[0_6px_20px_rgb(0_0_0/0.18)] transition duration-150 active:scale-[.97]';

/** Floating call / Zalo buttons on phones; hidden while a lightbox or drawer is open. */
export function ContactBar() {
  return (
    <div className="contact-bar fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex gap-2 md:hidden">
      <a href={telHref(site.phone)} className={`${PILL} bg-brand text-white`}>
        <Phone aria-hidden="true" className="size-5" />
        Gọi
      </a>
      <a
        href={zaloHref(site.zalo)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${PILL} bg-white text-brand-ink ring-1 ring-brand-ink/15`}
      >
        <MessageCircle aria-hidden="true" className="size-5" />
        Zalo
      </a>
    </div>
  );
}
