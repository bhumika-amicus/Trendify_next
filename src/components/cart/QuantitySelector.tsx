'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
  minQuantity?: number;
  className?: string;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  disabled = false,
  minQuantity = 1,
  className = '',
}: QuantitySelectorProps) {
  const [draftValue, setDraftValue] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    if (disabled) return;

    if (value === '') {
      setDraftValue('');
      return;
    }

    // Keep only numeric digits and limit to 3 characters max
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 3);
    if (digitsOnly === '') {
      setDraftValue('');
      return;
    }

    const parsed = parseInt(digitsOnly, 10);
    if (isNaN(parsed)) return;

    setDraftValue(digitsOnly);
    // Keep parent state immediately updated with the typed number (e.g. 100)
    onQuantityChange(parsed);
  };

  const handleInputBlur = () => {
    if (disabled) return;
    const currentDraft = draftValue;
    setDraftValue(null);

    if (currentDraft === null) return;

    if (currentDraft.trim() === '') {
      const fallback = Math.max(1, minQuantity);
      if (fallback !== quantity) {
        onQuantityChange(fallback);
      }
      return;
    }

    const parsed = parseInt(currentDraft, 10);
    if (isNaN(parsed) || parsed < minQuantity) {
      const fallback = Math.max(1, minQuantity);
      if (fallback !== quantity) {
        onQuantityChange(fallback);
      }
      return;
    }

    // Preserve the typed value (even if > 99) so handleAddToCart can validate and show "Maximum quantity limit is 99 items." instead of silently mutating on blur
    if (parsed !== quantity) {
      onQuantityChange(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleQuantityStep = (step: number) => {
    if (disabled) return;

    let current = quantity;
    if (draftValue !== null && draftValue.trim() !== '') {
      const parsedDraft = parseInt(draftValue, 10);
      if (!isNaN(parsedDraft)) {
        current = parsedDraft;
      }
    }

    const nextQuantity = Math.min(99, Math.max(minQuantity, current + step));
    setDraftValue(null);
    if (nextQuantity !== quantity) {
      onQuantityChange(nextQuantity);
    }
  };

  const displayValue = draftValue !== null ? draftValue : String(quantity);

  return (
    <div
      className={`col-span-full row-start-2 mx-auto inline-flex w-full max-w-47.5 items-center justify-center gap-4.5 ${className}`.trim()}
    >
      <span className="text-sm font-bold text-text-muted">QTY:</span>

      <div className="inline-flex items-center overflow-hidden rounded border border-border-subtle bg-white">
        <button
          type="button"
          disabled={quantity <= minQuantity || disabled}
          onClick={() => handleQuantityStep(-1)}
          aria-label="Decrease quantity"
          className="flex h-7 w-7 items-center justify-center border-0 bg-brand-orange-50 p-0 text-brand-orange transition-colors duration-200 hover:bg-brand-orange hover:text-white focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:text-neutral-400 cursor-pointer"
        >
          <Minus size={13} className="stroke-[2.5]" />
        </button>

        <input
          type="number"
          min={minQuantity}
          max={99}
          step="1"
          value={displayValue}
          onChange={(event) => handleInputChange(event.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          aria-label="Quantity"
          disabled={disabled}
          className="h-7 w-10.5 border-0 border-x border-border-light bg-white px-1 text-center text-sm font-bold leading-7 text-text-body focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:-outline-offset-2 disabled:bg-gray-50 disabled:text-gray-400 [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
          disabled={quantity >= 99 || disabled}
          onClick={() => handleQuantityStep(1)}
          aria-label="Increase quantity"
          className="flex h-7 w-7 items-center justify-center border-0 bg-brand-orange-50 p-0 text-brand-orange transition-colors duration-200 hover:bg-brand-orange hover:text-white focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:text-neutral-400 cursor-pointer"
        >
          <Plus size={13} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
