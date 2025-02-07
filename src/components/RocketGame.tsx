import { useState, useEffect, useRef } from 'react';
import { Rocket, Timer, TrendingUp, History, AlertTriangle, DollarSign } from 'lucide-react';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

interface GameHistory {
  multiplier: number;
  timestamp: Date;
  crashed: boolean;
}

export function RocketGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [betAmount, setBetAmount] = useState(100);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isCrashed, setIsCrashed] = useState(false);
  const [userPoints, setUserPoints] = useState(10000); // This should come from your global state
  const [playRocket] = useSound('/rocket.mp3', { volume: 0.3 });
  const [playExplosion] = useSound('/explosion.mp3', { volume: 0.4 });
  const [playSuccess] = useSound('/success.mp3', { volume: 0.3 });
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Calculate crash point (between 1 and 10)
  const calculateCrashPoint = () => {
    const random = Math.random();
    // Use an exponential distribution to make higher numbers rarer
    return Math.min(1 + Math.exp(random * 2), 10);
  };

  const startGame = () => {
    if (betAmount > userPoints) return;
    setUserPoints(prev => prev - betAmount);
    setIsPlaying(true);
    setIsCrashed(false);
    setMultiplier(1);
    startTimeRef.current = Date.now();
    playRocket();
    animate();
  };

  const animate = () => {
    if (!startTimeRef.current) return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const newMultiplier = 1 + (elapsed * 0.001); // Increase by 1x per second
    
    if (newMultiplier >= calculateCrashPoint()) {
      crashGame();
    } else {
      setMultiplier(newMultiplier);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const cashOut = () => {
    if (!isPlaying) return;
    
    const winnings = Math.floor(betAmount * multiplier);
    setUserPoints(prev => prev + winnings);
    setIsPlaying(false);
    setGameHistory(prev => [{
      multiplier,
      timestamp: new Date(),
      crashed: false
    }, ...prev.slice(0, 9)]);
    
    playSuccess();
    
    // Trigger confetti for big wins
    if (multiplier >= 2) {
      confetti({
        particleCount: Math.floor(multiplier * 20),
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const crashGame = () => {
    setIsCrashed(true);
    setIsPlaying(false);
    setGameHistory(prev => [{
      multiplier,
      timestamp: new Date(),
      crashed: true
    }, ...prev.slice(0, 9)]);
    playExplosion();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6" />
          <h3 className="text-xl font-bold">Rocket Game</h3>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-purple-200" />
          <span className="text-sm">Next game in: {isPlaying ? '0s' : '3s'}</span>
        </div>
      </div>

      {/* Game Display */}
      <div className="relative bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 h-48 overflow-hidden">
        {isCrashed ? (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-red-500/90 backdrop-blur-sm animate-fade-in">
            <AlertTriangle className="w-12 h-12 animate-bounce" />
            <p className="text-2xl font-bold">CRASHED!</p>
            <p className="text-sm opacity-90">at {multiplier.toFixed(2)}x</p>
          </div>
        ) : isPlaying ? (
          <div className="relative h-full">
            <Rocket 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 animate-rocket" 
              style={{
                transform: `translate(-50%, ${-multiplier * 10}%) rotate(-45deg)`,
                transition: 'transform 0.1s linear'
              }}
            />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl font-bold animate-pulse">
              {multiplier.toFixed(2)}x
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-xl text-purple-200">Place your bet to play</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-purple-200 mb-2">Bet Amount</label>
          <div className="relative">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
              disabled={isPlaying}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50"
              placeholder="Enter bet amount"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-purple-200">pts</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm text-purple-200 mb-2">Your Points</label>
          <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-200" />
            <span>{userPoints.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {!isPlaying ? (
          <button
            onClick={startGame}
            disabled={betAmount > userPoints}
            className="w-full bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place Bet
          </button>
        ) : (
          <button
            onClick={cashOut}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors animate-pulse"
          >
            Cash Out ({(betAmount * multiplier).toFixed(0)})
          </button>
        )}
        <button
          onClick={() => setBetAmount(prev => prev * 2)}
          disabled={isPlaying || betAmount * 2 > userPoints}
          className="w-full bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Double Bet
        </button>
      </div>

      {/* Game History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-purple-200" />
          <h4 className="text-sm font-medium">Recent Games</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {gameHistory.map((game, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-lg text-sm ${
                game.crashed
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-green-500/20 text-green-300'
              }`}
            >
              {game.multiplier.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rocket {
          0% { transform: translate(-50%, 0) rotate(-45deg); }
          100% { transform: translate(-50%, -100%) rotate(-45deg); }
        }
        .animate-rocket {
          animation: rocket 10s linear;
        }
      `}</style>
    </div>
  );
}