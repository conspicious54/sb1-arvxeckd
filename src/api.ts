import type { ApiResponse, Offer } from './types';

const API_KEY = '30066|ZLRMafmKrAeqte2ploWq0Hyn7Rq8IY6GNQmGwBEye3525b9b';

// Helper function to detect device type
function getDeviceInfo() {
  const ua = navigator.userAgent.toLowerCase();
  
  // Check for iPhone/iPad
  if (/iphone|ipad|ipod/i.test(ua)) {
    return { device: 'iPhone' };
  }
  
  // Check for Android
  if (/android/i.test(ua)) {
    return { device: 'Android' };
  }
  
  // Default to desktop
  return { device: 'desktop' };
}

// Helper function to track offer completions
export async function trackOfferCompletion(offerId: number) {
  try {
    console.log('Tracking offer completion:', offerId);
    
    // Get user's IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();

    // Get device info
    const { device } = getDeviceInfo();

    // Create tracking data
    const trackingData = {
      offer_id: offerId,
      ip: ipData.ip,
      user_agent: navigator.userAgent,
      device: device,
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

// Helper function to check if an offer is compatible with a device
function isOfferCompatibleWithDevice(offerDevice: string, userDevice: string): boolean {
  const deviceLower = offerDevice.toLowerCase();
  
  // Handle universal offers first
  if (deviceLower === 'all' || deviceLower === 'any') {
    return true;
  }

  // Split device string in case it contains multiple devices
  const devices = deviceLower.split(/[,\s&|+]+/).map(d => d.trim());

  switch (userDevice) {
    case 'iPhone':
      return devices.some(d => 
        d === 'iphone' || 
        d === 'ios' || 
        d === 'mobile' ||
        d === 'ipad' || 
        d === 'apple'
      );
      
    case 'Android':
      return devices.some(d => 
        d === 'android' || 
        d === 'mobile' ||
        d === 'phone'
      );
      
    case 'desktop':
      return devices.some(d => 
        d === 'desktop' || 
        d === 'pc' || 
        d === 'computer' ||
        d === 'web'
      );
      
    default:
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
    const { device } = getDeviceInfo();
    console.log('Device detected:', device);

    // Build the request parameters
    const params = {
      ip: ipData.ip,
      user_agent: navigator.userAgent,
      device: device, // Use exact device label required by API
      ctype: '2',
      aff_sub4: 'myrapidrewards.com',
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

    // Filter offers based on device compatibility
    const filteredOffers = data.offers.filter(offer => {
      const isCompatible = isOfferCompatibleWithDevice(offer.device, device);
      if (!isCompatible) {
        console.log(`Offer ${offer.name_short} (${offer.device}) not compatible with ${device}`);
      }
      return isCompatible;
    });

    console.log(`Filtered ${data.offers.length} offers down to ${filteredOffers.length} ${device}-compatible offers`);
    
    // Log the device types of filtered offers
    const deviceTypes = new Set(filteredOffers.map(o => o.device));
    console.log('Compatible device types:', Array.from(deviceTypes));

    return filteredOffers;

  } catch (error) {
    console.error('Error fetching offers:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}