import { supabase } from './supabase';

export async function updateStreak() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user's current streak info
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_count, best_streak, last_offer_completion')
      .eq('id', user.id)
      .single();

    if (!profile) return;

    const now = new Date();
    const lastCompletion = profile.last_offer_completion ? new Date(profile.last_offer_completion) : null;
    
    // Initialize streak if this is the first completion
    if (!lastCompletion) {
      await supabase
        .from('profiles')
        .update({
          streak_count: 1,
          best_streak: 1,
          last_offer_completion: now.toISOString()
        })
        .eq('id', user.id);
      return;
    }

    // Check if the last completion was yesterday
    const isYesterday = (
      lastCompletion.getDate() === now.getDate() - 1 &&
      lastCompletion.getMonth() === now.getMonth() &&
      lastCompletion.getFullYear() === now.getFullYear()
    );

    // Check if the last completion was today
    const isToday = (
      lastCompletion.getDate() === now.getDate() &&
      lastCompletion.getMonth() === now.getMonth() &&
      lastCompletion.getFullYear() === now.getFullYear()
    );

    if (isToday) {
      // Already completed an offer today, streak stays the same
      return;
    }

    if (isYesterday) {
      // Increment streak
      const newStreak = profile.streak_count + 1;
      const newBestStreak = Math.max(newStreak, profile.best_streak || 0);
      
      await supabase
        .from('profiles')
        .update({
          streak_count: newStreak,
          best_streak: newBestStreak,
          last_offer_completion: now.toISOString()
        })
        .eq('id', user.id);
    } else {
      // Streak broken, reset to 1
      await supabase
        .from('profiles')
        .update({
          streak_count: 1,
          last_offer_completion: now.toISOString()
        })
        .eq('id', user.id);
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}