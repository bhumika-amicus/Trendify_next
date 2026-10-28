import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import LoginForm from './LoginForm';

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    registered?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const callbackUrl = resolvedParams.callbackUrl || '/';
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
        <div className="rounded-md bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
          Please sign in first.
        </div>
      )}

      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
