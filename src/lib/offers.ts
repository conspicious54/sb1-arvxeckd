import { supabase } from './supabase';
import { updateStreak } from './streaks';

export async function completeOffer(offerId: number, offerName: string, payout: string) {
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Get current multiplier from local storage
    const multiplierData = localStorage.getItem('activeMultiplier');
    const { value: userMultiplier = 1 } = multiplierData ? JSON.parse(multiplierData) : {};

    // Convert payout to points (3000 points = $1) - 3x the original rate
    const basePoints = Math.round(parseFloat(payout) * 3000);
    const pointsEarned = Math.round(basePoints * userMultiplier);

    // Insert the offer completion
    const { data: completion, error: completionError } = await supabase
      .from('offer_completions')
      .insert({
        user_id: user.id,
        offer_id: offerId,
        offer_name: offerName,
        points_earned: pointsEarned,
        multiplier: userMultiplier
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

    // Update streak
    await updateStreak();

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