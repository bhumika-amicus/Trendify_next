'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { LoginSchema, RegisterSchema } from '@/schemas/auth';
import { serverApiFetch } from '@/services/serverApi';

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

interface AuthUpstreamResponse {
  token?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
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

  const res = await serverApiFetch<AuthUpstreamResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 0) {
      return {
        error: 'Authentication service is unreachable. Please check your connection and try again.',
      };
    }

    const backendMsg = res.data?.message || res.data?.error || res.error;
    console.error(
      `[AUTH] Login failed with upstream status [${res.status}]:`,
      backendMsg || 'No error body'
    );

    if (res.status >= 500) {
      return {
        error: 'Our authentication service is temporarily unavailable. Please try again later.',
      };
    }

    if (res.status === 401) {
      return { error: 'Invalid email or password.', values: { email } };
    }

    if (res.status === 403) {
      return {
        error:
          backendMsg ||
          'Access denied by server. Please try again later or contact support if the issue persists.',
        values: { email },
      };
    }

    return {
      error:
        res.data?.error ||
        res.data?.message ||
        res.error ||
        'Authentication failed. Please check credentials.',
    };
  }

  if (!res.data?.token) {
    console.error('[AUTH] Login response missing token:', res.data);
    return { error: 'Invalid response from authentication server.' };
  }

  // Set secure session cookies
  const cookieStore = await cookies();

  cookieStore.set('session', res.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2,
  });

  if (res.data.refreshToken) {
    cookieStore.set('refreshToken', res.data.refreshToken, {
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

  const res = await serverApiFetch<AuthUpstreamResponse>('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 0) {
      return {
        error: 'Registration service is unreachable. Please check your connection and try again.',
      };
    }

    const backendMsg = res.data?.message || res.data?.error || res.error;
    console.error(
      `[AUTH] Registration failed with upstream status [${res.status}]:`,
      backendMsg || 'No error body'
    );

    if (res.status >= 500) {
      return {
        error: 'Our registration service is temporarily unavailable. Please try again later.',
      };
    }

    if (res.status === 403) {
      return {
        error:
          backendMsg ||
          'Access denied by server security. Please try again later.',
        values: { name, email },
      };
    }

    if (res.status === 400) {
      const errorMsg =
        backendMsg || 'Registration failed. Email might already be registered.';
      const isEmailConflict = errorMsg.toLowerCase().includes('email');
      return {
        error: errorMsg,
        fieldErrors: isEmailConflict ? { email: errorMsg } : undefined,
        values: { name, email },
      };
    }

    return {
      error:
        backendMsg ||
        'Registration failed. Please check your details and try again.',
    };
  }

  redirect('/login?registered=true');
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('refreshToken');

  // Purge cached layout states
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function getAuthSessionAction(): Promise<{ isLoggedIn: boolean }> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  return { isLoggedIn: Boolean(sessionToken) };
}
