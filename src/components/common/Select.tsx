import type { SelectHTMLAttributes, ReactNode, Ref } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  error?: string;
  headerAction?: ReactNode;
  options: (SelectOption | string)[];
  isLoading?: boolean;
  loadingText?: string;
  placeholder?: string;
  disabledText?: string;
  ref?: Ref<HTMLSelectElement>;
}

export default function Select({
  ref,
  id,
  label,
  error,
  required,
  headerAction,
  options,
  isLoading = false,
  loadingText = 'Loading...',
  placeholder = 'Select an option',
  disabledText,
  disabled = false,
  className = '',
  children,
  ...props
}: SelectProps) {
  const isDisabled = disabled || isLoading;

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
        <select
          ref={ref}
          id={id}
          disabled={isDisabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block w-full appearance-none rounded-md border py-2.5 pl-3 pr-10 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange ${
            isDisabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
              : 'bg-white'
          } ${
            error
              ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 hover:border-gray-400'
          } ${className}`.trim()}
          {...props}
        >
          <option value="">
            {isLoading
              ? loadingText
              : disabled && disabledText
                ? disabledText
                : placeholder}
          </option>

          {/* Retain current prefilled value if options are still loading or not yet populated */}
          {props.value &&
            !options.some((opt) =>
              typeof opt === 'string' ? opt === props.value : opt.value === props.value
            ) && (
              <option value={props.value as string} key={String(props.value)}>
                {String(props.value)}
              </option>
            )}

          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}

          {children}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-brand-orange" />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs text-red-600 font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
