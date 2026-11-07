import { menu as defaultMenu } from '../config/menu.js';

/** @typedef {import('../types/menu.js').Menu} Menu */

/** Items marked `featured`, available first, at most `limit`. */
export function featuredItems(limit = 4, data = defaultMenu) {
  return data.categories
    .flatMap((category) =>
      category.items.map((item) => ({ ...item, categoryId: category.id })),
    )
    .filter((item) => item.featured)
    .sort((a, b) => Number(b.available) - Number(a.available))
    .slice(0, limit);
}

/**
 * The options that apply to a category, resolved from their ids.
 * @param {import('../types/menu.js').MenuCategory} category
 * @param {Menu} [data]
 */
export function categoryOptions(category, data = defaultMenu) {
  return category.optionIds
    .map((id) => data.options.find((option) => option.id === id))
    .filter((o) => o !== undefined);
}

/** Lowest and highest price on the menu, e.g. for schema.org priceRange. */
export function priceRange(data = defaultMenu) {
  const prices = data.categories.flatMap((category) =>
    category.items.map((item) => item.price),
  );
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Categories that have at least one item. */
export function visibleCategories(data = defaultMenu) {
  return data.categories.filter((category) => category.items.length > 0);
}
