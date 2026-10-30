/**
 * Core Cart Entity and Order Summary types.
 */
export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  itemSubtotal: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  totalCount: number;
}
