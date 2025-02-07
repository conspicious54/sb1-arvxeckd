import { Sparkles, ExternalLink, Timer, Star, Shield, TrendingUp, Users, ChevronRight, Globe, DollarSign } from 'lucide-react';
import { useState } from 'react';
import type { Offer } from '../types';
import { CompletionPopup } from './CompletionPopup';

interface FeaturedOfferProps {
  offer: Offer;
  onComplete: (offerId: number) => void;
}

export function FeaturedOffer({ offer, onComplete }: FeaturedOfferProps) {
  const [showCompletion, setShowCompletion] = useState(false);
  const pointsAmount = Math.round(parseFloat(offer.payout) * 100);

  const handleComplete = () => {
    onComplete(offer.offerid);
    setShowCompletion(true);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          {offer.picture && (
            <>
              <img
                src={offer.picture}
                alt={offer.name_short}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/95 via-green-900/70 to-transparent"></div>
            </>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full flex items-center gap-1.5 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Featured Offer
            </div>
            <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-1.5 rounded-full flex items-center gap-1.5 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              Verified
            </div>
          </div>
        </div>
        <div className="p-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Star className="w-4 h-4" />
                  Highest Reward
                </div>
                <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Timer className="w-4 h-4" />
                  Limited Time
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">{offer.name_short}</h2>
              <p className="text-green-100 text-lg mb-6 leading-relaxed">{offer.adcopy}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4 text-green-200" />
                    <span className="text-green-200 text-sm">Time Required</span>
                  </div>
                  <p className="text-xl font-semibold text-white">15 mins</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-200" />
                    <span className="text-green-200 text-sm">Popularity</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{offer.epc}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-green-200" />
                    <span className="text-green-200 text-sm">Completions</span>
                  </div>
                  <p className="text-xl font-semibold text-white">5k+</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-200" />
                <div className="flex flex-wrap gap-2">
                  {offer.country.split(',').map((country) => (
                    <span 
                      key={country.trim()} 
                      className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm"
                    >
                      {country.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center">
              <div className="mb-6">
                <div className="text-green-200 text-sm mb-2">Cash Reward</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <DollarSign className="w-8 h-8 text-white" />
                  <div className="text-4xl font-bold text-white">{offer.payout}</div>
                </div>
                <div className="text-green-200 text-sm mb-4">or</div>
                <div className="text-2xl font-bold text-white mb-1">{pointsAmount.toLocaleString()}</div>
                <div className="text-green-200 text-sm">points</div>
              </div>
              <button
                onClick={handleComplete}
                className="w-full bg-white hover:bg-green-50 text-green-700 px-6 py-3.5 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 group shadow-lg"
              >
                Complete Featured Offer
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-green-200 text-sm mt-4">
                Limited time offer - Complete now!
              </p>
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