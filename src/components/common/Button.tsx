'use client';

import React, { type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-orange text-white border-brand-orange hover:bg-brand-orange-hover hover:border-brand-orange-hover hover:shadow-[0_4px_10px_rgba(255,79,10,0.25)]',
  secondary:
    'bg-white text-text-body border-text-muted hover:bg-text-body hover:text-white hover:border-text-body',
  outline:
    'bg-transparent text-brand-orange border-brand-orange hover:bg-brand-orange hover:text-white',
  danger:
    'bg-status-danger text-white border-status-danger hover:bg-red-700 hover:border-red-700',
  ghost:
    'bg-transparent text-gray-700 border-transparent hover:bg-orange-50 hover:text-brand-orange',
  link:
    'bg-transparent text-brand-orange border-transparent p-0 h-auto hover:underline font-semibold',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
  icon: 'h-8 w-8 p-0 shrink-0 aspect-square',
};

/**
 * Universal Button Component.
 * Supports variants (primary, secondary, outline, danger, ghost, link),
 * sizes (sm, md, lg, icon), built-in loading states, and extends all native HTML button attributes.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  type = 'button',
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isLink = variant === 'link';
  const sizeClass = isLink
    ? size === 'sm'
      ? 'text-xs'
      : size === 'lg'
        ? 'text-base'
        : 'text-sm'
    : sizeStyles[size];

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center border font-bold cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-2 ${
        isLink ? '' : 'active:scale-98'
      } disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
