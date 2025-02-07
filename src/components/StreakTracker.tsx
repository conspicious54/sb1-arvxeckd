import { Flame, Trophy, Star, TrendingUp, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMultiplier } from '../context/MultiplierContext';
import { supabase } from '../lib/supabase';

interface StreakData {
  streak_count: number;
  best_streak: number;
  last_offer_completion: string | null;
}

export function StreakTracker() {
  const [showInfo, setShowInfo] = useState(false);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setMultiplier } = useMultiplier();

  useEffect(() => {
    async function fetchStreakData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('streak_count, best_streak, last_offer_completion')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setStreakData(data);
        
        // Update multiplier based on streak - increases by 0.1 every day up to 2x
        const multiplierValue = Math.min(1 + (data.streak_count * 0.1), 2);
        setMultiplier(multiplierValue, 'streak');
      } catch (error) {
        console.error('Error fetching streak data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStreakData();

    // Subscribe to changes
    const channel = supabase
      .channel('streak_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        },
        (payload) => {
          const newData = payload.new as StreakData;
          setStreakData(newData);
          
          // Update multiplier when streak changes
          const multiplierValue = Math.min(1 + (newData.streak_count * 0.1), 2);
          setMultiplier(multiplierValue, 'streak');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setMultiplier]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white animate-pulse">
        <div className="h-8 w-48 bg-white/20 rounded mb-4"></div>
        <div className="h-24 bg-white/20 rounded mb-4"></div>
        <div className="h-12 bg-white/20 rounded"></div>
      </div>
    );
  }

  const streak = streakData?.streak_count || 0;
  const bestStreak = streakData?.best_streak || 0;
  const multiplierValue = Math.min(1 + (streak * 0.1), 2);

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 animate-pulse" />
          <h3 className="text-xl font-bold">Daily Streak</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="How it works"
          >
            <Info className="w-4 h-4 text-orange-100" />
          </button>
          <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">
              {multiplierValue.toFixed(1)}x Multiplier
            </span>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="mb-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm">
          <h4 className="font-semibold mb-2">How Streaks Work:</h4>
          <ul className="space-y-2 text-orange-100">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
              Start at 1.0x multiplier
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
              Gain +0.1x each day you complete an offer
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
              Maximum multiplier is 2.0x (after 10 days)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
              Missing a day resets your streak
            </li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="text-orange-100 text-sm">Current Streak</span>
          </div>
          <p className="text-3xl font-bold">{streak} days</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span className="text-orange-100 text-sm">Best Streak</span>
          </div>
          <p className="text-3xl font-bold">{bestStreak} days</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-300" />
            <span className="text-orange-100 text-sm">Progress to Next Boost</span>
          </div>
          {streak < 10 && (
            <span className="text-sm font-medium">
              {multiplierValue.toFixed(1)}x → {Math.min(1 + ((streak + 1) * 0.1), 2).toFixed(1)}x
            </span>
          )}
        </div>
        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${(streak / 10) * 100}%` }}
          />
        </div>
        {streak >= 10 && (
          <p className="text-center text-sm mt-2 text-orange-100">
            Maximum multiplier achieved! 🎉
          </p>
        )}
      </div>
    </div>
  );
}