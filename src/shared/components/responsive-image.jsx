import { fallbackSrc, srcSet } from '@/shared/api/media';

/**
 * <picture> with AVIF + WebP srcsets, real width/height (no layout shift),
 * a blur placeholder behind it, lazy unless `priority`.
 * @param {{
 *   item: import('@/shared/types/media').MediaItem, sizes: string, priority?: boolean,
 *   className?: string, imgClassName?: string, alt?: string, fill?: boolean
 * }} props
 */
export function ResponsiveImage({
  item,
  sizes,
  priority = false,
  className = '',
  imgClassName = '',
  alt,
  fill = false,
}) {
  const style = item.blur
    ? {
        backgroundImage: `url(${item.blur})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;
  return (
    <picture
      className={`block ${fill ? 'h-full w-full' : ''} ${className}`}
      style={style}
    >
      <source type="image/avif" srcSet={srcSet(item, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(item, 'webp')} sizes={sizes} />
      { }
      <img
        src={fallbackSrc(item)}
        alt={alt ?? item.alt}
        width={item.width}
        height={item.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={`${fill ? 'h-full w-full object-cover' : 'h-auto w-full'} ${imgClassName}`}
      />
    </picture>
  );
}
