const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric amount to Indian Rupee (INR) currency format.
 * Example: 12999 -> "₹12,999"
 */
export const formatINR = (amount: number) => inrFormatter.format(amount);

/**
 * Formats an ISO date string into a clean, localized format (e.g., "Oct 28, 2026").
 * Safe against invalid date strings and undefined inputs.
 */
export function formatDate(isoDate?: string): string {
  if (!isoDate) return 'Recent';
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate || 'Recent';
  }
}
