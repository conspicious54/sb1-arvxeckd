import { supabase } from './supabase';

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
  potentialEarnings: number;
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

    // Calculate potential earnings (pending referrals * 5000 points)
    const potentialEarnings = profile.pending_referrals * 5000;

    return {
      totalReferrals: profile.total_referrals || 0,
      pendingReferrals: profile.pending_referrals || 0,
      totalEarned: profile.referral_earnings || 0,
      potentialEarnings
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return {
      totalReferrals: 0,
      pendingReferrals: 0,
      totalEarned: 0,
      potentialEarnings: 0
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
  
  // Create a URL with proper UTM parameters
  const baseUrl = 'https://myrapidrewards.com/signup';
  const params = new URLSearchParams({
    ref: code,
    utm_source: 'referral',
    utm_medium: 'user_share',
    utm_campaign: 'get_5_free'
  });
  
  return `${baseUrl}?${params.toString()}`;
}

export function getSocialShareText(referralUrl: string | null): {
  twitter: string;
  facebook: string;
  email: {
    subject: string;
    body: string;
  };
} {
  const url = referralUrl || 'https://myrapidrewards.com';
  
  return {
    twitter: `🎁 Get $5 FREE when you join RapidRewards! I'm already earning daily rewards and cash payouts. Join using my link: ${url} #EarnMoney #Rewards`,
    
    facebook: `🎁 Want to earn extra cash from home?\n\nJoin RapidRewards using my link and get $5 FREE instantly!\n\nI'm already earning PayPal cash and gift cards daily. Super easy to use and fast payouts!\n\nJoin here: ${url}`,
    
    email: {
      subject: "Get $5 Free - Join RapidRewards with my link!",
      body: `Hey!\n\nI've been using RapidRewards to earn extra money and thought you might be interested. They're giving out $5 FREE when you join using my referral link!\n\nIt's really easy to use - just complete simple tasks to earn points, then cash out for PayPal money or gift cards. I've already earned several rewards!\n\nJoin using my link to get your $5 bonus:\n${url}\n\nEnjoy!\n`
    }
  };
}

export async function processReferral(referralCode: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const client = supabase;
  
  try {
    if (!referralCode) {
      return { success: false, error: 'Invalid referral code' };
    }

    // Get current user
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get the referrer's profile
    const { data: referrer } = await client
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (!referrer) {
      console.warn('Referrer not found for code:', referralCode);
      return { success: false, error: 'Invalid referral code' };
    }

    // Check if user is already referred
    const { data: existingReferral } = await client
      .from('profiles')
      .select('referred_by')
      .eq('id', user.id)
      .single();

    if (existingReferral?.referred_by) {
      return { success: false, error: 'User already has a referrer' };
    }

    // Start a transaction-like sequence
    // 1. Update referred user's profile with referrer and welcome bonus
    const { error: userError } = await client
      .from('profiles')
      .update({
        referred_by: referrer.id,
        available_points: 5000, // Welcome bonus
        total_earnings: 5000
      })
      .eq('id', user.id);

    if (userError) throw userError;

    // 2. Update referrer's stats
    const { error: referrerError } = await client
      .from('profiles')
      .update({
        pending_referrals: client.sql`pending_referrals + 1`,
        total_referrals: client.sql`total_referrals + 1`
      })
      .eq('id', referrer.id);

    if (referrerError) throw referrerError;

    return { success: true };
  } catch (error) {
    console.error('Error processing referral:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process referral'
    };
  }
}

export async function handleReferralOfferCompletion(userId: string): Promise<void> {
  const client = supabase;
  
  try {
    // Get user's referrer
    const { data: profile } = await client
      .from('profiles')
      .select('referred_by')
      .eq('id', userId)
      .single();

    if (!profile?.referred_by) return; // User wasn't referred

    // Start a transaction-like sequence
    // 1. Update referrer's stats - they get 5000 points when their referral completes an offer
    const { error: referrerError } = await client
      .from('profiles')
      .update({
        pending_referrals: client.sql`pending_referrals - 1`,
        available_points: client.sql`available_points + 5000`,
        total_earnings: client.sql`total_earnings + 5000`,
        referral_earnings: client.sql`referral_earnings + 5000`
      })
      .eq('id', profile.referred_by);

    if (referrerError) {
      console.error('Error updating referrer stats:', referrerError);
      throw referrerError;
    }

    // 2. Record the referral earning
    const { error: earningError } = await client
      .from('referral_earnings')
      .insert({
        referrer_id: profile.referred_by,
        referred_id: userId,
        points_earned: 5000
      });

    if (earningError) {
      console.error('Error recording referral earning:', earningError);
      throw earningError;
    }

  } catch (error) {
    console.error('Error processing referral offer completion:', error);
  }
}