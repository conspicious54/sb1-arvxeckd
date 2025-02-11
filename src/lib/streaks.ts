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
      console.log('First completion - initializing streak');
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

    // Helper function to check if two dates are the same calendar day
    const isSameDay = (date1: Date, date2: Date) => {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
    };

    // Helper function to check if date1 is exactly one day before date2
    const isConsecutiveDay = (date1: Date, date2: Date) => {
      // Reset time to midnight for both dates
      const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
      const diffInDays = Math.round((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
      return diffInDays === 1;
    };

    console.log('Checking streak:', {
      now: now.toISOString(),
      lastCompletion: lastCompletion.toISOString(),
      currentStreak: profile.streak_count,
      bestStreak: profile.best_streak
    });

    // Check if the last completion was today
    if (isSameDay(lastCompletion, now)) {
      console.log('Already completed an offer today - maintaining streak');
      return;
    }

    // Check if the last completion was yesterday
    if (isConsecutiveDay(lastCompletion, now)) {
      console.log('Consecutive day - incrementing streak');
      // Increment streak
      const newStreak = profile.streak_count + 1;
      const newBestStreak = Math.max(newStreak, profile.best_streak || 0);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          streak_count: newStreak,
          best_streak: newBestStreak,
          last_offer_completion: now.toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating streak:', updateError);
        throw updateError;
      }

      console.log('Streak updated:', { newStreak, newBestStreak });
    } else {
      console.log('Streak broken - resetting to 1');
      // More than one day has passed, reset streak to 1
      const { error: resetError } = await supabase
        .from('profiles')
        .update({
          streak_count: 1,
          last_offer_completion: now.toISOString()
        })
        .eq('id', user.id);

      if (resetError) {
        console.error('Error resetting streak:', resetError);
        throw resetError;
      }
    }
  } catch (error) {
    console.error('Error in updateStreak:', error);
    throw error;
  }
}