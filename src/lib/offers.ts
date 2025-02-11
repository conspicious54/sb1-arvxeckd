import { supabase } from './supabase';
import { updateStreak } from './streaks';
import { handleReferralOfferCompletion } from './referrals';

export async function completeOffer(offerId: number, offerName: string, payout: string) {
  const client = supabase;
  
  try {
    // Validate required fields
    if (!offerId) {
      return {
        success: false,
        error: 'Offer ID is required'
      };
    }

    if (!offerName) {
      return {
        success: false,
        error: 'Offer name is required'
      };
    }

    if (!payout) {
      return {
        success: false,
        error: 'Payout amount is required'
      };
    }

    // Get authenticated user
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Get current multiplier from local storage
    const multiplierData = localStorage.getItem('activeMultiplier');
    const { value: multiplier = 1 } = multiplierData ? JSON.parse(multiplierData) : {};

    // Convert payout to points (1000 points = $1)
    // First multiply payout by 3 for the base tripled value, then convert to points
    const baseAmount = parseFloat(payout) * 3; // Triple the dollar amount first
    const basePoints = Math.round(baseAmount * 1000); // Convert to points (1000 points = $1)
    const pointsEarned = Math.round(basePoints * multiplier); // Apply any active multiplier

    console.log('Points calculation:', {
      originalPayout: payout,
      tripledAmount: baseAmount,
      basePoints,
      multiplier,
      finalPoints: pointsEarned
    });

    // Start a transaction-like sequence
    // 1. Insert the offer completion
    const { data: completion, error: completionError } = await client
      .from('offer_completions')
      .insert({
        user_id: user.id,
        offer_id: offerId,
        offer_name: offerName,
        points_earned: pointsEarned,
        multiplier: multiplier
      })
      .select()
      .single();

    if (completionError) {
      console.error('Completion error:', completionError);
      return {
        success: false,
        error: 'Failed to record offer completion'
      };
    }

    // 2. Update streak
    await updateStreak();

    // 3. Handle referral completion rewards
    await handleReferralOfferCompletion(user.id);

    return {
      success: true,
      data: completion
    };

  } catch (error) {
    console.error('Error completing offer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}