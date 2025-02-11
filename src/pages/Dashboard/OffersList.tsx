import { useState } from 'react';
import { FeaturedOffer } from '../../components/FeaturedOffer';
import { OfferCard } from '../../components/OfferCard';
import type { Offer } from '../../types';
import { ChevronDown } from 'lucide-react';

interface OffersListProps {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  onComplete: (offerId: number) => void;
}

export function OffersList({ offers, loading, error, onComplete }: OffersListProps) {
  const INITIAL_OFFERS = 7;
  const OFFERS_INCREMENT = 7;
  const [visibleOffers, setVisibleOffers] = useState(INITIAL_OFFERS);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(INITIAL_OFFERS)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-xl">
        {error}
      </div>
    );
  }

  // Separate featured offer from regular offers
  const featuredOffer = offers.length > 0 ? offers[0] : null;
  const regularOffers = offers.filter(offer => 
    featuredOffer ? offer.offerid !== featuredOffer.offerid : true
  );

  // Get currently visible offers
  const currentOffers = regularOffers.slice(0, visibleOffers);
  const hasMoreOffers = visibleOffers < regularOffers.length;

  const handleShowMore = () => {
    setVisibleOffers(prev => Math.min(prev + OFFERS_INCREMENT, regularOffers.length));
  };

  return (
    <div className="space-y-8">
      {/* Featured Offer */}
      {featuredOffer && (
        <div className="mb-12">
          <FeaturedOffer 
            offer={featuredOffer} 
            onComplete={onComplete} 
          />
        </div>
      )}

      {/* Regular Offers */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Offers
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {currentOffers.length} of {regularOffers.length} offers
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-6">
          {currentOffers.map((offer) => (
            <OfferCard
              key={offer.offerid}
              offer={offer}
              onComplete={onComplete}
            />
          ))}
        </div>

        {/* Show More Button */}
        {hasMoreOffers && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleShowMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              Show More Offers
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {regularOffers.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No offers available at this time.
              <br />
              Check back soon for new opportunities!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}