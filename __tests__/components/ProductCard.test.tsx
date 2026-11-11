import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '@/components/product/ProductCard';
import * as cartActions from '@/actions/cart';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

// 1. Mock Next.js navigation router specifically for redirect assertions
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/products',
  useSearchParams: () => new URLSearchParams(),
}));

// 2. Mock Cart Context actions hook
const mockSetCartCount = jest.fn();
jest.mock('@/context/CartContext', () => ({
  useCartActions: () => ({
    setCartCount: mockSetCartCount,
    refreshCartCount: jest.fn(),
    resetCart: jest.fn(),
  }),
}));

// 3. Mock Server Action addToCartAction
jest.mock('@/actions/cart', () => ({
  addToCartAction: jest.fn(),
}));

// 4. Mock toast notifications
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockProduct: Product = {
  id: 101,
  name: 'Wireless Noise-Canceling Headphones',
  description: 'Premium wireless headphones with crystal sound.',
  price: 2999,
  imageUrl: 'https://images.example.com/headphones.jpg',
  categoryId: 1,
  category: 'Electronics',
  brandId: 2,
  brand: 'AudioTech',
  rating: 4.5,
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Accessible Queries (getByRole, getByText)
  it('renders product details using accessible roles', () => {
    render(<ProductCard product={mockProduct} />);

    // Accessible Heading: <h2> with the product name
    const heading = screen.getByRole('heading', {
      level: 2,
      name: /wireless noise-canceling headphones/i,
    });
    expect(heading).toBeInTheDocument();

    // Accessible Button: "ADD TO CART"
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();

    // Accessible Quantity input
    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    expect(quantityInput).toHaveValue(1);

    // Formatted price display
    expect(screen.getByText(/₹2,999/)).toBeInTheDocument();
  });

  // Test 2: User Interaction (Quantity Increment)
  it('increments quantity and updates formatted total price', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    const increaseBtn = screen.getByRole('button', { name: /increase quantity/i });
    await user.click(increaseBtn);

    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    expect(quantityInput).toHaveValue(2);

    // Total price updates: 2999 * 2 = 5,998
    expect(screen.getByText(/₹5,998/)).toBeInTheDocument();
  });

  // Test 3: User Interaction (Quantity Decrement Disabled at Minimum)
  it('disables decrease button when quantity is at minimum (1)', () => {
    render(<ProductCard product={mockProduct} />);

    const decreaseBtn = screen.getByRole('button', { name: /decrease quantity/i });
    expect(decreaseBtn).toBeDisabled();
  });

  // Test 4: Submitting Add to Cart (Interaction + Server Action)
  it('calls addToCartAction with productId and quantity on button click', async () => {
    const user = userEvent.setup();
    (cartActions.addToCartAction as jest.Mock).mockResolvedValueOnce({
      success: true,
      count: 3,
    });

    render(<ProductCard product={mockProduct} />);

    // Increment to 2
    const increaseBtn = screen.getByRole('button', { name: /increase quantity/i });
    await user.click(increaseBtn);

    // Click Add to Cart
    const addToCartBtn = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addToCartBtn);

    expect(cartActions.addToCartAction).toHaveBeenCalledWith({
      productId: 101,
      quantity: 2,
    });

    await waitFor(() => {
      expect(mockSetCartCount).toHaveBeenCalledWith(3);
      expect(toast.success).toHaveBeenCalledWith(
        'Wireless Noise-Canceling Headphones added to cart!'
      );
    });
  });

  // Test 5: Authentication Guard (Redirect when requireAuth is returned)
  it('redirects user to login when server action requires authentication', async () => {
    const user = userEvent.setup();
    (cartActions.addToCartAction as jest.Mock).mockResolvedValueOnce({
      success: false,
      requireAuth: true,
      error: 'Please log in to add items to your cart.',
    });

    render(<ProductCard product={mockProduct} />);

    const addToCartBtn = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addToCartBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please log in to add items to your cart.');
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/login?callbackUrl='));
    });
  });
});

