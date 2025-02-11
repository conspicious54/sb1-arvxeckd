import { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(0);
  const OFFERS_PER_PAGE = 5;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(5)].map((_, i) => (
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

  // Calculate pagination
  const totalPages = Math.ceil(regularOffers.length / OFFERS_PER_PAGE);
  const startIndex = currentPage * OFFERS_PER_PAGE;
  const endIndex = startIndex + OFFERS_PER_PAGE;
  const currentPageOffers = regularOffers.slice(startIndex, endIndex);

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
            Showing {startIndex + 1}-{Math.min(endIndex, regularOffers.length)} of {regularOffers.length}
          </div>
        </div>

        {/* Current Page Offers */}
        <div className="space-y-6">
          {currentPageOffers.map((offer) => (
            <OfferCard
              key={offer.offerid}
              offer={offer}
              onComplete={onComplete}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-100 dark:border-gray-800">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`
                  min-w-[40px] h-10 px-4 rounded-lg font-medium transition-all duration-200
                  ${currentPage === index
                    ? 'bg-green-600 text-white shadow-lg shadow-green-100 dark:shadow-none'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
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