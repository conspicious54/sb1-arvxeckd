const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { apiKey, params } = JSON.parse(event.body);

    // Build the target URL with required parameters
    const targetUrl = `https://unlockcontent.net/api/v2?${new URLSearchParams(params).toString()}`;
    
    console.log('Making request to:', targetUrl);

    // Make the request to the API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API Response:', data);

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