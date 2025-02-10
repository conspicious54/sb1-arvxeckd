import { User, LogOut, Menu, X, DollarSign, Moon, Sun, Rocket } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MultiplierBadge } from '../MultiplierBadge';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';

interface DashboardNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  isLoggedIn: boolean;
  showTestPopup: boolean;
  setShowTestPopup: (value: boolean) => void;
}

export function DashboardNav({
  isMenuOpen,
  setIsMenuOpen,
  isDark,
  setIsDark,
  isLoggedIn,
  showTestPopup,
  setShowTestPopup,
}: DashboardNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string>('');
  const [points, setPoints] = useState<number>(0);

  const navigation = [
    { name: 'Offers', path: '/dashboard' },
    { name: 'Rewards', path: '/rewards' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Share+Earn', path: '/share' },
    { name: 'RocketGame', path: '/rocket-game', icon: <Rocket className="w-4 h-4" /> },
  ];

  useEffect(() => {
    // Get user email and points
    async function getUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || '');

          // Get user points
          const { data: profile } = await supabase
            .from('profiles')
            .select('available_points')
            .eq('id', user.id)
            .single();

          if (profile) {
            setPoints(profile.available_points);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    getUserData();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || '');
      } else {
        setUserEmail('');
      }
    });

    // Subscribe to points changes
    const channel = supabase
      .channel('points_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        },
        (payload) => {
          setPoints(payload.new.available_points);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a 
              href="https://myrapidrewards.com/dashboard" 
              className="flex items-center flex-shrink-0"
            >
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                RapidRewards
              </span>
            </a>

            <div className="hidden lg:flex items-center space-x-4">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    location.pathname === link.path
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end flex-1 gap-6">
            <div className="hidden lg:flex items-center space-x-6">
              <MultiplierBadge />

              {/* Points Display */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg whitespace-nowrap">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">{points.toLocaleString()}p</span>
              </div>

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <div className="relative group">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full bg-gray-100 ring-2 ring-white dark:ring-gray-800 group-hover:ring-green-200 dark:group-hover:ring-green-900 transition-all"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {userEmail}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 group"
                    >
                      <LogOut className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-4">
              <MultiplierBadge />

              {/* Mobile Points Display */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">{points.toLocaleString()}</span>
              </div>

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 text-base font-medium flex items-center gap-2 ${
                    location.pathname === link.path
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full bg-gray-100"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userEmail}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 group"
                    >
                      <LogOut className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}