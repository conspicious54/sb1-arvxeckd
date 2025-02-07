import { ArrowRight, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I start earning rewards?",
      answer: "Getting started is easy! Simply create a free account, browse available offers, and start completing tasks. You'll earn points for each completed task, which can be redeemed for cash or gift cards.",
      category: "Getting Started"
    },
    {
      question: "How much can I earn?",
      answer: "Earnings vary based on the tasks you complete. Surveys typically pay $1-5, while offer walls can pay $5-25 per offer. Active users earn an average of $200-500 per month.",
      category: "Earnings"
    },
    {
      question: "When and how do I get paid?",
      answer: "You can request payment anytime once you reach the minimum threshold ($5 for most rewards). We offer PayPal, gift cards, and crypto payments. Most payments are processed within 24 hours.",
      category: "Payments"
    },
    {
      question: "Are there any fees?",
      answer: "No! EarnRewards is completely free to use. We never charge any fees for joining, completing tasks, or withdrawing your earnings.",
      category: "Payments"
    },
    {
      question: "How does the referral program work?",
      answer: "You earn $5 for each friend who joins and completes their first offer. Plus, you get 10% of their earnings for life! There's no limit to how many friends you can refer.",
      category: "Referrals"
    },
    {
      question: "What are streaks and multipliers?",
      answer: "Streaks are earned by completing at least one offer daily. Each day increases your multiplier (up to 2x) for bigger rewards. Missing a day resets your streak.",
      category: "Earnings"
    },
    {
      question: "Is EarnRewards available in my country?",
      answer: "Yes! EarnRewards is available worldwide. However, available offers may vary by region. We're constantly adding new offers for all locations.",
      category: "General"
    },
    {
      question: "How do you protect my privacy?",
      answer: "We use bank-level SSL encryption to protect your data. We never share your personal information with third parties without your consent.",
      category: "Security"
    },
    {
      question: "What if I need help?",
      answer: "Our support team is available 24/7. You can reach us through the help center, email, or live chat. We typically respond within a few hours.",
      category: "Support"
    },
    {
      question: "Can I use multiple devices?",
      answer: "Yes! You can access EarnRewards from any device. We have a mobile-friendly website and dedicated apps for iOS and Android.",
      category: "General"
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-green-50 mb-12 max-w-3xl mx-auto">
            Find answers to common questions about EarnRewards
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {category}
              </h2>
              <div className="space-y-4">
                {faqs
                  .filter(faq => faq.category === category)
                  .map((faq) => (
                    <div
                      key={faq.question}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                        onClick={() => setOpenItem(openItem === faq.question ? null : faq.question)}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </span>
                        {openItem === faq.question ? (
                          <Minus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                      {openItem === faq.question && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Our support team is here to help 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              onClick={() => alert('Contact support functionality coming soon!')}
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}