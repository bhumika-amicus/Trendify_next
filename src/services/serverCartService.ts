import { DOTNET_API_BASE_URL } from '@/config';

export interface BackendCartItemDto {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  itemSubtotal: number;
}

/**
 * Server-only service to communicate with the .NET Azure Cart API.
 * All calls require a valid JWT bearer token.
 */

export async function getBackendCart(token: string): Promise<BackendCartItemDto[]> {
  try {
    const res = await fetch(`${DOTNET_API_BASE_URL}/api/v1/cart`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[CART_API] getBackendCart returned status ${res.status}`);
      return [];
    }

    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as BackendCartItemDto[]) : [];
  } catch (error) {
    console.error('[CART_API] Error fetching backend cart:', error);
    return [];
  }
}

export async function addBackendCartItem(
  token: string,
  productId: number,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${DOTNET_API_BASE_URL}/api/v1/cart/items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.warn(`[CART_API] addBackendCartItem failed (${res.status}):`, errorText);
      return { success: false, error: 'Failed to add item to backend cart.' };
    }

    return { success: true };
  } catch (error) {
    console.error('[CART_API] Network error in addBackendCartItem:', error);
    return { success: false, error: 'Cart service unavailable.' };
  }
}

export async function updateBackendCartItem(
  token: string,
  productId: number,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${DOTNET_API_BASE_URL}/api/v1/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.warn(`[CART_API] updateBackendCartItem failed (${res.status}):`, errorText);
      return { success: false, error: 'Failed to update item quantity.' };
    }

    return { success: true };
  } catch (error) {
    console.error('[CART_API] Network error in updateBackendCartItem:', error);
    return { success: false, error: 'Cart service unavailable.' };
  }
}

export async function removeBackendCartItem(
  token: string,
  productId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${DOTNET_API_BASE_URL}/api/v1/cart/items/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.warn(`[CART_API] removeBackendCartItem failed (${res.status}):`, errorText);
      return { success: false, error: 'Failed to remove item.' };
    }

    return { success: true };
  } catch (error) {
    console.error('[CART_API] Network error in removeBackendCartItem:', error);
    return { success: false, error: 'Cart service unavailable.' };
  }
}

export async function clearBackendCart(token: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${DOTNET_API_BASE_URL}/api/v1/cart`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return { success: res.ok };
  } catch (error) {
    console.error('[CART_API] Network error in clearBackendCart:', error);
    return { success: false };
  }
}
