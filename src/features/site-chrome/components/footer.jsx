import { shortTime } from '@/shared/api/format';
import { headerCta } from '@/shared/api/order-links';
import { Logo } from '@/shared/components/logo';
import { site } from '@/shared/config/site';

/** A small brand footer: address, counter hours and the two external channels. */
export function Footer() {
  const { store } = site.hours;
  const order = headerCta(site.order);
  return (
    <footer className="border-t border-brand-ink/10 bg-surface py-8 text-brand-ink">
      <div className="site-wrap flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <Logo />
        <div className="text-sm leading-relaxed">
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link inline-flex min-h-11 items-center"
          >
            {site.address.street}, {site.address.district}
          </a>
          <p>
            Tại quầy {shortTime(store.open)} – {shortTime(store.close)}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          {site.social.facebook ? (
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link inline-flex min-h-11 items-center"
            >
              Facebook
            </a>
          ) : null}
          {order ? (
            <a
              href={order.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link inline-flex min-h-11 items-center"
            >
              ShopeeFood
            </a>
          ) : null}
        </div>
      </div>
      <div className="site-wrap mt-6 border-t border-brand-ink/10 pt-4 text-xs text-brand-ink/75">
        © 2026 Anh Tú Coffee
      </div>
    </footer>
  );
}
