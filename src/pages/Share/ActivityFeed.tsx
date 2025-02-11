import { useState, useEffect } from 'react';
import { Users, Check, Trophy } from 'lucide-react';

interface ReferralActivity {
  id: string;
  user: string;
  action: 'joined' | 'completed' | 'milestone';
  amount?: number;
  timestamp: Date;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ReferralActivity[]>([]);

  // Generate random referral activities
  useEffect(() => {
    const generateActivity = () => {
      const actions: ReferralActivity['action'][] = ['joined', 'completed', 'milestone'];
      const names = ['Emma T.', 'James W.', 'Sophia C.', 'Lucas G.', 'Olivia B.'];
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        user: names[Math.floor(Math.random() * names.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        amount: Math.floor(Math.random() * 1000) + 500,
        timestamp: new Date()
      };
    };

    // Add initial activities
    setActivities(Array(5).fill(null).map(generateActivity));

    // Add new activities periodically
    const interval = setInterval(() => {
      setActivities(prev => [generateActivity(), ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-50 dark:border-gray-700">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {activity.action === 'joined' && <Users className="w-6 h-6 text-blue-500" />}
                {activity.action === 'completed' && <Check className="w-6 h-6 text-green-500" />}
                {activity.action === 'milestone' && <Trophy className="w-6 h-6 text-yellow-500" />}
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">
                  {activity.user}
                  {' '}
                  {activity.action === 'joined' && 'joined using a referral link'}
                  {activity.action === 'completed' && 'completed their first offer'}
                  {activity.action === 'milestone' && 'reached a milestone'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.amount && `+${activity.amount} points • `}
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}