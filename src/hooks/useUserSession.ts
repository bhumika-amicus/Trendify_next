'use client';

import { useSyncExternalStore } from 'react';

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
const noopSubscribe = () => () => {};

/**
 * Lightweight, non-blocking user session hook.
 * Reads client-accessible auth cookies via useSyncExternalStore.
 * Avoids cascading re-renders and keeps RootLayout 100% static.
 */
export function useUserSession(initialUser?: UserSessionData): UserSessionData {
  const userName = useSyncExternalStore(noopSubscribe, getUserNameSnapshot, getServerSnapshot);
  const userEmail = useSyncExternalStore(noopSubscribe, getUserEmailSnapshot, getServerSnapshot);

  if (initialUser && initialUser.isLoggedIn) {
    return initialUser;
  }

  return {
    isLoggedIn: Boolean(userName),
    userName,
    userEmail: userEmail || undefined,
  };
}
