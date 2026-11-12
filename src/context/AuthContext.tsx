'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
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
 * Synchronizes with the secure httpOnly session cookie on cold boot.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    let cancelled = false;
    getAuthSessionAction()
      .then((session) => {
        if (!cancelled) {
          setIsLoggedIn(session.isLoggedIn);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoggedIn(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
