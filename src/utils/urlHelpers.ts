export function getValidInt(
  params: URLSearchParams,
  key: string,
  min = -Infinity,
  max = Infinity
): number | undefined {
  const raw = params.get(key);
  if (raw === null || raw.trim() === '') return undefined;

  const val = Number(raw);
  if (Number.isInteger(val) && val >= min && val <= max) {
    return val;
  }
  return undefined;
}

export function getValidFloat(
  params: URLSearchParams,
  key: string,
  min = -Infinity,
  max = Infinity
): number | undefined {
  const raw = params.get(key);
  if (raw === null || raw.trim() === '') return undefined;

  const val = Number(raw);
  if (Number.isFinite(val) && val >= min && val <= max) {
    return val;
  }
  return undefined;
}

// Constructs a clean pathname ,  Automatically strips out undefined, null, and empty string parameters.

export function buildUrl(
  basePath: string,
  params?: Record<string, string | number | undefined | null>
): string {
  if (!params) return basePath;

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
