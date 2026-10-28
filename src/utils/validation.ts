/**
 * Reusable validation utilities for authentication and form handling.
 * Used across Server Actions and Client Components to ensure consistent validation rules.
 */

export function validateEmail(email: string): string | undefined {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return undefined;
}

export function validatePassword(password: string, minLength = 6): string | undefined {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (!name || !name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  return undefined;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | undefined {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return undefined;
}
