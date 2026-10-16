import {
  transformCategory,
  transformProduct,
  transformBrand,
} from '../utils/apiUtils';
import type { ProductDto } from '../types/ProductDto';
import type { Product } from '../types/Products';
import type { CategoryDto } from '../types/CategoryDto';
import type { Category } from '../types/Categories';
import type { BrandDto } from '../types/BrandDto';
import type { Brand } from '../types/Brands';
import type { ProductSearchParams } from '../types/ProductSearchParams';
import type { ProductSearchResultDto } from '../types/ProductSearchResultDto';
import type { ProductSearchResult } from '../types/ProductSearchResult';

import { apiFetch } from './api';

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await apiFetch<ProductDto[]>('/api/v1/Products', { signal });
  return data ? data.map(transformProduct) : [];
}

export async function getProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product | undefined> {
  const data = await apiFetch<ProductDto>(`/api/v1/Products/${id}`, { signal });
  return data ? transformProduct(data) : undefined;
}

export async function getCategories(
  signal?: AbortSignal
): Promise<Category[]> {
  const data = await apiFetch<CategoryDto[]>('/api/Categories?api-version=1', {
    signal,
  });
  return data ? data.map(transformCategory) : [];
}

export async function getBrands(signal?: AbortSignal): Promise<Brand[]> {
  const data = await apiFetch<BrandDto[]>('/api/Brands?api-version=1', {
    signal,
  });
  return data ? data.map(transformBrand) : [];
}

export async function searchProducts(
  params: ProductSearchParams,
  signal?: AbortSignal
): Promise<ProductSearchResult> {
  const queryParams = new URLSearchParams();

  const search = params.search?.trim();

  if (search) {
    queryParams.set('Search', search);
  }

  if (params.categoryId !== undefined) {
    queryParams.set('CategoryId', String(params.categoryId));
  }

  if (params.brandId !== undefined) {
    queryParams.set('BrandId', String(params.brandId));
  }

  if (params.minPrice !== undefined) {
    queryParams.set('MinPrice', String(params.minPrice));
  }

  if (params.maxPrice !== undefined) {
    queryParams.set('MaxPrice', String(params.maxPrice));
  }

  if (params.minRating !== undefined) {
    queryParams.set('MinRating', String(params.minRating));
  }

  if (params.sortBy) {
    queryParams.set('SortBy', params.sortBy);
  }

  if (params.sortOrder) {
    queryParams.set('SortOrder', params.sortOrder);
  }

  if (params.page !== undefined) {
    queryParams.set('Page', String(params.page));
  }

  if (params.pageSize !== undefined) {
    queryParams.set('PageSize', String(params.pageSize));
  }

  const data = await apiFetch<ProductSearchResultDto>(
    `/api/v1/Products/search?${queryParams.toString()}`,
    { signal }
  );

  if (!data) {
    return {
      products: [],
      totalRecords: 0,
      totalPages: 0,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    };
  }

  return {
    ...data,
    products: data.products.map(transformProduct),
  };
}
