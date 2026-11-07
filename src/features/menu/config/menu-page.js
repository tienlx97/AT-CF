/** Id of a category's section on /menu ("#nhom-ca-phe"). @param {string} categoryId */
export function categoryAnchor(categoryId) {
  return `nhom-${categoryId}`;
}

/** "07/11/2026" from "2026-11-07". @param {string} iso */
export function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}
