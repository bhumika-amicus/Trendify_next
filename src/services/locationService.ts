export function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError';
}

interface CountryRecord {
  country: string;
}

interface StateRecord {
  name: string;
}

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}

function isCountryListResponse(
  val: unknown
): val is { data: CountryRecord[]; error?: boolean; msg?: string } {
  return (
    isRecord(val) &&
    !val.error &&
    Array.isArray(val.data) &&
    val.data.length > 0 &&
    val.data.every((item) => isRecord(item) && typeof item.country === 'string')
  );
}

function isStateListResponse(
  val: unknown
): val is { data: { states?: StateRecord[] }; error?: boolean; msg?: string } {
  return (
    isRecord(val) &&
    !val.error &&
    isRecord(val.data) &&
    Array.isArray(val.data.states) &&
    val.data.states.every((item) => isRecord(item) && typeof item.name === 'string')
  );
}

function isCityListResponse(
  val: unknown
): val is { data: string[]; error?: boolean; msg?: string } {
  return (
    isRecord(val) &&
    !val.error &&
    Array.isArray(val.data) &&
    val.data.every((item) => typeof item === 'string')
  );
}

function getErrorMessage(val: unknown, fallback: string): string {
  if (isRecord(val) && typeof val.msg === 'string' && val.msg.trim().length > 0) {
    return val.msg;
  }
  return fallback;
}

const API_BASE_URL = 'https://countriesnow.space/api/v0.1/countries';
const stateCache = new Map<string, string[]>();
const cityCache = new Map<string, string[]>();

export async function getCountries(signal?: AbortSignal): Promise<string[]> {
  try {
    const response = await fetch(API_BASE_URL, {
      signal,
      next: { revalidate: 86400, tags: ['locations-countries'] },
    });

    if (!response.ok) {
      throw new Error(`Location API HTTP ${response.status}`);
    }

    const result: unknown = await response.json();
    if (!isCountryListResponse(result)) {
      throw new Error(getErrorMessage(result, 'Invalid API response format'));
    }

    return result.data.map(({ country }) => country);
  } catch (err: unknown) {
    if (!isAbortError(err)) {
      console.warn('[LOCATION_API] Failed to fetch countries:', err);
      throw err;
    }
    return [];
  }
}

export async function getStates(
  country: string,
  signal?: AbortSignal
): Promise<string[]> {
  if (!country) return [];

  const cached = stateCache.get(country);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE_URL}/states`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Location API HTTP ${response.status}`);
    }

    const result: unknown = await response.json();
    if (!isStateListResponse(result) || !result.data.states) {
      throw new Error(getErrorMessage(result, 'Invalid API response format'));
    }

    const stateNames = result.data.states.map((s) => s.name);
    stateCache.set(country, stateNames);
    return stateNames;
  } catch (err: unknown) {
    if (!isAbortError(err)) {
      console.warn(`[LOCATION_API] Failed to fetch states for ${country}:`, err);
      throw err;
    }
    return [];
  }
}

export async function getCities(
  country: string,
  state: string,
  signal?: AbortSignal
): Promise<string[]> {
  if (!country || !state) return [];

  const cacheKey = `${country}:${state}`;
  const cached = cityCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE_URL}/state/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, state }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Location API HTTP ${response.status}`);
    }

    const result: unknown = await response.json();
    if (!isCityListResponse(result)) {
      throw new Error(getErrorMessage(result, 'Invalid API response format'));
    }

    cityCache.set(cacheKey, result.data);
    return result.data;
  } catch (err: unknown) {
    if (!isAbortError(err)) {
      console.warn(`[LOCATION_API] Failed to fetch cities for ${country}/${state}:`, err);
      throw err;
    }
    return [];
  }
}
