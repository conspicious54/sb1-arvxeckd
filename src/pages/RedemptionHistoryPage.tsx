import { useState, useEffect } from 'react';
import { Gift, Clock, Check, X, AlertCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Redemption {
  id: string;
  reward_type: string;
  amount: number;
  points_spent: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  processed_at: string | null;
  reward: {
    name: string;
    image_url: string;
  };
}

export function RedemptionHistoryPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRedemptions() {
      try {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          return;
        }

        // Fetch redemptions with reward details
        const { data, error: fetchError } = await supabase
          .from('redemptions')
          .select(`
            *,
            reward:rewards(name, image_url)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setRedemptions(data || []);
      } catch (err) {
        console.error('Error loading redemptions:', err);
        setError('Failed to load redemption history');
      } finally {
        setLoading(false);
      }
    }

    loadRedemptions();

    // Subscribe to redemption status changes
    const channel = supabase
      .channel('redemption_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'redemptions'
        },
        (payload) => {
          setRedemptions(prev => 
            prev.map(redemption => 
              redemption.id === payload.new.id 
                ? { ...redemption, ...payload.new }
                : redemption
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: Redemption['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  const getStatusIcon = (status: Redemption['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/rewards"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rewards
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Redemption History</h1>
        </div>
        <Link
          to="/rewards"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
        >
          Redeem Points
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {redemptions.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Gift className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No redemptions yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start redeeming your points for amazing rewards!
          </p>
          <Link
            to="/rewards"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            Browse Rewards
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {redemptions.map((redemption) => (
            <div
              key={redemption.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center gap-6">
                  <img
                    src={redemption.reward.image_url}
                    alt={redemption.reward.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {redemption.reward.name}
                    </h3>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${redemption.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Points Spent</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {redemption.points_spent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Requested</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(redemption.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {redemption.processed_at && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Processed</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(redemption.processed_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg flex items-center gap-1.5 ${getStatusColor(redemption.status)}`}>
                    {getStatusIcon(redemption.status)}
                    <span className="text-sm font-medium capitalize">
                      {redemption.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}