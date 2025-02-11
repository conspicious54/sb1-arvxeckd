import { useState } from 'react';
import { ExternalLink, Globe, Monitor, Clock, Star, ChevronRight, Sparkles, TrendingUp, DollarSign, Loader2, X } from 'lucide-react';
import type { Offer } from '../types';
import { trackOfferStart } from '../lib/offers';
import { OfferInstructionsPopup } from './OfferInstructionsPopup';

interface OfferCardProps {
  offer: Offer;
  onComplete: (offerId: number) => void;
}

export function FeaturedOffer({ offer, onComplete }: OfferCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Multiply points by 3 (1000 points = $1)
  const pointsAmount = Math.round(parseFloat(offer.payout) * 3000);
  // Calculate cash equivalent (points / 1000)
  const cashEquivalent = (pointsAmount / 1000).toFixed(2);

  const handleStartOffer = async () => {
    try {
      setIsStarted(true);
      setIsChecking(true);
      
      // Track that user started the offer
      await trackOfferStart(offer.offerid);
      
      // Open offer in new tab
      window.open(offer.link, '_blank');
    } catch (error) {
      console.error('Error starting offer:', error);
      setIsStarted(false);
      setIsChecking(false);
    }
  };

  const handleCancelOffer = () => {
    setIsStarted(false);
    setIsChecking(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl overflow-hidden group">
        <div className="relative">
          {offer.picture && (
            <>
              <div className="relative h-40 md:h-72">
                <img
                  src={offer.picture}
                  alt={offer.name_short}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/95 via-green-900/70 to-transparent"></div>
              </div>
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Featured
                </div>
                <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  Best Offer
                </div>
              </div>
            </>
          )}
          <div className="p-4 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 md:mb-4 flex-wrap">
                  <div className="bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    ~15 mins
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    HIGH
                  </div>
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3">{offer.name_short}</h2>
                <p className="text-sm md:text-lg text-green-100 mb-4 md:mb-6 line-clamp-2 md:line-clamp-none">{offer.adcopy}</p>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
                    <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 text-green-200" />
                      <span className="text-green-200 text-xs md:text-sm">Time</span>
                    </div>
                    <p className="text-sm md:text-xl font-semibold text-white">15 mins</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
                    <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                      <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-200" />
                      <span className="text-green-200 text-xs md:text-sm">Rate</span>
                    </div>
                    <p className="text-sm md:text-xl font-semibold text-white">HIGH</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
                    <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                      <Monitor className="w-3 h-3 md:w-4 md:h-4 text-green-200" />
                      <span className="text-green-200 text-xs md:text-sm">Device</span>
                    </div>
                    <p className="text-sm md:text-xl font-semibold text-white">{offer.device}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-200" />
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {offer.country.split(',').map((country) => (
                      <span 
                        key={country.trim()} 
                        className="px-2 py-0.5 md:px-2.5 md:py-1 bg-white/10 backdrop-blur-sm text-white rounded-lg text-xs md:text-sm"
                      >
                        {country.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:w-80 bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 flex flex-col items-center text-center">
                <div className="mb-4 md:mb-6">
                  <div className="text-green-200 text-xs md:text-sm mb-1 md:mb-2">Cash Reward</div>
                  <div className="flex items-center justify-center gap-1 mb-1 md:mb-2">
                    <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    <div className="text-2xl md:text-4xl font-bold text-white">{cashEquivalent}</div>
                  </div>
                  <div className="text-green-200 text-xs md:text-sm mb-2 md:mb-4">or</div>
                  <div className="text-xl md:text-2xl font-bold text-white mb-1">{pointsAmount.toLocaleString()}</div>
                  <div className="text-xs md:text-sm text-green-200">points</div>
                </div>

                {isStarted ? (
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-1 text-white flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking completion...
                    </div>
                    <button
                      onClick={handleCancelOffer}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      // On mobile, show instructions popup
                      if (window.innerWidth < 768) {
                        setShowInstructions(true);
                      } else {
                        handleStartOffer();
                      }
                    }}
                    className="w-full bg-white hover:bg-green-50 text-green-700 px-4 md:px-6 py-2 md:py-3.5 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 group shadow-lg z-10"
                  >
                    Start Featured Offer
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                <p className="text-xs md:text-sm text-green-200 mt-2 md:mt-4">
                  Limited time offer - Complete now!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Popup */}
      <OfferInstructionsPopup
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        offer={offer}
        onStart={handleStartOffer}
      />
    </>
  );
}