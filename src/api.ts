import type { ApiResponse, Offer } from './types';

const API_KEY = '30066|ZLRMafmKrAeqte2ploWq0Hyn7Rq8IY6GNQmGwBEye3525b9b';

// Mock data only for development preview
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

    // Get IP address
    console.log('Fetching IP address...');
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) {
      throw new Error(`Failed to fetch IP: ${await ipResponse.text()}`);
    }
    const ipData = await ipResponse.json();
    console.log('Using IP:', ipData.ip);

    // Build request parameters
    const params = {
      ip: ipData.ip,
      user_agent: encodeURIComponent(navigator.userAgent),
      ctype: '2', // CPA offers only
      aff_sub4: localStorage.getItem('userEmail') || '',
      aff_sub5: 'web_app'
    };

    console.log('Fetching offers with params:', params);

    // Make request to Netlify function
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

    if (!response.ok) {
      throw new Error(`API response not OK: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    console.log('API response:', data);

    if (!data.success) {
      throw new Error(data.error || 'API returned success: false');
    }

    if (!data.offers || !Array.isArray(data.offers)) {
      throw new Error('No offers array in response');
    }

    // Return real offers, only fall back to mock if we got zero offers
    return data.offers.length > 0 ? data.offers : MOCK_OFFERS;

  } catch (error) {
    console.error('Error fetching offers:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    // Only fall back to mock offers if we couldn't get any real ones
    return MOCK_OFFERS;
  }
}