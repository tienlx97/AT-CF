import { Button } from '@/shared/components/button';
import { MediaPlaceholder } from '@/shared/components/media-placeholder';
import { StatusBadge } from '@/shared/components/status-badge';
import { site } from '@/shared/config/site';

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[100svh] items-end bg-brand-ink pt-24 pb-16 text-white">
        <div className="site-wrap">
          <StatusBadge />
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
            Cà phê pha máy mang đi ở {site.address.district}
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium text-white/90">
            {site.tagline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/menu/" variant="light">
              Xem menu
            </Button>
            <Button href={site.mapUrl} variant="outlineLight">
              Chỉ đường
            </Button>
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="site-wrap grid gap-6 md:grid-cols-2">
          <MediaPlaceholder label="Ảnh quầy pha máy" />
          <MediaPlaceholder label="Ảnh mặt tiền quán" />
        </div>
      </section>
    </>
  );
}
