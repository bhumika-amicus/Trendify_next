import { type ReactNode, type HTMLAttributes } from 'react';

export type CardVariant = 'elevated' | 'bordered' | 'flat';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  as?: 'div' | 'article' | 'section';
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  elevated: 'bg-white shadow-elevated',
  bordered: 'border border-border-subtle bg-white',
  flat: 'bg-surface-muted',
};

/**
 * Card Component (React Server Component)
 * Pure presentation wrapper that requires no client-side JavaScript.
 * Supports variants, smooth hover micro-animations, semantic tags, and all HTML div attributes.
 */
export default function Card({
  variant = 'elevated',
  hoverable = false,
  as: Component = 'div',
  className = '',
  children,
  ...props
}: CardProps) {
  const hoverStyles = hoverable
    ? 'cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg'
    : '';

  return (
    <Component
      className={`rounded flex flex-col h-full overflow-hidden ${variantStyles[variant]} ${hoverStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
