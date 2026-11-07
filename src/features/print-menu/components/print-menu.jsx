import { formatPrice, shortTime } from '@/shared/api/format';
import { categoryOptions, visibleCategories } from '@/shared/api/menu';
import { headerCta } from '@/shared/api/order-links';
import { site } from '@/shared/config/site';

import { qrSvg } from '../api/qr';
import { PrintToolbar } from './print-button';

/**
 * One A4 portrait sheet built from menu.json at build time: logo, name,
 * categories with prices large enough to read from 1–2 m, hours and
 * QR codes for the website menu and the sole purchase channel, ShopeeFood.
 */
export async function PrintMenu() {
  const categories = visibleCategories();
  const order = headerCta(site.order);
  const [webQr, orderQr] = await Promise.all([
    qrSvg(`${site.siteUrl}/menu/`),
    order ? qrSvg(order.href) : Promise.resolve(null),
  ]);
  const { store, online } = site.hours;
  const items = categories.reduce((sum, c) => sum + c.items.length, 0);
  // Long menus get smaller rows so the sheet stays one page.
  const dense = items > 16;

  return (
    <>
      <PrintToolbar />
      <div className="print-stage bg-surface-alt py-8 print:bg-transparent print:p-0">
        <article
          className="a4-sheet mx-auto flex flex-col bg-surface text-brand-ink shadow-xl print:shadow-none"
          aria-label="Menu in A4"
        >
          <header className="flex items-center justify-between gap-6 bg-brand px-[14mm] py-[9mm] text-white">
            <div className="flex items-center gap-[5mm]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static logo for print */}
              <img
                src="/brand/leaf-mark-white.svg"
                alt=""
                width={80}
                height={80}
                className="size-[20mm]"
              />
              <h1 className="leading-none">
                <span className="block text-[15mm] font-extrabold tracking-tight">
                  {site.brandMain}
                </span>
                <span className="mt-[2mm] block text-[4.4mm] font-bold tracking-[0.5em]">
                  {site.brandSub}
                </span>
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[4mm] font-bold tracking-[0.25em] uppercase">
                Cà phê pha máy · Mang đi
              </p>
              <p className="mt-[2mm] text-[6mm] font-extrabold">ShopeeFood</p>
            </div>
          </header>

          <div
            className={`grid flex-1 grid-cols-2 gap-x-[10mm] px-[14mm] ${dense ? 'py-[7mm]' : 'py-[10mm]'}`}
          >
            {categories.map((category) => {
              const options = categoryOptions(category);
              return (
                <section key={category.id} className="break-inside-avoid">
                  <h2 className="border-b-[0.8mm] border-brand pb-[2mm] text-[8.5mm] font-extrabold tracking-tight text-brand">
                    {category.name}
                  </h2>
                  <ul>
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className={`flex items-baseline justify-between gap-[3mm] border-b border-brand-ink/15 ${dense ? 'py-[2mm] text-[5.2mm]' : 'py-[3mm] text-[6.2mm]'} ${item.available ? '' : 'opacity-45'}`}
                      >
                        <span className="font-bold">
                          {item.name}
                          {item.bestseller ? (
                            <span className="ml-[2mm] inline-block rounded-[0.6mm] bg-brand px-[1.5mm] py-[0.6mm] align-middle text-[3mm] font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase">
                              Bán chạy
                            </span>
                          ) : null}
                          {item.available ? null : (
                            <span className="ml-[2mm] text-[3.2mm] whitespace-nowrap uppercase">
                              Tạm hết
                            </span>
                          )}
                        </span>
                        <span className="font-extrabold tabular-nums">
                          {formatPrice(item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {options.length ? (
                    <p className="mt-[3mm] text-[3.8mm] leading-snug text-brand-ink/80">
                      {options
                        .map(
                          (o) =>
                            `${o.label}: ${o.values.join(', ').toLowerCase()}`,
                        )
                        .join(' · ')}
                    </p>
                  ) : null}
                </section>
              );
            })}
          </div>

          <footer className="grid grid-cols-[1fr_auto_auto] items-center gap-[8mm] border-t-[0.8mm] border-brand px-[14mm] py-[8mm]">
            <div className="text-[4.4mm] leading-relaxed">
              <p className="font-extrabold">
                {shortTime(store.open)} – {shortTime(store.close)} bán tại quán
                · {shortTime(online.open)} – {shortTime(online.close)} đặt
                online
              </p>
              <p>
                {site.address.street}, {site.address.district}
              </p>
            </div>
            <figure className="text-center">
              <div
                className="size-[24mm]"
                dangerouslySetInnerHTML={{ __html: webQr }}
              />
              <figcaption className="mt-[1.5mm] text-[3.4mm] font-bold">
                Xem menu online
              </figcaption>
            </figure>
            {orderQr ? (
              <figure className="text-center">
                <div
                  className="size-[24mm]"
                  dangerouslySetInnerHTML={{ __html: orderQr }}
                />
                <figcaption className="mt-[1.5mm] text-[3.4mm] font-bold">
                  Đặt qua ShopeeFood
                </figcaption>
              </figure>
            ) : null}
          </footer>
        </article>
      </div>
    </>
  );
}
