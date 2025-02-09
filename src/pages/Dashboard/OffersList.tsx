import { FeaturedOffer } from '../../components/FeaturedOffer';
import { OfferCard } from '../../components/OfferCard';
import type { Offer } from '../../types';

interface OffersListProps {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  onComplete: (offerId: number) => void;
}

export function OffersList({ offers, loading, error, onComplete }: OffersListProps) {
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl" />
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

  const featuredOffer = offers.length > 0 ? offers[0] : null;
  const remainingOffers = offers.filter(offer => 
    featuredOffer ? offer.offerid !== featuredOffer.offerid : true
  );

  return (
    <div className="space-y-6">
      {/* Featured Offer */}
      {featuredOffer && (
        <div className="mb-8">
          <FeaturedOffer 
            offer={featuredOffer} 
            onComplete={onComplete} 
          />
        </div>
      )}

      {/* Regular Offers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Offers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {remainingOffers.length} offers
          </p>
        </div>
        <div className="space-y-6">
          {remainingOffers.map((offer) => (
            <OfferCard
              key={offer.offerid}
              offer={offer}
              onComplete={onComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}