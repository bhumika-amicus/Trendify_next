'use client';

import { useState, memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { Category, Brand } from '@/types';
import { useProductFilters } from '@/hooks/useProductFilters';
import {
  CategoryFilter,
  BrandFilter,
  PriceFilter,
  RatingFilter,
  SortFilter,
  type FilterSection,
} from './filters';

export interface FilterSidebarProps {
  categories?: Category[];
  brands?: Brand[];
}

function FilterSidebar({
  categories = [],
  brands = [],
}: FilterSidebarProps) {
  const {
    categoryId: selectedCategoryId,
    brandId,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    sortOrder,
    hasFacetFilters,
    clearAllFilters,
    toggleCategory,
    toggleBrand,
    togglePriceRange,
    toggleMinRating,
    setSort,
    clearSort,
  } = useProductFilters();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<FilterSection, boolean>>(
    {
      category: selectedCategoryId !== undefined,
      brand: brandId !== undefined,
      price: minPrice !== undefined || maxPrice !== undefined,
      rating: minRating !== undefined,
      sort: sortBy !== undefined,
    }
  );

  const toggleSection = (section: FilterSection) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="sticky top-4 z-10 rounded-lg border border-gray-200 bg-white p-3.5 lg:top-6 overflow-y-auto max-h-[calc(100vh-2.5rem)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Mobile: FILTERS toggle accordion button + inline Clear all */}
      <div className="flex items-center justify-between border-b-2 border-brand-orange-500 pb-2 mb-2 lg:hidden">
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center gap-2 bg-transparent border-0 p-0 text-left text-base font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          aria-expanded={isMobileFiltersOpen}
          aria-controls="listing-filter-content"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <span>FILTERS</span>
          <span aria-hidden="true">
            {isMobileFiltersOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </span>
        </button>
        {hasFacetFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-medium leading-none text-brand-orange-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Desktop: FILTERS heading + Clear all */}
      <div className="hidden lg:flex items-center justify-between pb-2 mb-4 border-b-2 border-brand-orange-500">
        <h2 className="m-0 font-bold uppercase tracking-wide text-gray-800 text-sm leading-none">
          FILTERS
        </h2>
        {hasFacetFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-medium leading-none text-brand-orange-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Sections (Expanded on Desktop, Toggled on Mobile) */}
      <div
        id="listing-filter-content"
        className={`lg:block ${isMobileFiltersOpen ? 'block mt-4' : 'hidden'}`}
      >
        {/* 1. Category */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isOpen={openSections.category}
          onToggle={() => toggleSection('category')}
          onToggleCategory={toggleCategory}
        />

        {/* 2. Brand */}
        <BrandFilter
          brands={brands}
          selectedBrandId={brandId}
          isOpen={openSections.brand}
          onToggle={() => toggleSection('brand')}
          onToggleBrand={toggleBrand}
        />

        {/* 3. Price */}
        <PriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
          onTogglePriceRange={togglePriceRange}
        />

        {/* 4. Rating */}
        <RatingFilter
          minRating={minRating}
          isOpen={openSections.rating}
          onToggle={() => toggleSection('rating')}
          onToggleMinRating={toggleMinRating}
        />

        {/* 5. Sort By */}
        <SortFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          isOpen={openSections.sort}
          onToggle={() => toggleSection('sort')}
          onSetSort={setSort}
          onClearSort={clearSort}
        />
      </div>
    </aside>
  );
}

export default memo(FilterSidebar);
