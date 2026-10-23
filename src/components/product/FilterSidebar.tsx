'use client';

import { useState, memo, type ReactNode } from 'react';
import { Star, ChevronUp, ChevronDown, X, ArrowRight } from 'lucide-react';
import type { Category } from '@/types/Categories';
import type { Brand } from '@/types/Brands';
import { ProductSortBy, SortOrder } from '@/types/ProductSorting';
import { useProductFilters } from '@/hooks/useProductFilters';

const PRICE_RANGES = [
  { label: 'Below ₹10,000', min: undefined, max: 10000 },
  { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: undefined },
];

const RATING_OPTIONS = [
  { label: '1 star & above', value: 1 },
  { label: '2 stars & above', value: 2 },
  { label: '3 stars & above', value: 3 },
  { label: '4 stars & above', value: 4 },
];

interface SortDirectionOption {
  label: ReactNode;
  order: SortOrder;
}

interface SortOptionConfig {
  type: ProductSortBy;
  label: string;
  defaultOrder: SortOrder;
  directionGroupName: string;
  directions: [SortDirectionOption, SortDirectionOption];
}

const SORT_OPTIONS: SortOptionConfig[] = [
  {
    type: ProductSortBy.Name,
    label: 'Name',
    defaultOrder: SortOrder.Asc,
    directionGroupName: 'sort-direction-name',
    directions: [
      {
        label: (
          <>
            A <ArrowRight size={14} className="inline mx-0.5" /> Z
          </>
        ),
        order: SortOrder.Asc,
      },
      {
        label: (
          <>
            Z <ArrowRight size={14} className="inline mx-0.5" /> A
          </>
        ),
        order: SortOrder.Desc,
      },
    ],
  },
  {
    type: ProductSortBy.Price,
    label: 'Price',
    defaultOrder: SortOrder.Asc,
    directionGroupName: 'sort-direction-price',
    directions: [
      {
        label: (
          <>
            Low <ArrowRight size={14} className="inline mx-0.5" /> High
          </>
        ),
        order: SortOrder.Asc,
      },
      {
        label: (
          <>
            High <ArrowRight size={14} className="inline mx-0.5" /> Low
          </>
        ),
        order: SortOrder.Desc,
      },
    ],
  },
  {
    type: ProductSortBy.Rating,
    label: 'Ratings',
    defaultOrder: SortOrder.Desc,
    directionGroupName: 'sort-direction-rating',
    directions: [
      {
        label: (
          <>
            High <ArrowRight size={14} className="inline mx-0.5" /> Low
          </>
        ),
        order: SortOrder.Desc,
      },
      {
        label: (
          <>
            Low <ArrowRight size={14} className="inline mx-0.5" /> High
          </>
        ),
        order: SortOrder.Asc,
      },
    ],
  },
];

type FilterSection = 'category' | 'brand' | 'price' | 'rating' | 'sort';

interface FilterSectionHeaderProps {
  title: string;
  section: FilterSection;
  isOpen: boolean;
  onToggle: (section: FilterSection) => void;
  hasTopMargin?: boolean;
}

