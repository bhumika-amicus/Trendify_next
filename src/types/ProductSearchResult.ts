import type { Product } from './product';

export interface ProductSearchResult {
  products: Product[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
