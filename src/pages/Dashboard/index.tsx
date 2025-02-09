import { useState, useEffect } from 'react';
import { fetchOffers } from '../../api';
import type { Offer } from '../../types';
import { StatsCard } from '../../components/StatsCard';
import { OffersList } from './OffersList';
import { FilterBar } from './FilterBar';
import { MobileNotice } from './MobileNotice';

export function DashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const fetchedOffers = await fetchOffers();
        // Sort by EPC by default
        const sortedOffers = [...fetchedOffers].sort((a, b) => 
          parseFloat(b.epc) - parseFloat(a.epc)
        );
        setOffers(sortedOffers);
      } catch (err) {
        console.error('Error loading offers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load offers');
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const handleOfferComplete = (offerId: number) => {
    console.log('Offer completed:', offerId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <MobileNotice />

      {/* Stats Overview */}
      <div className="mb-12">
        <StatsCard />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Offers Column */}
        <div className="lg:col-span-2 space-y-8">
          <FilterBar />
          <OffersList 
            offers={offers}
            loading={loading}
            error={error}
            onComplete={handleOfferComplete}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <StreakTracker />
          <LuckySpinner />
          <RedeemCard />
        </div>
      </div>
    </div>
  );
}