import { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

export function MobileNotice() {
  const [showMobileNotice, setShowMobileNotice] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      // Only show notice if on desktop
      setShowMobileNotice(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!showMobileNotice || isMobile) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mb-8 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Switch to Mobile for More Earnings!</h3>
            <p className="text-blue-100">Access exclusive mobile app offers and earn up to 3x more points</p>
          </div>
        </div>
        <button
          onClick={() => setShowMobileNotice(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Dismiss notice"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}