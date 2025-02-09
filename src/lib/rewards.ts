import { supabase } from './supabase';

export interface Reward {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: 'giftcard' | 'cash' | 'gaming' | 'travel';
  popular: boolean;
  featured: boolean;
  new: boolean;
  coming_soon: boolean;
  expires_at: string | null;
  options: RewardOption[];
}

export interface RewardOption {
  id: string;
  reward_id: string;
  amount: number;
  points: number;
  double_points: boolean;
  limited_time: boolean;
  expires_at: string | null;
}

export async function fetchRewards(): Promise<Reward[]> {
  try {
    console.log('Fetching rewards from Supabase...');

    // Check if we're authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);

    // Fetch rewards with their options
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select(`
        *,
        options:reward_options(*)
      `)
      .order('featured', { ascending: false })
      .order('popular', { ascending: false })
      .order('new', { ascending: false });

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError);
      throw rewardsError;
    }

    console.log('Fetched rewards:', rewards);
    return rewards || [];
  } catch (error) {
    console.error('Error in fetchRewards:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return [];
  }
}

export async function redeemReward(rewardId: string, optionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get the reward option details
    const { data: option } = await supabase
      .from('reward_options')
      .select('*')
      .eq('id', optionId)
      .single();

    if (!option) {
      return { success: false, error: 'Invalid reward option' };
    }

    // Get the reward details
    const { data: reward } = await supabase
      .from('rewards')
      .select('name')
      .eq('id', rewardId)
      .single();

    if (!reward) {
      return { success: false, error: 'Invalid reward' };
    }

    // Calculate actual points needed after double points discount
    const pointsNeeded = option.double_points ? Math.round(option.points / 2) : option.points;

    // Get user's current points
    const { data: profile } = await supabase
      .from('profiles')
      .select('available_points')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    if (profile.available_points < pointsNeeded) {
      return { success: false, error: 'Insufficient points' };
    }

    // Insert redemption record
    const { error: redemptionError } = await supabase
      .from('redemptions')
      .insert({
        user_id: user.id,
        reward_id: rewardId,
        option_id: optionId,
        points_spent: pointsNeeded,
        amount: option.amount,
        status: 'pending',
        reward_type: reward.name
      });

    if (redemptionError) {
      console.error('Redemption error:', redemptionError);
      throw redemptionError;
    }

    // Update user's points
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        available_points: profile.available_points - pointsNeeded
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to redeem reward'
    };
  }
}