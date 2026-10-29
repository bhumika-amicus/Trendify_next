'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { loginAction } from '@/actions/auth';

interface LoginFormProps {
  callbackUrl: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="space-y-6">
      <form className="space-y-5" action={formAction} noValidate>
        {/* Hidden input to pass callbackUrl to the server action */}
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Global Error Banner */}
        {state?.error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* Email Field */}
        <Input
          key={`email-${state?.values?.email ?? 'default'}`}
          id="email"
          name="email"
          type="email"
          label="Email Address"
          required
          defaultValue={state?.values?.email ?? 'deshmukh@example.com'}
          autoComplete="email"
          placeholder="you@example.com"
          error={state?.fieldErrors?.email}
        />

        {/* Password Field */}
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          required
          defaultValue="Amicus"
          autoComplete="current-password"
          placeholder="••••••••"
          error={state?.fieldErrors?.password}
        />

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            className="w-full uppercase tracking-widest font-bold text-sm py-3 shadow-sm"
          >
            SIGN IN
          </Button>
        </div>
      </form>

      {/* Pattern A: Distinct Registration Section for New Customers */}
      <div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-gray-500 font-semibold">
              New to Trendify?
            </span>
          </div>
        </div>

        <Link
          href="/register"
          className="w-full block text-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors uppercase tracking-wider"
        >
          Create your Trendify account
        </Link>
      </div>
    </div>
  );
}
