'use client';

import type { Category } from '@/types';
import { FilterSectionHeader } from './FilterSectionHeader';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: number;
  isOpen: boolean;
  onToggle: () => void;
  onToggleCategory: (id: number) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  isOpen,
  onToggle,
  onToggleCategory,
}: CategoryFilterProps) {
  return (
    <>
      <FilterSectionHeader
        title="Category"
        section="category"
        isOpen={isOpen}
        onToggle={onToggle}
        hasTopMargin={false}
      />
      <section className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
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
                onChange={() => onToggleCategory(category.id)}
              />
              {category.name}
            </label>
          ))
        )}
      </section>
    </>
  );
}
