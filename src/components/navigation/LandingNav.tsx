import { User, LogOut, Menu, X, DollarSign, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  isLoggedIn: boolean;
  userEmail: string;
  isHomePage: boolean;
}

export function LandingNav({
  isMenuOpen,
  setIsMenuOpen,
  isDark,
  setIsDark,
  isLoggedIn,
  userEmail,
  isHomePage,
}: LandingNavProps) {
  const landingLinks = [
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Features', path: '/features' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <header className={`${isHomePage ? 'absolute w-full z-50 bg-transparent border-transparent' : 'bg-white dark:bg-gray-900 border-b border-green-100 dark:border-gray-800'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://i.imgur.com/XhVzGft.png"
                alt="RapidRewards"
                className="h-12 w-auto"
              />
            </Link>
            
            <div className="hidden ml-10 space-x-8 lg:block">
              {landingLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium ${
                    isHomePage
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-8">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      isHomePage
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    aria-label="Toggle dark mode"
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                  <Link
                    to="/dashboard"
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isHomePage
                        ? 'bg-white text-green-600 hover:bg-green-50'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      isHomePage
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    aria-label="Toggle dark mode"
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                  <Link
                    to="/signup"
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isHomePage
                        ? 'bg-white text-green-600 hover:bg-green-50'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Start Earning Now
                  </Link>
                </>
              )}
            </div>

            <div className="lg:hidden flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-colors ${
                  isHomePage
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <Link
                to={isLoggedIn ? "/dashboard" : "/signup"}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isHomePage
                    ? 'bg-white text-green-600 hover:bg-green-50'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isLoggedIn ? 'Dashboard' : 'Start Earning'}
              </Link>
              <button
                type="button"
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                  isHomePage
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'
                }`}
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4">
            <div className="flex flex-col space-y-4">
              {landingLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium ${
                    isHomePage
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}