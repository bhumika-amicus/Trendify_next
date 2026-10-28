'use client';

import { useState, forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  headerAction?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, type = 'text', headerAction, className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {(label || headerAction) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && (
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-brand-orange ml-0.5">*</span>}
              </label>
            )}
            {headerAction}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={computedType}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error && id ? `${id}-error` : undefined}
            className={`appearance-none block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 sm:text-sm text-gray-900 transition-colors focus:outline-none ${
              isPassword ? 'pr-10' : ''
            } ${
              error
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-transparent bg-blue-50/50 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
            } ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p
            id={id ? `${id}-error` : undefined}
            className="mt-1.5 text-xs text-red-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
