'use client';

import { useSyncExternalStore } from 'react';
import { AUTH_UPDATED_EVENT } from '@/utils/authEvents';

export interface UserSessionData {
  isLoggedIn: boolean;
  userName: string;
  userEmail?: string;
}

function getClientCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

const getUserNameSnapshot = () => getClientCookie('userName');
const getUserEmailSnapshot = () => getClientCookie('userEmail');
const getServerSnapshot = () => '';

function subscribeToAuth(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(AUTH_UPDATED_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(AUTH_UPDATED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

/**
 * Lightweight, reactive user session hook.
 * Reads client-accessible auth cookies via useSyncExternalStore with real event & storage subscriptions.
 * Avoids cascading re-renders, enables instant 0ms auth reactivity, and keeps RootLayout 100% static.
 */
export function useUserSession(initialUser?: UserSessionData): UserSessionData {
  const userName = useSyncExternalStore(subscribeToAuth, getUserNameSnapshot, getServerSnapshot);
  const userEmail = useSyncExternalStore(subscribeToAuth, getUserEmailSnapshot, getServerSnapshot);

  if (initialUser && initialUser.isLoggedIn) {
    return initialUser;
  }

  return {
    isLoggedIn: Boolean(userName),
    userName,
    userEmail: userEmail || undefined,
  };
}
