'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import { getCartCountAction } from '@/actions/cart';

interface CartActionsContextType {
  setCartCount: (count: number) => void;
  resetCart: () => void;
  refreshCartCount: () => Promise<void>;
}

// Split contexts: CartCountContext (for reading the count) and CartActionsContext (for mutating)
// This guarantees components that only dispatch actions (e.g. 30 ProductCards) never re-render when count changes
const CartCountContext = createContext<number>(0);
const CartActionsContext = createContext<CartActionsContextType>({
  setCartCount: () => {},
  resetCart: () => {},
  refreshCartCount: async () => {},
});

/**
 * Unified In-Memory Cart Provider.
 *
 * Senior Architecture Standards:
 * 1. Single Source of Truth: In-memory React state for UI presentation + Cloud DB on server.
 * 2. Zero Cart Cookies: No client cookie synchronization issues or bloated HTTP headers.
 * 3. Race-Condition Proof: Uses an active request sequence counter so in-flight fetches cannot overwrite logout resets.
 * 4. Network Optimized: Runs on initial mount and only re-fetches when arriving from auth pages (/login, /register).
 * 5. Preserves Static SSG: Leaves RootLayout as pure static HTML.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState<number>(0);
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  // In-flight race condition sequence guard (prevents stale responses from overwriting resetCart)
  const activeRequestIdRef = useRef<number>(0);

  const handleSetCartCount = useCallback((count: number) => {
    setCartCount(Math.max(0, count));
  }, []);

  const resetCart = useCallback(() => {
    // Invalidate any in-flight refresh requests immediately
    activeRequestIdRef.current++;
    setCartCount(0);
  }, []);

  const refreshCartCount = useCallback(async () => {
    const requestId = ++activeRequestIdRef.current;
    try {
      const count = await getCartCountAction();
      // Only apply if no newer request or reset occurred while this was in flight
      if (requestId === activeRequestIdRef.current) {
        setCartCount(Math.max(0, count));
      }
    } catch {
      if (requestId === activeRequestIdRef.current) {
        setCartCount(0);
      }
    }
  }, []);

  useEffect(() => {
    // Initial cold load: query authoritative database once on boot
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      refreshCartCount();
      return;
    }

    // Route transitions: only re-fetch if arriving from an auth transition (login or register)
    const previousPath = prevPathRef.current;
    prevPathRef.current = pathname;

    if (previousPath === '/login' || previousPath === '/register') {
      refreshCartCount();
    }
  }, [pathname, refreshCartCount]);

  const actionsValue = useMemo(
    () => ({
      setCartCount: handleSetCartCount,
      resetCart,
      refreshCartCount,
    }),
    [handleSetCartCount, resetCart, refreshCartCount]
  );

  return (
    <CartActionsContext.Provider value={actionsValue}>
      <CartCountContext.Provider value={cartCount}>
        {children}
      </CartCountContext.Provider>
    </CartActionsContext.Provider>
  );
}

/**
 * Hook for components that display the cart badge count.
 * Only components calling this hook will re-render when the count changes.
 */
export function useCartCount(): number {
  return useContext(CartCountContext);
}

/**
 * Hook for components that trigger cart mutations (Add to Cart, Delete, Sign Out).
 * References are memoized and NEVER cause the calling component to re-render when count changes.
 */
export function useCartActions(): CartActionsContextType {
  return useContext(CartActionsContext);
}

/**
 * Combined hook for convenience.
 */
export function useCart() {
  const cartCount = useCartCount();
  const actions = useCartActions();
  return { cartCount, ...actions };
}
