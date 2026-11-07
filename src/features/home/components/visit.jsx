import { Clock, MapPin, Navigation } from 'lucide-react';

import { directionsUrl, hoursRows } from '@/shared/api/contact';
import { shortTime } from '@/shared/api/format';
import { Button } from '@/shared/components/button';
import { LazyMap } from '@/shared/components/lazy-map';
import { StatusBadge } from '@/shared/components/status-badge';
import { site } from '@/shared/config/site';

/**
 * Hours, address and the lazy map. `headingLevel` lets /lien-he use it under its own h1.
 * @param {{ headingLevel?: 'h1' | 'h2' }} props
 */
export function Visit({ headingLevel = 'h2' }) {
  const Heading = headingLevel;
  return (
    <section
      aria-labelledby="gio-mo-cua"
      className={`bg-surface-alt ${headingLevel === 'h1' ? 'pt-28 pb-20 md:pt-36 md:pb-28' : 'py-20 md:py-28'}`}
    >
      <div className="site-wrap grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-6">
          <p className="label-caps text-brand">Giờ mở cửa · Địa chỉ</p>
          <Heading
            id="gio-mo-cua"
            className="mt-3 text-3xl leading-tight font-extrabold tracking-tight md:text-[2.75rem]"
          >
            Ghé quán ở {site.address.district}
          </Heading>
          <StatusBadge tone="dark" className="mt-5" />
          <ul className="mt-8 divide-y divide-brand-ink/10 border-y border-brand-ink/10">
            {hoursRows(site.hours).map((row) => (
              <li key={row.id} className="flex items-start gap-4 py-5">
                <Clock
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-brand"
                />
                <div>
                  <p className="text-2xl font-extrabold tabular-nums">
                    {shortTime(row.from)} – {shortTime(row.to)}
                  </p>
                  <p className="mt-1 text-base text-brand-ink">{row.label}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex gap-4 text-lg leading-relaxed">
            <MapPin
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-brand"
            />
            <span>
              {site.address.street}
              <br />
              {site.address.district}, {site.address.city}
            </span>
          </p>
          <div className="mt-8">
            <Button
              href={directionsUrl(site.geo)}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Navigation aria-hidden="true" className="size-5" />
              Chỉ đường đến quán
            </Button>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <LazyMap />
        </div>
      </div>
    </section>
  );
}
