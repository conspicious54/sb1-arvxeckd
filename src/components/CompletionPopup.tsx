import { useState } from 'react';
import { Gift, Clock, ExternalLink, AlertCircle, ChevronRight, Star, TrendingUp, Crown, Target, Rocket, Zap } from 'lucide-react';
import { trackOfferStart } from '../lib/offers';

interface CompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    offerid: number;
    name: string;
    payout: string;
    link: string;
  };
}

export function CompletionPopup({ isOpen, onClose, offer }: CompletionPopupProps) {
  const [error, setError] = useState<string | null>(null);
  
  // First triple the dollar amount, then convert to points (1000 points = $1)
  const tripleAmount = parseFloat(offer.payout) * 3;
  const pointsEarned = Math.round(tripleAmount * 1000);

  const handleStartOffer = async () => {
    try {
      // Track that user started the offer
      await trackOfferStart(offer.offerid);
      
      // Open offer in new tab
      window.open(offer.link, '_blank');
      
      // Close the popup
      onClose();
    } catch (err) {
      console.error('Error starting offer:', err);
      setError('Failed to start offer. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
        style={{
          animation: 'popup 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping bg-green-400 rounded-full opacity-25"></div>
              <div className="relative p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg animate-bounce-subtle">
                {error ? (
                  <AlertCircle className="w-8 h-8 text-white" />
                ) : (
                  <Gift className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-full animate-float-fast">
                <Star className="w-4 h-4 text-yellow-900" />
              </div>
              <div className="absolute -bottom-2 -left-2 p-2 bg-blue-500 rounded-full animate-float-medium">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
              {error ? 'Oops!' : 'Ready to Earn?'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {error ? (
                error
              ) : (
                <>
                  You're about to start
                  <br />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {offer.name}
                  </span>
                </>
              )}
            </p>

            {/* Earnings Display */}
            {!error && (
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg mb-6 animate-fade-in-up hover-card-rise" style={{ animationDelay: '0.4s' }}>
                <p className="text-green-50 text-sm mb-2">Potential Earnings</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-8 h-8 text-white" />
                  <span className="text-4xl font-bold text-white animate-gradient-text">
                    ${tripleAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-100 text-sm">or</span>
                  <span className="font-bold text-white">
                    {pointsEarned.toLocaleString()}
                  </span>
                  <span className="text-green-100 text-sm">points</span>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Important Instructions
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• Complete all required steps to earn rewards</li>
                <li>• Points will be awarded after verification</li>
                <li>• This may take up to 24 hours</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {error ? (
              <button
                onClick={onClose}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                Try Again
              </button>
            ) : (
              <>
                <button
                  onClick={handleStartOffer}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-green-200 dark:shadow-none pulse-glow"
                >
                  Start Offer
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </>
            )}
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