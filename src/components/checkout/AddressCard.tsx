'use client';

import React from 'react';
import { Pencil, MapPin, CheckCircle2, Circle, Trash2, Loader2 } from 'lucide-react';
import type { Address } from '@/types';

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (address: Address) => void;
  onEdit: (address: Address) => void;
  onDelete?: (addressId: number) => void;
  isDeleting?: boolean;
}

export default function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDeleting = false,
}: AddressCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(address)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(address);
        }
      }}
      className={`relative flex flex-col justify-between rounded-lg border p-4 text-left transition-all cursor-pointer ${
        isSelected
          ? 'border-brand-orange bg-orange-50/40 ring-2 ring-brand-orange/30 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60 shadow-xs'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {isSelected ? (
              <CheckCircle2 size={18} className="text-brand-orange shrink-0" />
            ) : (
              <Circle size={18} className="text-gray-300 shrink-0" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <MapPin size={12} className="text-gray-400" />
              <span>{address.city}, {address.country}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {address.isDefault && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold tracking-wider text-emerald-700 border border-emerald-200 uppercase">
                Default
              </span>
            )}
          </div>
        </div>

        <div className="space-y-0.5 text-sm text-gray-700 pl-6">
          <p className="font-medium text-gray-900 leading-snug">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ''}
          </p>
          <p className="text-xs text-gray-600 leading-snug">
            {address.city}, {address.state} - {address.postalCode}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {address.country}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-end gap-2 pl-6">
        <button
          type="button"
          aria-label="Edit address"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-brand-orange hover:bg-orange-50 transition-colors"
          title="Edit address"
        >
          <Pencil size={13} />
          <span>Edit</span>
        </button>

        {onDelete && (
          <button
            type="button"
            aria-label="Delete address"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.addressId);
            }}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Delete address"
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin text-red-500" />
            ) : (
              <Trash2 size={13} />
            )}
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
