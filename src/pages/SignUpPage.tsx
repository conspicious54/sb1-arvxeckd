import { DollarSign, Gift, Star, Shield, Sparkles, Trophy, Users, Clock, ChevronRight, Smartphone, Check } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { SignUpForm } from '../components/auth/SignUpForm';

export function SignUpPage() {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  const features = [
    {
      icon: <Gift className="w-6 h-6 text-white" />,
      title: "Multiple Rewards",
      description: "Choose from PayPal cash, gift cards, or crypto rewards"
    },
    {
      icon: <Star className="w-6 h-6 text-white" />,
      title: "Daily Bonuses",
      description: "Earn up to 2x points with daily streaks and multipliers"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Secure & Reliable",
      description: "Bank-level security with instant payouts"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Total Paid", value: "$250K+" },
    { label: "Avg. Rating", value: "4.9/5" },
    { label: "Countries", value: "150+" }
  ];

  const howItWorks = [
    {
      title: "Complete offers and download apps",
      description: "Earn points for each task you complete"
    },
    {
      title: "Refer friends to earn big",
      description: "Get 10% of their earnings forever"
    },
    {
      title: "Get paid fast",
      description: "10x more than industry leaders"
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image and Features */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-emerald-600/90"></div>
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Animated Shapes */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-medium"></div>
        </div>

        {/* Feature List */}
        <div className="relative h-full flex flex-col justify-center p-12">
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-white mb-6">
              Start Earning Today
            </h3>
            <p className="text-xl text-green-50">
              Join thousands of users already earning rewards daily
            </p>
          </div>

          <div className="space-y-8 mb-12">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 animate-fade-in-up">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-green-100">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8">
  <img 
    src="https://i.imgur.com/XhVzGft.png"
    alt="RapidRewards"
    className="h-8 w-auto dark:invert-0 invert"
  />
</Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Start earning rewards in minutes
            </p>
          </div>

          {/* Welcome Bonus Badge */}
          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 mb-8 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  {referralCode ? 'Double Welcome Bonus!' : 'Welcome Bonus!'}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {referralCode 
                    ? 'Get 5,000 points ($5) instantly + 5,000 bonus points from your referrer'
                    : 'Get 5,000 points ($5) instantly when you join'}
                </p>
              </div>
            </div>
          </div>

          <SignUpForm />

          {/* How It Works */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <div className="space-y-4">
              {howItWorks.map((step, index) => (
                <div key={step.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Secure Sign Up</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}