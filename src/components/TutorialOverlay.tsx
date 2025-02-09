import { useState } from 'react';
import { Gift, ChevronRight, X, DollarSign, Rocket, Users } from 'lucide-react';
import { useTutorial } from '../context/TutorialContext';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';

export function TutorialOverlay() {
  const { showTutorial, currentStep, nextStep, skipTutorial } = useTutorial();
  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });

  if (!showTutorial) return null;

  const steps = [
    {
      title: "Welcome to Your Dashboard!",
      description: "This is your earning hub where you'll find all available offers. Let's take a quick tour to help you get started!",
      icon: <Gift className="w-8 h-8 text-green-600" />,
      highlight: ".dashboard-link"
    },
    {
      title: "Redeem Your Earnings",
      description: "Convert your points into gift cards, cash, or other exciting rewards. The more you earn, the more you can redeem!",
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      highlight: ".rewards-link"
    },
    {
      title: "Share & Multiply",
      description: "Invite friends and earn 10% of their earnings forever! Plus get 2,000 points for each friend who joins.",
      icon: <Users className="w-8 h-8 text-green-600" />,
      highlight: ".share-link"
    },
    {
      title: "Bonus Games",
      description: "Play our RocketGame for a chance to multiply your earnings up to 10x! The higher you fly, the more you earn.",
      icon: <Rocket className="w-8 h-8 text-green-600" />,
      highlight: ".rocket-game-link"
    },
    {
      title: "You're All Set!",
      description: "Congratulations! You've earned 5,000 bonus points. Return to your dashboard and start completing offers to earn even more!",
      icon: <Gift className="w-8 h-8 text-green-600" />,
      highlight: null
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Trigger celebration effects
      playSuccess();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    nextStep();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 relative animate-fade-in">
        <button
          onClick={skipTutorial}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
            {currentStepData.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {currentStepData.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={skipTutorial}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Skip Tutorial
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors group"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}