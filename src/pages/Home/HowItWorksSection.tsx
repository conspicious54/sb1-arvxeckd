import { ClipboardCheck, LayoutGrid, Gift, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "1. Sign Up",
      description: "Create your free account in less than 30 seconds. No credit card required.",
      color: "blue",
      delay: 0
    },
    {
      icon: <LayoutGrid className="w-8 h-8" />,
      title: "2. Choose Tasks",
      description: "Browse available offers and select the ones that interest you.",
      color: "purple",
      delay: 0.2
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "3. Complete & Earn",
      description: "Follow the instructions and earn points upon completion.",
      color: "green",
      delay: 0.4
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "4. Get Paid",
      description: "Redeem your points for cash or gift cards. Instant payouts available.",
      color: "pink",
      delay: 0.6
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTQgNGg0OHY0OEg0eiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start earning rewards in just a few simple steps. Our platform makes it easy to turn your spare time into real rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${step.delay}s` }}
            >
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-emerald-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className={`p-4 bg-${step.color}-100 dark:bg-${step.color}-900/30 rounded-2xl mx-auto w-fit mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors group"
          >
            Start Earning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}