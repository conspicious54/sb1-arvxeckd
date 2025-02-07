import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CompletionPopup } from './CompletionPopup';
import { MultiplierBadge } from './MultiplierBadge';
import { LandingNav } from './navigation/LandingNav';
import { DashboardNav } from './navigation/DashboardNav';

// Demo offer for testing
const TEST_OFFER = {
  offerid: 999,
  name: "Test Completion Offer",
  name_short: "Test Offer",
  description: "This is a test offer for demonstration purposes",
  adcopy: "Complete this test offer to see how the completion flow works!",
  picture: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80",
  payout: "5.00",
  country: "US",
  device: "All Devices",
  link: "#",
  epc: "1.00"
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showTestPopup, setShowTestPopup] = useState(false);
  const location = useLocation();
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const isLoggedIn = !!userEmail;
  const isHomePage = location.pathname === '/';

  // Define which paths should use the landing navigation
  const landingPaths = ['/', '/how-it-works', '/features', '/testimonials', '/faq'];
  const isLandingPage = landingPaths.includes(location.pathname);

  // Update dark mode in localStorage and apply class
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Listen for system color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('darkMode');
      if (!saved) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const commonProps = {
    isMenuOpen,
    setIsMenuOpen,
    isDark,
    setIsDark,
    isLoggedIn,
    userEmail,
    isHomePage,
    showTestPopup,
    setShowTestPopup,
  };

  return (
    <>
      {isLandingPage ? (
        <LandingNav {...commonProps} />
      ) : (
        <DashboardNav {...commonProps} />
      )}

      <CompletionPopup
        isOpen={showTestPopup}
        onClose={() => setShowTestPopup(false)}
        offer={TEST_OFFER}
      />
    </>
  );
}