import type { ReactNode } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, PackageOpen, Info } from 'lucide-react';
import Button, { type ButtonVariant } from './Button';

export interface StateMessageProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonVariant?: ButtonVariant;
  onAction?: () => void;
  actionHref?: string;
  children?: ReactNode;
  className?: string;
  variant?: 'error' | 'empty' | 'info';
  compact?: boolean;
}

export default function StateMessage({
  title,
  message,
  buttonText,
  buttonVariant = 'primary',
  onAction,
  actionHref,
  children,
  className = '',
  variant = 'error',
  compact = false,
}: StateMessageProps) {
  const iconConfig = {
    error: {
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      badge: 'bg-red-50 text-red-600',
    },
    empty: {
      icon: <PackageOpen className="h-6 w-6 text-brand-orange" />,
      badge: 'bg-orange-50 text-brand-orange',
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-500" />,
      badge: 'bg-blue-50 text-blue-600',
    },
  }[variant];

  return (
    <div
      className={`mx-auto flex w-full max-w-xl flex-col items-center justify-center text-center transition-all ${
        compact ? 'py-6 px-4' : 'py-8 px-6 sm:px-10 my-2'
      } ${className}`.trim()}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconConfig.badge}`}
      >
        {iconConfig.icon}
      </div>

      <h3 className="mb-2 text-lg font-bold text-gray-900 md:text-xl">
        {title}
      </h3>

      <p className="mb-5 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
        {message}
      </p>

      {children}

      {buttonText && actionHref && (
        <Link href={actionHref}>
          <Button
            variant={buttonVariant}
            className="mt-2 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all hover:shadow-xs"
          >
            <RefreshCw size={14} className="shrink-0" />
            {buttonText}
          </Button>
        </Link>
      )}

      {buttonText && onAction && !actionHref && (
        <Button
          variant={buttonVariant}
          className="mt-2 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all hover:shadow-xs"
          onClick={onAction}
        >
          <RefreshCw size={14} className="shrink-0" />
          {buttonText}
        </Button>
      )}
    </div>
  );
}

