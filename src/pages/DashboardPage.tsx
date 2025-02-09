import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, PartyPopper, Smartphone, X } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { FeaturedOffer } from '../components/FeaturedOffer';
import { OfferCard } from '../components/OfferCard';
import { StreakTracker } from '../components/StreakTracker';
import { LuckySpinner } from '../components/LuckySpinner';
import { RedeemCard } from '../components/RedeemCard';
import { CompletionPopup } from '../components/CompletionPopup';
import { fetchOffers } from '../api';
import type { Offer } from '../types';

type SortOption = 'popular' | 'payout' | 'easy';

export function DashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [showMobileNotice, setShowMobileNotice] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      // Only show notice if on desktop
      setShowMobileNotice(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadOffers = async () => {
      const fetchedOffers = await fetchOffers();
      // Sort by EPC by default
      const sortedOffers = [...fetchedOffers].sort((a, b) => 
        parseFloat(b.epc) - parseFloat(a.epc)
      );
      setOffers(sortedOffers);
    };

    loadOffers();
  }, []);

  const handleOfferComplete = (offerId: number) => {
    console.log('Offer completed:', offerId);
  };

  // Get unique countries and devices from offers
  const countries = Array.from(new Set(offers.flatMap(offer => 
    offer.country.split(',').map(c => c.trim())
  ))).sort();

  const devices = Array.from(new Set(offers.map(offer => offer.device))).sort();

  // Filter and sort offers
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || offer.country.includes(selectedCountry);
    const matchesDevice = selectedDevice === 'all' || offer.device === selectedDevice;
    return matchesSearch && matchesCountry && matchesDevice;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'popular': // This is actually EPC-based sorting
        return parseFloat(b.epc) - parseFloat(a.epc);
      case 'payout':
        return parseFloat(b.payout) - parseFloat(a.payout);
      case 'easy':
        const aScore = (parseFloat(a.epc) * 100) / parseFloat(a.payout);
        const bScore = (parseFloat(b.epc) * 100) / parseFloat(b.payout);
        return bScore - aScore;
      default:
        return 0;
    }
  });

  // Get the featured offer (highest EPC)
  const featuredOffer = sortedOffers.length > 0 ? sortedOffers[0] : null;
  const remainingOffers = sortedOffers.filter(offer => 
    featuredOffer ? offer.offerid !== featuredOffer.offerid : true
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Mobile Notice */}
      {showMobileNotice && !isMobile && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Switch to Mobile for More Earnings!</h3>
                <p className="text-blue-100">Access exclusive mobile app offers and earn up to 3x more points</p>
              </div>
            </div>
            <button
              onClick={() => setShowMobileNotice(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss notice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="mb-12">
        <StatsCard />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Offers Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Offer */}
          {featuredOffer && (
            <div className="mb-8">
              <FeaturedOffer 
                offer={featuredOffer} 
                onComplete={handleOfferComplete} 
              />
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search offers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expanded Filters */}
            {isFilterOpen && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Device
                  </label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Devices</option>
                    {devices.map(device => (
                      <option key={device} value={device}>{device}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="payout">Highest Payout</option>
                    <option value="easy">Easiest Completion</option>
                  </select>
                </div>
              </div>
            )}
          </div>

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
                  onComplete={handleOfferComplete}
                />
              ))}
            </div>
          </div>
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