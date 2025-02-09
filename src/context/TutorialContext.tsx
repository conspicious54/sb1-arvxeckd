import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface TutorialContextType {
  showTutorial: boolean;
  currentStep: number;
  nextStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType>({
  showTutorial: false,
  currentStep: 0,
  nextStep: () => {},
  skipTutorial: () => {},
  completeTutorial: () => {},
});

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is new when reaching dashboard
  useEffect(() => {
    const checkNewUser = async () => {
      // Only check on dashboard
      if (location.pathname !== '/dashboard') return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('tutorial_completed')
        .eq('id', user.id)
        .single();

      if (profile && !profile.tutorial_completed) {
        setShowTutorial(true);
      }
    };

    checkNewUser();
  }, [location.pathname]);

  const nextStep = () => {
    // First navigate to the next page
    switch (currentStep) {
      case 0:
        navigate('/rewards');
        break;
      case 1:
        navigate('/share');
        break;
      case 2:
        navigate('/rocket-game');
        break;
      case 3:
        navigate('/dashboard');
        break;
      case 4:
        completeTutorial();
        return; // Exit early for completion
    }

    // Then update the step counter
    setCurrentStep(prev => prev + 1);
  };

  const skipTutorial = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Award points even if skipped
    await supabase.rpc('award_welcome_bonus', { user_id: user.id });

    // Mark tutorial as completed
    await supabase
      .from('profiles')
      .update({ tutorial_completed: true })
      .eq('id', user.id);

    setShowTutorial(false);
    navigate('/dashboard');
  };

  const completeTutorial = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Award welcome bonus
    await supabase.rpc('award_welcome_bonus', { user_id: user.id });

    // Mark tutorial as completed
    await supabase
      .from('profiles')
      .update({ tutorial_completed: true })
      .eq('id', user.id);

    setShowTutorial(false);
    navigate('/dashboard');
  };

  return (
    <TutorialContext.Provider value={{
      showTutorial,
      currentStep,
      nextStep,
      skipTutorial,
      completeTutorial
    }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}