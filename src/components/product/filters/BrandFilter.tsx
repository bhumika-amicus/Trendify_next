'use client';

import type { Brand } from '@/types';
import { CheckboxFilterGroup } from './CheckboxFilterGroup';

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
    <CheckboxFilterGroup
      title="Brand"
      section="brand"
      items={brands}
      selectedId={selectedBrandId}
      isOpen={isOpen}
      onToggle={onToggle}
      onSelect={onToggleBrand}
      hasTopMargin={true}
      emptyMessage="No brands found."
    />
  );
}

