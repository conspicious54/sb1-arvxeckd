import { createContext, useContext, useState, useEffect } from 'react';

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

  const setMultiplier = (value: number, newSource: 'streak' | 'spinner') => {
    // Only update if the new multiplier is higher
    if (value > multiplier) {
      setMultiplierValue(value);
      setSource(newSource);
      
      // Store in localStorage
      localStorage.setItem('activeMultiplier', JSON.stringify({ value, source: newSource }));
    }
  };

  // Load saved multiplier on mount
  useEffect(() => {
    const saved = localStorage.getItem('activeMultiplier');
    if (saved) {
      const { value, source: savedSource } = JSON.parse(saved);
      setMultiplierValue(value);
      setSource(savedSource);
    }
  }, []);

  return (
    <MultiplierContext.Provider value={{ multiplier, source, setMultiplier }}>
      {children}
    </MultiplierContext.Provider>
  );
}

export function useMultiplier() {
  return useContext(MultiplierContext);
}