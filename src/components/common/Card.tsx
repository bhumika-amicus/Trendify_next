import { type ReactNode } from 'react';

export type CardVariant = 'elevated' | 'bordered' | 'flat';

export interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  elevated: 'bg-white shadow-elevated',
  bordered: 'border border-border-subtle bg-white',
  flat: 'bg-surface-muted',
};

/**
 * Card Component (React Server Component)
 * Pure presentation wrapper that requires no client-side JavaScript.
 */
export default function Card({ variant = 'elevated', children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded flex flex-col h-full overflow-hidden ${variantStyles[variant]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
