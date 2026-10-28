'use client';

import type { Category } from '@/types';
import { CheckboxFilterGroup } from './CheckboxFilterGroup';

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
    <CheckboxFilterGroup
      title="Category"
      section="category"
      items={categories}
      selectedId={selectedCategoryId}
      isOpen={isOpen}
      onToggle={onToggle}
      onSelect={onToggleCategory}
      hasTopMargin={false}
      emptyMessage="No categories found."
    />
  );
}

