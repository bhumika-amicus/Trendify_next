export const ProductSortBy = {
  Name: 'name',
  Price: 'price',
  Rating: 'rating',
} as const;

export type ProductSortBy = (typeof ProductSortBy)[keyof typeof ProductSortBy];

export const SortOrder = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
