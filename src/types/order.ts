import type { ShippingMethod, PaymentMethod } from '@/schemas/checkout';

export interface AddressDto {
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

export interface CreateAddressRequest {
  addressId?: number;
  customerId?: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

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

export interface OrderItemDetail {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  itemSubtotal: number;
}

export interface OrderShippingDetail {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingMethod: string;
  shippingCharge: number;
}

export interface OrderPaymentDetail {
  paymentId: number;
  orderId: number;
  paymentStatus: string;
  paymentMethod: string | null;
  amount: number;
  transactionReference: string;
  createdAt: string;
}

export interface OrderDetailDto {
  orderId: number;
  customerId: number;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  items: OrderItemDetail[];
  shipping: OrderShippingDetail;
  payment: OrderPaymentDetail | null;
}
