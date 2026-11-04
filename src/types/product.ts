import type { PaginationMetadata } from './common';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  category: string;
  brandId: number;
  brand: string;
  rating: number;
}

/**
 * Raw upstream .NET API product DTO shape.
 */
export interface ProductDto {
  productId: number;
  name: string | null;
  description: string | null;
  categoryId: number;
  categoryName: string | null;
  brandId: number;
  brandName: string | null;
  price: number;
  rating: number;
}

export interface ProductInput {
  name: string;
  description?: string;
  price?: number;
  categoryId: number;
  brandId: number;
  rating?: number;
}

/**
 * Sorting keys and direction for products.
 */
export type ProductSortBy = 'name' | 'price' | 'rating';
export type SortOrder = 'asc' | 'desc';

/**
 * Parameters for searching, filtering, and paginating products.
 */
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

/**
 * Paginated product search results extending shared PaginationMetadata.
 */
export interface ProductSearchResult extends PaginationMetadata {
  products: Product[];
}

export interface ProductSearchResultDto extends PaginationMetadata {
  products: ProductDto[];
}

