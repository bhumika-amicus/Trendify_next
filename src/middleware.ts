import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DOTNET_API_BASE_URL } from '@/config';

/**
 * Protected routes requiring an active session cookie.
 */
const PROTECTED_ROUTES = ['/checkout', '/orders', '/dashboard'];

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = request.nextUrl;
  const method = request.method;

  // 1. Read existing cookies
  let sessionToken = request.cookies.get('session')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let newSessionToken: string | null = null;
  let newRefreshToken: string | null = null;

  // 2. Transparent Token Refresh:
  // If the short-lived access token (2h) has expired, but the 7-day refreshToken exists,
  // silently exchange it for a fresh access token before proceeding.
  if (!sessionToken && refreshToken) {
    try {
      const refreshResponse = await fetch(`${DOTNET_API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData?.token) {
          sessionToken = refreshData.token;
          newSessionToken = refreshData.token;
          newRefreshToken = refreshData.refreshToken || null;
          console.log(`[AUTH] Silently refreshed session token for ${pathname}`);
        }
      }
    } catch (err) {
      console.warn('[AUTH] Background session refresh failed:', err);
    }
  }

  //  Route Protection Check
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !sessionToken) {
    const duration = Date.now() - startTime;
    console.log(
      `[HTTP] ${method} ${pathname} -> 307 Redirect to /login (${duration}ms)`
    );

    // Build redirect URL preserving the original path and search query
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  // If a new session token was issued, set updated cookies on the outgoing response
  if (newSessionToken) {
    response.cookies.set('session', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, 
    });

    if (newRefreshToken) {
      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, 
      });
    }
  }

  // Log HTTP method, path, and duration
  const duration = Date.now() - startTime;
  console.log(`[HTTP] ${method} ${pathname} - Completed in ${duration}ms`);

  // Attach duration header for network inspection
  response.headers.set('x-middleware-duration', `${duration}ms`);

  return response;
}

/**
 * Matcher configuration:
 * Run middleware on application routes, while completely excluding:
 * - API routes (/api/*)
 * - Next.js internal static assets (_next/static/*)
 * - Next.js optimized images (_next/image/*)
 * - Favicon, sitemaps, robots.txt
 * - Static file extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
