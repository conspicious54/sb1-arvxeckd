import type { ApiResponse, Offer } from './types';

const API_KEY = '30066|ZLRMafmKrAeqte2ploWq0Hyn7Rq8IY6GNQmGwBEye3525b9b';

// Helper function to detect device type and OS
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceType = 'desktop';
  let os = 'unknown';

  // Check if mobile
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    deviceType = 'mobile';
    
    // Detect specific mobile OS
    if (/iPhone|iPad|iPod/i.test(ua)) {
      os = 'ios';
    } else if (/Android/i.test(ua)) {
      os = 'android';
    }
  }

  return { deviceType, os };
}

// Helper function to track offer completions
export async function trackOfferCompletion(offerId: number) {
  try {
    console.log('Tracking offer completion:', offerId);
    
    // Get user's IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();

    // Get device info
    const { deviceType, os } = getDeviceInfo();

    // Create tracking data
    const trackingData = {
      offer_id: offerId,
      ip: ipData.ip,
      user_agent: navigator.userAgent,
      device_type: deviceType,
      os: os,
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
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) {
      throw new Error('Failed to fetch IP address');
    }
    const ipData = await ipResponse.json();
    console.log('IP address fetched:', ipData.ip);

    // Get device information
    const { deviceType, os } = getDeviceInfo();
    console.log('Device info:', { deviceType, os });

    // Ensure aff_sub4 is a valid string
    const aff_sub4 = 'myrapidrewards.com'; // Use a fixed domain as default

    // Build the request parameters
    const params = {
      ip: ipData.ip,
      user_agent: navigator.userAgent,
      device_type: deviceType,
      os: os,
      ctype: '2',
      aff_sub4,
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
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data: ApiResponse = await response.json();
    console.log('API response:', data);

    if (!data.success) {
      const errorMessage = data.error 
        ? typeof data.error === 'string' 
          ? data.error 
          : JSON.stringify(data.error)
        : 'API request failed';
      throw new Error(errorMessage);
    }

    if (!data.offers || !data.offers.length) {
      console.warn('No offers available');
      return [];
    }

    // Filter offers based on device type and OS
    const filteredOffers = data.offers.filter(offer => {
      // If we're on mobile, only show mobile offers
      if (deviceType === 'mobile') {
        if (offer.device.toLowerCase().includes('desktop')) {
          return false;
        }
        // If we're on iOS, only show iOS offers
        if (os === 'ios' && !offer.device.toLowerCase().includes('ios')) {
          return false;
        }
        // If we're on Android, only show Android offers
        if (os === 'android' && !offer.device.toLowerCase().includes('android')) {
          return false;
        }
      }
      // If we're on desktop, only show desktop offers
      else if (deviceType === 'desktop') {
        return offer.device.toLowerCase().includes('desktop');
      }
      return true;
    });

    console.log(`Filtered ${data.offers.length} offers down to ${filteredOffers.length} ${deviceType} offers`);
    return filteredOffers;

  } catch (error) {
    console.error('Error fetching offers:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}