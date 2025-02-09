import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Clock } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  earnings: number;
  completedOffers: number;
  lastActive: string;
}

// Helper to get today's date as YYYY-MM-DD
const getTodayKey = () => new Date().toISOString().split('T')[0];

// Helper to mask name (e.g., "John Smith" -> "J******")
const maskName = (name: string) => {
  const [first, ...rest] = name.split(' ');
  return `${first[0]}${'*'.repeat(6)}`;
};

// Generate consistent random data for a given day
const generateDailyData = (date: string): LeaderboardEntry[] => {
  const names = [
    'Emma Thompson', 'James Wilson', 'Sophia Chen', 'Lucas Garcia', 'Olivia Brown',
    'Ethan Taylor', 'Ava Martinez', 'Noah Anderson', 'Isabella Lee', 'William Kim',
    'Mia Johnson', 'Alexander Davis', 'Charlotte White', 'Benjamin Moore', 'Amelia Clark',
    'Daniel Rodriguez', 'Harper Lewis', 'Matthew Turner', 'Elizabeth Hall', 'David Wright',
    'Victoria Scott', 'Joseph King', 'Grace Baker', 'Samuel Green', 'Chloe Adams'
  ];

  // Use the date string to seed the random numbers
  const seed = date.split('-').join('');
  const seededRandom = (index: number) => {
    const x = Math.sin(Number(seed) + index) * 10000;
    return x - Math.floor(x);
  };

  return names.map((name, index) => {
    // Generate earnings between $5 and $200 based on the date and user index
    const baseEarnings = 5 + Math.floor(seededRandom(index) * 195);
    // Time of day affects earnings (later = more earnings)
    const hourMultiplier = new Date().getHours() / 24;
    const earnings = Math.floor(baseEarnings * (1 + hourMultiplier));

    return {
      id: `user-${index + 1}`,
      name: maskName(name),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
      earnings,
      completedOffers: Math.floor(3 + seededRandom(index + 100) * 17), // 3-20 offers
      lastActive: `${Math.floor(seededRandom(index + 200) * 59 + 1)}m ago`
    };
  });
};

// Helper to occasionally update an entry
const updateRandomEntry = (entries: LeaderboardEntry[]): LeaderboardEntry[] => {
  const index = Math.floor(Math.random() * entries.length);
  const entry = entries[index];
  
  // Small random increase in earnings (1-5 dollars)
  const increase = 1 + Math.floor(Math.random() * 4);
  
  return entries.map((e, i) => 
    i === index ? {
      ...e,
      earnings: e.earnings + increase,
      completedOffers: e.completedOffers + 1,
      lastActive: '1m ago'
    } : e
  );
};

export function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'earnings' | 'offers'>('earnings');

  // Initialize and manage leaderboard data
  useEffect(() => {
    const todayKey = getTodayKey();
    const storedData = localStorage.getItem(`leaderboard_${todayKey}`);
    
    if (storedData) {
      setLeaderboardData(JSON.parse(storedData));
    } else {
      // If no data for today, generate new data
      const newData = generateDailyData(todayKey);
      setLeaderboardData(newData);
      localStorage.setItem(`leaderboard_${todayKey}`, JSON.stringify(newData));
    }

    // Occasionally update random entries
    const interval = setInterval(() => {
      setLeaderboardData(prev => {
        const updated = updateRandomEntry(prev);
        localStorage.setItem(`leaderboard_${todayKey}`, JSON.stringify(updated));
        return updated;
      });
    }, 30000); // Update every 30 seconds

    // Reset data at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightReset = setTimeout(() => {
      const newData = generateDailyData(getTodayKey());
      setLeaderboardData(newData);
      localStorage.setItem(`leaderboard_${getTodayKey()}`, JSON.stringify(newData));
    }, timeUntilMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightReset);
    };
  }, []);

  const sortedData = [...leaderboardData].sort((a, b) => 
    sortBy === 'earnings' ? b.earnings - a.earnings : b.completedOffers - a.completedOffers
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Today's Top Earners</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Daily leaderboard resets at midnight. Keep completing offers to climb the ranks!
        </p>
      </div>

      {/* Top 3 Winners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {sortedData.slice(0, 3).map((entry, index) => (
          <div
            key={entry.id}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-200"
          >
            <div className="absolute top-4 left-4">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                  index === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300' : 
                  'bg-orange-300 text-orange-900'}
              `}>
                #{index + 1}
              </div>
            </div>
            <div className="p-6 text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="rounded-full object-cover w-full h-full"
                />
                {index === 0 && (
                  <Trophy className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{entry.name}</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                ${entry.earnings.toFixed(2)}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{entry.completedOffers} offers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{entry.lastActive}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Performers</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'earnings' | 'offers')}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="earnings">Sort by Earnings</option>
              <option value="offers">Sort by Completed Offers</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed Offers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedData.slice(3).map((entry, index) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{index + 4}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full" src={entry.avatar} alt="" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">${entry.earnings.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{entry.completedOffers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{entry.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}