import type { ApiResponse, Offer } from './types';

const API_KEY = '30066|ZLRMafmKrAeqte2ploWq0Hyn7Rq8IY6GNQmGwBEye3525b9b';

// Helper function to get device type for API
function getDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  
  // Check for iPhone
  if (/iphone|ipod/.test(ua)) {
    return 'iPhone';
  }
  
  // Check for Android
  if (/android/.test(ua)) {
    return 'Android';
  }
  
  // Default to Desktop
  return 'Desktop';
}

// Helper function to track offer completions
export async function trackOfferCompletion(offerId: number) {
  try {
    console.log('Tracking offer completion:', offerId);
    
    // Get user's IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();

    // Get device type
    const device = getDeviceType();

    // Create tracking data
    const trackingData = {
      offer_id: offerId,
      ip: ipData.ip,
      user_agent: navigator.userAgent,
      device,
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

// Helper function to check if an offer is compatible with user's device
function isOfferCompatibleWithDevice(offerDevice: string, userDevice: string): boolean {
  if (!offerDevice) return false;
  
  // Normalize strings
  const normalizedOfferDevice = offerDevice.toLowerCase().trim();
  const normalizedUserDevice = userDevice.toLowerCase().trim();

  // Split by common separators and normalize each device
  const deviceList = normalizedOfferDevice
    .split(/[,&\s]+/)
    .map(d => d.trim())
    .filter(Boolean);

  // Log device compatibility check
  console.log('Checking device compatibility:', {
    offerDevice: normalizedOfferDevice,
    userDevice: normalizedUserDevice,
    deviceList
  });

  // Direct match
  if (deviceList.includes(normalizedUserDevice)) {
    return true;
  }

  // Handle special cases
  if (deviceList.includes('all')) {
    return true;
  }

  // Handle iOS devices
  if (normalizedUserDevice === 'iphone') {
    return deviceList.includes('ios') || deviceList.includes('iphone');
  }

  // Handle Android devices
  if (normalizedUserDevice === 'android') {
    return deviceList.includes('android');
  }

  return false;
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

    // Get device type
    const device = getDeviceType();
    console.log('Device detected:', device);

    // Build the request parameters
    const params = {
      ip: ipData.ip,
      user_agent: navigator.userAgent,
      device, // Use exact device label (Desktop, iPhone, or Android)
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
    console.log('API Response:', {
      success: data.success,
      offerCount: data.offers?.length || 0,
      device
    });

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

    // Log raw offers before filtering
    console.log('Raw offers before filtering:', data.offers.map(o => ({
      name: o.name_short,
      device: o.device
    })));

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