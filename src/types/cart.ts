
export interface CartItem {
  cartItemId?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  itemSubtotal: number;
  imageUrl?: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  totalCount: number;
}
