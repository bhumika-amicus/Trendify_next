import type { ProductDto } from './ProductDto';

export interface ProductSearchResultDto {
  products: ProductDto[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