function FilterSectionHeader({
  title,
  section,
  isOpen,
  onToggle,
  hasTopMargin = true,
}: FilterSectionHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onToggle(section)}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between lg:hidden m-0 mb-2 ${
          hasTopMargin ? 'mt-5' : ''
        } text-base font-bold text-gray-800`.trim()}
      >
        <span>{title}</span>
        <span aria-hidden="true">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <h3
        className={`hidden lg:block m-0 mb-2 ${
          hasTopMargin ? 'mt-5' : ''
        } text-base font-bold text-gray-800`.trim()}
      >
        {title}
      </h3>
    </>
  );
}

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
    <aside className="sticky top-0 z-10 border border-gray-300 bg-white p-3 lg:top-6 overflow-y-auto max-h-screen lg:max-h-[calc(100vh-3rem)]">
      {/* Mobile: FILTERS toggle + inline "Clear all" */}
      <div className="flex items-center justify-between border-b-2 border-brand-orange-500 pb-2 mb-2 lg:hidden">
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center gap-2 bg-transparent border-0 p-0 text-left text-lg md:text-xl font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          aria-expanded={isMobileFiltersOpen}
          aria-controls="listing-filter-content"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          FILTERS
          <span aria-hidden="true">
            {isMobileFiltersOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
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

      <div
        id="listing-filter-content"
        className={`lg:block ${isMobileFiltersOpen ? 'block mt-5' : 'hidden'}`}
      >
        {/* 1. Category */}
        <FilterSectionHeader
          title="Category"
          section="category"
          isOpen={openSections.category}
          onToggle={toggleSection}
          hasTopMargin={false}
        />
        <section
          className={`${openSections.category ? 'block' : 'hidden'} lg:block`}
        >
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500 py-1 italic">
              No categories found.
            </p>
          ) : (
            categories.map((category) => (
              <label
                key={category.id}
                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  checked={selectedCategoryId === category.id}
                  onChange={() => toggleCategory(category.id)}
                />
                {category.name}
              </label>
            ))
          )}
        </section>

        {/* 2. Brand */}
        <FilterSectionHeader
          title="Brand"
          section="brand"
          isOpen={openSections.brand}
          onToggle={toggleSection}
        />
        <section
          className={`${openSections.brand ? 'block' : 'hidden'} lg:block`}
        >
          {brands.length === 0 ? (
            <p className="text-sm text-gray-500 py-1 italic">No brands found.</p>
          ) : (
            brands.map((brand) => (
              <label
                key={brand.id}
                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  checked={brandId === brand.id}
                  onChange={() => toggleBrand(brand.id)}
                />
                {brand.name}
              </label>
            ))
          )}
        </section>

        {/* 3. Price */}
        <FilterSectionHeader
          title="Price"
          section="price"
          isOpen={openSections.price}
          onToggle={toggleSection}
        />
        <section
          className={`${openSections.price ? 'block' : 'hidden'} lg:block`}
        >
          {PRICE_RANGES.map((range) => {
            const isChecked =
              minPrice === range.min && maxPrice === range.max;
            return (
              <label
                key={range.label}
                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  checked={isChecked}
                  onChange={() => togglePriceRange(range.min, range.max)}
                />
                {range.label}
              </label>
            );
          })}
        </section>

        {/* 4. Rating */}
        <FilterSectionHeader
          title="Rating"
          section="rating"
          isOpen={openSections.rating}
          onToggle={toggleSection}
        />
        <section
          className={`${openSections.rating ? 'block' : 'hidden'} lg:block`}
        >
          {RATING_OPTIONS.map((rating) => {
            const isChecked = minRating === rating.value;
            return (
              <label
                key={rating.value}
                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  checked={isChecked}
                  onChange={() => toggleMinRating(rating.value)}
                />
                <div className="flex flex-col gap-1 mt-0.5">
                  <span>{rating.label}</span>
                  <span className="flex items-center text-brand-orange-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < rating.value ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </span>
                </div>
              </label>
            );
          })}
        </section>

        {/* 5. Sort By */}
        <FilterSectionHeader
          title="Sort by"
          section="sort"
          isOpen={openSections.sort}
          onToggle={toggleSection}
        />
        <section
          className={`flex-col ${openSections.sort ? 'flex' : 'hidden'} lg:flex`}
        >
          {SORT_OPTIONS.map((config) => {
            const isSelected = sortBy === config.type;
            return (
              <div key={config.type} className="flex flex-col">
                <div
                  className={`mb-2 flex items-center justify-between rounded px-1 text-sm text-gray-600 transition-colors hover:bg-brand-orange-50 ${
                    isSelected
                      ? 'bg-brand-orange-50 font-medium text-brand-orange-600'
                      : ''
                  }`}
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded">
                    <input
                      type="radio"
                      name="sort-category"
                      className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                      checked={isSelected}
                      onChange={() =>
                        setSort(config.type, config.defaultOrder)
                      }
                    />
                    {config.label}
                  </label>
                  {isSelected && (
                    <button
                      type="button"
                      className="cursor-pointer rounded border-0 bg-transparent px-1 text-brand-orange-600 font-bold transition-colors hover:bg-brand-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                      onClick={clearSort}
                      aria-label="Clear sort"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div
                  aria-hidden={!isSelected}
                  inert={!isSelected}
                  className={`overflow-hidden transition-all duration-200 ${
                    isSelected ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div>
                    <div className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-brand-orange-500 pl-3">
                      {config.directions.map((dir) => (
                        <label
                          key={dir.order}
                          className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600"
                        >
                          <input
                            type="radio"
                            name={config.directionGroupName}
                            className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                            checked={isSelected && sortOrder === dir.order}
                            onChange={() => setSort(config.type, dir.order)}
                          />
                          {dir.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </aside>
  );
}

export default memo(FilterSidebar);
