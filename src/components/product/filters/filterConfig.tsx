import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ProductSortBy, SortOrder } from '@/types';

export type FilterSection = 'category' | 'brand' | 'price' | 'rating' | 'sort';

export interface PriceRangeOption {
  label: string;
  min?: number;
  max?: number;
}

export const PRICE_RANGES: PriceRangeOption[] = [
  { label: 'Below ₹10,000', min: undefined, max: 10000 },
  { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: undefined },
];

export interface RatingOption {
  label: string;
  value: number;
}

export const RATING_OPTIONS: RatingOption[] = [
  { label: '1 star & above', value: 1 },
  { label: '2 stars & above', value: 2 },
  { label: '3 stars & above', value: 3 },
  { label: '4 stars & above', value: 4 },
];

export interface SortDirectionOption {
  label: ReactNode;
  order: SortOrder;
}

export interface SortOptionConfig {
  type: ProductSortBy;
  label: string;
  defaultOrder: SortOrder;
  directionGroupName: string;
  directions: [SortDirectionOption, SortDirectionOption];
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  {
    type: 'name',
    label: 'Name',
    defaultOrder: 'asc',
    directionGroupName: 'sort-direction-name',
    directions: [
      {
        label: (
          <>
            A <ArrowRight size={14} className="inline mx-0.5" /> Z
          </>
        ),
        order: 'asc',
      },
      {
        label: (
          <>
            Z <ArrowRight size={14} className="inline mx-0.5" /> A
          </>
        ),
        order: 'desc',
      },
    ],
  },
  {
    type: 'price',
    label: 'Price',
    defaultOrder: 'asc',
    directionGroupName: 'sort-direction-price',
    directions: [
      {
        label: (
          <>
            Low <ArrowRight size={14} className="inline mx-0.5" /> High
          </>
        ),
        order: 'asc',
      },
      {
        label: (
          <>
            High <ArrowRight size={14} className="inline mx-0.5" /> Low
          </>
        ),
        order: 'desc',
      },
    ],
  },
  {
    type: 'rating',
    label: 'Ratings',
    defaultOrder: 'desc',
    directionGroupName: 'sort-direction-rating',
    directions: [
      {
        label: (
          <>
            High <ArrowRight size={14} className="inline mx-0.5" /> Low
          </>
        ),
        order: 'desc',
      },
      {
        label: (
          <>
            Low <ArrowRight size={14} className="inline mx-0.5" /> High
          </>
        ),
        order: 'asc',
      },
    ],
  },
];
