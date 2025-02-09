import { Star, Zap, Crown, Target } from 'lucide-react';
import type { ReferralStats } from '../../lib/referrals';

interface AchievementsListProps {
  stats: ReferralStats | null;
}

interface Achievement {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

export function AchievementsList({ stats }: AchievementsListProps) {
  if (!stats) return null;

  const achievements: Achievement[] = [
    {
      id: 'first-referral',
      icon: <Star className="w-6 h-6" />,
      name: 'First Steps',
      description: 'Get your first referral',
      progress: stats.totalReferrals,
      target: 1,
      reward: 1000,
      completed: stats.totalReferrals >= 1
    },
    {
      id: 'power-referrer',
      icon: <Zap className="w-6 h-6" />,
      name: 'Power Referrer',
      description: 'Refer 5 active users',
      progress: stats.totalReferrals,
      target: 5,
      reward: 5000,
      completed: stats.totalReferrals >= 5
    },
    {
      id: 'elite',
      icon: <Crown className="w-6 h-6" />,
      name: 'Elite Affiliate',
      description: 'Earn 50,000 points from referrals',
      progress: stats.totalEarned,
      target: 50000,
      reward: 10000,
      completed: stats.totalEarned >= 50000
    },
    {
      id: 'conversion',
      icon: <Target className="w-6 h-6" />,
      name: 'Conversion Master',
      description: 'Achieve 70% referral conversion rate',
      progress: parseInt(stats.conversionRate),
      target: 70,
      reward: 7500,
      completed: parseInt(stats.conversionRate) >= 70
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-50 dark:border-gray-700">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-lg text-sm font-medium">
            {achievements.filter(a => a.completed).length}/{achievements.length} Completed
          </div>
        </div>
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-6 ${
                achievement.completed
                  ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  achievement.completed
                    ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Progress: {achievement.progress}/{achievement.target}
                    </span>
                    <span className={`font-medium ${
                      achievement.completed
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {Math.round((achievement.progress / achievement.target) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        achievement.completed
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-500'
                      }`}
                      style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                    />
                  </div>
                  {achievement.completed ? (
                    <div className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
                      Completed! Earned {achievement.reward.toLocaleString()} points
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Reward: {achievement.reward.toLocaleString()} points
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}