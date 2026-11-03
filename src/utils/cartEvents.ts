/**
 * Event name for client-side cart count updates.
 * Dispatched whenever an item is added, updated, or removed,
 * allowing UI elements (such as CartBadge) to sync in 0ms
 * without triggering full Next.js root layout revalidation.
 */
export const CART_UPDATED_EVENT = 'trendify:cart-updated';

/**
 * Emits an in-app event notifying listeners (e.g. CartBadge) of the new cart count.
 * Note: Persistent cookie updates are handled directly by Server Actions.
 */
export function emitCartUpdate(count: number = 0): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, { detail: { count: Math.max(0, count) } })
  );
}
