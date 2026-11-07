import { site } from '@/shared/config/site';

/**
 * The shop's leaf mark (file unchanged from assets/logo) with the two-line name.
 * @param {{ tone?: 'brand' | 'white', size?: 'md' | 'lg' | 'nav', className?: string }} props
 */
export function Logo({ tone = 'brand', size = 'md', className = '' }) {
  const src =
    tone === 'white' ? '/brand/leaf-mark-white.svg' : '/brand/leaf-mark.svg';
  const mark =
    size === 'nav'
      ? 'size-10 md:size-12'
      : size === 'lg'
        ? 'size-14'
        : 'size-10';
  const main = size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo, no optimisation needed */}
      <img
        src={src}
        alt=""
        width={40}
        height={40}
        className={`${mark} shrink-0`}
      />
      <span className="flex flex-col leading-none">
        <span className={`${main} font-extrabold tracking-tight`}>
          {site.brandMain}
        </span>
        <span className="mt-1 text-[0.625rem] font-bold tracking-[0.42em]">
          {site.brandSub}
        </span>
      </span>
    </span>
  );
}
