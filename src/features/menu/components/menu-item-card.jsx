import { formatPrice } from '@/shared/api/format';
import { menuImage } from '@/shared/api/media';
import { ResponsiveImage } from '@/shared/components/responsive-image';

/**
 * One drink: photo (or a frame naming the drink), name, price, description,
 * "Bán chạy" and "Tạm hết" labels.
 * @param {{ item: import('@/shared/types/menu').MenuItem, layout?: 'card' | 'row', priority?: boolean }} props
 */
export function MenuItemCard({ item, layout = 'card', priority = false }) {
  const photo = menuImage(item.image);
  const row = layout === 'row';
  const picture = photo ? (
    <ResponsiveImage
      item={photo}
      fill
      fit="contain"
      imgClassName="object-bottom"
      priority={priority}
      sizes={row ? '96px' : '(min-width: 1024px) 24vw, 48vw'}
      alt={photo.alt}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-surface-alt p-3 text-center">
      <span className="text-[0.6875rem] leading-snug font-bold tracking-[0.18em] text-brand-ink/80 uppercase">
        {item.name}
      </span>
    </div>
  );
  return (
    <article
      className={`group relative ${row ? 'flex gap-4 py-5 md:gap-5' : 'flex flex-col'} ${item.available ? '' : 'opacity-55'}`}
      aria-label={`${item.name}, ${formatPrice(item.price)}${item.available ? '' : ', tạm hết'}`}
    >
      <div
        className={`zoom-frame relative shrink-0 ${row ? 'size-24 md:size-28' : 'aspect-square w-full'}`}
      >
        {picture}
        {item.bestseller ? (
          <span className="absolute top-2 left-2 rounded-[2px] bg-brand px-2 py-1 text-[0.6875rem] font-bold tracking-[0.12em] text-white uppercase">
            Bán chạy
          </span>
        ) : null}
      </div>
      <div className={`flex min-w-0 flex-1 flex-col ${row ? '' : 'pt-4'}`}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h3 className="text-lg leading-snug font-bold">{item.name}</h3>
          <p className="shrink-0 text-lg font-extrabold text-brand tabular-nums">
            {formatPrice(item.price)}
          </p>
        </div>
        {item.available ? null : (
          <p className="mt-2 inline-flex w-fit rounded-[2px] bg-brand-ink px-2 py-1 text-xs font-bold tracking-[0.12em] text-white uppercase">
            Tạm hết
          </p>
        )}
      </div>
    </article>
  );
}
