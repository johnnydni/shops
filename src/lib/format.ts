/** Format an EUR amount as "€X,YY" (German thousands/decimal). */
export function eur(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Same value, but split into ['€', '189'] for the design's italic+small-cur layout. */
export function eurParts(amount: number): { cur: string; value: string } {
  const fmt = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return { cur: '€', value: fmt.format(amount) };
}

/** Slugify a string for URL use. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
