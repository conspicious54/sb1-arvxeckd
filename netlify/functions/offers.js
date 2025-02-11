const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { apiKey, params } = JSON.parse(event.body);

    // Create the target URL exactly as shown in documentation
    const targetUrl = `https://unlockcontent.net/api/v2?${new URLSearchParams(params)}`;
    
    console.log('Making API request to:', targetUrl);
    console.log('Request params:', params);

    // Make request exactly as shown in documentation
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Log the raw response to see what devices are coming back
    console.log('Raw API response:', {
      success: data.success,
      offerCount: data.offers?.length || 0,
      deviceTypes: data.offers?.map(offer => offer.device)
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