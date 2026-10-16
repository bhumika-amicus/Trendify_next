import type { ReactNode } from 'react';
import Button from './Button';

interface StateMessageProps {
  title: string;
  message: string;
  buttonText?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
}

export default function StateMessage({
  title,
  message,
  buttonText,
  onAction,
  children,
  className = 'mt-7.5',
}: StateMessageProps) {
  return (
    <div
      className={`flex w-full items-start justify-center ${className}`.trim()}
    >
      <div className="flex w-full max-w-125 flex-col items-center p-5 text-center">
        <h2 className="mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-700">
          {title}
        </h2>
        <p className="mb-6 text-base text-gray-600">{message}</p>

        {children}

        {buttonText && onAction && (
          <Button variant="outline" className="mt-8" onClick={onAction}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
