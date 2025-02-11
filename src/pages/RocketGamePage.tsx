import { useState, useEffect, useRef } from 'react';
import { Rocket, Timer, TrendingUp, History, AlertTriangle, DollarSign, Trophy, Users, Star, Info, Lock, ChevronRight } from 'lucide-react';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

interface GameHistory {
  multiplier: number;
  timestamp: Date;
  crashed: boolean;
  crashSpeed?: number;
}

export function RocketGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Coming Soon Overlay */}
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-indigo-600/90 rounded-2xl"></div>
          
          <div className="relative">
            {/* Icon */}
            <div className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <Rocket className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Rocket Game Coming Soon!
            </h1>

            {/* Description */}
            <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-8">
              Get ready for an exciting new way to multiply your earnings! Our Rocket Game is launching soon with amazing rewards.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="p-3 bg-purple-500/20 rounded-lg w-fit mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Multiply Points
                </h3>
                <p className="text-purple-200 text-sm">
                  Earn up to 10x multiplier on your points
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="p-3 bg-purple-500/20 rounded-lg w-fit mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Daily Rewards
                </h3>
                <p className="text-purple-200 text-sm">
                  Special bonuses and achievements
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="p-3 bg-purple-500/20 rounded-lg w-fit mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Leaderboards
                </h3>
                <p className="text-purple-200 text-sm">
                  Compete for top positions
                </p>
              </div>
            </div>

            {/* Notification Button */}
            <button 
              onClick={() => alert('Thank you! We\'ll notify you when the Rocket Game launches.')}
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 group transform hover:scale-105"
            >
              <Lock className="w-5 h-5" />
              Notify Me When Available
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}