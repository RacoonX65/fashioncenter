'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase-auth';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signIn({ email, password });

      if (error) {
        toast.error(error);
      } else if (user) {
        toast.success('Successfully signed in!');
        router.push('/account');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Sign In</h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome back to FashionCenter
        </p>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-black font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/checkout" className="text-sm text-gray-600 hover:underline">
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

