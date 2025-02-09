import { useEffect, useState } from 'react';
import { TrendingUp, Users, Clock, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserStats {
  total_earnings: number;
  completed_offers: number;
  streak_count: number;
  last_offer_completion: string | null;
}

export function StatsCard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Initial fetch
        const { data, error } = await supabase
          .from('profiles')
          .select('total_earnings, completed_offers, streak_count, last_offer_completion')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setStats(data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserStats();

    // Subscribe to changes
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          setStats(payload.new as UserStats);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate time since last offer
  const getTimeSinceLastOffer = () => {
    if (!stats?.last_offer_completion) return 'No offers completed';
    
    const lastOfferDate = new Date(stats.last_offer_completion);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastOfferDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-green-50 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Current Points',
      value: stats ? `${stats.total_earnings.toLocaleString()} pts` : '0 pts',
      icon: <Award className="w-5 h-5 text-green-600 dark:text-green-400" />,
      color: 'green'
    },
    {
      label: 'Completed Offers',
      value: stats?.completed_offers.toString() || '0',
      icon: <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'blue'
    },
    {
      label: 'Current Streak',
      value: stats?.streak_count.toString() || '0',
      icon: <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'purple'
    },
    {
      label: 'Last Completion',
      value: getTimeSinceLastOffer(),
      icon: <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-green-50 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200 group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 dark:from-gray-700/50 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:translate-y-[-4rem] transition-transform duration-300"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 bg-${stat.color}-50 dark:bg-${stat.color}-900/30 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}