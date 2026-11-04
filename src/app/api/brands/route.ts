import { NextResponse } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';
import type { Brand } from '@/types';

export async function GET() {
  try {
    const upstreamUrl = `${DOTNET_API_BASE_URL}/api/Brands?api-version=1`;

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 300, tags: ['brands'] },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve brands from upstream' },
        { status: response.status }
      );
    }

    const brands: Brand[] = await response.json();
    return NextResponse.json(Array.isArray(brands) ? brands : [], { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/brands handler:', error);
    return NextResponse.json(
      { error: 'Upstream brands service is unavailable' },
      { status: 502 }
    );
  }
}
