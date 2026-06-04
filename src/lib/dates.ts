/**
 * Tiny date helpers used by the events page. Native Intl, no library.
 * Always German formatting; UTC-safe so SSR/static prerender wouldn't
 * shift days across timezones.
 */

const MONTH_SHORT = new Intl.DateTimeFormat('de-DE', {
  month: 'short',
  timeZone: 'UTC',
});
const FULL = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Parse a YYYY-MM-DD as a UTC date (no time-zone drift). */
export function parseISODate(iso: string): Date {
  // Build via Date.UTC so a "2026-07-12" doesn't become 2026-07-11 in negative TZs.
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

/** "12" — day of month as a 1- or 2-digit number. */
export function dayNum(iso: string): number {
  return parseISODate(iso).getUTCDate();
}

/** "Jul" — short German month, no trailing dot. */
export function monthShort(iso: string): string {
  return MONTH_SHORT.format(parseISODate(iso)).replace('.', '');
}

/** "Sa, 12. Juli 2026" — long full date. */
export function fullDate(iso: string): string {
  return FULL.format(parseISODate(iso));
}

/** Formats the day range "12 – 13" if endDate is set & same month, else "12". */
export function dayRange(iso: string, endIso?: string): string {
  if (!endIso) return String(dayNum(iso));
  const a = parseISODate(iso);
  const b = parseISODate(endIso);
  if (a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear()) {
    return `${a.getUTCDate()} – ${b.getUTCDate()}`;
  }
  // Different months — fall back to the start day only; full date is shown elsewhere.
  return String(a.getUTCDate());
}
