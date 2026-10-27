'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/common/Button';
import { registerAction } from '@/app/actions/auth';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <form className="space-y-4" action={formAction}>
        {/* Error Banner */}
        {state?.error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* Full Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name<span className="text-brand-orange">*</span>
          </label>
          <div className="mt-1.5">
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Bhumika Deshmukh"
              className="appearance-none block w-full px-4 py-3 border border-transparent bg-blue-50/50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm text-gray-900 transition-colors"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address<span className="text-brand-orange">*</span>
          </label>
          <div className="mt-1.5">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="appearance-none block w-full px-4 py-3 border border-transparent bg-blue-50/50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm text-gray-900 transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password<span className="text-brand-orange">*</span>
          </label>
          <div className="mt-1.5 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              className="appearance-none block w-full px-4 py-3 border border-transparent bg-blue-50/50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm text-gray-900 pr-10 transition-colors"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password<span className="text-brand-orange">*</span>
          </label>
          <div className="mt-1.5 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Re-enter password"
              className="appearance-none block w-full px-4 py-3 border border-transparent bg-blue-50/50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm text-gray-900 pr-10 transition-colors"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full uppercase tracking-widest font-bold text-sm py-3 shadow-sm"
          >
            {isPending ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
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
