const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { apiKey, params } = JSON.parse(event.body);

    // Use the device parameter directly from the client
    // The client now sends the exact required device label
    const queryParams = new URLSearchParams(params);
    
    console.log('Making request to API with device:', params.device);

    // Build the target URL with required parameters
    const targetUrl = `https://unlockcontent.net/api/v2?${queryParams.toString()}`;
    
    console.log('Making request to:', targetUrl);

    // Make the request to the API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': params.user_agent
      }
    });

    const data = await response.json();
    console.log('API Response:', {
      success: data.success,
      offerCount: data.offers?.length || 0,
      device: params.device
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