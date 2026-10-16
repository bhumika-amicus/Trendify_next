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
