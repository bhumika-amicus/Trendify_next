import { serverApiFetch } from './serverApi';
import type {
  CheckoutRequest,
  CheckoutResponse,
  MockPaymentRequest,
  MockPaymentResponse,
  OrderSummaryItem,
  OrderHistoryResponse,
  OrderDetail,
} from '@/types';


// Rejects unsupported / invalid statuses by returning undefined (defaults to all orders).
export function toBackendOrderStatus(status?: string): string | undefined {
  if (!status || status === 'all') return undefined;
  const lower = status.toLowerCase().trim();
  if (lower === 'processing' || lower === 'placed') return 'Placed';
  if (lower === 'shipped') return 'Shipped';
  if (lower === 'delivered') return 'Delivered';
  if (lower === 'cancelled') return 'Cancelled';

  return undefined;
}

export interface GetOrderHistoryOptions {
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface OrderHistoryResult extends OrderHistoryResponse {
  error?: string;
}

export async function getOrderHistoryServer(
  token?: string,
  options: GetOrderHistoryOptions = {}
): Promise<OrderHistoryResult> {
  // Default pageSize to 50 so full order history loads without premature clipping
  const { status, page = 1, pageSize = 50 } = options;

  if (!token) {
    return {
      orders: [],
      page,
      pageSize,
      totalRecords: 0,
      totalPages: 0,
      error: 'Authentication session required.',
    };
  }

  const backendStatus = toBackendOrderStatus(status);

  const query = new URLSearchParams();
  if (backendStatus) {
    query.set('status', backendStatus);
  }
  query.set('page', page.toString());
  query.set('pageSize', pageSize.toString());

  const res = await serverApiFetch<OrderHistoryResponse>(
    `/api/v1/orders/history?${query.toString()}`,
    {
      method: 'GET',
      token,
      cache: 'no-store',
    }
  );

  if (!res.ok || !res.data) {
    const errorMsg = res.error || 'Failed to load order history from server.';
    console.warn('[ORDER_API] getOrderHistory failed:', errorMsg);
    return {
      orders: [],
      page,
      pageSize,
      totalRecords: 0,
      totalPages: 0,
      error: errorMsg,
    };
  }

  const orders = Array.isArray(res.data.orders)
    ? [...res.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    : [];

  return {
    ...res.data,
    orders,
  };
}

export interface OrderDetailResult {
  success: boolean;
  order?: OrderDetail | null;
  error?: string;
}

export async function getOrderDetailServer(
  token: string,
  orderId: number
): Promise<OrderDetailResult> {
  if (!token) {
    return { success: false, error: 'Authentication session required.' };
  }
  if (!orderId || orderId <= 0) {
    return { success: false, error: 'Invalid order reference.' };
  }

  const res = await serverApiFetch<OrderDetail>(`/api/v1/orders/${orderId}`, {
    method: 'GET',
    token,
    cache: 'no-store',
  });

  if (!res.ok || !res.data) {
    const errorMsg = res.error || `Order #${orderId} could not be found.`;
    console.warn(`[ORDER_API] getOrderDetail failed for order #${orderId}:`, errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }

  return {
    success: true,
    order: res.data,
  };
}

export interface ReorderResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function reorderOrderServer(
  token: string,
  orderId: number
): Promise<ReorderResponse> {
  if (!token || !orderId || orderId <= 0) {
    return { success: false, error: 'Invalid order reference or session.' };
  }

  const res = await serverApiFetch<{ message: string }>(
    `/api/v1/orders/${orderId}/reorder`,
    {
      method: 'POST',
      token,
    }
  );

  if (!res.ok) {
    return {
      success: false,
      error: res.error || 'Failed to reorder items. Some products may be unavailable.',
    };
  }

  return {
    success: true,
    message: res.data?.message || 'Items added back to your cart successfully.',
  };
}

export async function getRecentOrdersServer(
  token?: string,
  limit = 3
): Promise<OrderSummaryItem[] | null> {
  if (!token) return [];

  const res = await serverApiFetch<OrderHistoryResponse>(
    `/api/v1/orders/history?pageSize=${limit}&page=1`,
    {
      method: 'GET',
      token,
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    console.error('[ORDER_API] getRecentOrdersServer failed:', res.error);
    return null;
  }

  return Array.isArray(res.data?.orders) ? res.data.orders : [];
}

export async function createCheckoutServer(
  token: string,
  checkoutData: CheckoutRequest
): Promise<CheckoutResponse | null> {
  const res = await serverApiFetch<CheckoutResponse>('/api/v1/checkout', {
    method: 'POST',
    token,
    body: checkoutData,
  });

  if (res.ok && res.data) {
    return res.data;
  }

  if (res.data) {
    return {
      ...res.data,
      message: res.error || res.data.message,
    };
  }

  if (res.error) {
    console.warn('[CHECKOUT_API] createCheckout failed:', res.error);
  }

  return null;
}

export async function processMockPaymentServer(
  token: string,
  paymentData: MockPaymentRequest
): Promise<MockPaymentResponse | null> {
  const res = await serverApiFetch<MockPaymentResponse>('/api/payments/mock', {
    method: 'POST',
    token,
    body: paymentData,
  });

  if (res.ok && res.data) {
    return res.data;
  }

  if (res.data) {
    return {
      ...res.data,
      message: res.error || res.data.message,
    };
  }

  if (res.error) {
    console.warn('[PAYMENT_API] processMockPayment failed:', res.error);
  }

  return null;
}
