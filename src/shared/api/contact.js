/**
 * Google Maps embed for the shop (no API key needed), loaded only on demand.
 * @param {{ lat: number, lng: number }} geo
 * @param {string} name
 */
export function mapEmbedUrl(geo, name) {
  const q = encodeURIComponent(`${name} ${geo.lat},${geo.lng}`);
  return `https://maps.google.com/maps?q=${q}&ll=${geo.lat},${geo.lng}&z=17&hl=vi&output=embed`;
}

/**
 * Directions from the visitor's position to the shop (opens the Maps app on phones).
 * @param {{ lat: number, lng: number }} geo
 */
export function directionsUrl(geo) {
  return `https://www.google.com/maps/dir/?api=1&destination=${geo.lat},${geo.lng}`;
}

/**
 * Hours as rows for display, in the order of the day.
 * @param {import('../types/site.js').Hours} hours
 */
export function hoursRows(hours) {
  return [
    {
      id: 'store',
      from: hours.store.open,
      to: hours.store.close,
      label: hours.store.label,
    },
    {
      id: 'online',
      from: hours.online.open,
      to: hours.online.close,
      label: hours.online.label,
    },
  ];
}
