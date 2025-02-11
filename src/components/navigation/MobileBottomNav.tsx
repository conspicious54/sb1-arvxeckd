import { Home, Gift, Trophy, Users, Rocket } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Offers', path: '/dashboard' },
    { icon: Gift, label: 'Rewards', path: '/rewards' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Users, label: 'Share', path: '/share' },
    { icon: Rocket, label: 'Games', path: '/rocket-game' }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center py-2 px-4 ${
              location.pathname === item.path
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}