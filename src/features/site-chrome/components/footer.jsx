import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { formatPhone, shortTime, telHref, zaloHref } from '@/shared/api/format';
import { FacebookIcon } from '@/shared/components/brand-icons';
import { Logo } from '@/shared/components/logo';
import { NAV_LINKS, site } from '@/shared/config/site';

/** Brand-green footer with the white logo, contacts and hours. */
export function Footer() {
  const { store, online } = site.hours;
  const heading = 'label-caps mb-4 text-white/70';
  const link = 'nav-link nav-link--light';
  return (
    <footer className="bg-brand pt-16 pb-28 text-white md:pb-12">
      <div className="site-wrap grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tone="white" size="lg" />
          <p className="mt-5 max-w-xs text-base leading-relaxed text-white/90">
            {site.tagline}
          </p>
          {site.social.facebook ? (
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold"
            >
              <FacebookIcon />
              <span className={link}>Facebook Anh Tú Coffee</span>
            </a>
          ) : null}
        </div>
        <div className="md:col-span-3">
          <h2 className={heading}>Giờ mở cửa</h2>
          <dl className="space-y-3 text-base">
            <div>
              <dt className="flex items-center gap-2 font-bold">
                <Clock aria-hidden="true" className="size-4" />
                {shortTime(store.open)} – {shortTime(store.close)}
              </dt>
              <dd className="text-white/85">{store.label}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-bold">
                <Clock aria-hidden="true" className="size-4" />
                {shortTime(online.open)} – {shortTime(online.close)}
              </dt>
              <dd className="text-white/85">{online.label}</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-3">
          <h2 className={heading}>Liên hệ</h2>
          <ul className="space-y-3 text-base">
            <li>
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span className={link}>
                  {site.address.street}, {site.address.district},{' '}
                  {site.address.city}
                </span>
              </a>
            </li>
            <li>
              <a
                href={telHref(site.phone)}
                className="flex min-h-6 items-center gap-2 font-bold"
              >
                <Phone aria-hidden="true" className="size-4" />
                <span className={link}>{formatPhone(site.phone)}</span>
              </a>
            </li>
            <li>
              <a
                href={zaloHref(site.zalo)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                <span className={link}>Nhắn Zalo</span>
              </a>
            </li>
          </ul>
        </div>
        <nav aria-label="Chân trang" className="md:col-span-2">
          <h2 className={heading}>Trang</h2>
          <ul className="space-y-3 text-base">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="site-wrap mt-14 border-t border-white/20 pt-6 text-sm text-white/80">
        © 2026 Anh Tú Coffee · Cà phê pha máy nguyên chất từ {site.foundedYear}
      </div>
    </footer>
  );
}
