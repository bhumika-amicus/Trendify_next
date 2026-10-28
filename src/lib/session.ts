import { cookies } from 'next/headers';

export interface UserSession {
  name: string;
  email: string;
  token: string;
}

/**
 * Clean, lightweight session reader.
 * Returns the authenticated user session from cookies, or null if unauthenticated.
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  return {
    name: cookieStore.get('userName')?.value || 'Customer',
    email: cookieStore.get('userEmail')?.value || '',
    token,
  };
}
