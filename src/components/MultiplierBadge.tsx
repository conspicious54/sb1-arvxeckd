import { Star, Flame, Gift } from 'lucide-react';
import { useMultiplier } from '../context/MultiplierContext';

export function MultiplierBadge() {
  const { multiplier, source } = useMultiplier();

  if (multiplier === 1) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse">
      {source === 'streak' ? (
        <Flame className="w-4 h-4" />
      ) : source === 'spinner' ? (
        <Gift className="w-4 h-4" />
      ) : (
        <Star className="w-4 h-4" />
      )}
      <span className="font-medium">{multiplier.toFixed(1)}x</span>
    </div>
  );
}