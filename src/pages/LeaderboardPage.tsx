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

// Generate random data
const generateRandomData = (): LeaderboardEntry[] => {
  const names = [
    'Emma Thompson', 'James Wilson', 'Sophia Chen', 'Lucas Garcia', 'Olivia Brown',
    'Ethan Taylor', 'Ava Martinez', 'Noah Anderson', 'Isabella Lee', 'William Kim',
    'Mia Johnson', 'Alexander Davis', 'Charlotte White', 'Benjamin Moore', 'Amelia Clark',
    'Daniel Rodriguez', 'Harper Lewis', 'Matthew Turner', 'Elizabeth Hall', 'David Wright',
    'Victoria Scott', 'Joseph King', 'Grace Baker', 'Samuel Green', 'Chloe Adams'
  ];

  return names.map((name, index) => ({
    id: `user-${index + 1}`,
    name,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(' ', '')}`,
    earnings: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    completedOffers: Math.floor(Math.random() * 20 + 5),
    lastActive: `${Math.floor(Math.random() * 59 + 1)}m ago`
  }));
};

export function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'earnings' | 'offers'>('earnings');

  // Initialize data
  useEffect(() => {
    setLeaderboardData(generateRandomData());
  }, []);

  // Update random entries periodically
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setLeaderboardData(prevData => {
        const newData = [...prevData];
        // Update 2 random entries
        for (let i = 0; i < 2; i++) {
          const randomIndex = Math.floor(Math.random() * newData.length);
          newData[randomIndex] = {
            ...newData[randomIndex],
            earnings: parseFloat((Math.random() * 500 + 50).toFixed(2)),
            completedOffers: Math.floor(Math.random() * 20 + 5),
            lastActive: `${Math.floor(Math.random() * 59 + 1)}m ago`
          };
        }
        return newData;
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(updateInterval);
  }, []);

  const sortedData = [...leaderboardData].sort((a, b) => 
    sortBy === 'earnings' ? b.earnings - a.earnings : b.completedOffers - a.completedOffers
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Top Earners</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Live leaderboard of today's top performers. Updates every few seconds.
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