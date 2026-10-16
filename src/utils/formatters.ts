const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric amount to Indian Rupee (INR) currency format.
 * Example: 12999 -> "₹12,999"
 */
export const formatINR = (amount: number): string => inrFormatter.format(amount);
