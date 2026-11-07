/**
 * @typedef {{ id: string, label: string, values: string[] }} MenuOption
 * @typedef {{
 *   id: string, name: string, price: number, description: string, image: string,
 *   bestseller: boolean, featured: boolean, available: boolean
 * }} MenuItem
 * @typedef {{ id: string, name: string, description?: string, optionIds: string[], items: MenuItem[] }} MenuCategory
 * @typedef {{ currency: string, updatedAt: string, options: MenuOption[], categories: MenuCategory[] }} Menu
 */

export {};
