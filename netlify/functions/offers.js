const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
      }
    };
  }

  try {
    const { apiKey, params } = JSON.parse(event.body);

    // Build the target URL with required parameters
    const targetUrl = `https://unlockcontent.net/api/v2?${new URLSearchParams(params).toString()}`;
    console.log('Requesting offers from:', targetUrl);

    // Make the request to the API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: await response.text()
      });
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', {
      success: data.success,
      offerCount: data.offers?.length || 0
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error in offers function:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to fetch offers',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};