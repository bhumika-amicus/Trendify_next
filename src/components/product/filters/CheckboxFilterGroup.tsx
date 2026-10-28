'use client';

import { FilterSectionHeader } from './FilterSectionHeader';
import type { FilterSection } from './filterConfig';

export interface FilterItem {
  id: number;
  name: string;
}

export interface CheckboxFilterGroupProps {
  title: string;
  section: FilterSection;
  items: FilterItem[];
  selectedId?: number;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: number) => void;
  hasTopMargin?: boolean;
  emptyMessage?: string;
}

export function CheckboxFilterGroup({
  title,
  section,
  items,
  selectedId,
  isOpen,
  onToggle,
  onSelect,
  hasTopMargin = true,
  emptyMessage = 'No items found.',
}: CheckboxFilterGroupProps) {
  return (
    <>
      <FilterSectionHeader
        title={title}
        section={section}
        isOpen={isOpen}
        onToggle={onToggle}
        hasTopMargin={hasTopMargin}
      />
      <section className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 py-1 italic">{emptyMessage}</p>
        ) : (
          items.map((item) => (
            <label
              key={item.id}
              className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <input
                type="checkbox"
                className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                checked={selectedId === item.id}
                onChange={() => onSelect(item.id)}
              />
              <span className="truncate">{item.name}</span>
            </label>
          ))
        )}
      </section>
    </>
  );
}
