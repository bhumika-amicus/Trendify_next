
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

export interface PaginatedResult<T> extends PaginationMetadata {
  products: T[];
}
