'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DOTNET_API_BASE_URL } from '@/config';

export interface AuthActionState {
  error?: string;
  success?: boolean;
}

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Server Action for User Login.
 * Handles credential validation, calls the Azure upstream API,
 * establishes a session via httpOnly cookies, and redirects the user
 * to the originally requested page (callbackUrl) or the homepage.
 */
export async function loginAction(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormString(formData, 'email');
  const password = getFormString(formData, 'password');
  const callbackUrl = getFormString(formData, 'callbackUrl') || '/';

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  let redirectTo: string | null = null;

  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/auth/login`;

    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        `[AUTH] Login failed with upstream status [${response.status}]:`,
        data?.message || data?.error || 'No error body'
      );

      if (response.status >= 500) {
        return {
          error:
            'Our authentication service is temporarily unavailable. Please try again later.',
        };
      }

      if (response.status === 401 || response.status === 403) {
        return { error: 'Invalid email or password.' };
      }

      return {
        error:
          data?.error ||
          data?.message ||
          'Authentication failed. Please check credentials.',
      };
    }

    if (!data || !data.token) {
      console.error('[AUTH] Login response missing token:', data);
      return { error: 'Invalid response from authentication server.' };
    }

    // Set secure session cookies
    const cookieStore = await cookies();

    // 1. Session token (httpOnly: short-lived access token, e.g. 2 hours)
    cookieStore.set('session', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
    });

    // 2. Refresh token (httpOnly: long-lived token, e.g. 7 days)
    if (data.refreshToken) {
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // 3. User display name (readable by client components like NavBar)
    cookieStore.set('userName', data.name || email.split('@')[0], {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    if (data.customerId) {
      cookieStore.set('customerId', String(data.customerId), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (data.role) {
      cookieStore.set('role', data.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    redirectTo = callbackUrl;
  } catch (error) {
    console.error('[AUTH] Network error in loginAction:', error);
    return {
      error: 'Authentication service is unreachable. Please check your connection and try again.',
    };
  }

  // Next.js redirect MUST be called outside the try/catch block
  if (redirectTo) {
    redirect(redirectTo);
  }

  return { success: true };
}

/**
 * Server Action for User Registration.
 * Validates inputs, calls Azure /api/auth/register with { name, email, password },
 * and on success redirects to /login?registered=true.
 */
export async function registerAction(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const name = getFormString(formData, 'name');
  const email = getFormString(formData, 'email');
  const password = getFormString(formData, 'password');
  const confirmPassword = getFormString(formData, 'confirmPassword');

  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  let redirectTo: string | null = null;

  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/auth/register`;

    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        `[AUTH] Registration failed with upstream status [${response.status}]:`,
        data?.message || data?.error || 'No error body'
      );

      if (response.status >= 500) {
        return {
          error:
            'Our registration service is temporarily unavailable. Please try again later.',
        };
      }

      if (response.status === 400) {
        return {
          error:
            data?.message ||
            data?.error ||
            'Registration failed. Email might already be registered.',
        };
      }

      return {
        error:
          data?.message ||
          data?.error ||
          'Registration failed. Please check your details and try again.',
      };
    }

    // Success response from Azure: { customerId: 20, message: "Registration successful." }
    redirectTo = '/login?registered=true';
  } catch (error) {
    console.error('[AUTH] Network error in registerAction:', error);
    return {
      error: 'Registration service is unreachable. Please check your connection and try again.',
    };
  }

  // Next.js redirect outside try/catch
  if (redirectTo) {
    redirect(redirectTo);
  }

  return { success: true };
}

/**
 * Server Action for User Logout.
 * Clears the session cookies and redirects to the login page.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userName');
  cookieStore.delete('customerId');
  cookieStore.delete('role');
  redirect('/login');
}
