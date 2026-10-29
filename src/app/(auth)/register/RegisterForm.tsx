'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { registerAction } from '@/actions/auth';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [clientConfirmError, setClientConfirmError] = useState<string>();

  const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Only intercept on client if both passwords have been typed and they mismatch
    if (
      typeof password === 'string' &&
      typeof confirmPassword === 'string' &&
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      e.preventDefault(); // Prevents Server Action from firing!
      setClientConfirmError('Passwords do not match.');
      return;
    }
    setClientConfirmError(undefined);
  };

  const confirmPasswordError = clientConfirmError || state?.fieldErrors?.confirmPassword;

  return (
    <div className="space-y-6">
      <form className="space-y-4" action={formAction} onSubmit={handleClientSubmit} noValidate>
        {/* Error Banner */}
        {state?.error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* Full Name Field */}
        <Input
          key={`name-${state?.values?.name ?? 'empty'}`}
          id="name"
          name="name"
          type="text"
          label="Full Name"
          required
          defaultValue={state?.values?.name}
          placeholder="e.g. Bhumika Deshmukh"
          error={state?.fieldErrors?.name}
        />

        {/* Email Field */}
        <Input
          key={`email-${state?.values?.email ?? 'empty'}`}
          id="email"
          name="email"
          type="email"
          label="Email Address"
          required
          autoComplete="email"
          defaultValue={state?.values?.email}
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
          minLength={6}
          autoComplete="new-password"
          placeholder="Minimum 6 characters"
          error={state?.fieldErrors?.password}
        />

        {/* Confirm Password Field */}
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Re-enter password"
          error={confirmPasswordError}
          onChange={() => {
            if (clientConfirmError) setClientConfirmError(undefined);
          }}
        />

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            className="w-full uppercase tracking-widest font-bold text-sm py-3 shadow-sm"
          >
            CREATE ACCOUNT
          </Button>
        </div>
      </form>

      {/* Pattern A: Existing Customer Return Section */}
      <div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-gray-500 font-semibold">
              Already have an account?
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="w-full block text-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors uppercase tracking-wider"
        >
          Sign in to your account
        </Link>
      </div>
    </div>
  );
}
