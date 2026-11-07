/** @param {string} path */
export function normalizePath(path) {
  const clean = (path || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

/**
 * Whether a nav link is the current page ("/menu/" matches "/menu" and "/menu/x").
 * @param {string} pathname
 * @param {string} href
 */
export function isCurrentPath(pathname, href) {
  const here = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === '/') return here === '/';
  return here === target || here.startsWith(`${target}/`);
}
