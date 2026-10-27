'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/common/Button';
import { loginAction } from '@/app/actions/auth';

interface LoginFormProps {
  callbackUrl: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <form className="space-y-5" action={formAction}>
        {/* Hidden input to pass callbackUrl to the server action */}
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Error Banner */}
        {state?.error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {state.error}
          </div>
        )}

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
              defaultValue="deshmukh@example.com"
              autoComplete="email"
              placeholder="you@example.com"
              className="appearance-none block w-full px-4 py-3 border border-transparent bg-blue-50/50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm text-gray-900 transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password<span className="text-brand-orange">*</span>
            </label>
            <button
              type="button"
              className="text-xs font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors cursor-pointer bg-transparent border-0 p-0"
              onClick={() => alert('Please contact administrator or reset password.')}
            >
              Forgot Password?
            </button>
          </div>
          <div className="mt-1.5 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              defaultValue="Amicus"
              autoComplete="current-password"
              placeholder="••••••••"
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

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full uppercase tracking-widest font-bold text-sm py-3 shadow-sm"
          >
            {isPending ? 'SIGNING IN...' : 'SIGN IN'}
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
