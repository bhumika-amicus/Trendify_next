import React, { type ReactNode } from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  href?: string;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
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
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs font-bold uppercase tracking-wide',
  md: 'px-6 py-2.5 text-sm font-bold',
  lg: 'px-8 py-3.5 text-base font-bold',
  icon: 'h-8 w-8 p-0 shrink-0 aspect-square',
};

/**
 * Universal Button Component.
 * Supports variants (primary, secondary, outline, danger, ghost),
 * sizes (sm, md, lg, icon), built-in loading states, and extends all native HTML button attributes.
 *
 * When an `href` prop is supplied, it automatically renders a semantic Next.js `<Link>`
 * avoiding invalid HTML5 interactive nesting (<Link><button>...</button></Link>).
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  href,
  prefetch,
  scroll,
  replace,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const combinedClasses = `inline-flex items-center justify-center border cursor-pointer transition-all duration-200 active:scale-98 focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-2 ${
    isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
  } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  const content = isLoading ? (
    <span className="flex items-center gap-2">
      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>{children}</span>
    </span>
  ) : (
    children
  );

  // 1. Semantic Link Mode
  if (href) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        scroll={scroll}
        replace={replace}
        aria-disabled={isDisabled}
        className={combinedClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  // 2. Semantic Button Mode
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
