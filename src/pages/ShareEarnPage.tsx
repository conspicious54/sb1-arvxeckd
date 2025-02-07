import { useState, useEffect } from 'react';
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail, Users, Sparkles, ChevronRight, Clock, Check, Trophy, Star, Gift, TrendingUp, Crown, Target, Rocket, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getReferralStats, getReferralUrl } from '../lib/referrals';
import type { ReferralStats } from '../lib/referrals';
import { supabase } from '../lib/supabase';

interface ReferralActivity {
  id: string;
  user: string;
  action: 'joined' | 'completed' | 'milestone';
  amount?: number;
  timestamp: Date;
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

export function ShareEarnPage() {
  const [copied, setCopied] = useState(false);
  const [showCopiedEffect, setShowCopiedEffect] = useState(false);
  const [activities, setActivities] = useState<ReferralActivity[]>([]);
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

  // Calculate achievements based on referral stats
  const achievements: Achievement[] = [
    {
      id: 'first-referral',
      icon: <Star className="w-6 h-6" />,
      name: 'First Steps',
      description: 'Get your first referral',
      progress: referralStats?.totalReferrals || 0,
      target: 1,
      reward: 1000,
      completed: (referralStats?.totalReferrals || 0) >= 1
    },
    {
      id: 'power-referrer',
      icon: <Zap className="w-6 h-6" />,
      name: 'Power Referrer',
      description: 'Refer 5 active users',
      progress: referralStats?.totalReferrals || 0,
      target: 5,
      reward: 5000,
      completed: (referralStats?.totalReferrals || 0) >= 5
    },
    {
      id: 'elite',
      icon: <Crown className="w-6 h-6" />,
      name: 'Elite Affiliate',
      description: 'Earn 50,000 points from referrals',
      progress: referralStats?.totalEarned || 0,
      target: 50000,
      reward: 10000,
      completed: (referralStats?.totalEarned || 0) >= 50000
    },
    {
      id: 'conversion',
      icon: <Target className="w-6 h-6" />,
      name: 'Conversion Master',
      description: 'Achieve 70% referral conversion rate',
      progress: parseInt(referralStats?.conversionRate || '0'),
      target: 70,
      reward: 7500,
      completed: parseInt(referralStats?.conversionRate || '0') >= 70
    }
  ];

  const copyToClipboard = async () => {
    if (!referralUrl) return;

    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setShowCopiedEffect(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });

      setTimeout(() => {
        setCopied(false);
        setShowCopiedEffect(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl || '')}`
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl || '')}&text=${encodeURIComponent('Join me on RapidRewards and start earning today! Use my referral link:')}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl || '')}`
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      shareUrl: `mailto:?subject=${encodeURIComponent('Join me on RapidRewards!')}&body=${encodeURIComponent(`Hey! I've been using RapidRewards to earn extra money and thought you might be interested. Use my referral link to join: ${referralUrl}`)}`
    }
  ];

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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
          <Rocket className="w-5 h-5" />
          <span className="font-medium">Earn up to $500/month from referrals!</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Share & Earn{' '}
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text">
            2,000 Points
          </span>
          {' '}Per Referral
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Plus get 10% of their earnings for life! The more friends you invite, the more you both earn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats?.totalReferrals || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats?.pendingReferrals || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Gift className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(referralStats?.totalEarned || 0).toLocaleString()} <span className="text-sm font-normal">pts</span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Potential</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(referralStats?.potentialEarnings || 0).toLocaleString()} <span className="text-sm font-normal">pts</span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rank</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{referralStats?.monthlyRank || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-50 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {referralStats?.conversionRate || '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Referral Link Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-50 dark:border-gray-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Referral Link</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={referralUrl || ''}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  {showCopiedEffect && (
                    <div 
                      className="absolute inset-0 bg-green-500 bg-opacity-10 rounded-xl flex items-center justify-center"
                      style={{ animation: 'fade-out 1s forwards' }}
                    >
                      <div className="bg-green-500 text-white px-3 py-1 rounded-lg">
                        Copied!
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors relative overflow-hidden group"
                >
                  {copied ? (
                    <>
                      <span>Copied!</span>
                      <Check className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <span>Copy Link</span>
                      <Copy className="w-5 h-5" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transform translate-x-full group-hover:translate-x-0 transition-transform" />
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-8 py-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-wrap gap-4">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-white px-6 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 ${platform.color}`}
                  >
                    {platform.icon}
                    <span>Share on {platform.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
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
                        {activity.action === 'joined' && 'joined using your referral link'}
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
        </div>

        {/* Achievements */}
        <div>
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
        </div>
      </div>
    </div>
  );
}