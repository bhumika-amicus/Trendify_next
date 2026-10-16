import type { ProductSortBy, SortOrder } from './ProductSorting';

export interface ProductSearchParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}
