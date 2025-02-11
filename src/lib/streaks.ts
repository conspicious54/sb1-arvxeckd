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

    // Helper function to check if two dates are the same day
    const isSameDay = (date1: Date, date2: Date) => {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
    };

    // Helper function to check if date1 is exactly one day before date2
    const isConsecutiveDay = (date1: Date, date2: Date) => {
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const diffInDays = Math.round((date2.getTime() - date1.getTime()) / oneDayInMs);
      return diffInDays === 1;
    };

    // Check if the last completion was today
    if (isSameDay(lastCompletion, now)) {
      // Already completed an offer today, streak stays the same
      return;
    }

    // Check if the last completion was yesterday
    if (isConsecutiveDay(lastCompletion, now)) {
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
      // More than one day has passed, reset streak to 1
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