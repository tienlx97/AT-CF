'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isCurrentPath } from '@/shared/api/routes';
import { NAV_LINKS } from '@/shared/config/site';

/**
 * @param {{ className?: string, linkClassName?: string, onNavigate?: () => void }} props
 */
export function NavLinks({ className = '', linkClassName = '', onNavigate }) {
  const pathname = usePathname() ?? '/';
  return (
    <ul className={className}>
      {NAV_LINKS.map((link) => {
        const current = isCurrentPath(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={current ? 'page' : undefined}
              onClick={onNavigate}
              className={`nav-link ${linkClassName}`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
