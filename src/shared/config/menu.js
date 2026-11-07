import menuData from '../../data/menu.json' with { type: 'json' };

/**
 * Check the owner-edited menu once at build time; a mistake fails `pnpm build`
 * with a message in Vietnamese naming the item.
 * @param {any} data
 * @returns {import('../types/menu.js').Menu}
 */
export function validateMenu(data) {
  const problems = [];
  if (!Array.isArray(data?.categories)) problems.push('thiếu "categories"');
  const optionIds = new Set(
    (data?.options ?? []).map((/** @type {any} */ o) => o.id),
  );
  const ids = new Set();
  for (const category of data?.categories ?? []) {
    if (!category.id || !category.name)
      problems.push(
        `nhóm thiếu "id" hoặc "name": ${JSON.stringify(category.name ?? category.id)}`,
      );
    for (const optionId of category.optionIds ?? []) {
      if (!optionIds.has(optionId))
        problems.push(
          `nhóm "${category.name}" dùng tùy chọn không có: ${optionId}`,
        );
    }
    for (const item of category.items ?? []) {
      const where = `món "${item.name ?? item.id}"`;
      if (!item.id) problems.push(`${where} thiếu "id"`);
      if (ids.has(item.id))
        problems.push(`${where}: "id" bị trùng (${item.id})`);
      ids.add(item.id);
      if (!item.name) problems.push(`${where} thiếu "name"`);
      if (!Number.isInteger(item.price) || item.price < 0)
        problems.push(`${where}: "price" phải là số nguyên VNĐ, ví dụ 20000`);
    }
  }
  if (problems.length)
    throw new Error(`src/data/menu.json có lỗi:\n- ${problems.join('\n- ')}`);
  return {
    ...data,
    categories: data.categories.map((/** @type {any} */ category) => ({
      optionIds: [],
      description: '',
      ...category,
      items: (category.items ?? []).map((/** @type {any} */ item) => ({
        description: '',
        image: '',
        bestseller: false,
        featured: false,
        available: true,
        ...item,
      })),
    })),
  };
}

export const menu = validateMenu(menuData);
