import { z } from 'zod';

/**
 * Zod schema for validating the Add to Cart action payload.
 */
export const AddToCartSchema = z.object({
  productId: z.coerce
    .number()
    .int('Product ID must be an integer.')
    .positive('Product ID must be positive.'),
  quantity: z.coerce
    .number()
    .int('Quantity must be an integer.')
    .min(1, 'Quantity must be at least 1.')
    .max(99, 'Quantity cannot exceed 99.')
    .default(1),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

/**
 * Zod schema for updating cart item quantity.
 * A quantity of 0 indicates the item should be removed.
 */
export const UpdateCartQuantitySchema = z.object({
  productId: z.coerce
    .number()
    .int('Product ID must be an integer.')
    .positive('Product ID must be positive.'),
  quantity: z.coerce
    .number()
    .int('Quantity must be an integer.')
    .min(0, 'Quantity cannot be negative.')
    .max(99, 'Quantity cannot exceed 99.'),
});

export type UpdateCartQuantityInput = z.infer<typeof UpdateCartQuantitySchema>;

/**
 * Zod schema for removing an item from the cart.
 */
export const RemoveCartItemSchema = z.object({
  productId: z.coerce
    .number()
    .int('Product ID must be an integer.')
    .positive('Product ID must be positive.'),
});

export type RemoveCartItemInput = z.infer<typeof RemoveCartItemSchema>;

/**
 * Zod schema for validating cart item structure stored in cookies.
 */
export const StoredCartItemSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1),
  price: z.number().nonnegative(),
  imageUrl: z.string().optional().default(''),
  quantity: z.number().int().min(1).max(99),
});

export const StoredCartSchema = z.array(StoredCartItemSchema);
