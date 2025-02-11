import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Gift, Star, Shield } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-sm">
        <a href="/" className="flex items-center gap-2 mb-8">
  <img 
    src="https://i.imgur.com/XhVzGft.png"
    alt="RapidRewards"
    className="h-11 w-auto invert dark:invert-0"
  />
</a>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sign in to continue earning rewards
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Sign up for free
            </Link>
          </p>

          {/* Trust Badges */}
          <div className="mt-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Secure Login</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** Right side - Image and Features */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-emerald-600/90"></div>
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Feature List */}
        <div className="relative h-full flex flex-col justify-center p-12">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-white mb-6">
              Start Earning Today
            </h3>
            <p className="text-lg text-green-50">
              Join thousands of users already earning rewards daily
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Multiple Rewards
                </h4>
                <p className="text-green-100">
                  Choose from PayPal cash, gift cards, or crypto rewards
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Daily Bonuses
                </h4>
                <p className="text-green-100">
                  Earn up to 2x points with daily streaks and multipliers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Secure & Reliable
                </h4>
                <p className="text-green-100">
                  Bank-level security with instant payouts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}