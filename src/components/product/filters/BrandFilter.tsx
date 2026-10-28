'use client';

import type { Brand } from '@/types';
import { FilterSectionHeader } from './FilterSectionHeader';

interface BrandFilterProps {
  brands: Brand[];
  selectedBrandId?: number;
  isOpen: boolean;
  onToggle: () => void;
  onToggleBrand: (id: number) => void;
}

export function BrandFilter({
  brands,
  selectedBrandId,
  isOpen,
  onToggle,
  onToggleBrand,
}: BrandFilterProps) {
  return (
    <>
      <FilterSectionHeader
        title="Brand"
        section="brand"
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <section className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
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
                checked={selectedBrandId === brand.id}
                onChange={() => onToggleBrand(brand.id)}
              />
              {brand.name}
            </label>
          ))
        )}
      </section>
    </>
  );
}
