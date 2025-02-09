import type { ApiResponse, Offer } from './types';

const API_KEY = '30066|ZLRMafmKrAeqte2ploWq0Hyn7Rq8IY6GNQmGwBEye3525b9b';

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
  }
];

// Helper function to get client IP with fallback
async function getClientIP(): Promise<string> {
  try {
    // Try multiple IP services
    const services = [
      'https://api.ipify.org?format=json',
      'https://api.myip.com',
      'https://api.ip.sb/jsonip'
    ];

    for (const service of services) {
      try {
        const response = await fetch(service);
        if (!response.ok) continue;
        
        const data = await response.json();
        // Handle different response formats
        const ip = data.ip || data.address || data.YourFuckingIPAddress;
        if (ip) return ip;
      } catch (e) {
        console.warn(`Failed to fetch IP from ${service}:`, e);
        continue;
      }
    }

    // If all services fail, use a fallback IP
    console.warn('Failed to get client IP, using fallback');
    return '8.8.8.8';
  } catch (error) {
    console.error('Error getting client IP:', error);
    return '8.8.8.8';
  }
}

// Helper function to track offer completions
export async function trackOfferCompletion(offerId: number) {
  try {
    console.log('Tracking offer completion:', offerId);
    
    const ip = await getClientIP();

    // Create tracking data
    const trackingData = {
      offer_id: offerId,
      ip,
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

    // Get client IP
    const ip = await getClientIP();
    console.log('Using IP:', ip);

    // Build the request parameters
    const params = {
      ip,
      user_agent: encodeURIComponent(navigator.userAgent),
      ctype: '2', // CPA offers only
      aff_sub4: localStorage.getItem('userEmail') || '',
      aff_sub5: 'web_app'
    };

    console.log('Fetching offers with params:', params);

    // Try to fetch from the Netlify function with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch('/.netlify/functions/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: API_KEY,
          params
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Netlify function error:', errorText);
        throw new Error(`Netlify function failed: ${response.status} ${errorText}`);
      }

      const data: ApiResponse = await response.json();
      console.log('API response:', data);

      if (!data.success) {
        throw new Error(data.error || 'API returned unsuccessful response');
      }

      if (data.offers && data.offers.length > 0) {
        return data.offers;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Request timed out, using mock offers');
      } else {
        console.error('Error fetching offers:', error);
      }
    }

    console.warn('No offers returned from API, using mock offers');
    return MOCK_OFFERS;

  } catch (error) {
    console.error('Error in fetchOffers:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    // Return mock offers as fallback
    return MOCK_OFFERS;
  }
}