'use client';

import { X } from 'lucide-react';
import Button from '@/components/common/Button';
import { ProductSortBy, SortOrder } from '@/types';
import { SORT_OPTIONS } from './filterConfig';
import { FilterSectionHeader } from './FilterSectionHeader';

interface SortFilterProps {
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  isOpen: boolean;
  onToggle: () => void;
  onSetSort: (newSortBy: ProductSortBy, newSortOrder: SortOrder) => void;
  onClearSort: () => void;
}

export function SortFilter({
  sortBy,
  sortOrder,
  isOpen,
  onToggle,
  onSetSort,
  onClearSort,
}: SortFilterProps) {
  return (
    <>
      <FilterSectionHeader
        title="Sort by"
        section="sort"
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <section className={`flex-col ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
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
                    onChange={() => onSetSort(config.type, config.defaultOrder)}
                  />
                  {config.label}
                </label>
                {isSelected && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-brand-orange-600 hover:bg-brand-orange-100"
                    onClick={onClearSort}
                    aria-label="Clear sort"
                  >
                    <X size={16} />
                  </Button>
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
                          onChange={() => onSetSort(config.type, dir.order)}
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
    </>
  );
}
