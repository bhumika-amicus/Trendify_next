'use client';

import { Star } from 'lucide-react';
import { RATING_OPTIONS } from './filterConfig';
import { FilterSectionHeader } from './FilterSectionHeader';

interface RatingFilterProps {
  minRating?: number;
  isOpen: boolean;
  onToggle: () => void;
  onToggleMinRating: (rating: number) => void;
}

export function RatingFilter({
  minRating,
  isOpen,
  onToggle,
  onToggleMinRating,
}: RatingFilterProps) {
  return (
    <>
      <FilterSectionHeader
        title="Rating"
        section="rating"
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <section className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        {RATING_OPTIONS.map((rating) => {
          const isChecked = minRating === rating.value;
          return (
            <label
              key={rating.value}
              className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <input
                type="checkbox"
                className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                checked={isChecked}
                onChange={() => onToggleMinRating(rating.value)}
              />
              <div className="flex flex-col gap-1 mt-0.5">
                <span>{rating.label}</span>
                <span className="flex items-center text-brand-orange-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rating.value ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </span>
              </div>
            </label>
          );
        })}
      </section>
    </>
  );
}
