import { MapPin } from 'lucide-react';
import { getDefaultAddressServer } from '@/services/serverAddressService';
import StateMessage from '@/components/common/StateMessage';

interface DefaultAddressSectionProps {
  token?: string;
}

/**
 * Async Server Component:
 * Fetches and renders the customer's default shipping address.
 * Wrapped in its own independent <Suspense> boundary.
 */
export default async function DefaultAddressSection({ token }: DefaultAddressSectionProps) {
  const { address, error } = await getDefaultAddressServer(token);

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin size={16} className="text-brand-orange" /> Default Shipping Address
          </h3>
        </div>
        <StateMessage
          title="Unable to load shipping address"
          message="We're having trouble connecting to our servers right now. Please try again."
          buttonText="Retry"
          actionHref="/dashboard"
          variant="error"
          compact
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin size={16} className="text-brand-orange" /> Default Shipping Address
        </h3>
        {address && (
          <span className="text-xs bg-orange-50 text-brand-orange font-medium px-2 py-0.5 rounded border border-orange-200">
            Primary
          </span>
        )}
      </div>

      {address ? (
        <div className="p-4 bg-gray-50/70 rounded-lg border border-gray-100 text-sm text-gray-700 space-y-1">
          <p className="font-medium text-gray-900">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ''}
          </p>
          <p className="text-gray-600">
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="text-gray-500 text-xs">{address.country}</p>
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
