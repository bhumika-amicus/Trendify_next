'use client';

import React, { type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
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
};

export default function Button({
  variant = 'primary',
  children,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center px-6 py-3 border text-sm font-bold cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-2 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
