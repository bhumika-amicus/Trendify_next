export interface StateOption {
  name: string;
  state_code: string;
}

interface ApiResponse<T> {
  data: T;
  error?: boolean;
  msg?: string;
}

const API_BASE_URL = 'https://countriesnow.space/api/v0.1/countries';
const stateCache = new Map<string, StateOption[]>();
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

    const result = (await response.json()) as ApiResponse<{ country: string }[]>;
    if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
      throw new Error(result.msg || 'Invalid API response format');
    }

    return result.data.map(({ country }) => country);
  } catch (err: unknown) {
    if ((err as Error)?.name !== 'AbortError') {
      console.warn('[LOCATION_API] Failed to fetch countries:', err);
      throw err;
    }
    return [];
  }
}

export async function getStates(
  country: string,
  signal?: AbortSignal
): Promise<StateOption[]> {
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

    const result = (await response.json()) as ApiResponse<{ states?: StateOption[] }>;
    if (result.error || !result.data?.states) {
      throw new Error(result.msg || 'Invalid API response format');
    }

    stateCache.set(country, result.data.states);
    return result.data.states;
  } catch (err: unknown) {
    if ((err as Error)?.name !== 'AbortError') {
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

    const result = (await response.json()) as ApiResponse<string[]>;
    if (result.error || !Array.isArray(result.data)) {
      throw new Error(result.msg || 'Invalid API response format');
    }

    cityCache.set(cacheKey, result.data);
    return result.data;
  } catch (err: unknown) {
    if ((err as Error)?.name !== 'AbortError') {
      console.warn(`[LOCATION_API] Failed to fetch cities for ${country}/${state}:`, err);
      throw err;
    }
    return [];
  }
}
