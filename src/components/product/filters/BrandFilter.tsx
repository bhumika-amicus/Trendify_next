'use client';

import type { Brand } from '@/types';
import CheckboxFilterGroup from './CheckboxFilterGroup';

interface BrandFilterProps {
  brands: Brand[];
  selectedBrandId?: number;
  isOpen: boolean;
  onToggle: () => void;
  onToggleBrand: (id: number) => void;
}

export default function BrandFilter({
  brands,
  selectedBrandId,
  isOpen,
  onToggle,
  onToggleBrand,
}: BrandFilterProps) {
  return (
    <CheckboxFilterGroup<Brand>
      title="Brand"
      section="brand"
      items={brands}
      getItemId={(b) => b.brandId}
      getItemName={(b) => b.name}
      selectedId={selectedBrandId}
      isOpen={isOpen}
      onToggle={onToggle}
      onSelect={onToggleBrand}
      hasTopMargin={true}
      emptyMessage="No brands found."
    />
  );
}

