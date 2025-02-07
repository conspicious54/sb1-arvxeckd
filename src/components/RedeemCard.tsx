import { GiftIcon, ArrowRight, Sparkles } from 'lucide-react';

export function RedeemCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-green-100 dark:border-gray-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Redeem</h3>
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
            <GiftIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Best Value: Amazon $50</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              style={{ width: '65%' }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">3,250 / 5,000 points</span>
            <span className="text-green-600 dark:text-green-400 font-medium">65%</span>
          </div>
        </div>

        <button 
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-green-100 dark:shadow-none"
          onClick={() => alert('Redeem functionality coming soon!')}
        >
          Redeem Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}