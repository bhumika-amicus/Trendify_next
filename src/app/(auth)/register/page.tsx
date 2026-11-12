import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/utils/session';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new Trendify account to track orders and enjoy fast checkout.',
};

export default async function RegisterPage() {
  // If already logged in, redirect away
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
  }

  return (
    <div className="w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-gray-100">
      <div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-wider">
          CREATE ACCOUNT
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join Trendify today to start shopping with exclusive member benefits.
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
