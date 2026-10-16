'use client';

import { useState, memo } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
  minQuantity?: number;
  className?: string;
}

function QuantitySelector({
  quantity,
  onQuantityChange,
  disabled = false,
  minQuantity = 1,
  className = '',
}: QuantitySelectorProps) {
  const [draftValue, setDraftValue] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    if (disabled) return;
    setDraftValue(value);
  };

  const handleInputBlur = () => {
    if (disabled || draftValue === null) return;

    if (draftValue.trim() === '') {
      setDraftValue(null);
      return;
    }

    const nextQuantity = Math.floor(Number(draftValue));
    if (isNaN(nextQuantity) || nextQuantity < minQuantity) {
      setDraftValue(null);
      return;
    }

    setDraftValue(null);
    if (nextQuantity !== quantity) {
      onQuantityChange(nextQuantity);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleQuantityStep = (step: number) => {
    if (disabled) return;

    const parsedDraft = draftValue !== null ? Math.floor(Number(draftValue)) : NaN;
    const baseQuantity =
      !isNaN(parsedDraft) && parsedDraft >= minQuantity ? parsedDraft : quantity;

    const nextQuantity = Math.max(minQuantity, baseQuantity + step);
    if (nextQuantity !== quantity) {
      setDraftValue(null);
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
          disabled={disabled}
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

export default memo(QuantitySelector);
