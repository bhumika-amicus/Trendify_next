'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import type { FilterSection } from './filterConfig';

interface FilterSectionHeaderProps {
  title: string;
  section: FilterSection;
  isOpen: boolean;
  onToggle: (section: FilterSection) => void;
  hasTopMargin?: boolean;
}

export function FilterSectionHeader({
  title,
  section,
  isOpen,
  onToggle,
  hasTopMargin = true,
}: FilterSectionHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onToggle(section)}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between lg:hidden m-0 mb-2 ${
          hasTopMargin ? 'mt-5' : ''
        } text-base font-bold text-gray-800`.trim()}
      >
        <span>{title}</span>
        <span aria-hidden="true">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <h3
        className={`hidden lg:block m-0 mb-2 ${
          hasTopMargin ? 'mt-5' : ''
        } text-base font-bold text-gray-800`.trim()}
      >
        {title}
      </h3>
    </>
  );
}
