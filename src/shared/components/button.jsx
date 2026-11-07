import Link from 'next/link';

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] px-6 text-base font-bold transition duration-150 ease-out hover:-translate-y-px active:translate-y-px active:scale-[.985] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50';

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-ink focus-visible:outline-brand',
  secondary:
    'border border-brand-ink/30 bg-surface text-brand-ink hover:border-brand-ink hover:bg-surface-alt focus-visible:outline-brand',
  light:
    'bg-white text-brand-ink hover:bg-surface-alt focus-visible:outline-white',
  outlineLight:
    'border border-white/70 text-white hover:bg-white/10 hover:border-white focus-visible:outline-white',
};

/**
 * One button family for the whole site. Renders <a> for external/tel links,
 * next/link for internal paths and <button> otherwise.
 * @param {{
 *   href?: string, variant?: keyof typeof VARIANTS, className?: string,
 *   children: import('react').ReactNode, external?: boolean
 * } & Record<string, unknown>} props
 */
export function Button({
  href,
  variant = 'primary',
  className = '',
  children,
  external = false,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  if (href && (external || /^(https?:|tel:|mailto:)/.test(href))) {
    const target = href.startsWith('http')
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};
    return (
      <a href={href} className={classes} {...target} {...rest}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
