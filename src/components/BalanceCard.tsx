import { DollarSign, TrendingUp, ArrowUpRight, History } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-green-50 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-5xl font-bold text-white tracking-tight">${balance.toFixed(2)}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-100" />
              <span className="text-green-100 text-sm font-medium">Today's Earnings</span>
            </div>
            <p className="text-xl font-bold text-white">$12.50</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-green-100" />
              <span className="text-green-100 text-sm font-medium">Pending</span>
            </div>
            <p className="text-xl font-bold text-white">$5.00</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
            <span className="text-green-100 text-sm">Active Earnings</span>
          </div>
          <button className="flex items-center gap-1 text-white hover:text-green-100 transition-colors text-sm font-medium group">
            View History
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}