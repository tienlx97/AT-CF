// Checks every page must pass at every width (openspec/project.md thresholds).
export async function pageBasics(page, check, label) {
  const overflow = await page.eval('document.documentElement.scrollWidth - window.innerWidth');
  check(`${label}: no horizontal scroll`, overflow <= 0, `overflow ${overflow}px`);
  const broken = await page.eval(`[...document.images].filter((img) => img.complete && img.naturalWidth === 0 && img.loading !== 'lazy').map((img) => img.src)`);
  check(`${label}: no broken images`, broken.length === 0, broken.slice(0, 3).join(', '));
  if (page.width < 600) {
    const small = await page.eval(`[...document.querySelectorAll('a[href], button')]
      .filter((el) => { const r = el.getBoundingClientRect(); const st = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && !el.closest('[data-inline-link]') && !el.closest('p, dd, li > span') })
      .filter((el) => { const r = el.getBoundingClientRect(); return r.height < 44 && r.width < 44 })
      .map((el) => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30))`);
    check(`${label}: touch targets >= 44px`, small.length === 0, small.slice(0, 5).join(', '));
  }
  const lang = await page.eval('document.documentElement.lang');
  check(`${label}: lang="vi"`, lang === 'vi');
  const h1 = await page.eval('document.querySelectorAll("h1").length');
  check(`${label}: exactly one h1`, h1 === 1, `found ${h1}`);
}