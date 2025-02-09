import type { ApiResponse, Offer } from './types';

const API_KEY = '30066|ZLRMafmKrAeqte2ploWq0Hyn7Rq8IY6GNQmGwBEye3525b9b';

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
      throw new Error('Failed to fetch IP address');
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

    console.log('Fetching offers with params:', params);

    // Try to fetch from the Netlify function
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log('API response:', data);

    if (!data.success) {
      throw new Error(data.error ? JSON.stringify(data.error) : 'API request failed');
    }

    if (!data.offers || !data.offers.length) {
      throw new Error('No offers available');
    }

    return data.offers;

  } catch (error) {
    console.error('Error fetching offers:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}