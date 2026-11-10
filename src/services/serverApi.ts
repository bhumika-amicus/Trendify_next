import { DOTNET_API_BASE_URL } from '@/config';

export interface ServerApiOptions extends Omit<RequestInit, 'body'> {
  token?: string;
  body?: unknown;
}

/**
 * Backward-compatible discriminated union:
 * - When ok === true: data is T | null, and error is undefined.
 * - When ok === false: error is guaranteed string, and data holds parsed response (T | null).
 * - Full type narrowing when checking res.ok, with 100% compatibility for existing callers.
 */
export type ServerApiResponse<T> =
  | {
      ok: true;
      status: number;
      data: T | null;
      error?: undefined;
    }
  | {
      ok: false;
      status: number;
      data: T | null;
      error: string;
    };

/**
 * Custom error carrying an HTTP status code.
 * Allows Route Handlers to forward upstream status codes (400, 404, 502)
 * while letting Server Components bubble up to Next.js Error Boundaries.
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Checks whether an error belongs to Next.js framework control flow.
 * These errors (like DYNAMIC_SERVER_USAGE or NEXT_REDIRECT) must propagate
 * instead of being converted into API failures.
 */
function isNextControlFlowError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('digest' in error)) {
    return false;
  }

  const digest = (error as { digest?: unknown }).digest;

  return (
    typeof digest === 'string' &&
    (digest === 'DYNAMIC_SERVER_USAGE' || digest.startsWith('NEXT_'))
  );
}

/**
 * Safely extracts a human-readable message from ASP.NET Core ProblemDetails
 * or ModelState validation dictionaries: { errors: { FieldName: ["message"] } }.
 */
function extractErrorMessage(data: unknown, status: number): string {
  if (typeof data === 'object' && data !== null) {
    const errorData = data as Record<string, unknown>;

    const message =
      (typeof errorData.detail === 'string' && errorData.detail) ||
      (typeof errorData.message === 'string' && errorData.message) ||
      (typeof errorData.title === 'string' && errorData.title);

    if (message) {
      return message;
    }

    // ASP.NET Core ModelState validation dictionary
    if (
      typeof errorData.errors === 'object' &&
      errorData.errors !== null &&
      !Array.isArray(errorData.errors)
    ) {
      const errorList = Object.values(errorData.errors as Record<string, unknown>)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === 'string');

      if (errorList.length > 0) {
        return errorList.join(', ');
      }
    }
  }

  return `Upstream service returned error status ${status}.`;
}

/**
 * Parses response body as JSON when possible.
 * Returns null for empty bodies (such as 204 or empty strings) and preserves text otherwise.
 */
async function parseResponseBody(response: Response): Promise<unknown> {
  const responseText = await response.text();

  if (!responseText.trim()) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
}

/**
 * Generic server-side HTTP helper for communicating with the .NET backend.
 *
 * Responsibilities:
 * - Construct normalized URLs.
 * - Manage standard headers (Accept, Authorization, Content-Type).
 * - Serialize JSON bodies while preserving FormData / URLSearchParams.
 * - Parse JSON and handle empty/text bodies gracefully.
 * - Preserve Next.js dynamic rendering control flow errors.
 * - Support Next.js caching options (revalidate, tags) via standard RequestInit.
 */
export async function serverApiFetch<T>(
  endpoint: string,
  options: ServerApiOptions = {}
): Promise<ServerApiResponse<T>> {
  const { token, body, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const isFormData = body instanceof FormData;
  const isUrlSearchParams = body instanceof URLSearchParams;

  const isJsonBody =
    body !== undefined &&
    body !== null &&
    !isFormData &&
    !isUrlSearchParams &&
    typeof body !== 'string';

  if (isJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const requestBody = isJsonBody
    ? JSON.stringify(body)
    : (body as BodyInit | null | undefined);

  const fetchOptions: RequestInit = {
    ...rest,
    headers,
    ...(body !== undefined ? { body: requestBody } : {}),
  };

  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = DOTNET_API_BASE_URL.replace(/\/+$/, '');
  const url = `${baseUrl}${normalizedPath}`;

  try {
    const response = await fetch(url, fetchOptions);

    // 204 No Content
    if (response.status === 204) {
      return {
        ok: true,
        status: 204,
        data: null,
      };
    }

    const responseData = await parseResponseBody(response);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: (typeof responseData === 'object' && responseData !== null ? responseData : null) as T | null,
        error: extractErrorMessage(responseData, response.status),
      };
    }

    // A successful response containing non-JSON text is invalid for this JSON helper
    if (typeof responseData === 'string') {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: 'The backend returned an invalid response format.',
      };
    }

    return {
      ok: true,
      status: response.status,
      data: responseData as T | null,
    };
  } catch (error) {
    // Never swallow Next.js framework control-flow errors
    if (isNextControlFlowError(error)) {
      throw error;
    }

    console.error(`[SERVER_API] Request failed for ${normalizedPath}:`, error);

    return {
      ok: false,
      status: 0,
      data: null,
      error: 'Unable to connect to the backend server. Please try again.',
    };
  }
}
