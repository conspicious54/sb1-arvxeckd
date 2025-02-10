import { useState } from 'react';
import { Star, Sparkles, Timer, Lock, ChevronRight } from 'lucide-react';
import type { Reward } from '../../lib/rewards';
import { redeemReward } from '../../lib/rewards';
import { RedemptionConfirmation } from '../../components/RedemptionConfirmation';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';

interface RewardsListProps {
  featuredRewards: Reward[];
  regularRewards: Reward[];
  userPoints: number;
  loading: boolean;
  error: string | null;
}

export function RewardsList({ featuredRewards, regularRewards, userPoints, loading, error }: RewardsListProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedReward, setSelectedReward] = useState<{
    reward: Reward;
    option: Reward['options'][0];
  } | null>(null);
  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });

  const handleRedeem = async (reward: Reward, option: Reward['options'][0]) => {
    setSelectedReward({ reward, option });
    setShowConfirmation(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      const result = await redeemReward(selectedReward.reward.id, selectedReward.option.id);
      
      if (result.success) {
        // Play success sound
        playSuccess();

        // Trigger confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#10b981', '#fbbf24', '#f59e0b']
        });

        // Show success message with animation
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
        successMessage.textContent = 'Redemption successful! Check your email for further instructions.';
        document.body.appendChild(successMessage);

        // Remove message after animation
        setTimeout(() => {
          successMessage.classList.add('animate-slide-out');
          setTimeout(() => successMessage.remove(), 500);
        }, 3000);
      } else {
        // Show error message
        alert(result.error || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('An error occurred while redeeming the reward');
    } finally {
      setShowConfirmation(false);
      setSelectedReward(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Featured Rewards */}
      {featuredRewards.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Rewards</h2>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {featuredRewards.map((reward) => (
              <FeaturedRewardCard
                key={reward.id}
                reward={reward}
                userPoints={userPoints}
                onRedeem={handleRedeem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Rewards */}
      <div className="grid grid-cols-1 gap-8">
        {regularRewards.map((reward) => (
          <RegularRewardCard
            key={reward.id}
            reward={reward}
            userPoints={userPoints}
            onRedeem={handleRedeem}
          />
        ))}
      </div>

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <RedemptionConfirmation
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setSelectedReward(null);
          }}
          onConfirm={handleConfirmRedeem}
          reward={selectedReward.reward}
          option={selectedReward.option}
        />
      )}
    </div>
  );
}

function FeaturedRewardCard({ reward, userPoints, onRedeem }: {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward, option: Reward['options'][0]) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl overflow-hidden group">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="relative h-full">
            <img
              src={reward.image_url}
              alt={reward.name}
              className="w-full h-full object-cover md:absolute inset-0 group-hover:scale-105 transition-transform duration-500"
              style={{ minHeight: '300px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-t"></div>
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                <Star className="w-4 h-4" />
                Featured
              </div>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Double Points
              </div>
              {reward.expires_at && (
                <div className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Timer className="w-4 h-4" />
                  Limited Time
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-3xl font-bold text-white mb-2">{reward.name}</h3>
              <p className="text-white/90 text-lg">{reward.description}</p>
            </div>
          </div>
        </div>
        <div className="md:w-2/3 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reward.options.map((option) => {
              const displayPoints = option.double_points ? Math.round(option.points / 2) : option.points;
              return (
                <div
                  key={option.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center border-2 border-white/20 hover:border-white/40 transition-all duration-200"
                >
                  <span className="text-3xl font-bold text-white mb-2">
                    ${option.amount}
                  </span>
                  <div className="flex flex-col items-center mb-4">
                    <span className="text-sm text-green-100">Only</span>
                    <span className="text-xl font-bold text-white">
                      {displayPoints.toLocaleString()} <span className="text-sm">pts</span>
                    </span>
                    {option.double_points && (
                      <span className="text-xs text-green-100 mt-1">Double points offer!</span>
                    )}
                  </div>
                  <button
                    onClick={() => onRedeem(reward, option)}
                    disabled={userPoints < displayPoints}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      userPoints >= displayPoints
                        ? 'bg-white hover:bg-green-50 text-green-600'
                        : 'bg-white/50 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    {userPoints >= displayPoints ? (
                      <>
                        Redeem Now
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Need {displayPoints.toLocaleString()} pts
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegularRewardCard({ reward, userPoints, onRedeem }: {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward, option: Reward['options'][0]) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-green-50 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200 group">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="relative h-full">
            <img
              src={reward.image_url}
              alt={reward.name}
              className={`w-full h-full object-cover md:absolute inset-0 ${reward.coming_soon ? 'filter blur-sm' : ''} group-hover:scale-105 transition-transform duration-500`}
              style={{ minHeight: '300px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-t"></div>
            <div className="absolute top-4 left-4 flex gap-2">
              {reward.popular && (
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Popular
                </div>
              )}
              {reward.new && (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  New
                </div>
              )}
              {reward.coming_soon && (
                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Timer className="w-4 h-4" />
                  Coming Soon
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{reward.name}</h3>
              <p className="text-white/90">{reward.description}</p>
            </div>
          </div>
        </div>
        <div className="md:w-2/3 p-6">
          {reward.coming_soon ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Lock className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This reward option will be available soon. Stay tuned!
              </p>
              <button
                className="px-6 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-medium"
                onClick={() => alert('We\'ll notify you when this reward becomes available!')}
              >
                Notify Me
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reward.options.map((option) => {
                const displayPoints = option.double_points ? Math.round(option.points / 2) : option.points;
                return (
                  <div
                    key={option.id}
                    className={`rounded-xl p-6 flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                      userPoints >= displayPoints
                        ? 'border-green-100 hover:border-green-300 bg-green-50/50 dark:bg-green-900/10'
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 opacity-60'
                    }`}
                  >
                    <span className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      ${option.amount}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {displayPoints.toLocaleString()} points
                    </span>
                    <button
                      onClick={() => onRedeem(reward, option)}
                      disabled={userPoints < displayPoints}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        userPoints >= displayPoints
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200/50'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {userPoints >= displayPoints ? (
                        <>
                          Redeem Now
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Need {displayPoints.toLocaleString()} pts
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}