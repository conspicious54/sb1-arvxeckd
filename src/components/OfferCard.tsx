import { ExternalLink, Globe, Monitor, Clock, Star, ChevronRight, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { useState } from 'react';
import type { Offer } from '../types';
import { CompletionPopup } from './CompletionPopup';

interface OfferCardProps {
  offer: Offer;
  onComplete: (offerId: number) => void;
}

export function OfferCard({ offer, onComplete }: OfferCardProps) {
  const [showCompletion, setShowCompletion] = useState(false);
  // Multiply points by 3 (1000 points = $1)
  const pointsAmount = Math.round(parseFloat(offer.payout) * 3000);
  // Calculate cash equivalent (points / 1000)
  const cashEquivalent = (pointsAmount / 1000).toFixed(2);

  const handleComplete = () => {
    onComplete(offer.offerid);
    setShowCompletion(true);
  };

  return (
    <>
      <div className="group relative">
        {/* Hover Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-emerald-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-50 dark:border-gray-700 group-hover:border-green-200 dark:group-hover:border-green-600">
          <div className="flex h-28">
            {offer.picture && (
              <div className="w-28 relative flex-shrink-0 overflow-hidden">
                <img 
                  src={offer.picture} 
                  alt={offer.name_short}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute top-2 left-2">
                  <div className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 transform -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <Sparkles className="w-3 h-3" />
                    Easy
                  </div>
                </div>
                {/* Cash Reward Badge */}
                <div className="absolute bottom-2 left-2">
                  <div className="bg-white/90 backdrop-blur-sm text-green-600 px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {cashEquivalent}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex-1 p-4 flex flex-col justify-between relative">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                      {offer.name_short}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 group-hover:line-clamp-2 transition-all duration-300">
                      {offer.adcopy}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-lg h-fit transform translate-y-0 opacity-100 group-hover:-translate-y-1 group-hover:opacity-0 transition-all duration-200">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-medium whitespace-nowrap">HIGH</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>~15 mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Monitor className="w-3 h-3" />
                    <span>{offer.device}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Globe className="w-3 h-3" />
                    <span>{offer.country.split(',')[0].trim()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="transform group-hover:translate-x-2 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Earn</p>
                      <div className="flex items-baseline gap-1">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {cashEquivalent}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">cash</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">or</p>
                      <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                        {pointsAmount.toLocaleString()} <span className="text-xs">pts</span>
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleComplete}
                  className="relative overflow-hidden flex items-center gap-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 text-sm font-medium group/btn"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    Start
                    <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CompletionPopup
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        offer={offer}
      />
    </>
  );
}