import { z } from 'zod';

/**
 * Valid shipping speed identifiers.
 */
export const ShippingMethodEnum = z.enum(['standard', 'express', 'overnight']);
export type ShippingMethod = z.infer<typeof ShippingMethodEnum>;

/**
 * Valid payment method identifiers.
 */
export const PaymentMethodEnum = z.enum(['cod', 'card', 'upi']);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

/**
 * Shipping rates mapped in Rupees (INR).
 * Standard: ₹100, Express: ₹250, Overnight: ₹400.
 */
export const SHIPPING_RATES: Record<ShippingMethod, number> = {
  standard: 100,
  express: 250,
  overnight: 400,
};

export interface ShippingOption {
  id: ShippingMethod;
  title: string;
  desc: string;
  price: number;
}

export const SHIPPING_OPTIONS: readonly ShippingOption[] = [
  {
    id: 'standard',
    title: 'Standard Shipping',
    desc: 'Delivered in 5–7 business days',
    price: SHIPPING_RATES.standard,
  },
  {
    id: 'express',
    title: 'Express Shipping',
    desc: 'Delivered in 2–3 business days',
    price: SHIPPING_RATES.express,
  },
  {
    id: 'overnight',
    title: 'Overnight Delivery',
    desc: 'Delivered next business day',
    price: SHIPPING_RATES.overnight,
  },
] as const;

// Schema for Step 1: Contact Information and Shipping Address.

export const ShippingAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .min(3, 'Full name must be at least 3 characters.')
    .max(50, 'Full name must be 50 characters or less.'),

  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required.')
    .regex(
      /^[+]?[\d\s-]{7,17}$/,
      'Please enter a valid phone number (e.g. +91 9876543210 or 10 digits).'
    ),

  address: z
    .string()
    .trim()
    .min(1, 'Street address is required.')
    .min(5, 'Please enter a complete street address.'),

  apartment: z
    .string()
    .trim()
    .optional()
    .default(''),

  city: z
    .string()
    .trim()
    .min(1, 'City is required.'),

  state: z
    .string()
    .trim()
    .min(1, 'State is required.'),

  postalCode: z
    .string()
    .trim()
    .min(1, 'ZIP / Postal code is required.')
    .min(3, 'Postal code must be at least 3 characters.')
    .max(10, 'Postal code cannot exceed 10 characters.')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Please enter a valid postal / ZIP code.'),

  country: z
    .string()
    .trim()
    .min(1, 'Country is required.')
    .default('India'),

  shippingMethod: ShippingMethodEnum.default('standard'),
});

export type ShippingAddressFormData = z.infer<typeof ShippingAddressSchema>;


export const PlaceOrderSchema = ShippingAddressSchema.extend({
  paymentMethod: PaymentMethodEnum.default('cod'),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderSchema>;
