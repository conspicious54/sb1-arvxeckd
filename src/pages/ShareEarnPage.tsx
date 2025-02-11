import { useState, useEffect } from 'react';
import { getReferralStats, getReferralUrl } from '../lib/referrals';
import type { ReferralStats } from '../lib/referrals';
import { supabase } from '../lib/supabase';
import { StatsGrid } from './Share/StatsGrid';
import { ReferralLink } from './Share/ReferralLink';
import { AchievementsList } from './Share/AchievementsList';
import { ActivityFeed } from './Share/ActivityFeed';

export function ShareEarnPage() {
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load referral data
  useEffect(() => {
    async function loadReferralData() {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          return;
        }

        // Get referral URL and stats
        const [url, stats] = await Promise.all([
          getReferralUrl(),
          getReferralStats(user.id)
        ]);

        setReferralUrl(url);
        setReferralStats(stats);

        // Subscribe to referral stats changes
        const channel = supabase
          .channel('referral_changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`
            },
            async (payload) => {
              // Refresh stats when profile is updated
              const newStats = await getReferralStats(user.id);
              setReferralStats(newStats);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error('Error loading referral data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load referral data');
      } finally {
        setLoading(false);
      }
    }

    loadReferralData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Share & Earn{' '}
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text">
            5,000 Points
          </span>
          {' '}Per Referral
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Plus get 10% of their earnings for life! The more friends you invite, the more you both earn.
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={referralStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Referral Link Section */}
        <div className="lg:col-span-2">
          <ReferralLink referralUrl={referralUrl} />
          <ActivityFeed />
        </div>

        {/* Achievements */}
        <div>
          <AchievementsList stats={referralStats} />
        </div>
      </div>
    </div>
  );
}