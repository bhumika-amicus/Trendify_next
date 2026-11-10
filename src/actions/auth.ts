'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { DOTNET_API_BASE_URL } from '@/config';
import { LoginSchema, RegisterSchema } from '@/schemas/auth';

export interface AuthFieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthActionState {
  error?: string;
  fieldErrors?: AuthFieldErrors;
  values?: {
    name?: string;
    email?: string;
  };
  success?: boolean;
  redirectTo?: string;
}

export async function loginAction(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    callbackUrl: formData.get('callbackUrl') || '/',
  };

  const parsed = LoginSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    return {
      fieldErrors: {
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
      values: {
        email: typeof rawData.email === 'string' ? rawData.email : '',
      },
    };
  }

  const { email, password, callbackUrl } = parsed.data;

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

      if (response.status === 401) {
        return { error: 'Invalid email or password.', values: { email } };
      }

      if (response.status === 403) {
        return {
          error:
            data?.message ||
            data?.error ||
            'Access denied by server. Please try again later or contact support if the issue persists.',
          values: { email },
        };
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

    cookieStore.set('session', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2,
    });

    if (data.refreshToken) {
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // Prevent redirect loop to auth pages
    const targetUrl =
      callbackUrl === '/login' || callbackUrl === '/register'
        ? '/'
        : callbackUrl;

    return { success: true, redirectTo: targetUrl };
  } catch (error) {
    console.error('[AUTH] Network error in loginAction:', error);
    return {
      error: 'Authentication service is unreachable. Please check your connection and try again.',
    };
  }
}

export async function registerAction(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = RegisterSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    return {
      fieldErrors: {
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
      },
      values: {
        name: typeof rawData.name === 'string' ? rawData.name : '',
        email: typeof rawData.email === 'string' ? rawData.email : '',
      },
    };
  }

  const { name, email, password } = parsed.data;
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

      if (response.status === 403) {
        return {
          error:
            data?.message ||
            data?.error ||
            'Access denied by server security. Please try again later.',
          values: {
            name,
            email,
          },
        };
      }

      if (response.status === 400) {
        const errorMsg =
          data?.message ||
          data?.error ||
          'Registration failed. Email might already be registered.';
        const isEmailConflict = errorMsg.toLowerCase().includes('email');
        return {
          error: errorMsg,
          fieldErrors: isEmailConflict ? { email: errorMsg } : undefined,
          values: {
            name,
            email,
          },
        };
      }

      return {
        error:
          data?.message ||
          data?.error ||
          'Registration failed. Please check your details and try again.',
      };
    }

    redirectTo = '/login?registered=true';
  } catch (error) {
    console.error('[AUTH] Network error in registerAction:', error);
    return {
      error: 'Registration service is unreachable. Please check your connection and try again.',
    };
  }

  if (redirectTo) {
    redirect(redirectTo);
  }

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userName');
  cookieStore.delete('userEmail');
  cookieStore.delete('customerId');
  cookieStore.delete('role');

  // Purge cached layout states
  revalidatePath('/', 'layout');
  redirect('/login');
}


export async function getAuthSessionAction(): Promise<{ isLoggedIn: boolean }> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  return { isLoggedIn: Boolean(sessionToken) };
}
