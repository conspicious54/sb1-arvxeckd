import { DollarSign, Gift, Trophy, Shield, Sparkles, Users, Clock, ChevronRight, Star, ClipboardCheck, LayoutGrid, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HowItWorksPage() {
  const steps = [
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "1. Sign Up",
      description: "Create your free account in less than 30 seconds. No credit card required.",
      color: "blue"
    },
    {
      icon: <LayoutGrid className="w-8 h-8" />,
      title: "2. Choose Tasks",
      description: "Browse available offers and select the ones that interest you.",
      color: "purple"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "3. Complete & Earn",
      description: "Follow the instructions and earn points upon completion.",
      color: "green"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "4. Get Paid",
      description: "Redeem your points for cash or gift cards. Instant payouts available.",
      color: "pink"
    }
  ];

  const earningMethods = [
    {
      title: "Surveys & Research",
      icon: <ClipboardCheck className="w-6 h-6" />,
      description: "Share your opinion and participate in market research studies.",
      earnings: "$1-5 per survey",
      time: "5-15 minutes",
      points: [
        "Quick opinion polls",
        "Consumer research surveys",
        "Product feedback studies"
      ]
    },
    {
      title: "Offer Walls",
      icon: <LayoutGrid className="w-6 h-6" />,
      description: "Complete offers from our partners and earn substantial rewards.",
      earnings: "$5-25 per offer",
      time: "10-30 minutes",
      points: [
        "App installations",
        "Free trial signups",
        "Game achievements"
      ]
    },
    {
      title: "Referral Program",
      icon: <Users className="w-6 h-6" />,
      description: "Invite friends and earn from their activity.",
      earnings: "$5 + 10% commission",
      time: "Passive income",
      points: [
        "Unlimited referrals",
        "Lifetime commissions",
        "Monthly bonuses"
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
            How EarnRewards Works
          </h1>
          <p className="text-xl text-green-50 mb-12 max-w-3xl mx-auto">
            Turn your spare time into real rewards. Our platform makes it easy to earn money through various activities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.title}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              >
                <div className={`p-3 bg-${step.color}-500/20 rounded-xl w-fit mx-auto mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-green-50 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Earning Methods */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ways to Earn
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose from multiple earning methods that suit your schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {earningMethods.map((method) => (
              <div
                key={method.title}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mb-6">
                  {method.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {method.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {method.earnings}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {method.time}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {method.points.map((point) => (
                    <div key={point} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">{point}</span>
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