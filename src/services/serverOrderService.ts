import { DOTNET_API_BASE_URL } from '@/config';

export interface OrderSummaryItemDto {
  orderId: number;
  customerId: number;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  createdBy?: number;
  updatedAt?: string | null;
  updatedBy?: number | null;
}

export interface OrderHistoryResponse {
  orders: OrderSummaryItemDto[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

/**
 * Server-side helper to fetch recent order history for the authenticated user.
 * Simulates network latency (2500ms) to clearly demonstrate Next.js streaming with Suspense.
 */
export async function getRecentOrdersServer(
  token?: string,
  limit = 3
): Promise<OrderSummaryItemDto[]> {
  if (!token) return [];

  // ⏱️ SIMULATE SLOW DATA (2.5 seconds) to demonstrate Suspense streaming
  await new Promise((resolve) => setTimeout(resolve, 2500));

  try {
    const response = await fetch(
      `${DOTNET_API_BASE_URL}/api/v1/orders/history?pageSize=${limit}&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(`[ORDERS] Request failed with upstream status [${response.status}]`);
      return [];
    }

    const data: OrderHistoryResponse = await response.json();
    return Array.isArray(data?.orders) ? data.orders : [];
  } catch (error) {
    console.error('[ORDERS] Error fetching orders on server:', error);
    return [];
  }
}
