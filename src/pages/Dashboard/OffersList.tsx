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
  const [activeTab, setActiveTab] = useState(0);
  const OFFERS_PER_TAB = 5;

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

  // Split offers into tabs
  const totalTabs = Math.ceil(regularOffers.length / OFFERS_PER_TAB);
  const tabOffers = Array.from({ length: totalTabs }, (_, i) => 
    regularOffers.slice(i * OFFERS_PER_TAB, (i + 1) * OFFERS_PER_TAB)
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Offers
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {regularOffers.length} offers available
          </div>
        </div>

        {/* Offers in Current Tab */}
        <div className="space-y-6">
          {tabOffers[activeTab]?.map((offer) => (
            <OfferCard
              key={offer.offerid}
              offer={offer}
              onComplete={onComplete}
            />
          ))}
        </div>

        {/* Tabs Navigation */}
        {totalTabs > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
              {tabOffers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`
                    relative px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200
                    ${activeTab === index
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  {/* Active Tab Background */}
                  {activeTab === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg transition-all duration-200" />
                  )}
                  
                  {/* Tab Content */}
                  <span className="relative z-10">
                    Tab {index + 1}
                  </span>
                </button>
              ))}
            </div>
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