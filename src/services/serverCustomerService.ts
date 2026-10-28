import { DOTNET_API_BASE_URL } from '@/config';

export interface AddressDto {
  addressId: number;
  customerId?: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

/**
 * Server-side helper to fetch saved addresses for the authenticated customer.
 * Returns the default address, or the first address, or null if none exist.
 */
export async function getDefaultAddressServer(
  token?: string
): Promise<AddressDto | null> {
  if (!token) return null;

  // ⏱️ SIMULATE SLOW DATA (1.5 seconds) to clearly demonstrate independent Suspense streaming
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const response = await fetch(`${DOTNET_API_BASE_URL}/api/v1/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn(`[CUSTOMER] Addresses request returned status [${response.status}]`);
      return null;
    }

    const addresses: AddressDto[] = await response.json();
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return null;
    }

    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  } catch (error) {
    console.error('[CUSTOMER] Error fetching addresses on server:', error);
    return null;
  }
}
