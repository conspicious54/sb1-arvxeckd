const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { apiKey, params } = JSON.parse(event.body);

    // Add device type to query parameters
    const queryParams = new URLSearchParams({
      ...params,
      device: params.device_type === 'mobile' ? 
        params.os === 'ios' ? 'ios' :
        params.os === 'android' ? 'android' : 'mobile'
        : 'desktop'
    });

    // Build the target URL with required parameters
    const targetUrl = `https://unlockcontent.net/api/v2?${queryParams.toString()}`;
    
    console.log('Making request to:', targetUrl);
    console.log('With device params:', {
      device_type: params.device_type,
      os: params.os,
      device: queryParams.get('device')
    });

    // Make the request to the API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': params.user_agent // Pass through the original user agent
      }
    });

    const data = await response.json();
    console.log('API Response:', {
      success: data.success,
      offerCount: data.offers?.length || 0
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to fetch offers'
      })
    };
  }
};