import { serverApiFetch } from './serverApi';
import type {
  CheckoutRequest,
  CheckoutResponse,
  MockPaymentRequest,
  MockPaymentResponse,
  OrderSummaryItem,
  OrderHistoryResponse,
} from '@/types';

export async function getRecentOrdersServer(
  token?: string,
  limit = 3
): Promise<OrderSummaryItem[]> {
  if (!token) return [];

  const res = await serverApiFetch<OrderHistoryResponse>(
    `/api/v1/orders/history?pageSize=${limit}&page=1`,
    {
      method: 'GET',
      token,
      cache: 'no-store',
    }
  );

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
