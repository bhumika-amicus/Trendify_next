import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartView from '@/components/cart/CartView';
import * as cartActions from '@/actions/cart';
import type { CartItem } from '@/types';
import toast from 'react-hot-toast';

// 1. Mock Navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/cart',
  useSearchParams: () => new URLSearchParams(),
}));

// 2. Mock CartContext
const mockSetCartCount = jest.fn();
jest.mock('@/context/CartContext', () => ({
  useCartActions: () => ({
    setCartCount: mockSetCartCount,
    refreshCartCount: jest.fn(),
    resetCart: jest.fn(),
  }),
}));

// 3. Mock Server Actions
jest.mock('@/actions/cart', () => ({
  updateCartQuantityAction: jest.fn(),
  removeCartItemAction: jest.fn(),
}));

describe('CartView Component', () => {
  const sampleItems: CartItem[] = [
    {
      productId: 1,
      productName: 'Mechanical Keyboard',
      price: 2000,
      quantity: 2,
      itemSubtotal: 4000,
      imageUrl: '/keyboard.jpg',
    },
    {
      productId: 2,
      productName: 'Wireless Mouse',
      price: 1000,
      quantity: 1,
      itemSubtotal: 1000,
      imageUrl: '/mouse.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Empty state
  it('renders empty state message with browse products link when cart is empty', () => {
    render(<CartView items={[]} />);

    // Accessible Heading: "Your Cart is Empty"
    expect(
      screen.getByRole('heading', { level: 3, name: /your cart is empty/i })
    ).toBeInTheDocument();

    // Accessible Link: "Browse Products" with href="/products"
    const browseLink = screen.getByRole('link', { name: /browse products/i });
    expect(browseLink).toBeInTheDocument();
    expect(browseLink).toHaveAttribute('href', '/products');
  });

  // Test 2: Renders cart items list and summary with accurate subtotal
  it('renders cart items list and order summary with calculated totals', () => {
    render(<CartView items={sampleItems} />);

    // Page Heading: "Shopping Cart (3 Items)"
    expect(
      screen.getByRole('heading', { level: 1, name: /shopping cart \(3 items\)/i })
    ).toBeInTheDocument();

    // Both product names rendered
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();

    // Subtotal: (2000*2) + 1000 = ₹5,000
    expect(screen.getByText(/₹5,000/)).toBeInTheDocument();

    // Order summary header
    expect(screen.getByText('ORDER SUMMARY')).toBeInTheDocument();
  });

  // Test 3: Updates quantity via updateCartQuantityAction
  it('triggers updateCartQuantityAction when quantity is incremented', async () => {
    const user = userEvent.setup();
    (cartActions.updateCartQuantityAction as jest.Mock).mockResolvedValueOnce({
      success: true,
      count: 4,
    });

    render(<CartView items={sampleItems} />);

    // Find all increase buttons; click the first one (for Mechanical Keyboard)
    const increaseButtons = screen.getAllByRole('button', { name: /increase quantity/i });
    await user.click(increaseButtons[0]);

    // Mechanical Keyboard originally had quantity 2, so incrementing should request quantity 3
    expect(cartActions.updateCartQuantityAction).toHaveBeenCalledWith({
      productId: 1,
      quantity: 3,
    });
  });

  // Test 4: Removes item via removeCartItemAction
  it('triggers removeCartItemAction when remove button is clicked', async () => {
    const user = userEvent.setup();
    (cartActions.removeCartItemAction as jest.Mock).mockResolvedValueOnce({
      success: true,
      count: 1,
    });

    render(<CartView items={sampleItems} />);

    // Find the specific accessible remove button for Mechanical Keyboard
    const removeBtn = screen.getByRole('button', {
      name: /remove mechanical keyboard from cart/i,
    });
    await user.click(removeBtn);

    expect(cartActions.removeCartItemAction).toHaveBeenCalledWith({
      productId: 1,
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Mechanical Keyboard removed from cart',
        expect.any(Object)
      );
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  // Test 5: Handles auth requirement by redirecting to login
  it('redirects user to login when updating quantity requires authentication', async () => {
    const user = userEvent.setup();
    (cartActions.updateCartQuantityAction as jest.Mock).mockResolvedValueOnce({
      success: false,
      requireAuth: true,
      error: 'Please log in to manage your cart.',
    });

    render(<CartView items={sampleItems} />);

    const increaseButtons = screen.getAllByRole('button', { name: /increase quantity/i });
    await user.click(increaseButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please log in to manage your cart.');
      expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=/cart');
    });
  });
});

