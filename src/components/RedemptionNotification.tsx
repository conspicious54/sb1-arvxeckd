import { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';

interface Notification {
  id: string;
  user: string;
  reward: string;
  amount: number;
  timestamp: Date;
}

const rewards = [
  { name: 'Amazon Gift Card', amounts: [25, 50, 100] },
  { name: 'PayPal Cash', amounts: [25, 50, 100] },
  { name: 'Visa Prepaid Card', amounts: [25, 50, 100] },
];

export function RedemptionNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState<string | null>(null);

  // Generate a random redemption
  const generateRedemption = () => {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    const amount = reward.amounts[Math.floor(Math.random() * reward.amounts.length)];
    const names = [
      'Emma T.', 'James W.', 'Sophia C.', 'Lucas G.', 'Olivia B.',
      'Ethan T.', 'Ava M.', 'Noah A.', 'Isabella L.', 'William K.',
    ];
    const user = names[Math.floor(Math.random() * names.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      user,
      reward: reward.name,
      amount,
      timestamp: new Date(),
    };
  };

  // Show notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRedemption();
      setNotifications(prev => [...prev, newNotification]);
      setVisible(newNotification.id);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setVisible(null);
        // Remove old notifications from state
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }, 60000); // Create new notification every minute

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const currentNotification = notifications.find(n => n.id === visible);
  if (!currentNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-100 dark:border-gray-700 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {currentNotification.user} just redeemed
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ${currentNotification.amount} {currentNotification.reward}
            </p>
          </div>
          <button
            onClick={() => setVisible(null)}
            className="flex-shrink-0 ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}