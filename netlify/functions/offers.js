const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        }
      };
    }

    const { apiKey, params } = JSON.parse(event.body);

    if (!apiKey) {
      throw new Error('API key is required');
    }

    if (!params || !params.ip) {
      throw new Error('IP address is required');
    }

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
      throw new Error(`API responded with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log('API response received:', data);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to fetch offers'
      })
    };
  }
};