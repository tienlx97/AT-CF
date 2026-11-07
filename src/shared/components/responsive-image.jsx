import { fallbackSrc, srcSet } from '@/shared/api/media';

/**
 * <picture> with AVIF + WebP srcsets, real width/height (no layout shift),
 * a blur placeholder behind it, lazy unless `priority`. Only the page's LCP
 * candidate should also pass `highPriority`, so it does not compete with the
 * other eager images and the critical scripts on a slow connection.
 * @param {{
 *   item: import('@/shared/types/media').MediaItem, sizes: string, priority?: boolean,
 *   highPriority?: boolean, className?: string, imgClassName?: string, alt?: string, fill?: boolean,
 *   fit?: 'cover' | 'contain'
 * }} props
 */
export function ResponsiveImage({
  item,
  sizes,
  priority = false,
  highPriority = priority,
  className = '',
  imgClassName = '',
  alt,
  fill = false,
  fit = 'cover',
}) {
  const style =
    item.blur && fit === 'cover'
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
      <img
        src={fallbackSrc(item)}
        alt={alt ?? item.alt}
        width={item.width}
        height={item.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={highPriority ? 'high' : 'auto'}
        className={`${fill ? `h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}` : 'h-auto w-full'} ${imgClassName}`}
      />
    </picture>
  );
}
