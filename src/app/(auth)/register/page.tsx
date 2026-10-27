import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RegisterForm from './RegisterForm';

export const metadata = {
  title: 'Create Account | Trendify',
  description: 'Create a new Trendify account to track orders and enjoy fast checkout.',
};

export default async function RegisterPage() {
  // If already logged in, redirect away
  const cookieStore = await cookies();
  if (cookieStore.get('session')?.value) {
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
