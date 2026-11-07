'use client';

import { useActiveSection } from '../hooks/use-active-section';

/**
 * Sticky category tabs; each is a link to its section, the current one marked.
 * @param {{ tabs: { id: string, label: string }[] }} props
 */
export function CategoryTabs({ tabs }) {
  const active = useActiveSection(tabs.map((tab) => tab.id));
  return (
    <nav
      aria-label="Nhóm món"
      className="sticky top-16 z-30 border-b border-brand-ink/10 bg-surface/95 backdrop-blur md:top-[4.5rem]"
    >
      <ul className="site-wrap flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
        {tabs.map((tab) => {
          const current = tab.id === active;
          return (
            <li key={tab.id} className="shrink-0">
              <a
                href={`#${tab.id}`}
                aria-current={current ? 'true' : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-5 text-[0.9375rem] font-bold transition-colors duration-150 ${
                  current
                    ? 'bg-brand text-white'
                    : 'bg-surface-alt text-brand-ink hover:bg-brand-ink/10'
                }`}
              >
                {tab.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
