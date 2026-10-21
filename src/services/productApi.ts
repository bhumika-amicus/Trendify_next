import type { Product } from '../types/Products';
import type { Category } from '../types/Categories';
import type { Brand } from '../types/Brands';
import type { ProductSearchParams } from '../types/ProductSearchParams';
import type { ProductSearchResult } from '../types/ProductSearchResult';
import type { CreateProductDto, UpdateProductDto } from '../types/ProductDto';

import { apiFetch } from './api';

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await apiFetch<ProductSearchResult>('/api/products?pageSize=8', {
    signal,
  });
  return data?.products || [];
}

export async function getProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product | undefined> {
  return apiFetch<Product>(`/api/products/${id}`, { signal });
}

export async function getCategories(
  signal?: AbortSignal
): Promise<Category[]> {
  const data = await apiFetch<Category[]>('/api/categories', {
    signal,
  });
  return data || [];
}

export async function getBrands(signal?: AbortSignal): Promise<Brand[]> {
  const data = await apiFetch<Brand[]>('/api/brands', {
    signal,
  });
  return data || [];
}

export async function searchProducts(
  params: ProductSearchParams,
  signal?: AbortSignal
): Promise<ProductSearchResult> {
  const queryParams = new URLSearchParams();

  const search = params.search?.trim();

  if (search) {
    queryParams.set('search', search);
  }

  if (params.categoryId !== undefined) {
    queryParams.set('categoryId', String(params.categoryId));
  }

  if (params.brandId !== undefined) {
    queryParams.set('brandId', String(params.brandId));
  }

  if (params.minPrice !== undefined) {
    queryParams.set('minPrice', String(params.minPrice));
  }

  if (params.maxPrice !== undefined) {
    queryParams.set('maxPrice', String(params.maxPrice));
  }

  if (params.minRating !== undefined) {
    queryParams.set('minRating', String(params.minRating));
  }

  if (params.sortBy) {
    queryParams.set('sortBy', params.sortBy);
  }

  if (params.sortOrder) {
    queryParams.set('sortOrder', params.sortOrder);
  }

  if (params.page !== undefined) {
    queryParams.set('page', String(params.page));
  }

  if (params.pageSize !== undefined) {
    queryParams.set('pageSize', String(params.pageSize));
  }

  const data = await apiFetch<ProductSearchResult>(
    `/api/products?${queryParams.toString()}`,
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

  return data;
}

export async function createProduct(
  product: CreateProductDto,
  signal?: AbortSignal
): Promise<Product | undefined> {
  return apiFetch<Product>('/api/products', {
    method: 'POST',
    auth: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
    signal,
  });
}

export async function updateProduct(
  id: number,
  product: UpdateProductDto,
  signal?: AbortSignal
): Promise<void> {
  await apiFetch<void>(`/api/products/${id}`, {
    method: 'PUT',
    auth: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
    signal,
  });
}

export async function deleteProduct(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  await apiFetch<void>(`/api/products/${id}`, {
    method: 'DELETE',
    auth: true,
    signal,
  });
}


