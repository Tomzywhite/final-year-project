// ─── Date Formatting ─────────────────────────────────────────────────────────

/**
 * Format an ISO date string to a readable format.
 * e.g. "2024-03-15T10:30:00Z" → "15 Mar 2024, 10:30"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format an ISO date string to date only.
 * e.g. "2024-03-15T10:30:00Z" → "15 Mar 2024"
 */
export function formatDateOnly(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Class Merging ────────────────────────────────────────────────────────────

/**
 * Simple utility to join class names, filtering out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
