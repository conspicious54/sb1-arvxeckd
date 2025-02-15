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

    // If streak is 0 or null, this is a fresh start
    if (!profile.streak_count || profile.streak_count === 0) {
      console.log('Starting fresh streak');
      const { error: initError } = await supabase
        .from('profiles')
        .update({
          streak_count: 1,
          best_streak: 1,
          last_offer_completion: now.toISOString()
        })
        .eq('id', user.id);

      if (initError) {
        console.error('Error initializing streak:', initError);
        throw initError;
      }

      // Clear any existing multiplier from localStorage
      localStorage.removeItem('activeMultiplier');
      return;
    }

    // If no last completion date, but streak exists (shouldn't happen, but let's handle it)
    if (!profile.last_offer_completion) {
      console.log('No last completion date - resetting streak');
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

      // Clear any existing multiplier from localStorage
      localStorage.removeItem('activeMultiplier');
      return;
    }

    const lastCompletion = new Date(profile.last_offer_completion);

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
      console.log('Starting new streak');
      // More than one day has passed, start new streak at 1
      const { error: resetError } = await supabase
        .from('profiles')
        .update({
          streak_count: 1,
          last_offer_completion: now.toISOString()
        })
        .eq('id', user.id);

      if (resetError) {
        console.error('Error starting new streak:', resetError);
        throw resetError;
      }

      // Clear any existing multiplier from localStorage
      localStorage.removeItem('activeMultiplier');
    }
  } catch (error) {
    console.error('Error in updateStreak:', error);
    throw error;
  }
}