import { useState } from 'react';
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getSocialShareText } from '../../lib/referrals';

interface ReferralLinkProps {
  referralUrl: string | null;
}

export function ReferralLink({ referralUrl }: ReferralLinkProps) {
  const [copied, setCopied] = useState(false);
  const [showCopiedEffect, setShowCopiedEffect] = useState(false);

  const socialShareText = getSocialShareText(referralUrl);

  const copyToClipboard = async () => {
    if (!referralUrl) return;

    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setShowCopiedEffect(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });

      setTimeout(() => {
        setCopied(false);
        setShowCopiedEffect(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl || '')}&quote=${encodeURIComponent(socialShareText.facebook)}`
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialShareText.twitter)}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl || '')}`
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      shareUrl: `mailto:?subject=${encodeURIComponent(socialShareText.email.subject)}&body=${encodeURIComponent(socialShareText.email.body)}`
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-50 dark:border-gray-700">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Referral Link</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={referralUrl || ''}
              readOnly
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
            />
            {showCopiedEffect && (
              <div 
                className="absolute inset-0 bg-green-500 bg-opacity-10 rounded-xl flex items-center justify-center"
                style={{ animation: 'fade-out 1s forwards' }}
              >
                <div className="bg-green-500 text-white px-3 py-1 rounded-lg">
                  Copied!
                </div>
              </div>
            )}
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors relative overflow-hidden group"
          >
            {copied ? (
              <>
                <span>Copied!</span>
                <Share2 className="w-5 h-5" />
              </>
            ) : (
              <>
                <span>Copy Link</span>
                <Copy className="w-5 h-5" />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transform translate-x-full group-hover:translate-x-0 transition-transform" />
          </button>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="border-t border-gray-100 dark:border-gray-700 px-8 py-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex flex-wrap gap-4">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-white px-6 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 ${platform.color}`}
            >
              {platform.icon}
              <span>Share on {platform.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}