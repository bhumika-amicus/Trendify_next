import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductSortBy, SortOrder } from '@/types';

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
    type: ProductSortBy.Name,
    label: 'Name',
    defaultOrder: SortOrder.Asc,
    directionGroupName: 'sort-direction-name',
    directions: [
      {
        label: (
          <>
            A <ArrowRight size={14} className="inline mx-0.5" /> Z
          </>
        ),
        order: SortOrder.Asc,
      },
      {
        label: (
          <>
            Z <ArrowRight size={14} className="inline mx-0.5" /> A
          </>
        ),
        order: SortOrder.Desc,
      },
    ],
  },
  {
    type: ProductSortBy.Price,
    label: 'Price',
    defaultOrder: SortOrder.Asc,
    directionGroupName: 'sort-direction-price',
    directions: [
      {
        label: (
          <>
            Low <ArrowRight size={14} className="inline mx-0.5" /> High
          </>
        ),
        order: SortOrder.Asc,
      },
      {
        label: (
          <>
            High <ArrowRight size={14} className="inline mx-0.5" /> Low
          </>
        ),
        order: SortOrder.Desc,
      },
    ],
  },
  {
    type: ProductSortBy.Rating,
    label: 'Ratings',
    defaultOrder: SortOrder.Desc,
    directionGroupName: 'sort-direction-rating',
    directions: [
      {
        label: (
          <>
            High <ArrowRight size={14} className="inline mx-0.5" /> Low
          </>
        ),
        order: SortOrder.Desc,
      },
      {
        label: (
          <>
            Low <ArrowRight size={14} className="inline mx-0.5" /> High
          </>
        ),
        order: SortOrder.Asc,
      },
    ],
  },
];
