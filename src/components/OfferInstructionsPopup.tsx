import { useState } from 'react';
import { X, ExternalLink, Gift, Clock, AlertCircle, ChevronRight, Star, TrendingUp, Mail, Download, CreditCard, Smartphone } from 'lucide-react';

interface OfferInstructionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    offerid: number;
    name: string;
    payout: string;
    link: string;
    device: string;
    adcopy: string;
  };
  onStart: () => void;
}

type OfferType = 'app_install' | 'email_submit' | 'lead_gen' | 'pin_submit';

export function OfferInstructionsPopup({ isOpen, onClose, offer, onStart }: OfferInstructionsPopupProps) {
  const [error, setError] = useState<string | null>(null);
  
  // First triple the dollar amount, then convert to points (1000 points = $1)
  const tripleAmount = parseFloat(offer.payout) * 3;
  const pointsEarned = Math.round(tripleAmount * 1000);

  // Determine offer type based on name and description
  const getOfferType = (): OfferType => {
    const text = (offer.name + ' ' + offer.adcopy).toLowerCase();
    
    // App install takes precedence
    if (text.includes('install') || text.includes('download') || 
        text.includes('app') || text.includes('game')) {
      return 'app_install';
    }
    
    if (text.includes('pin') || text.includes('verify') || text.includes('code')) {
      return 'pin_submit';
    }
    
    if (text.includes('email') || text.includes('subscribe') || text.includes('newsletter')) {
      return 'email_submit';
    }
    
    // Default to lead gen
    return 'lead_gen';
  };

  const offerType = getOfferType();

  // Get instructions based on offer type
  const getInstructions = () => {
    switch (offerType) {
      case 'app_install':
        return [
          {
            title: 'Install the app',
            description: 'Download and install from the app store',
            icon: <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Open and complete setup',
            description: 'Launch the app and follow initial setup',
            icon: <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Keep app installed',
            description: 'Must keep installed for 24 hours',
            icon: <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
          }
        ];
      
      case 'email_submit':
        return [
          {
            title: 'Enter valid email',
            description: 'Use an active email address',
            icon: <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Confirm email',
            description: 'Click the confirmation link sent to you',
            icon: <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Stay subscribed',
            description: 'Remain subscribed for 24 hours',
            icon: <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
          }
        ];
      
      case 'pin_submit':
        return [
          {
            title: 'Enter phone number',
            description: 'Use your active mobile number',
            icon: <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Submit PIN code',
            description: 'Enter the PIN sent via SMS',
            icon: <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Complete verification',
            description: 'Finish the verification process',
            icon: <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
          }
        ];
      
      case 'lead_gen':
        return [
          {
            title: 'Fill out form',
            description: 'Complete all required fields',
            icon: <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Submit information',
            description: 'Ensure all details are accurate',
            icon: <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
          },
          {
            title: 'Complete process',
            description: 'Follow any additional steps',
            icon: <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
          }
        ];
    }
  };

  // Determine button text based on offer type
  const getButtonText = () => {
    if (offerType === 'app_install') {
      const deviceType = offer.device.toLowerCase();
      if (deviceType.includes('ios') || deviceType.includes('iphone')) {
        return 'Install on App Store';
      }
      if (deviceType.includes('android')) {
        return 'Install on Play Store';
      }
      return 'Download Now';
    }
    
    if (offerType === 'email_submit') {
      return 'Subscribe Now';
    }
    
    if (offerType === 'pin_submit') {
      return 'Start Verification';
    }
    
    return 'Start Offer';
  };

  if (!isOpen) return null;

  const instructions = getInstructions();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl"
        style={{
          animation: 'popup 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Instructions
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Offer Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {offer.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Earn ${tripleAmount.toFixed(2)} or {pointsEarned.toLocaleString()} points</span>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-4 mb-6">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-medium text-green-600 dark:text-green-400">
                  {index + 1}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {instruction.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {instruction.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Important:</p>
                <ul className="space-y-1">
                  {offerType === 'app_install' && (
                    <>
                      <li>• Keep the app installed for at least 24 hours</li>
                      <li>• Complete the initial app setup</li>
                    </>
                  )}
                  {offerType === 'email_submit' && (
                    <>
                      <li>• Use a valid, active email address</li>
                      <li>• Check your inbox for confirmation</li>
                    </>
                  )}
                  {offerType === 'pin_submit' && (
                    <>
                      <li>• Use your active mobile number</li>
                      <li>• Standard SMS rates may apply</li>
                    </>
                  )}
                  {offerType === 'lead_gen' && (
                    <>
                      <li>• Provide accurate information</li>
                      <li>• Complete all required steps</li>
                    </>
                  )}
                  <li>• Points will be awarded after verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault(); // Prevent default to run our tracking first
              onStart(); // Track the offer start
              onClose(); // Close the popup
              // Use a small timeout to ensure tracking completes
              setTimeout(() => {
                window.location.href = offer.link; // Redirect to the offer
              }, 100);
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-green-200 dark:shadow-none no-underline"
          >
            {getButtonText()}
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes popup {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 640px) {
          @keyframes popup {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
}