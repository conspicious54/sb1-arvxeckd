import { useState, useEffect, useRef } from 'react';
import { Rocket, Timer, TrendingUp, History, AlertTriangle, DollarSign, Trophy, Users, Star, Info } from 'lucide-react';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

interface GameHistory {
  multiplier: number;
  timestamp: Date;
  crashed: boolean;
  crashSpeed?: number;
}

export function RocketGamePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [betAmount, setBetAmount] = useState(100);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isCrashed, setIsCrashed] = useState(false);
  const [userPoints, setUserPoints] = useState(10000);
  const [showInfo, setShowInfo] = useState(false);
  const [rocketPosition, setRocketPosition] = useState({ x: 50, y: 100 }); // Percentage values
  const [crashSpeed, setCrashSpeed] = useState(0);
  const [playRocket] = useSound('/rocket.mp3', { volume: 0.3 });
  const [playExplosion] = useSound('/explosion.mp3', { volume: 0.4 });
  const [playSuccess] = useSound('/success.mp3', { volume: 0.3 });
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const graphRef = useRef<HTMLDivElement>(null);

  // Calculate crash point with corrected distribution
  const calculateCrashPoint = () => {
    const random = Math.random();
    
    // Corrected distribution curve:
    // 20% chance: Very early crash (1.0x-1.3x)
    // 30% chance: Early crash (1.3x-1.8x)
    // 25% chance: Medium crash (1.8x-2.4x)
    // 15% chance: Good run (2.4x-3.0x)
    // 10% chance: Great run (3.0x-5.0x)
    
    if (random < 0.20) {
      // Very early crash: 1.0x-1.3x
      return 1.0 + (random / 0.20) * 0.3;
    } else if (random < 0.50) {
      // Early crash: 1.3x-1.8x
      return 1.3 + ((random - 0.20) / 0.30) * 0.5;
    } else if (random < 0.75) {
      // Medium crash: 1.8x-2.4x
      return 1.8 + ((random - 0.50) / 0.25) * 0.6;
    } else if (random < 0.90) {
      // Good run: 2.4x-3.0x
      return 2.4 + ((random - 0.75) / 0.15) * 0.6;
    } else {
      // Great run: 3.0x-5.0x
      return 3.0 + ((random - 0.90) / 0.10) * 2.0;
    }
  };

  const updateRocketPosition = (currentMultiplier: number, isCrashing: boolean = false) => {
    if (!graphRef.current) return;
    
    // Calculate x position based on time (moves right)
    // Start from bottom left (0, 0) and move up and right
    const xProgress = Math.min((currentMultiplier - 1) * 8, 85); // Slower horizontal movement
    
    // Calculate y position based on multiplier with some randomness
    let yPosition = (currentMultiplier - 1) * 8; // Slower vertical movement
    
    // Add slight wave motion during flight
    if (!isCrashing) {
      const wave = Math.sin(Date.now() / 500) * 2; // Gentle wave effect
      yPosition += wave;
    }
    
    if (isCrashing) {
      // Add chaotic motion during crash
      const randomX = (Math.random() - 0.5) * crashSpeed;
      const randomY = Math.random() * crashSpeed;
      
      setRocketPosition(prev => ({
        x: Math.max(0, Math.min(100, prev.x + randomX)),
        y: Math.max(0, Math.min(100, prev.y - randomY))
      }));
    } else {
      setRocketPosition({
        x: Math.max(0, Math.min(100, xProgress)),
        y: Math.max(0, Math.min(100, yPosition))
      });
    }
  };

  const startGame = () => {
    if (betAmount > userPoints) return;
    setUserPoints(prev => prev - betAmount);
    setIsPlaying(true);
    setIsCrashed(false);
    setMultiplier(1);
    setCrashSpeed(0);
    // Start from bottom left
    setRocketPosition({ x: 0, y: 0 });
    startTimeRef.current = Date.now();
    playRocket();
    
    // Add rocket trail effect
    const addTrailParticle = () => {
      if (!isPlaying) return;
      
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 rounded-full bg-purple-500/50';
      particle.style.left = `${rocketPosition.x}%`;
      particle.style.bottom = `${rocketPosition.y}%`;
      
      if (graphRef.current) {
        graphRef.current.appendChild(particle);
        
        // Animate particle
        setTimeout(() => {
          particle.style.opacity = '0';
          particle.style.transform = 'scale(0.5)';
          setTimeout(() => particle.remove(), 1000);
        }, 0);
      }
      
      if (isPlaying) {
        requestAnimationFrame(addTrailParticle);
      }
    };
    
    addTrailParticle();
    animate();
  };

  const crashGame = () => {
    setIsCrashed(true);
    setIsPlaying(false);
    setCrashSpeed(3); // Start slower for more dramatic effect
    playExplosion();

    // Create explosion particles
    const createExplosionParticles = () => {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-3 h-3 rounded-full';
        particle.style.left = `${rocketPosition.x}%`;
        particle.style.bottom = `${rocketPosition.y}%`;
        particle.style.backgroundColor = ['#ef4444', '#f97316', '#f59e0b'][Math.floor(Math.random() * 3)];
        
        const angle = (Math.random() * Math.PI * 2);
        const speed = Math.random() * 50 + 25;
        const startTime = Date.now();
        
        if (graphRef.current) {
          graphRef.current.appendChild(particle);
          
          const animateParticle = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const x = speed * Math.cos(angle) * elapsed;
            const y = speed * Math.sin(angle) * elapsed - (50 * elapsed * elapsed); // Add gravity
            
            particle.style.transform = `translate(${x}px, ${-y}px)`;
            particle.style.opacity = Math.max(0, 1 - elapsed).toString();
            
            if (elapsed < 2) {
              requestAnimationFrame(animateParticle);
            } else {
              particle.remove();
            }
          };
          
          requestAnimationFrame(animateParticle);
        }
      }
    };

    createExplosionParticles();
    
    // Chaotic crash animation
    const crashAnimation = () => {
      setCrashSpeed(prev => prev * 1.2); // Accelerate more gradually
      updateRocketPosition(multiplier, true);
      
      if (rocketPosition.y > 0 && crashSpeed < 30) {
        requestAnimationFrame(crashAnimation);
      }
    };
    crashAnimation();

    // Add screen shake effect
    if (graphRef.current) {
      graphRef.current.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    }

    setGameHistory(prev => [{
      multiplier,
      timestamp: new Date(),
      crashed: true,
      crashSpeed
    }, ...prev.slice(0, 9)]);
  };

  const animate = () => {
    if (!startTimeRef.current) return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const newMultiplier = 1 + (elapsed * 0.001); // Increase by 1x per second
    
    if (newMultiplier >= calculateCrashPoint()) {
      crashGame();
    } else {
      setMultiplier(newMultiplier);
      updateRocketPosition(newMultiplier);
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
    
    if (multiplier >= 2) {
      confetti({
        particleCount: Math.floor(multiplier * 20),
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Rocket Game</h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Place your bet and cash out before the rocket crashes. The longer you wait, the higher your potential winnings!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Stats</h2>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-200 text-sm">Balance</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{userPoints}</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-200 text-sm">Best Win</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {Math.max(...gameHistory.filter(g => !g.crashed).map(g => g.multiplier), 0).toFixed(2)}x
                  </p>
                </div>
              </div>
            </div>

            {/* Game History */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Games</h2>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <History className="w-6 h-6 text-purple-300" />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg text-sm text-center ${
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

            {/* How to Play */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">How to Play</h2>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Info className="w-6 h-6 text-purple-300" />
                </div>
              </div>
              <ol className="space-y-4 text-purple-200">
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                  <span>Place your bet using the controls below</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                  <span>Watch the multiplier increase as the rocket flies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                  <span>Cash out before the rocket crashes to win!</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Game Display */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              {/* Game Canvas */}
              <div 
                ref={graphRef}
                className="relative bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 h-96 overflow-hidden"
              >
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-10 gap-0">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="border-l border-white/10 h-full" />
                  ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-10 gap-0">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="border-t border-white/10 w-full" />
                  ))}
                </div>

                {/* Multiplier Line */}
                {isPlaying && (
                  <div 
                    className="absolute left-0 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"
                    style={{
                      bottom: `${100 - (multiplier - 1) * 10}%`,
                      width: '100%',
                      opacity: 0.5
                    }}
                  />
                )}

                {isCrashed ? (
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-red-500/90 backdrop-blur-sm animate-fade-in">
                    <AlertTriangle className="w-24 h-24 animate-bounce text-white" />
                    <p className="text-4xl font-bold text-white">CRASHED!</p>
                    <p className="text-xl text-white/90">at {multiplier.toFixed(2)}x</p>
                  </div>
                ) : (
                  <>
                    <Rocket 
                      className="absolute w-16 h-16 text-white transform -rotate-45 transition-transform duration-100"
                      style={{
                        left: `${rocketPosition.x}%`,
                        bottom: `${rocketPosition.y}%`,
                        transform: `translate(-50%, 50%) rotate(${isCrashed ? '45' : '-45'}deg)`,
                      }}
                    />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl font-bold text-white animate-pulse">
                      {multiplier.toFixed(2)}x
                    </div>
                  </>
                )}

                {!isPlaying && !isCrashed && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl text-purple-200">Place your bet to play</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-purple-200 mb-2">Bet Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      disabled={isPlaying}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50"
                      placeholder="Enter bet amount"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm text-purple-200">pts</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-purple-200 mb-2">Your Points</label>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-200" />
                    <span className="text-white">{userPoints.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {!isPlaying ? (
                  <button
                    onClick={startGame}
                    disabled={betAmount > userPoints}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Place Bet
                  </button>
                ) : (
                  <button
                    onClick={cashOut}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-colors animate-pulse"
                  >
                    Cash Out ({(betAmount * multiplier).toFixed(0)})
                  </button>
                )}
                <button
                  onClick={() => setBetAmount(prev => prev * 2)}
                  disabled={isPlaying || betAmount * 2 > userPoints}
                  className="w-full bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Double Bet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add these styles at the end */}
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        .rocket-trail {
          transition: all 1s;
        }
      `}</style>
    </div>
  );
}