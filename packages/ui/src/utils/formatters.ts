/** Format ISO date string to locale display string. */
export function formatDate(iso: string, locale = 'en-ET'): string {
  return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Format a number with thousands separator. */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

/** Capitalise first letter of each word. */
export function titleCase(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** Truncate a string to maxLen characters. */
export function truncate(str: string, maxLen = 60): string {
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}
