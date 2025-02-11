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
  const OFFERS_PER_TAB = 5;
  const [activeTab, setActiveTab] = useState(0);

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

  // Calculate total tabs needed
  const totalTabs = Math.ceil(remainingOffers.length / OFFERS_PER_TAB);

  // Get current tab's offers
  const currentOffers = remainingOffers.slice(
    activeTab * OFFERS_PER_TAB,
    (activeTab + 1) * OFFERS_PER_TAB
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

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto hide-scrollbar gap-2" style={{ scrollbarWidth: 'none' }}>
            {[...Array(totalTabs)].map((_, index) => {
              const startRange = index * OFFERS_PER_TAB + 1;
              const endRange = Math.min((index + 1) * OFFERS_PER_TAB, remainingOffers.length);
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`
                    flex-none px-6 py-3 text-sm font-medium rounded-t-lg transition-colors
                    ${activeTab === index
                      ? 'text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 border-x border-t border-green-200 dark:border-green-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                  Offers {startRange}-{endRange}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {currentOffers.map((offer) => (
              <div key={offer.offerid} className="p-4">
                <OfferCard
                  offer={offer}
                  onComplete={onComplete}
                />
              </div>
            ))}
          </div>

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

      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}