'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import { getAuthSessionAction } from '@/actions/auth';

interface AuthContextValue {
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Lightweight, secure client-side authentication provider.
 * Maintains login status in memory, eliminating plaintext cookies.
 * Synchronizes with the secure httpOnly session cookie on cold boot and auth route transitions.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  const setLoggedIn = useCallback((value: boolean) => {
    setIsLoggedIn(value);
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const session = await getAuthSessionAction();
      setIsLoggedIn(session.isLoggedIn);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  // Cold boot & auth route transition listener
  useEffect(() => {
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      refreshAuth();
      return;
    }

    const previousPath = prevPathRef.current;
    prevPathRef.current = pathname;

    if (previousPath === '/login' || previousPath === '/register') {
      refreshAuth();
    }
  }, [pathname, refreshAuth]);

  const value = useMemo(
    () => ({ isLoggedIn, setLoggedIn, refreshAuth }),
    [isLoggedIn, setLoggedIn, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isLoggedIn: false,
      setLoggedIn: () => {},
      refreshAuth: async () => {},
    };
  }
  return context;
}
