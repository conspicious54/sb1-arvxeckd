import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqs = [
    {
      question: "How do I start earning rewards?",
      answer: "Getting started is easy! Simply create a free account, browse available offers, and start completing tasks. You'll earn points for each completed task, which can be redeemed for cash or gift cards."
    },
    {
      question: "How much can I earn?",
      answer: "Earnings vary based on the tasks you complete. Surveys typically pay $1-5, while offer walls can pay $5-25 per offer. Active users earn an average of $200-500 per month."
    },
    {
      question: "When and how do I get paid?",
      answer: "You can request payment anytime once you reach the minimum threshold ($5 for most rewards). We offer PayPal, gift cards, and crypto payments. Most payments are processed within 24 hours."
    },
    {
      question: "Is RapidRewards available worldwide?",
      answer: "Yes! RapidRewards is available worldwide. However, available offers may vary by region. We're constantly adding new offers for all locations."
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find answers to common questions about RapidRewards
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
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
    </section>
  );
}