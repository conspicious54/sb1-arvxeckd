import { Shield, Sparkles, Gift, Clock, Users, TrendingUp } from 'lucide-react';

export function FeaturesSection() {
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

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose RapidRewards?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We make earning rewards simple, secure, and rewarding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`p-4 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl w-fit mb-6`}>
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
  );
}