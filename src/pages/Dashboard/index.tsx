import { useState, useEffect } from 'react';
import { fetchOffers } from '../../api';
import type { Offer } from '../../types';
import { StatsCard } from '../../components/StatsCard';
import { OffersList } from './OffersList';
import { FilterBar } from './FilterBar';
import { MobileNotice } from './MobileNotice';
import { StreakTracker } from '../../components/StreakTracker';
import { LuckySpinner } from '../../components/LuckySpinner';
import { RedeemCard } from '../../components/RedeemCard';

export function DashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: 'all',
    device: 'all',
    sortBy: 'popular' as 'popular' | 'payout' | 'easy'
  });

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);
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

  // Filter and sort offers based on search and filters
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filters.country === 'all' || offer.country.includes(filters.country);
    const matchesDevice = filters.device === 'all' || offer.device === filters.device;
    return matchesSearch && matchesCountry && matchesDevice;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (filters.sortBy) {
      case 'payout':
        return parseFloat(b.payout) - parseFloat(a.payout);
      case 'easy':
        const aScore = (parseFloat(a.epc) * 100) / parseFloat(a.payout);
        const bScore = (parseFloat(b.epc) * 100) / parseFloat(b.payout);
        return bScore - aScore;
      default: // 'popular'
        return parseFloat(b.epc) - parseFloat(a.epc);
    }
  });

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
          {/* Mobile Streak Tracker - Only visible on mobile */}
          <div className="lg:hidden mb-8">
            <StreakTracker />
          </div>

          {/* Search and Filters */}
          <FilterBar
            onSearch={setSearchQuery}
            onFilterChange={setFilters}
          />

          {/* Offers List */}
          <OffersList 
            offers={sortedOffers}
            loading={loading}
            error={error}
            onComplete={handleOfferComplete}
          />
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-8">
          <StreakTracker />
          <LuckySpinner />
          <RedeemCard />
        </div>
      </div>
    </div>
  );
}