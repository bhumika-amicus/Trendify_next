import type { ShippingMethod, PaymentMethod } from '@/schemas/checkout';
import type { PaginationMetadata } from './common';

export interface Address {
  addressId: number;
  customerId?: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type CreateAddressInput = Omit<Address, 'addressId' | 'customerId'>;

//Payload for updating an address. Any subset of user-editable fields.

export type UpdateAddressInput = Partial<CreateAddressInput>;

export interface CreateAddressResponse {
  addressId: number;
  message?: string;
}

export interface CheckoutRequest {
  addressId: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
}

export interface StockIssueItem {
  productId: number;
  productName?: string;
  requestedQuantity?: number;
  availableQuantity?: number;
  message?: string;
}

export interface PriceChangeItem {
  productId: number;
  productName?: string;
  oldPrice?: number;
  newPrice?: number;
  message?: string;
}

export interface CheckoutResponse {
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  priceChanges: PriceChangeItem[];
  stockIssues: StockIssueItem[];
  orderId: number | null;
  message?: string;
}

export interface MockPaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
}

export interface MockPaymentResponse {
  orderId: number;
  paymentStatus: 'Success' | 'Failed';
  transactionReference: string;
  amount: number;
  message?: string;
}

export interface OrderSummaryItem {
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

export interface OrderHistoryResponse extends PaginationMetadata {
  orders: OrderSummaryItem[];
}

