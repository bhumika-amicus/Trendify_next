import { cookies } from 'next/headers';

export interface UserSession {
  token: string;
}

/**
 * Clean, secure session reader.
 * Returns the authenticated user session from the secure httpOnly 'session' cookie,
 * or null if unauthenticated.
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  return { token };
}
