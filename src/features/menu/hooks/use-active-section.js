'use client';

import { useEffect, useState } from 'react';

/**
 * Id of the section currently under the sticky bars (scroll-spy for the tabs).
 * @param {string[]} ids
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');
  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null);
    if (sections.length === 0) return undefined;
    const update = () => {
      const line = 160;
      let current = sections[0];
      for (const section of sections)
        if (section.getBoundingClientRect().top <= line) current = section;
      setActive(current.id);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [key]);
  return active;
}
