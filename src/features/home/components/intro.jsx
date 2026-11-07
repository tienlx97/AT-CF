import { leadPhoto } from '@/shared/api/media';
import { MediaPlaceholder } from '@/shared/components/media-placeholder';
import { ResponsiveImage } from '@/shared/components/responsive-image';
import { site } from '@/shared/config/site';

const FACTS = [
  { value: '100%', label: 'Cà phê nguyên chất' },
  { value: '5:30', label: 'Mở cửa mỗi sáng' },
  { value: '2025', label: 'Năm mở quán' },
];

/** Short story of the shop beside one large photograph of the bar or shopfront. */
/** The intro's photo; the gallery preview skips it so no photo shows twice. */
export function introPhoto() {
  return leadPhoto('pha-che') ?? leadPhoto('khong-gian');
}

export function Intro() {
  const photo = introPhoto();
  return (
    <section aria-labelledby="gioi-thieu" className="py-20 md:py-28">
      <div className="site-wrap grid items-center gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <p className="label-caps text-brand">Cà phê pha máy · Mang đi</p>
          <h2
            id="gioi-thieu"
            className="mt-3 text-3xl leading-tight font-extrabold tracking-tight md:text-[2.75rem]"
          >
            Quán cà phê mang đi của người {site.address.district}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-ink/80">
            {site.intro}
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-brand-ink/10 pt-6">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="sr-only">{fact.label}</dt>
                <dd className="text-2xl font-extrabold text-brand md:text-3xl">
                  {fact.value}
                </dd>
                <dd className="mt-1 text-sm leading-snug text-brand-ink/75">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {photo ? (
            <div className="zoom-frame aspect-[4/5] md:aspect-[4/3]">
              <ResponsiveImage
                item={photo}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          ) : (
            <MediaPlaceholder
              label="Ảnh lớn quầy pha máy hoặc mặt tiền quán"
              ratio="4 / 3"
            />
          )}
        </div>
      </div>
    </section>
  );
}
