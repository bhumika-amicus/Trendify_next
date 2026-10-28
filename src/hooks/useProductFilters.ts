'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductSortBy, SortOrder } from '@/types';
import { parseProductSearchParams } from '@/utils/productParams';

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();

  // Create a mutable searchParams instance
  const searchParams = new URLSearchParams(rawSearchParams?.toString() || '');

  const setSearchParams = (
    updateFn: (params: URLSearchParams) => URLSearchParams
  ) => {
    const current = new URLSearchParams(rawSearchParams?.toString() || '');
    const next = updateFn(current);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Parse and validate URL query parameters via shared utility
  const {
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
  } = parseProductSearchParams(searchParams);

  // 4. Stable URL update operations
  const updatePage = (nextPage: number) => {
    if (nextPage < 1) return;
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set('page', String(nextPage));
      return nextParams;
    });
  };

  const clearAllFilters = () => {
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
  };

  const resetAllFilters = () => {
    setSearchParams(() => new URLSearchParams());
  };

  const toggleParam = (key: string, value: string | number) => {
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
  };

  const toggleCategory = (id: number) => toggleParam('categoryId', id);
  const toggleBrand = (id: number) => toggleParam('brandId', id);
  const toggleMinRating = (rating: number) => toggleParam('minRating', rating);

  const togglePriceRange = (min?: number, max?: number) => {
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
  };

  const setSort = (newSortBy: ProductSortBy, newSortOrder: SortOrder) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set('sortBy', newSortBy);
      nextParams.set('sortOrder', newSortOrder);
      nextParams.set('page', '1');
      return nextParams;
    });
  };

  const clearSort = () => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete('sortBy');
      nextParams.delete('sortOrder');
      nextParams.set('page', '1');
      return nextParams;
    });
  };

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
