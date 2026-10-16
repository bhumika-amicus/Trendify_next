'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductSortBy, SortOrder } from '../types/ProductSorting';
import type { ProductSearchParams } from '../types/ProductSearchParams';
import { getValidInt, getValidFloat } from '../utils/urlHelpers';

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();

  // Create a mutable searchParams instance
  const searchParams = new URLSearchParams(rawSearchParams?.toString() || '');

  const setSearchParams = useCallback(
    (updateFn: (params: URLSearchParams) => URLSearchParams) => {
      const current = new URLSearchParams(rawSearchParams?.toString() || '');
      const next = updateFn(current);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, rawSearchParams, router]
  );

  // 1. Parse and validate URL query parameters
  const searchTerm = searchParams.get('search') || '';
  const categoryId = getValidInt(searchParams, 'categoryId', 1);
  const brandId = getValidInt(searchParams, 'brandId', 1);
  const minRating = getValidFloat(searchParams, 'minRating', 1, 5);
  const page = getValidInt(searchParams, 'page', 1) ?? 1;

  let minPrice = getValidFloat(searchParams, 'minPrice', 0);
  let maxPrice = getValidFloat(searchParams, 'maxPrice', 0);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  const rawSortBy = searchParams.get('sortBy');
  const isValidSortBy = (val: string | null): val is ProductSortBy =>
    Object.values(ProductSortBy).some((v) => v === val);
  const sortBy = isValidSortBy(rawSortBy) ? rawSortBy : undefined;

  const rawSortOrder = searchParams.get('sortOrder');
  const isValidSortOrder = (val: string | null): val is SortOrder =>
    Object.values(SortOrder).some((v) => v === val);
  const sortOrder = isValidSortOrder(rawSortOrder) ? rawSortOrder : undefined;

  // 2. Filter status
  const hasFacetFilters = Boolean(
    categoryId !== undefined ||
      brandId !== undefined ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minRating !== undefined ||
      sortBy !== undefined
  );

  const hasActiveFilters = Boolean(searchTerm !== '' || hasFacetFilters);

  // 3. API payload object matching ProductSearchParams
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
  };

  // 4. Stable URL update operations
  const updatePage = useCallback(
    (nextPage: number) => {
      if (nextPage < 1) return;
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set('page', String(nextPage));
        return nextParams;
      });
    },
    [setSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete('categoryId');
      nextParams.delete('brandId');
      nextParams.delete('minPrice');
      nextParams.delete('maxPrice');
      nextParams.delete('minRating');
      nextParams.delete('sortBy');
      nextParams.delete('sortOrder');
      nextParams.delete('page');
      return nextParams;
    });
  }, [setSearchParams]);

  const resetAllFilters = useCallback(() => {
    setSearchParams(() => new URLSearchParams());
  }, [setSearchParams]);

  const toggleParam = useCallback(
    (key: string, value: string | number) => {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        const strVal = String(value);
        if (nextParams.get(key) === strVal) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, strVal);
        }
        nextParams.set('page', '1');
        return nextParams;
      });
    },
    [setSearchParams]
  );

  const toggleCategory = useCallback(
    (id: number) => toggleParam('categoryId', id),
    [toggleParam]
  );

  const toggleBrand = useCallback(
    (id: number) => toggleParam('brandId', id),
    [toggleParam]
  );

  const toggleMinRating = useCallback(
    (rating: number) => toggleParam('minRating', rating),
    [toggleParam]
  );

  const togglePriceRange = useCallback(
    (min?: number, max?: number) => {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        const currentMin = nextParams.get('minPrice');
        const currentMax = nextParams.get('maxPrice');
        const targetMin = min !== undefined ? String(min) : null;
        const targetMax = max !== undefined ? String(max) : null;

        if (currentMin === targetMin && currentMax === targetMax) {
          nextParams.delete('minPrice');
          nextParams.delete('maxPrice');
        } else {
          if (targetMin !== null) nextParams.set('minPrice', targetMin);
          else nextParams.delete('minPrice');

          if (targetMax !== null) nextParams.set('maxPrice', targetMax);
          else nextParams.delete('maxPrice');
        }
        nextParams.set('page', '1');
        return nextParams;
      });
    },
    [setSearchParams]
  );

  const setSort = useCallback(
    (newSortBy: ProductSortBy, newSortOrder: SortOrder) => {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set('sortBy', newSortBy);
        nextParams.set('sortOrder', newSortOrder);
        nextParams.set('page', '1');
        return nextParams;
      });
    },
    [setSearchParams]
  );

  const clearSort = useCallback(() => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete('sortBy');
      nextParams.delete('sortOrder');
      nextParams.set('page', '1');
      return nextParams;
    });
  }, [setSearchParams]);

  return {
    searchTerm,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    sortOrder,
    page,
    hasActiveFilters,
    hasFacetFilters,
    filterKey: searchParams.toString(),
    apiParams,
    updatePage,
    clearAllFilters,
    resetAllFilters,
    toggleCategory,
    toggleBrand,
    togglePriceRange,
    toggleMinRating,
    setSort,
    clearSort,
  };
}
