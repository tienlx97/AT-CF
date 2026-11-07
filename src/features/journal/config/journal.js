import data from '@/data/journal.json' with { type: 'json' };

/** Owner-supplied stories, newest first. Media are supplied SVG illustrations. */
export const journalEntries = [...data].sort((a, b) =>
  b.date.localeCompare(a.date),
);

/** @param {string} date */
export function journalDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
