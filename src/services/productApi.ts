import type { Product } from '../types/Products';
import type { CreateProductDto, UpdateProductDto } from '../types/ProductDto';

import { apiFetch } from './api';

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


