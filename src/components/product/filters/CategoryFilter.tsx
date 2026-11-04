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
    <CheckboxFilterGroup<Category>
      title="Category"
      section="category"
      items={categories}
      getItemId={(c) => c.categoryId}
      getItemName={(c) => c.name}
      selectedId={selectedCategoryId}
      isOpen={isOpen}
      onToggle={onToggle}
      onSelect={onToggleCategory}
      hasTopMargin={false}
      emptyMessage="No categories found."
    />
  );
}

