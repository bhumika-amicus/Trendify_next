/**
 * Common shared entity types and generic utilities.
 */

export interface Category {
  categoryId: number;
  name: string;
}

export interface Brand {
  brandId: number;
  name: string;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

