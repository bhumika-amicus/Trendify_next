export type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

/**
 * Clears authentication tokens and notifies components across the app.
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('customerId');
    window.dispatchEvent(new Event('auth:logout'));
  }
}

/**
 * Generic API client for local Next.js Route Handlers.
 * - Auto-detects and adds JSON Content-Type when appropriate.
 * - Injects Bearer token from localStorage for authenticated calls.
 * - Automatically catches 401, rotates token via refreshToken, and retries the request once.
 * - Extracts clean user-facing error messages while keeping internal server errors safe.
 */
export async function apiFetch<T>(
  endpoint: string,
  init: ApiFetchOptions = {},
  isRetry = false
): Promise<T | undefined> {
  const headers = new Headers(init.headers);

  // 1. Generic Header: Auto-set application/json if body exists and is not FormData/URLSearchParams
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !(init.body instanceof URLSearchParams) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  // 2. Attach Bearer token from localStorage for authenticated client requests
  if (init.auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(endpoint, { ...init, headers });

  // 3. 401 Interceptor: Auto-refresh token and retry request once
  if (
    response.status === 401 &&
    init.auth &&
    !isRetry &&
    typeof window !== 'undefined'
  ) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.token) {
            localStorage.setItem('token', refreshData.token);
          }
          if (refreshData.refreshToken) {
            localStorage.setItem('refreshToken', refreshData.refreshToken);
          }
          // Retry the original request with renewed credentials
          return apiFetch<T>(endpoint, init, true);
        }
      } catch (refreshErr) {
        console.warn('Auto-refresh token attempt failed:', refreshErr);
      }
    }

    // Refresh failed or no refreshToken available - clean up session
    logout();
    throw new Error('Your session has expired. Please sign in again.');
  }

  // 4. Handle HTTP Errors with clean error message extraction
  if (!response.ok) {
    let serverMessage: string | null = null;
    try {
      const errorData = await response.json();
      if (errorData) {
        serverMessage = errorData.error || errorData.detail || errorData.message || null;
      }
    } catch {
      // Body was not JSON (e.g. plain text or empty)
    }

    if (response.status === 400) {
      throw new Error(serverMessage || 'Invalid request. Please check your inputs.');
    }

    if (response.status === 401) {
      throw new Error(serverMessage || 'Authentication required. Please sign in.');
    }

    if (response.status === 403) {
      throw new Error(
        serverMessage || 'Access denied. You do not have permission for this action.'
      );
    }

    if (response.status === 404) {
      throw new Error(serverMessage || 'The requested resource was not found.');
    }

    if (response.status >= 500) {
      console.error(`Server Error [${response.status}] at ${endpoint}:`, serverMessage);
      throw new Error(
        'Our servers are experiencing technical difficulties. Please try again shortly.'
      );
    }

    throw new Error(
      serverMessage || 'We are having trouble completing your request. Please try again.'
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}

