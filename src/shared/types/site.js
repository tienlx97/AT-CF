/**
 * @typedef {{ open: string, close: string, label: string }} HoursWindow
 * @typedef {{ timeZone: string, store: HoursWindow, online: HoursWindow }} Hours
 * @typedef {{ shopeefood: string, grabfood: string }} OrderLinks
 * @typedef {{
 *   name: string, brandMain: string, brandSub: string, tagline: string, intro: string,
 *   foundedYear: number, siteUrl: string,
 *   address: { street: string, district: string, city: string, country: string },
 *   geo: { lat: number, lng: number }, mapUrl: string, phone: string, zalo: string,
 *   social: { facebook: string, tiktok: string, instagram: string },
 *   order: OrderLinks, hours: Hours
 * }} Site
 * @typedef {'open' | 'online' | 'closed'} OpenState
 * @typedef {{ state: OpenState, label: string, until: string | null, reopensAt: string | null }} OpenStatus
 */

export {};