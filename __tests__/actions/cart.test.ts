import {
  addToCartAction,
  getCartCountAction,
  updateCartQuantityAction,
  removeCartItemAction,
  clearCartAction,
} from '@/actions/cart';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import * as serverCartService from '@/services/serverCartService';

// 1. Mock Next.js Server Primitives
jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

// 2. Mock external backend cart service
jest.mock('@/services/serverCartService', () => ({
  addBackendCartItem: jest.fn(),
  updateBackendCartItem: jest.fn(),
  removeBackendCartItem: jest.fn(),
  clearBackendCart: jest.fn(),
  getBackendCartCount: jest.fn(),
}));

// Clean Helper Utilities (Eliminates repeated cookie boilerplate)
const mockLoggedIn = (token = 'mock-session-token') =>
  (cookies as jest.Mock).mockResolvedValue({ get: () => ({ value: token }) });

const mockLoggedOut = () =>
  (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

describe('Cart Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCartAction', () => {
    it('returns requireAuth: true when user is logged out', async () => {
      mockLoggedOut();

      const result = await addToCartAction({ productId: 101, quantity: 1 });

      expect(result).toEqual({
        success: false,
        requireAuth: true,
        error: 'Please log in to add items to your cart.',
      });
      expect(serverCartService.addBackendCartItem).not.toHaveBeenCalled();
    });

    test.each([
      [{ productId: 101, quantity: 0 }, 'Quantity must be at least 1.'],
      [{ productId: 101, quantity: 150 }, 'Quantity cannot exceed 99.'],
      [{ productId: -5, quantity: 1 }, 'Product ID must be positive.'],
    ])('rejects invalid payload %p with "%s"', async (payload, expectedError) => {
      mockLoggedIn();
      const result = await addToCartAction(payload);

      expect(result).toEqual({ success: false, error: expectedError });
      expect(serverCartService.addBackendCartItem).not.toHaveBeenCalled();
    });

    it('successfully adds item, syncs with backend, and triggers revalidation', async () => {
      mockLoggedIn();
      (serverCartService.addBackendCartItem as jest.Mock).mockResolvedValue({ success: true });
      (serverCartService.getBackendCartCount as jest.Mock).mockResolvedValue(5);

      const result = await addToCartAction({ productId: 101, quantity: 2 });

      expect(result).toEqual({
        success: true,
        count: 5,
        message: 'Product added to cart successfully.',
      });
      expect(serverCartService.addBackendCartItem).toHaveBeenCalledWith(
        'mock-session-token',
        101,
        2
      );
      expect(revalidatePath).toHaveBeenCalledWith('/cart');
    });
  });

  describe('getCartCountAction', () => {
    it('returns 0 when session cookie is missing', async () => {
      mockLoggedOut();
      const count = await getCartCountAction();

      expect(count).toBe(0);
      expect(serverCartService.getBackendCartCount).not.toHaveBeenCalled();
    });

    it('returns fresh count from backend service when authenticated', async () => {
      mockLoggedIn();
      (serverCartService.getBackendCartCount as jest.Mock).mockResolvedValue(7);

      const count = await getCartCountAction();

      expect(count).toBe(7);
      expect(serverCartService.getBackendCartCount).toHaveBeenCalledWith('mock-session-token');
    });
  });

  describe('updateCartQuantityAction', () => {
    it('returns requireAuth: true when unauthenticated', async () => {
      mockLoggedOut();
      const result = await updateCartQuantityAction({ productId: 1, quantity: 3 });

      expect(result.requireAuth).toBe(true);
      expect(result.success).toBe(false);
    });

    it('updates item quantity when quantity is positive', async () => {
      mockLoggedIn();
      (serverCartService.updateBackendCartItem as jest.Mock).mockResolvedValue({ success: true });
      (serverCartService.getBackendCartCount as jest.Mock).mockResolvedValue(4);

      const result = await updateCartQuantityAction({ productId: 1, quantity: 4 });

      expect(result).toEqual({ success: true, count: 4 });
      expect(serverCartService.updateBackendCartItem).toHaveBeenCalledWith(
        'mock-session-token',
        1,
        4
      );
      expect(revalidatePath).toHaveBeenCalledWith('/cart');
    });

    it('removes item from backend when quantity is set to 0', async () => {
      mockLoggedIn();
      (serverCartService.removeBackendCartItem as jest.Mock).mockResolvedValue({ success: true });
      (serverCartService.getBackendCartCount as jest.Mock).mockResolvedValue(2);

      const result = await updateCartQuantityAction({ productId: 1, quantity: 0 });

      expect(result).toEqual({ success: true, count: 2 });
      expect(serverCartService.removeBackendCartItem).toHaveBeenCalledWith(
        'mock-session-token',
        1
      );
      expect(revalidatePath).toHaveBeenCalledWith('/cart');
    });
  });

  describe('removeCartItemAction', () => {
    it('returns requireAuth: true when unauthenticated', async () => {
      mockLoggedOut();
      const result = await removeCartItemAction({ productId: 1 });

      expect(result.requireAuth).toBe(true);
      expect(result.success).toBe(false);
    });

    it('removes item, refreshes count, and calls revalidatePath', async () => {
      mockLoggedIn();
      (serverCartService.removeBackendCartItem as jest.Mock).mockResolvedValue({ success: true });
      (serverCartService.getBackendCartCount as jest.Mock).mockResolvedValue(1);

      const result = await removeCartItemAction({ productId: 1 });

      expect(result).toEqual({ success: true, count: 1 });
      expect(serverCartService.removeBackendCartItem).toHaveBeenCalledWith(
        'mock-session-token',
        1
      );
      expect(revalidatePath).toHaveBeenCalledWith('/cart');
    });
  });

  describe('clearCartAction', () => {
    it('clears backend cart and triggers revalidatePath', async () => {
      mockLoggedIn();
      (serverCartService.clearBackendCart as jest.Mock).mockResolvedValue({ success: true });

      const result = await clearCartAction();

      expect(result).toEqual({ success: true, count: 0 });
      expect(serverCartService.clearBackendCart).toHaveBeenCalledWith('mock-session-token');
      expect(revalidatePath).toHaveBeenCalledWith('/cart');
    });
  });
});
