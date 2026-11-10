'use client';

import FilterSectionHeader from './FilterSectionHeader';
import type { FilterSection } from './filterConfig';

export interface CheckboxFilterGroupProps<T> {
  title: string;
  section: FilterSection;
  items: T[];
  getItemId: (item: T) => number;
  getItemName: (item: T) => string;
  selectedId?: number;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: number) => void;
  hasTopMargin?: boolean;
  emptyMessage?: string;
}

export default function CheckboxFilterGroup<T>({
  title,
  section,
  items,
  getItemId,
  getItemName,
  selectedId,
  isOpen,
  onToggle,
  onSelect,
  hasTopMargin = true,
  emptyMessage = 'No items found.',
}: CheckboxFilterGroupProps<T>) {
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
          items.map((item) => {
            const itemId = getItemId(item);
            const itemName = getItemName(item);
            return (
              <label
                key={itemId}
                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  checked={selectedId === itemId}
                  onChange={() => onSelect(itemId)}
                />
                <span className="truncate">{itemName}</span>
              </label>
            );
          })
        )}
      </section>
    </>
  );
}
