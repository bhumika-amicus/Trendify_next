'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate authentication request
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-gray-100">
      <div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-wider">
          SIGN IN
        </h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address<span className="text-brand-orange">*</span>
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-transparent bg-blue-50/50 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm text-gray-900 pr-10 transition-colors"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
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
        </div>

        {/* Links and Submit Button */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm font-semibold text-brand-orange mb-8">
            <button
              type="button"
              className="hover:text-brand-orange/80 transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              Don&apos;t have an account?
            </button>
            <button
              type="button"
              className="hover:text-brand-orange/80 transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || isSuccess}
              className="px-8 uppercase tracking-widest font-bold text-sm"
            >
              {isLoading
                ? 'SIGNING IN...'
                : isSuccess
                ? 'SIGNED IN '
                : 'SIGN IN'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
