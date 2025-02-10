import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Clock, Check, X, AlertCircle, ChevronRight, ArrowRight, Star, TrendingUp, Crown, Target, Rocket, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import { completeOffer } from '../lib/offers';

interface CompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    offerid: number;
    name: string;
    payout: string;
  };
}

export function CompletionPopup({ isOpen, onClose, offer }: CompletionPopupProps) {
  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Multiply points by 3 (1000 points = $1)
  const pointsEarned = Math.round(parseFloat(offer.payout) * 3000);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !isProcessing && !isCompleted) {
      handleCompletion();
    }
  }, [isOpen]);

  const handleCompletion = async () => {
    if (isProcessing || isCompleted) return;
    
    setIsProcessing(true);
    
    try {
      // Process the offer completion
      const result = await completeOffer(offer.offerid, offer.name, offer.payout);
      
      if (!result.success) {
        console.error('Failed to complete offer:', result.error);
        setError(result.error);
        return;
      }

      setIsCompleted(true);

      // Play success sound
      playSuccess();

      // Trigger confetti
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#22c55e', '#10b981', '#fbbf24', '#f59e0b']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#22c55e', '#10b981', '#fbbf24', '#f59e0b']
        });
      }, 250);

      return () => clearInterval(interval);
    } catch (err) {
      console.error('Error processing completion:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsCompleted(false);
      setError(null);
    }
  }, [isOpen]);

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
              {error ? 'Oops!' : 'Congratulations!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {error ? (
                error
              ) : (
                <>
                  You've successfully completed
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
                <p className="text-green-50 text-sm mb-2">You earned</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-8 h-8 text-white" />
                  <span className="text-4xl font-bold text-white animate-gradient-text">
                    {pointsEarned.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-100 text-sm">or</span>
                  <span className="font-bold text-white">
                    ${offer.payout}
                  </span>
                  <span className="text-green-100 text-sm">cash</span>
                </div>
              </div>
            )}
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
                  onClick={() => navigate('/rewards')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-green-200 dark:shadow-none pulse-glow"
                >
                  <Gift className="w-5 h-5" />
                  Redeem Rewards
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  Keep Earning
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