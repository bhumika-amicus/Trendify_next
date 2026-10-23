import type { Product } from './Products';

export interface ProductSearchResult {
  products: Product[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
