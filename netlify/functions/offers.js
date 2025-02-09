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
    console.log('Received request:', event.body);
    const { apiKey, params } = JSON.parse(event.body);

    // Build the target URL with required parameters
    const targetUrl = `https://unlockcontent.net/api/v2?${new URLSearchParams(params).toString()}`;
    console.log('Requesting URL:', targetUrl);

    // Make the request to the API with timeout
    const timeout = 8000; // 8 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': params.user_agent || 'RapidRewards/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', errorText);
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(data)
      };
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('API request timed out');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch offers',
        details: error.message
      })
    };
  }
};