import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface MultiplierContextType {
  multiplier: number;
  source: 'streak' | 'spinner' | null;
  setMultiplier: (value: number, source: 'streak' | 'spinner') => void;
}

const MultiplierContext = createContext<MultiplierContextType>({
  multiplier: 1,
  source: null,
  setMultiplier: () => {},
});

export function MultiplierProvider({ children }: { children: React.ReactNode }) {
  const [multiplier, setMultiplierValue] = useState(1);
  const [source, setSource] = useState<'streak' | 'spinner' | null>(null);

  // Load user's streak on mount to set correct initial multiplier
  useEffect(() => {
    async function loadUserStreak() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('streak_count')
          .eq('id', user.id)
          .single();

        if (profile) {
          // Calculate multiplier based on streak (0.1 per day up to 2x)
          const streakMultiplier = Math.min(1 + (profile.streak_count * 0.1), 2);
          
          // Only set if streak multiplier is greater than 1
          if (streakMultiplier > 1) {
            setMultiplierValue(streakMultiplier);
            setSource('streak');
            localStorage.setItem('activeMultiplier', JSON.stringify({ 
              value: streakMultiplier, 
              source: 'streak',
              lastUpdated: new Date().toISOString()
            }));
          } else {
            // Clear any stored multiplier for new users
            localStorage.removeItem('activeMultiplier');
          }
        }
      } catch (error) {
        console.error('Error loading user streak:', error);
      }
    }

    loadUserStreak();
  }, []);

  const setMultiplier = (value: number, newSource: 'streak' | 'spinner') => {
    // Only update if the new multiplier is higher
    if (value > multiplier) {
      setMultiplierValue(value);
      setSource(newSource);
      
      // Store in localStorage with timestamp
      localStorage.setItem('activeMultiplier', JSON.stringify({ 
        value, 
        source: newSource,
        lastUpdated: new Date().toISOString()
      }));
    }
  };

  return (
    <MultiplierContext.Provider value={{ multiplier, source, setMultiplier }}>
      {children}
    </MultiplierContext.Provider>
  );
}

export function useMultiplier() {
  return useContext(MultiplierContext);
}