import { DOTNET_API_BASE_URL } from '@/config';

export interface ServerApiOptions extends Omit<RequestInit, 'body'> {
  token?: string;
  body?: unknown;
}

/**
 * Discriminated union for upstream API results:
 * - When ok === true: data holds parsed JSON (T | null), error is undefined.
 * - When ok === false: error holds a safe backend message for < 500 responses,
 *   or undefined on 5xx so calling services supply their own contextual fallback.
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
    error?: string;
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

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function hasDigest(err: unknown): err is { digest: unknown } {
  return typeof err === 'object' && err !== null && 'digest' in err;
}

/**
 * Checks whether an error belongs to Next.js framework control flow.
 * These errors (like DYNAMIC_SERVER_USAGE or NEXT_REDIRECT) must propagate
 * instead of being converted into API failures.
 */
function isNextControlFlowError(error: unknown): boolean {
  if (!hasDigest(error)) {
    return false;
  }

  const { digest } = error;

  return (
    typeof digest === 'string' &&
    (digest === 'DYNAMIC_SERVER_USAGE' || digest.startsWith('NEXT_'))
  );
}

/**
 * Safely extracts a message if the backend explicitly returned one.
 * If no backend message exists or the server returned 5xx, returns undefined
 * so the calling service can supply its own contextual domain fallback.
 */
function extractBackendMessage(data: unknown, status: number): string | undefined {
  if (status >= 500) {
    return undefined;
  }

  if (isRecord(data)) {
    const msg = data.message || data.detail || data.title;
    if (typeof msg === 'string' && msg.trim()) {
      return msg.trim();
    }
  }

  return undefined;
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

  const hasJsonBody = body !== undefined && body !== null;
  if (hasJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const timeoutSignal = AbortSignal.timeout(8500);
  const combinedSignal = rest.signal
    ? AbortSignal.any([rest.signal, timeoutSignal])
    : timeoutSignal;

  const fetchOptions: RequestInit = {
    ...rest,
    headers,
    // Fail fast before Vercel's serverless timeout so error boundaries / fallbacks handle slow upstreams
    signal: combinedSignal,
    ...(hasJsonBody ? { body: JSON.stringify(body) } : {}),
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
      if (response.status >= 500) {
        console.error(
          `[SERVER_API_5XX] Upstream failure on ${normalizedPath} [${response.status}]:`,
          responseData
        );
      }
      return {
        ok: false,
        status: response.status,
        data: (isRecord(responseData) ? responseData : null) as T | null,
        error: extractBackendMessage(responseData, response.status),
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
