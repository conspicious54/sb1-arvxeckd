import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { fetchRewards } from '../../lib/rewards';
import type { Reward } from '../../lib/rewards';
import { RewardsList } from './RewardsList';
import { CategoryFilter } from './CategoryFilter';
import { supabase } from '../../lib/supabase';

export function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'giftcard' | 'cash' | 'gaming' | 'travel'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);

  // Load rewards and user points
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Get user's points
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('available_points')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserPoints(profile.available_points);
        }

        // Get rewards
        const rewardsData = await fetchRewards();
        setRewards(rewardsData);
      } catch (err) {
        console.error('Error loading rewards:', err);
        setError('Failed to load rewards');
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Subscribe to points changes
    const channel = supabase
      .channel('points_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        },
        (payload) => {
          setUserPoints(payload.new.available_points);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter rewards by category
  const filteredRewards = rewards.filter(
    reward => selectedCategory === 'all' || reward.category === selectedCategory
  );

  // Separate featured and regular rewards
  const featuredRewards = filteredRewards.filter(reward => reward.featured);
  const regularRewards = filteredRewards.filter(reward => !reward.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Redeem Rewards</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You have <span className="font-semibold text-green-600 dark:text-green-400">{userPoints.toLocaleString()} points</span> available to redeem
          </p>
        </div>
        <Link
          to="/rewards/history"
          className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        >
          View History
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Category Filters */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Rewards List */}
      <RewardsList
        featuredRewards={featuredRewards}
        regularRewards={regularRewards}
        userPoints={userPoints}
        loading={loading}
        error={error}
      />
    </div>
  );
}