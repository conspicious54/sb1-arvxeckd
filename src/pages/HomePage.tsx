import { 
  ArrowRight, DollarSign, Gift, Trophy, Shield, Sparkles, 
  Users, Clock, ChevronRight, Star, Quote, Check, 
  ClipboardCheck, LayoutGrid, TrendingUp, Facebook, Twitter, 
  Linkedin, Mail, Info, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LivePayoutFeed } from '../components/LivePayoutFeed';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-500 to-emerald-600 pt-32 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Turn Your Time Into
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-transparent bg-clip-text">
                Real Rewards
              </span>
            </h1>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Complete simple tasks, earn points, and redeem for cash or gift cards. Join thousands of users already earning daily rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors group"
              >
                Start Earning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">$250K+</div>
              <div className="text-green-100">Rewards Paid</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-green-100">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">100K+</div>
              <div className="text-green-100">Rewards Claimed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Join now and get 500 bonus points instantly!
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors group text-lg"
          >
            Get Started Now
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}