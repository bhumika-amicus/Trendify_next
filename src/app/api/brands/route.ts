import { NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';
import type { BrandDto } from '@/types/BrandDto';
import type { Brand } from '@/types/Brands';

export async function GET() {
  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/Brands?api-version=1`;

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve brands from upstream' },
        { status: response.status }
      );
    }

    const data: BrandDto[] = await response.json();
    const brands: Brand[] = (data || []).map((b) => ({
      id: b.brandId,
      name: b.name,
    }));

    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/brands handler:', error);
    return NextResponse.json(
      { error: 'Upstream brands service is unavailable' },
      { status: 502 }
    );
  }
}
