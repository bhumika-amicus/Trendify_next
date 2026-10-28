import { MapPin } from 'lucide-react';
import { getDefaultAddressServer } from '@/services/serverCustomerService';

interface DefaultAddressSectionProps {
  token?: string;
}

/**
 * Async Server Component:
 * Fetches and renders the customer's default shipping address.
 * Wrapped in its own independent <Suspense> boundary.
 */
export default async function DefaultAddressSection({ token }: DefaultAddressSectionProps) {
  const defaultAddress = await getDefaultAddressServer(token);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin size={16} className="text-brand-orange" /> Default Shipping Address
        </h3>
        {defaultAddress && (
          <span className="text-xs bg-orange-50 text-brand-orange font-medium px-2 py-0.5 rounded border border-orange-200">
            Primary
          </span>
        )}
      </div>

      {defaultAddress ? (
        <div className="p-4 bg-gray-50/70 rounded-lg border border-gray-100 text-sm text-gray-700 space-y-1">
          <p className="font-medium text-gray-900">
            {defaultAddress.addressLine1}
            {defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''}
          </p>
          <p className="text-gray-600">
            {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
          </p>
          <p className="text-gray-500 text-xs">{defaultAddress.country}</p>
        </div>
      ) : (
        <div className="p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500 text-center py-6">
          <p className="font-medium text-gray-700">No default address saved yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Your shipping address will be saved here automatically when you place your first order.
          </p>
        </div>
      )}
    </div>
  );
}
