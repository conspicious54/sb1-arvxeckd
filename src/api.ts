import type { ApiResponse, Offer } from './types';

const API_KEY = '30027|HtsAyozKX0X97Ck5jozjSxgndcraPstw0HmcSfcp523226a0';

// Mock data for development and fallback
export const MOCK_OFFERS: Offer[] = [
  {
    offerid: 1,
    name: "Survey Rewards Plus",
    name_short: "Survey Rewards",
    description: "Complete a short survey about your shopping habits",
    adcopy: "Share your opinion and earn rewards instantly! Complete this quick 5-minute survey about your recent shopping experiences.",
    picture: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    payout: "5.00",
    country: "US, UK, CA",
    device: "All Devices",
    link: "#",
    epc: "2.50"
  },
  {
    offerid: 2,
    name: "Mobile Game Challenge",
    name_short: "Game Challenge",
    description: "Play our new mobile game and reach level 5",
    adcopy: "Download this exciting new game and reach level 5 to earn your reward. Fun and easy to play!",
    picture: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800",
    payout: "10.00",
    country: "US, CA, AU",
    device: "Mobile",
    link: "#",
    epc: "3.75"
  },
  {
    offerid: 3,
    name: "Premium Streaming Trial",
    name_short: "Stream Trial",
    description: "Try premium streaming for 7 days",
    adcopy: "Get access to thousands of movies and TV shows. Start your 7-day trial and earn a reward!",
    picture: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800",
    payout: "15.00",
    country: "US, UK, DE",
    device: "All Devices",
    link: "#",
    epc: "4.20"
  },
  {
    offerid: 4,
    name: "Fitness App Premium",
    name_short: "Fitness App",
    description: "Try our premium fitness app",
    adcopy: "Start your fitness journey today! Try our premium features and earn while getting healthy.",
    picture: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
    payout: "12.50",
    country: "US, CA, AU, UK",
    device: "Mobile",
    link: "#",
    epc: "3.90"
  },
  {
    offerid: 5,
    name: "Food Delivery Credit",
    name_short: "Food Credit",
    description: "Sign up and get $20 in delivery credit",
    adcopy: "Get $20 in food delivery credit when you sign up. Plus earn a reward for trying our service!",
    picture: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800",
    payout: "8.00",
    country: "US, CA",
    device: "All Devices",
    link: "#",
    epc: "3.25"
  }
];

// Helper function to track offer completions
export async function trackOfferCompletion(offerId: number) {
  try {
    console.log('Tracking offer completion:', offerId);
    
    // Get user's IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();

    // Create tracking data
    const trackingData = {
      offer_id: offerId,
      ip: ipData.ip,
      user_agent: navigator.userAgent,
      aff_sub4: localStorage.getItem('userEmail') || '',
      aff_sub5: 'web_app',
      timestamp: new Date().toISOString()
    };

    console.log('Tracking data:', trackingData);

    // Store in local storage for now
    const existingData = JSON.parse(localStorage.getItem('completedOffers') || '[]');
    existingData.push(trackingData);
    localStorage.setItem('completedOffers', JSON.stringify(existingData));

    return true;
  } catch (error) {
    console.error('Error tracking offer completion:', error);
    return false;
  }
}

// Main function to fetch offers
export async function fetchOffers(): Promise<Offer[]> {
  try {
    console.log('Starting offer fetch...');

    // First try to get the IP address
    console.log('Fetching IP address...');
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) {
      console.warn('Failed to fetch IP address:', await ipResponse.text());
      return MOCK_OFFERS;
    }
    const ipData = await ipResponse.json();
    console.log('IP address fetched:', ipData.ip);

    // Build the request parameters
    const params = {
      ip: ipData.ip,
      user_agent: encodeURIComponent(navigator.userAgent),
      ctype: '2', // CPA offers only
      aff_sub4: localStorage.getItem('userEmail') || '',
      aff_sub5: 'web_app'
    };

    // Try to fetch from the Netlify function first
    try {
      const response = await fetch('/.netlify/functions/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: API_KEY,
          params
        })
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        if (data.success && data.offers && data.offers.length > 0) {
          // Combine real offers with mock offers to ensure we always have content
          return [...data.offers, ...MOCK_OFFERS];
        }
      }
    } catch (error) {
      console.warn('Failed to fetch from Netlify function:', error);
    }

    // If all else fails, return mock offers
    console.log('Using mock offers for development');
    return MOCK_OFFERS;

  } catch (error) {
    console.warn('Error fetching offers:', error);
    if (error instanceof Error) {
      console.warn('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    // Always return mock offers as fallback
    return MOCK_OFFERS;
  }
}