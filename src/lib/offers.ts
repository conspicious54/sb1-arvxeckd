import { supabase } from './supabase';

// Function to track when a user starts an offer
export async function trackOfferStart(offerId: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    // Get user's email for tracking
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (!profile?.email) {
      console.error('No email found for user');
      return;
    }

    // Store the start time and offer ID in localStorage
    const offerStart = {
      offerId,
      startTime: new Date().toISOString(),
      userId: user.id,
      userEmail: profile.email
    };

    localStorage.setItem(`offer_start_${offerId}`, JSON.stringify(offerStart));
    
    console.log('Offer start tracked:', offerStart);
  } catch (error) {
    console.error('Error tracking offer start:', error);
  }
}

// Function to handle postback URL setup
export function getPostbackUrl(userId: string): string {
  const baseUrl = 'https://myrapidrewards.com/postback';
  const params = new URLSearchParams({
    offer_id: '{offer_id}',
    payout: '{payout}',
    ip: '{session_ip}',
    aff_sub4: userId,
    aff_sub5: 'web_app'
  });

  return `${baseUrl}?${params.toString()}`;
}