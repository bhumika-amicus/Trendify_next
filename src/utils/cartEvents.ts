/**
 * Event name for client-side cart updates.
 * Dispatched whenever an item is added, updated, or removed,
 * allowing UI elements (such as the Navbar cart badge) to sync in 0ms
 * without triggering full Next.js root layout revalidation.
 */
export const CART_UPDATED_EVENT = 'trendify:cart-updated';

/**
 * Emits an event to notify client listeners that the cart count has changed.
 * Reads the latest count from the 'trendify_cart_count' cookie if no explicit count is passed.
 */
export function emitCartUpdate(count?: number): void {
  if (typeof window === 'undefined') return;

  let resolvedCount = count;
  if (resolvedCount === undefined) {
    const match = document.cookie.match(/(?:^|;\s*)trendify_cart_count=([^;]*)/);
    resolvedCount = match ? parseInt(decodeURIComponent(match[1]), 10) || 0 : 0;
  } else {
    document.cookie = `trendify_cart_count=${resolvedCount}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }

  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, { detail: { count: resolvedCount } })
  );
}
