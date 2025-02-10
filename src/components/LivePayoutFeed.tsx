import { useState, useEffect } from 'react';
import { DollarSign, Gift } from 'lucide-react';

interface Payout {
  id: string;
  user: string;
  amount: number;
  type: 'paypal' | 'amazon' | 'visa';
  timestamp: Date;
}

export function LivePayoutFeed() {
  const [payouts, setPayouts] = useState<Payout[]>([]);

  // Generate random payouts
  useEffect(() => {
    const names = [
      'Emma T.', 'James W.', 'Sophia C.', 'Lucas G.', 'Olivia B.',
      'Ethan T.', 'Ava M.', 'Noah A.', 'Isabella L.', 'William K.',
    ];
    const types: ('paypal' | 'amazon' | 'visa')[] = ['paypal', 'amazon', 'visa'];
    const amounts = [5, 10, 25, 50, 100];

    const generatePayout = () => ({
      id: Math.random().toString(36).substr(2, 9),
      user: names[Math.floor(Math.random() * names.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      type: types[Math.floor(Math.random() * types.length)],
      timestamp: new Date(),
    });

    // Initialize with some payouts
    setPayouts(Array(5).fill(null).map(generatePayout));

    // Add new payouts periodically
    const interval = setInterval(() => {
      setPayouts(prev => [generatePayout(), ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Live Payouts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Watch real-time rewards being claimed by our users
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-50 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Payouts</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {payout.user}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payout.type.charAt(0).toUpperCase() + payout.type.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      ${payout.amount}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payout.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}