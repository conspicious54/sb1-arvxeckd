import { Gift, Clock, AlertTriangle, X, Check } from 'lucide-react';
import type { RewardOption } from '../types';

interface RedemptionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reward: {
    name: string;
    image_url: string;
  };
  option: RewardOption;
}

export function RedemptionConfirmation({
  isOpen,
  onClose,
  onConfirm,
  reward,
  option
}: RedemptionConfirmationProps) {
  if (!isOpen) return null;

  // Calculate actual points needed after double points discount
  const displayPoints = option.double_points ? Math.round(option.points / 2) : option.points;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
        style={{
          animation: 'popup 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Gift className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Confirm Redemption
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You are about to redeem:
            </p>
          </div>

          {/* Reward Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={reward.image_url}
                alt={reward.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {reward.name}
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${option.amount}
                </p>
              </div>
            </div>
          </div>

          {/* Points Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Points Required:</span>
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {displayPoints.toLocaleString()} points
                </span>
                {option.double_points && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {option.points.toLocaleString()} points
                  </div>
                )}
              </div>
            </div>
            {option.double_points && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Double points offer applied! Save 50% points</span>
              </div>
            )}
          </div>

          {/* Processing Time Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                Please note that redemption processing may take up to 72 hours. You will receive an email notification once your reward is ready.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirm Redemption
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}