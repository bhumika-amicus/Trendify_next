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

/**
 * Formats an order ID into a standardized, branded reference (e.g., "ORD-2026-014").
 * Dynamically resolves the year from createdAt if available.
 */
export function formatOrderId(orderId: number, createdAt?: string): string {
  const year =
    createdAt && !isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).getFullYear()
      : 2026;
  return `ORD-${year}-${orderId.toString().padStart(3, '0')}`;
}
