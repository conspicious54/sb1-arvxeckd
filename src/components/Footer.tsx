import { DollarSign, Facebook, Twitter, Linkedin, Instagram, Mail, Shield, Lock, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    earn: [
      { name: 'Surveys & Tasks', href: '/dashboard' },
      { name: 'Offer Walls', href: '/dashboard' },
      { name: 'Referral Program', href: '/share' },
      { name: 'Daily Bonuses', href: '/dashboard' },
      { name: 'Achievement Rewards', href: '/dashboard' }
    ],
    rewards: [
      { name: 'PayPal Cash', href: '/rewards' },
      { name: 'Gift Cards', href: '/rewards' },
      { name: 'Crypto Rewards', href: '/rewards' },
      { name: 'Prize Draws', href: '/rewards' },
      { name: 'Exclusive Deals', href: '/rewards' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Help Center', href: '#' }
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
      { name: 'Instagram', href: '#', icon: Instagram }
    ]
  };

  return (
    <footer className="bg-white dark:bg-gray-900">
      {/* Newsletter Section */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
            
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Stay Updated</h3>
                  <p className="text-green-50">Get notified about new earning opportunities and exclusive rewards.</p>
                </div>
                <div className="w-full md:w-auto">
                  <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 min-w-0 px-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-white text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors flex items-center gap-2 whitespace-nowrap group"
                    >
                      Subscribe
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <img 
                  src="https://i.imgur.com/XhVzGft.png"
                  alt="RapidRewards"
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
                Join millions of users earning rewards daily through surveys, offers, and referrals. Your time is valuable - get paid for it.
              </p>
              <div className="flex items-center gap-6">
                {footerLinks.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Ways to Earn
              </h3>
              <ul className="space-y-3">
                {footerLinks.earn.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Rewards
              </h3>
              <ul className="space-y-3">
                {footerLinks.rewards.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-8">
              <p className="text-gray-500 dark:text-gray-400">
                © {currentYear} RapidRewards. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Available Worldwide</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 dark:invert" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 dark:invert" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}