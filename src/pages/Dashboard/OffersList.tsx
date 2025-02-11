import { useState } from 'react';
import { FeaturedOffer } from '../../components/FeaturedOffer';
import { OfferCard } from '../../components/OfferCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Offer } from '../../types';

interface OffersListProps {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  onComplete: (offerId: number) => void;
}

export function OffersList({ offers, loading, error, onComplete }: OffersListProps) {
  const OFFERS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
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

  const featuredOffer = offers.length > 0 ? offers[0] : null;
  const remainingOffers = offers.filter(offer => 
    featuredOffer ? offer.offerid !== featuredOffer.offerid : true
  );

  // Calculate total pages
  const totalPages = Math.ceil(remainingOffers.length / OFFERS_PER_PAGE);

  // Get current page offers
  const currentOffers = remainingOffers.slice(
    currentPage * OFFERS_PER_PAGE,
    (currentPage + 1) * OFFERS_PER_PAGE
  );

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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Offers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {currentOffers.length} of {remainingOffers.length} offers
          </p>
        </div>

        {/* Offers Grid */}
        <div className="space-y-6">
          {currentOffers.map((offer) => (
            <OfferCard
              key={offer.offerid}
              offer={offer}
              onComplete={onComplete}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === index
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-4 sm:hidden">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {currentOffers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No more offers available at this time.
              <br />
              Check back soon for new opportunities!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}