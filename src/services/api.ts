export type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  init: ApiFetchOptions = {},
  isRetry = false
): Promise<T | undefined> {
  const headers = new Headers(init.headers);

  // All endpoints (/api/products, /api/categories, /api/brands) are local Next.js Route Handlers
  const response = await fetch(endpoint, { ...init, headers });

  if (!response.ok) {
    if (response.status === 400) {
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          throw new Error(errorData.detail);
        }
      } catch (e) {
        if (
          e instanceof Error &&
          e.message !== 'Unexpected end of JSON input' &&
          e.message !== 'Failed to parse URL from' &&
          e.message !== 'invalid json response body at'
        ) {
          throw e;
        }
      }
    }

    console.error(`API HTTP Error: ${response.status} ${response.statusText}`);

    if (response.status === 404) {
      throw new Error('The requested resource could not be found.');
    }

    if (response.status >= 500) {
      throw new Error(
        'The server is currently unavailable. Please try again later.'
      );
    }

    throw new Error(
      'We are having trouble completing your request. Please try again.'
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}
