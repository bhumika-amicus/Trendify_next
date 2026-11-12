import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/utils/session';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your Trendify account to track orders, manage your cart, and access exclusive member deals.',
};

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    registered?: string;
  }>;
}

function getAuthPromptMessage(url: string): string {
  if (url.startsWith('/cart')) {
    return 'Please sign in to view and manage your shopping cart.';
  }
  if (url.startsWith('/checkout')) {
    return 'Please sign in to proceed to secure checkout.';
  }
  if (url.startsWith('/orders')) {
    return 'Please sign in to view your order history and tracking.';
  }
  if (url.startsWith('/dashboard')) {
    return 'Please sign in to access your customer dashboard.';
  }
  return 'Please sign in first.';
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const rawCallbackUrl = resolvedParams.callbackUrl || '/';
  const callbackUrl =
    rawCallbackUrl === '/login' || rawCallbackUrl === '/register'
      ? '/'
      : rawCallbackUrl;
  const isRegistered = resolvedParams.registered === 'true';

  // Server-side check: If already logged in, redirect directly without rendering login form
  const user = await getCurrentUser();
  if (user) {
    redirect(callbackUrl);
  }

  return (
    <div className="w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-gray-100">
      <div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-wider">
          SIGN IN
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your Trendify account to track orders and enjoy seamless checkout.
        </p>
      </div>

      {isRegistered && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200 text-sm text-green-800">
          Account created successfully! Please sign in with your credentials.
        </div>
      )}

      {callbackUrl && callbackUrl !== '/' && (
        <div className="rounded-md bg-amber-50 p-3.5 border border-amber-200 text-xs font-medium text-amber-800">
          {getAuthPromptMessage(callbackUrl)}
        </div>
      )}

      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
