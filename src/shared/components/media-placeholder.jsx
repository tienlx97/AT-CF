import { ImageIcon } from 'lucide-react';

/**
 * Stand-in frame for a photo or video the owner has not supplied yet. It
 * names the shot to take; never filled with stock or generated images.
 * @param {{ label: string, ratio?: string, className?: string, tone?: 'alt' | 'brand' }} props
 */
export function MediaPlaceholder({
  label,
  ratio = '4 / 3',
  className = '',
  tone = 'alt',
}) {
  const skin =
    tone === 'brand'
      ? 'bg-brand-ink text-white/80'
      : 'bg-surface-alt text-brand-ink/70';
  return (
    <div
      role="img"
      aria-label={`Chờ ảnh: ${label.toLowerCase()}`}
      style={{ aspectRatio: ratio }}
      className={`flex w-full flex-col items-center justify-center gap-3 p-6 text-center ${skin} ${className}`}
    >
      <ImageIcon
        aria-hidden="true"
        className="size-7 opacity-60"
        strokeWidth={1.5}
      />
      <span className="label-caps max-w-[22ch] leading-relaxed">{label}</span>
    </div>
  );
}
