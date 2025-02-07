import { Shield, Sparkles, Gift, Clock, Users, TrendingUp, DollarSign, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturesPage() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Bank-level security with SSL encryption and instant payouts. Your earnings are always safe.",
      color: "blue"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Daily Bonuses",
      description: "Earn up to 2x points with daily streaks and special multipliers. The more active you are, the more you earn.",
      color: "yellow"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Multiple Rewards",
      description: "Choose from PayPal cash, gift cards, or crypto rewards. Flexible redemption options for everyone.",
      color: "green"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Tasks",
      description: "Most tasks take 5-15 minutes. Perfect for earning in your spare time or during breaks.",
      color: "purple"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Referral Program",
      description: "Earn from your network with our generous referral program. Get 10% of your referrals' earnings.",
      color: "pink"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Achievement System",
      description: "Level up and unlock higher rewards. Complete achievements for bonus points and exclusive offers.",
      color: "indigo"
    }
  ];

  const highlights = [
    {
      title: "Instant Payouts",
      description: "No minimum withdrawal required. Get your earnings instantly via PayPal or gift cards.",
      stats: [
        { label: "Average payout time", value: "< 24 hours" },
        { label: "Minimum withdrawal", value: "$5" },
        { label: "Success rate", value: "99.9%" }
      ]
    },
    {
      title: "Earning Potential",
      description: "Multiple ways to earn with competitive rewards for your time.",
      stats: [
        { label: "Average earnings/hour", value: "$10-20" },
        { label: "Monthly potential", value: "$500+" },
        { label: "Active users", value: "50K+" }
      ]
    },
    {
      title: "Reward Options",
      description: "Flexible redemption options to suit your preferences.",
      stats: [
        { label: "Available rewards", value: "25+" },
        { label: "Gift card brands", value: "50+" },
        { label: "Payment methods", value: "10+" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Powerful Features for
            <br />
            Maximum Earnings
          </h1>
          <p className="text-xl text-green-50 mb-12 max-w-3xl mx-auto">
            Everything you need to turn your spare time into real rewards. Our platform is packed with features to help you earn more.
          </p>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl w-fit mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {highlight.description}
                </p>
                <div className="space-y-4">
                  {highlight.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Join thousands of users already earning rewards daily
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors group"
          >
            Start Earning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}