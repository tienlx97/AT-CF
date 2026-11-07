import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Head row of a home section: small tracked label, the h2 on the left line,
 * an optional link on its baseline at the right (taste-skill head row).
 * @param {{ id: string, label: string, title: string, lead?: string, link?: { href: string, label: string }, tone?: 'light' | 'dark' }} props
 */
export function SectionHead({ id, label, title, lead, link, tone = 'dark' }) {
  const muted = tone === 'light' ? 'text-white' : 'text-brand-ink';
  const accent = tone === 'light' ? 'text-white/90' : 'text-brand';
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className={`label-caps ${accent}`}>{label}</p>
        <h2
          id={id}
          className="mt-3 text-3xl leading-tight font-semibold tracking-tight md:text-[2.75rem]"
        >
          {title}
        </h2>
        {lead ? (
          <p className={`mt-3 text-base leading-relaxed md:text-lg ${muted}`}>
            {lead}
          </p>
        ) : null}
      </div>
      {link ? (
        <Link
          href={link.href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-bold"
        >
          <span className="nav-link">{link.label}</span>
          <ArrowRight
            aria-hidden="true"
            className="size-5 transition-transform duration-150 group-hover:translate-x-[3px]"
          />
        </Link>
      ) : null}
    </div>
  );
}
