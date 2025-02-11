const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event) => {
  try {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Get parameters from query string
    const {
      offer_id,
      payout,
      ip,
      aff_sub4: userId,
      aff_sub5: platform
    } = event.queryStringParameters;

    console.log('Received postback:', {
      offer_id,
      payout,
      ip,
      userId,
      platform
    });

    // Validate required parameters
    if (!offer_id || !payout || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Get the offer start data from the user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (!profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    // Record the conversion
    const { error: conversionError } = await supabase
      .from('conversions')
      .insert({
        offer_id: parseInt(offer_id),
        payout: parseFloat(payout),
        ip,
        affiliate_id: userId,
        source: platform,
        aff_sub4: profile.email,
        aff_sub5: platform
      });

    if (conversionError) {
      console.error('Error recording conversion:', conversionError);
      throw conversionError;
    }

    // Return success
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Conversion recorded successfully'
      })
    };
  } catch (error) {
    console.error('Error processing postback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};