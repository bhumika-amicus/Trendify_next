import { serverApiFetch } from './serverApi';
import type {
  AddressDto,
  CreateAddressRequest,
  CreateAddressResponse,
  UpdateAddressRequest,
} from '@/types';

export async function getAddressesServer(
  token?: string,
  signal?: AbortSignal
): Promise<AddressDto[]> {
  if (!token) return [];

  const res = await serverApiFetch<AddressDto[]>('/api/v1/addresses', {
    method: 'GET',
    token,
    signal,
    cache: 'no-store',
  });

  return Array.isArray(res.data) ? res.data : [];
}

export async function getDefaultAddressServer(
  token?: string,
  signal?: AbortSignal
): Promise<AddressDto | null> {
  const addresses = await getAddressesServer(token, signal);
  if (!addresses.length) return null;
  return addresses.find((a) => a.isDefault) || addresses[0] || null;
}

export async function createAddressServer(
  token: string,
  address: CreateAddressRequest
): Promise<CreateAddressResponse | null> {
  const res = await serverApiFetch<CreateAddressResponse>('/api/v1/addresses', {
    method: 'POST',
    token,
    body: address,
  });

  if (!res.ok || !res.data) {
    if (res.error) {
      console.warn('[ADDRESS_API] createAddressServer failed:', res.error);
    }
    return null;
  }

  return res.data;
}

export async function updateAddressServer(
  token: string,
  addressId: number,
  address: CreateAddressRequest | UpdateAddressRequest
): Promise<boolean> {
  const res = await serverApiFetch<void>(`/api/v1/addresses/${addressId}`, {
    method: 'PUT',
    token,
    body: address,
  });

  return res.ok;
}

export async function deleteAddressServer(
  token: string,
  addressId: number
): Promise<boolean> {
  const res = await serverApiFetch<void>(`/api/v1/addresses/${addressId}`, {
    method: 'DELETE',
    token,
  });

  return res.ok;
}
