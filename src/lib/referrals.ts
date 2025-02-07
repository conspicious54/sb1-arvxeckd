import { supabase } from './supabase';

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
  potentialEarnings: number;
  monthlyRank: number;
  conversionRate: string;
}

export async function getReferralStats(userId: string): Promise<ReferralStats> {
  try {
    // Get user's referral stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_referrals, pending_referrals, referral_earnings')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Get total number of users for rank calculation
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    // Calculate conversion rate
    const conversionRate = profile.total_referrals > 0
      ? Math.round((profile.total_referrals - profile.pending_referrals) / profile.total_referrals * 100)
      : 0;

    // Calculate potential earnings (pending referrals * 2000 points)
    const potentialEarnings = profile.pending_referrals * 2000;

    return {
      totalReferrals: profile.total_referrals || 0,
      pendingReferrals: profile.pending_referrals || 0,
      totalEarned: profile.referral_earnings || 0,
      potentialEarnings,
      monthlyRank: Math.floor(Math.random() * (totalUsers || 100)) + 1, // Placeholder for now
      conversionRate: `${conversionRate}%`
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return {
      totalReferrals: 0,
      pendingReferrals: 0,
      totalEarned: 0,
      potentialEarnings: 0,
      monthlyRank: 0,
      conversionRate: '0%'
    };
  }
}

export async function getReferralCode(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', user.id)
      .single();

    return profile?.referral_code || null;
  } catch (error) {
    console.error('Error getting referral code:', error);
    return null;
  }
}

export async function getReferralUrl(): Promise<string | null> {
  const code = await getReferralCode();
  if (!code) return null;
  
  return `https://myrapidrewards.com/signup?ref=${code}`;
}

export async function processReferral(referralCode: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!referralCode) {
      return { success: false, error: 'Invalid referral code' };
    }

    // Get the referrer's profile
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (!referrer) {
      console.warn('Referrer not found for code:', referralCode);
      return { success: false, error: 'Invalid referral code' };
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user is already referred
    const { data: existingReferral } = await supabase
      .from('profiles')
      .select('referred_by')
      .eq('id', user.id)
      .single();

    if (existingReferral?.referred_by) {
      return { success: false, error: 'User already has a referrer' };
    }

    // Update the user's profile with the referrer
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ referred_by: referrer.id })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Increment pending referrals for the referrer
    const { error: referrerError } = await supabase
      .from('profiles')
      .update({
        pending_referrals: supabase.sql`pending_referrals + 1`
      })
      .eq('id', referrer.id);

    if (referrerError) {
      throw referrerError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing referral:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process referral'
    };
  }
}

export async function completeReferral(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get user's profile to find their referrer
    const { data: profile } = await supabase
      .from('profiles')
      .select('referred_by')
      .eq('id', userId)
      .single();

    if (!profile?.referred_by) {
      return { success: true }; // Not a referral, just succeed silently
    }

    // Update referrer's stats
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        total_referrals: supabase.sql`total_referrals + 1`,
        pending_referrals: supabase.sql`pending_referrals - 1`,
        referral_earnings: supabase.sql`referral_earnings + 2000`
      })
      .eq('id', profile.referred_by);

    if (updateError) {
      throw updateError;
    }

    // Record the referral earnings
    const { error: earningsError } = await supabase
      .from('referral_earnings')
      .insert({
        referrer_id: profile.referred_by,
        referred_id: userId,
        points_earned: 2000
      });

    if (earningsError) {
      throw earningsError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error completing referral:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete referral'
    };
  }
}