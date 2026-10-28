'use client';

import { PRICE_RANGES } from './filterConfig';
import { FilterSectionHeader } from './FilterSectionHeader';

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  isOpen: boolean;
  onToggle: () => void;
  onTogglePriceRange: (min?: number, max?: number) => void;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  isOpen,
  onToggle,
  onTogglePriceRange,
}: PriceFilterProps) {
  return (
    <>
      <FilterSectionHeader
        title="Price"
        section="price"
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <section className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        {PRICE_RANGES.map((range) => {
          const isChecked = minPrice === range.min && maxPrice === range.max;
          return (
            <label
              key={range.label}
              className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <input
                type="checkbox"
                className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                checked={isChecked}
                onChange={() => onTogglePriceRange(range.min, range.max)}
              />
              {range.label}
            </label>
          );
        })}
      </section>
    </>
  );
}
