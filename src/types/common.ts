/**
 * Common shared entity types and generic utilities.
 */

export interface Category {
  id: number;
  name: string;
  slug?: string;
  icon?: string;
}

export interface CategoryDto {
  categoryId: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface BrandDto {
  brandId: number;
  name: string;
}

/**
 * Generic pagination wrapper for lists of data (Products, Orders, etc.)
 */
export interface PaginatedResult<T> {
  products: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
