import { useState, useEffect } from 'react';
import { Gift, Sparkles, Info, Lock, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import { useMultiplier } from '../context/MultiplierContext';

const PRIZES = [
  { label: '2x Points', value: 2, color: '#4F46E5', textColor: '#fff' }, // indigo-600
  { label: '1.5x Points', value: 1.5, color: '#7C3AED', textColor: '#fff' }, // violet-600
  { label: '3x Points', value: 3, color: '#2563EB', textColor: '#fff' }, // blue-600
  { label: '1.2x Points', value: 1.2, color: '#9333EA', textColor: '#fff' }, // purple-600
  { label: '5x Points', value: 5, color: '#EC4899', textColor: '#fff' }, // pink-600
  { label: '1.8x Points', value: 1.8, color: '#8B5CF6', textColor: '#fff' }, // violet-500
  { label: '1.3x Points', value: 1.3, color: '#6366F1', textColor: '#fff' }, // indigo-500
  { label: '10x Points', value: 10, color: '#DB2777', textColor: '#fff' }, // pink-700
];

const SPIN_COST = 5000; // 5,000 points to spin
const SPIN_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function LuckySpinner() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [lastSpinTime, setLastSpinTime] = useState(() => {
    const saved = localStorage.getItem('lastSpinTime');
    return saved ? parseInt(saved) : 0;
  });
  const [playSpinning] = useSound('/spinning.mp3', { volume: 0.3 });
  const [playWin] = useSound('/win.mp3', { volume: 0.5 });
  const { setMultiplier } = useMultiplier();

  const userPoints = 10000; // This should come from your user state
  const canSpin = userPoints >= SPIN_COST && Date.now() - lastSpinTime >= SPIN_COOLDOWN;
  
  const timeUntilNextSpin = () => {
    const timeLeft = SPIN_COOLDOWN - (Date.now() - lastSpinTime);
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  const spin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    playSpinning();

    // Calculate the winning prize
    const random = Math.random();
    const prizeIndex = Math.floor(random * PRIZES.length);
    const prize = PRIZES[prizeIndex];

    // Calculate the final rotation
    // Each prize takes up 360/PRIZES.length degrees
    // We want to land in the middle of the prize's segment
    const degreesPerPrize = 360 / PRIZES.length;
    const prizeRotation = 360 - (prizeIndex * degreesPerPrize + degreesPerPrize / 2);
    
    // Add extra rotations for effect (5-8 full rotations)
    const extraRotations = (5 + Math.floor(Math.random() * 4)) * 360;
    const targetRotation = prizeRotation + extraRotations;

    // Animate the spin
    setRotation(targetRotation);

    // Handle win after animation
    setTimeout(() => {
      setIsSpinning(false);
      playWin();
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Update last spin time
      const now = Date.now();
      setLastSpinTime(now);
      localStorage.setItem('lastSpinTime', now.toString());

      // Update multiplier
      setMultiplier(prize.value, 'spinner');

      // Show win notification
      alert(`Congratulations! You won ${prize.label}!`);
    }, 5000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6" />
          <h3 className="text-xl font-bold">Lucky Spinner</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="How it works"
          >
            <Info className="w-4 h-4 text-purple-100" />
          </button>
          <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">{SPIN_COST.toLocaleString()} points/spin</span>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm">
          <h4 className="font-semibold mb-2">How Lucky Spinner Works:</h4>
          <ul className="space-y-2 text-purple-100">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              Costs {SPIN_COST.toLocaleString()} points per spin
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              Win multipliers from 1.2x to 10x
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              24-hour cooldown between spins
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              Multipliers apply to your next offer completion
            </li>
          </ul>
        </div>
      )}

      <div className="relative aspect-square max-w-[300px] mx-auto mb-6">
        {/* Spinner Wheel */}
        <div 
          className="absolute inset-0 rounded-full shadow-xl overflow-hidden transition-transform duration-[5000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {PRIZES.map((prize, index) => {
            const rotation = (index * 360) / PRIZES.length;
            return (
              <div
                key={index}
                className="absolute top-0 left-0 w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
                style={{
                  transform: `rotate(${rotation}deg) skew(${90 - (360 / PRIZES.length)}deg)`,
                  background: prize.color,
                }}
              >
                <div
                  className="text-sm font-bold whitespace-nowrap"
                  style={{
                    transform: `rotate(${-rotation}deg) skew(${-(90 - (360 / PRIZES.length))}deg)`,
                    color: prize.textColor,
                  }}
                >
                  {prize.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full"></div>
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4">
          <div className="w-4 h-4 bg-white rotate-45 transform origin-bottom"></div>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={!canSpin || isSpinning}
        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          !canSpin || isSpinning
            ? 'bg-gray-400/50 cursor-not-allowed'
            : 'bg-white text-purple-600 hover:bg-purple-50'
        }`}
      >
        {isSpinning ? (
          'Spinning...'
        ) : !canSpin ? (
          <div className="flex items-center gap-2">
            {userPoints < SPIN_COST ? (
              <>
                <Lock className="w-4 h-4" />
                Need {SPIN_COST.toLocaleString()} Points
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Available in {timeUntilNextSpin()}
              </>
            )}
          </div>
        ) : (
          'Spin Now'
        )}
      </button>
    </div>
  );
}