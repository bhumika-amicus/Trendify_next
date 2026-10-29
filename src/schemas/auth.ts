import { z } from 'zod';

/**
 * Zod validation schema for customer login.
 * Inferred types ensure compile-time and runtime safety across Server Actions.
 */
export const LoginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Password is required.'),
  callbackUrl: z
    .string()
    .optional()
    .default('/'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Zod validation schema for customer registration.
 * Includes cross-field refinement to guarantee password confirmation matches.
 */
export const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Full name is required.')
      .min(2, 'Full name must be at least 2 characters.'),
    email: z.email('Please enter a valid email address.'),
    password: z
      .string()
      .min(1, 'Password is required.')
      .min(6, 'Password must be at least 6 characters long.'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
