import { headerCta } from '@/shared/api/order-links';
import { site } from '@/shared/config/site';

/** One external purchase action, using the official logo's original icon. */
export function ShopeeFoodFloat() {
  const order = headerCta(site.order);
  if (!order) return null;
  return (
    <a
      href={order.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Đặt qua ShopeeFood (mở tab mới)"
      className="shopee-float"
    >
      <span className="shopee-float__ring" aria-hidden="true" />
      <span
        className="shopee-float__ring shopee-float__ring--delayed"
        aria-hidden="true"
      />
      <span className="shopee-float__icon" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- original static ShopeeFood artwork */}
        <img
          src="/brand/shopeefood-wordmark.png"
          width={220}
          height={43}
          alt=""
        />
      </span>
      <span className="shopee-float__label" aria-hidden="true">
        Đặt qua ShopeeFood
      </span>
    </a>
  );
}
