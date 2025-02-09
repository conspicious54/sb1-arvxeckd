import { Gift, CreditCard, DollarSign, Gamepad, Plane } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: 'all' | 'giftcard' | 'cash' | 'gaming' | 'travel';
  onCategoryChange: (category: 'all' | 'giftcard' | 'cash' | 'gaming' | 'travel') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
          selectedCategory === 'all'
            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
        }`}
      >
        <Gift className="w-4 h-4" />
        All Rewards
      </button>
      <button
        onClick={() => onCategoryChange('giftcard')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
          selectedCategory === 'giftcard'
            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
        }`}
      >
        <CreditCard className="w-4 h-4" />
        Gift Cards
      </button>
      <button
        onClick={() => onCategoryChange('cash')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
          selectedCategory === 'cash'
            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
        }`}
      >
        <DollarSign className="w-4 h-4" />
        Cash Rewards
      </button>
      <button
        onClick={() => onCategoryChange('gaming')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
          selectedCategory === 'gaming'
            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
        }`}
      >
        <Gamepad className="w-4 h-4" />
        Gaming
      </button>
      <button
        onClick={() => onCategoryChange('travel')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
          selectedCategory === 'travel'
            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
        }`}
      >
        <Plane className="w-4 h-4" />
        Travel
      </button>
    </div>
  );
}