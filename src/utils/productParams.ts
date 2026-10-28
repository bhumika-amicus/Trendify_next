import { ProductSortBy, SortOrder, type ProductSearchParams } from '@/types';
import { getValidInt, getValidFloat } from './urlHelpers';

export interface ParsedProductParams {
  urlParams: URLSearchParams;
  searchTerm: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  page: number;
  hasFacetFilters: boolean;
  hasActiveFilters: boolean;
  apiParams: ProductSearchParams;
}

/**
 * Normalizes input (URLSearchParams or raw Next.js searchParams object) into URLSearchParams.
 */
function toUrlSearchParams(
  input: URLSearchParams | Record<string, string | string[] | undefined>
): URLSearchParams {
  if (input instanceof URLSearchParams) {
    return new URLSearchParams(input.toString());
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input || {})) {
    if (typeof value === 'string') {
      params.set(key, value);
    } else if (Array.isArray(value) && value.length > 0) {
      params.set(key, value[0]);
    }
  }
  return params;
}

/**
 * Single source of truth for parsing, validating, and extracting product search parameters.
 * Shared between Server Components (page.tsx) and Client Hooks (useProductFilters.ts).
 */
export function parseProductSearchParams(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
  pageSize?: number
): ParsedProductParams {
  const urlParams = toUrlSearchParams(input);

  // 1. Parse and validate primitive filters
  const searchTerm = urlParams.get('search')?.trim() || '';
  const categoryId = getValidInt(urlParams, 'categoryId', 1);
  const brandId = getValidInt(urlParams, 'brandId', 1);
  const minRating = getValidFloat(urlParams, 'minRating', 1, 5);
  const page = getValidInt(urlParams, 'page', 1) ?? 1;

  let minPrice = getValidFloat(urlParams, 'minPrice', 0);
  let maxPrice = getValidFloat(urlParams, 'maxPrice', 0);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  // 2. Validate enum sorts
  const rawSortBy = urlParams.get('sortBy');
  const isValidSortBy = (val: string | null): val is ProductSortBy =>
    Object.values(ProductSortBy).some((v) => v === val);
  const sortBy = isValidSortBy(rawSortBy) ? rawSortBy : undefined;

  const rawSortOrder = urlParams.get('sortOrder');
  const isValidSortOrder = (val: string | null): val is SortOrder =>
    Object.values(SortOrder).some((v) => v === val);
  const sortOrder = isValidSortOrder(rawSortOrder) ? rawSortOrder : undefined;

  // 3. Determine active filter presence
  const hasFacetFilters = Boolean(
    categoryId !== undefined ||
      brandId !== undefined ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minRating !== undefined ||
      sortBy !== undefined
  );
  const hasActiveFilters = Boolean(searchTerm !== '' || hasFacetFilters);

  // 4. Build API query payload
  const apiParams: ProductSearchParams = {
    search: searchTerm || undefined,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    sortOrder,
    page,
    ...(pageSize ? { pageSize } : {}),
  };

  return {
    urlParams,
    searchTerm,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    sortOrder,
    page,
    hasFacetFilters,
    hasActiveFilters,
    apiParams,
  };
}
