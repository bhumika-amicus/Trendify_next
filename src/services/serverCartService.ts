import { serverApiFetch } from './serverApi';
import type { BackendCartItemDto } from '@/types';

export async function getBackendCart(token: string): Promise<BackendCartItemDto[]> {
  const res = await serverApiFetch<BackendCartItemDto[]>('/api/v1/cart', {
    method: 'GET',
    token,
    cache: 'no-store',
  });

  return Array.isArray(res.data) ? res.data : [];
}

export async function getBackendCartCount(token: string): Promise<number> {
  const res = await serverApiFetch<{ itemCount?: number }>('/api/v1/cart/count', {
    method: 'GET',
    token,
    cache: 'no-store',
  });

  if (res.ok && res.data && typeof res.data.itemCount === 'number') {
    return res.data.itemCount;
  }
  return 0;
}

export async function addBackendCartItem(
  token: string,
  productId: number,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  const res = await serverApiFetch<unknown>('/api/v1/cart/items', {
    method: 'POST',
    token,
    body: { productId, quantity },
  });

  return {
    success: res.ok,
    error: res.ok
      ? undefined
      : res.error || 'Failed to add item to cart. Please check stock availability.',
  };
}

export async function updateBackendCartItem(
  token: string,
  productId: number,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  const res = await serverApiFetch<unknown>(`/api/v1/cart/items/${productId}`, {
    method: 'PUT',
    token,
    body: { quantity },
  });

  return {
    success: res.ok,
    error: res.ok ? undefined : res.error || 'Failed to update item quantity.',
  };
}

export async function removeBackendCartItem(
  token: string,
  productId: number
): Promise<{ success: boolean; error?: string }> {
  const res = await serverApiFetch<unknown>(`/api/v1/cart/items/${productId}`, {
    method: 'DELETE',
    token,
  });

  return {
    success: res.ok,
    error: res.ok ? undefined : res.error || 'Failed to remove item.',
  };
}

export async function clearBackendCart(token: string): Promise<{ success: boolean }> {
  const res = await serverApiFetch<unknown>('/api/v1/cart', {
    method: 'DELETE',
    token,
  });

  return { success: res.ok };
}
