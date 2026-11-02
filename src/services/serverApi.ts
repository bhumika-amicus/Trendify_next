import { DOTNET_API_BASE_URL } from '@/config';

export interface ServerApiOptions extends Omit<RequestInit, 'body'> {
  token?: string;
  body?: unknown;
}

export interface ServerApiResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

export async function serverApiFetch<T>(
  endpoint: string,
  options: ServerApiOptions = {}
): Promise<ServerApiResponse<T>> {
  const { token, body, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);
  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const isJsonBody =
    body !== undefined &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    typeof body !== 'string';

  if (isJsonBody) {
    headers.set('Content-Type', 'application/json');
  }

  const fetchOptions: RequestInit = {
    ...rest,
    headers,
    body: isJsonBody
      ? JSON.stringify(body)
      : (body as BodyInit | null | undefined),
  };

  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${DOTNET_API_BASE_URL}${normalizedPath}`;

  try {
    const response = await fetch(url, fetchOptions);

    // 204 No Content
    if (response.status === 204) {
      return { ok: true, status: 204, data: null };
    }

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMsg =
        (typeof json?.detail === 'string' && json.detail) ||
        (typeof json?.message === 'string' && json.message) ||
        (typeof json?.title === 'string' && json.title);

      // Handle ASP.NET ModelState validation dictionary errors: { errors: { Field: ["error message"] } }
      if (!errorMsg && json?.errors && typeof json.errors === 'object') {
        const errorList = Object.values(json.errors)
          .flat()
          .filter((msg): msg is string => typeof msg === 'string');
        if (errorList.length > 0) {
          errorMsg = errorList.join(', ');
        }
      }

      if (!errorMsg) {
        errorMsg = `Upstream service returned error status ${response.status}.`;
      }

      return {
        ok: false,
        status: response.status,
        data: json as T | null,
        error: errorMsg,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: json as T,
    };
  } catch (err) {
    console.error(`[SERVER_API] Network error fetching ${normalizedPath}:`, err);
    return {
      ok: false,
      status: 0,
      data: null,
      error: 'Unable to connect to the backend server. Please try again.',
    };
  }
}
