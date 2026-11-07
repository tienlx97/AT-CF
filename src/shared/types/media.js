/**
 * @typedef {'hero' | 'menu' | 'gallery' | 'reel'} MediaRole
 * @typedef {'pha-che' | 'do-uong' | 'khong-gian' | 'khach-hang' | 'video' | 'hero' | 'menu'} MediaGroup
 * @typedef {'landscape' | 'portrait' | 'square'} Orientation
 * @typedef {{
 *   id: string, type: 'image' | 'video', role: MediaRole, group: MediaGroup,
 *   source: string, hash: string,
 *   src: string, widths: number[], formats: string[],
 *   width: number, height: number, orientation: Orientation, blur: string,
 *   poster?: string, videos?: { src: string, height: number, bytes: number }[], duration?: number,
 *   alt: string, caption: string, featured: boolean
 * }} MediaItem
 * @typedef {{ version: number, updatedAt: string, items: MediaItem[] }} MediaManifest
 */

export {};
