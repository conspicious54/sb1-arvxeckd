import { DollarSign, Users } from 'lucide-react';
import type { ReferralStats } from '../../lib/referrals';

interface StatsGridProps {
  stats: ReferralStats | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-green-50 dark:border-gray-700">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Users className="w-4 h-4 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalReferrals}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-green-50 dark:border-gray-700">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <Users className="w-4 h-4 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {stats.pendingReferrals}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-green-50 dark:border-gray-700">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Earned</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalEarned.toLocaleString()} <span className="text-xs md:text-sm font-normal">pts</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-green-50 dark:border-gray-700">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Potential</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {stats.potentialEarnings.toLocaleString()} <span className="text-xs md:text-sm font-normal">pts</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}