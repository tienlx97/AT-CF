import { ExternalLink, MessageCircle, Phone, ShoppingBag } from 'lucide-react';

import { formatPhone, shortTime, telHref, zaloHref } from '@/shared/api/format';
import { orderPlatforms } from '@/shared/api/order-links';
import { FacebookIcon } from '@/shared/components/brand-icons';
import { site } from '@/shared/config/site';

const CARD =
  'group flex min-h-20 items-center gap-4 border border-white/25 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white/5';

/**
 * Contact links and the online-order block. ShopeeFood/GrabFood buttons
 * appear only when their links are filled in site.json; otherwise the block
 * offers phone and Zalo.
 */
export function ContactOrder() {
  const platforms = orderPlatforms(site.order);
  const { online } = site.hours;
  const onlineHours = `${shortTime(online.open)} – ${shortTime(online.close)}`;
  return (
    <section
      id="dat-online"
      aria-labelledby="lien-he-dat-mon"
      className="bg-brand-ink py-20 text-white md:py-28"
    >
      <div className="site-wrap grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-6">
          <p className="label-caps text-white/90">Liên hệ · Đặt món</p>
          <h2
            id="lien-he-dat-mon"
            className="mt-3 text-3xl leading-tight font-extrabold tracking-tight md:text-[2.75rem]"
          >
            Gọi, nhắn Zalo hoặc đặt online
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white">
            Sáng ghé quán lấy ly mang đi. Từ {onlineHours}, đặt online và nhận
            tận nơi.
          </p>
        </div>
        <div className="grid gap-6 md:col-span-6">
          <div>
            <p className="label-caps mb-4 text-white/90">
              Đặt online {onlineHours}
            </p>
            {platforms.length ? (
              <ul
                className={`grid gap-3 ${platforms.length > 1 ? 'sm:grid-cols-2' : ''}`}
              >
                {platforms.map((platform) => (
                  <li key={platform.id}>
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={CARD}
                      data-order={platform.id}
                    >
                      <ShoppingBag
                        aria-hidden="true"
                        className="size-6 shrink-0"
                      />
                      <span className="flex-1 text-lg font-bold">
                        Đặt trên {platform.label}
                      </span>
                      <ExternalLink
                        aria-hidden="true"
                        className="size-5 opacity-70"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="border border-white/25 p-5 text-base leading-relaxed text-white"
                data-order-fallback
              >
                Gian hàng ShopeeFood và GrabFood sắp mở. Trong lúc chờ, đặt qua
                điện thoại hoặc Zalo, quán giao gần.
              </p>
            )}
          </div>
          <div>
            <p className="label-caps mb-4 text-white/90">Liên hệ</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li>
                <a href={telHref(site.phone)} className={CARD}>
                  <Phone aria-hidden="true" className="size-6 shrink-0" />
                  <span>
                    <span className="block text-sm text-white/90">
                      Gọi đặt món
                    </span>
                    <span className="block text-xl font-extrabold tabular-nums">
                      {formatPhone(site.phone)}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={zaloHref(site.zalo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CARD}
                >
                  <MessageCircle
                    aria-hidden="true"
                    className="size-6 shrink-0"
                  />
                  <span>
                    <span className="block text-sm text-white/90">
                      Nhắn tin
                    </span>
                    <span className="block text-xl font-extrabold">Zalo</span>
                  </span>
                </a>
              </li>
              {site.social.facebook ? (
                <li className="sm:col-span-2">
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CARD}
                  >
                    <FacebookIcon className="size-6 shrink-0" />
                    <span className="flex-1 text-lg font-bold">
                      Facebook Anh Tú Coffee
                    </span>
                    <ExternalLink
                      aria-hidden="true"
                      className="size-5 opacity-70"
                    />
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
