/**
 * Event name for client-side authentication and user session updates.
 * Dispatched whenever a user logs in, logs out, or switches accounts,
 * allowing UI elements (such as the Navbar UserDropdown and MobileNavDrawer)
 * to reactively update in 0ms without requiring full page reloads or SSR layout de-opts.
 */
export const AUTH_UPDATED_EVENT = 'trendify:auth-updated';

export interface AuthUpdateDetail {
  userName?: string;
  userEmail?: string;
  isLoggedIn?: boolean;
}

/**
 * Emits an event to notify client listeners that the authentication state has changed.
 */
export function emitAuthUpdate(detail?: AuthUpdateDetail): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<AuthUpdateDetail | undefined>(AUTH_UPDATED_EVENT, { detail })
  );
}
