import { useState } from 'react';
import { X, ExternalLink, Gift, Clock, AlertCircle, ChevronRight, Star, TrendingUp } from 'lucide-react';

interface OfferInstructionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    offerid: number;
    name: string;
    payout: string;
    link: string;
    device: string;
  };
  onStart: () => void;
}

export function OfferInstructionsPopup({ isOpen, onClose, offer, onStart }: OfferInstructionsPopupProps) {
  const [error, setError] = useState<string | null>(null);
  
  // First triple the dollar amount, then convert to points (1000 points = $1)
  const tripleAmount = parseFloat(offer.payout) * 3;
  const pointsEarned = Math.round(tripleAmount * 1000);

  // Determine button text based on device type
  const getButtonText = () => {
    const deviceType = offer.device.toLowerCase();
    if (deviceType.includes('ios') || deviceType.includes('iphone')) {
      return 'Install on App Store';
    }
    if (deviceType.includes('android')) {
      return 'Install on Play Store';
    }
    return 'Start Offer';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl"
        style={{
          animation: 'popup 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Instructions
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Offer Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {offer.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Earn ${tripleAmount.toFixed(2)} or {pointsEarned.toLocaleString()} points</span>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                1
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Install and open the app</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Complete the installation and launch the app</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                2
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Complete required actions</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Follow the instructions within the app</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                3
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Get rewarded</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Points will be credited after verification</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Important:</p>
                <ul className="space-y-1">
                  <li>• Keep the app installed for at least 24 hours</li>
                  <li>• Complete all required actions to earn rewards</li>
                  <li>• Points will be awarded after verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              onStart();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-green-200 dark:shadow-none"
          >
            {getButtonText()}
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popup {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 640px) {
          @keyframes popup {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
}