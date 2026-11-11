import { addToCartAction } from '@/actions/cart';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import * as serverCartService from '@/services/serverCartService';

// 1. Mock Next.js Server Primitives
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// 2. Mock external backend cart service calls
jest.mock('@/services/serverCartService', () => ({
  addBackendCartItem: jest.fn(),
  getBackendCartCount: jest.fn(),
}));

describe('addToCartAction Server Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Invalid Case - Missing Authentication
  it('returns requireAuth: true when user has no session cookie', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await addToCartAction({ productId: 101, quantity: 1 });

    expect(result).toEqual({
      success: false,
      requireAuth: true,
      error: 'Please log in to add items to your cart.',
    });
    // Ensure backend service was NEVER contacted
    expect(serverCartService.addBackendCartItem).not.toHaveBeenCalled();
  });

  // Test 2: Invalid Case - Schema Validation Error (Quantity < 1)
  it('rejects payload when quantity is zero or negative', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'mock-session-token' }),
    });

    const result = await addToCartAction({ productId: 101, quantity: 0 });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Quantity must be at least 1.');
    expect(serverCartService.addBackendCartItem).not.toHaveBeenCalled();
  });

  // Test 3: Invalid Case - Schema Validation Error (Quantity > 99)
  it('rejects payload when quantity exceeds maximum limit of 99', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'mock-session-token' }),
    });

    const result = await addToCartAction({ productId: 101, quantity: 150 });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Quantity cannot exceed 99.');
    expect(serverCartService.addBackendCartItem).not.toHaveBeenCalled();
  });

  // Test 4: Invalid Case - Schema Validation Error (Invalid Product ID)
  it('rejects payload when productId is not a positive integer', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'mock-session-token' }),
    });

    const result = await addToCartAction({ productId: -5, quantity: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Product ID must be positive.');
    expect(serverCartService.addBackendCartItem).not.toHaveBeenCalled();
  });

  // Test 5: Valid Case - Successful Add to Cart (Happy Path)
  it('successfully adds item, syncs with backend, triggers revalidatePath, and returns fresh count', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'mock-session-token' }),
    });

    (serverCartService.addBackendCartItem as jest.Mock).mockResolvedValue({
      success: true,
    });
    (serverCartService.getBackendCartCount as jest.Mock).mockResolvedValue(5);

    const result = await addToCartAction({ productId: 101, quantity: 2 });

    expect(result).toEqual({
      success: true,
      count: 5,
      message: 'Product added to cart successfully.',
    });

    // Verify correct parameters forwarded to backend service
    expect(serverCartService.addBackendCartItem).toHaveBeenCalledWith(
      'mock-session-token',
      101,
      2
    );

    // Verify Next.js cache revalidation was triggered for the cart path
    expect(revalidatePath).toHaveBeenCalledWith('/cart');
  });
});

