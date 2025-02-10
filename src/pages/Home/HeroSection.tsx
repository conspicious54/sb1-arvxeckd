import { ArrowRight, DollarSign, Gift, Trophy, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-medium"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Hero Content */}
        <div className="text-center mb-16 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white mb-8 animate-fade-in-up">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Get $5 FREE when you join today!</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Turn Your Time Into
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-transparent bg-clip-text animate-gradient-text">
              Real Rewards
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Complete simple tasks, earn points, and redeem for cash or gift cards.
            <br />
            Join thousands of users already earning daily rewards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 group text-lg transform hover:scale-105 hover:shadow-xl"
            >
              Start Earning Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {[
            { icon: DollarSign, value: "$250K+", label: "Rewards Paid" },
            { icon: Trophy, value: "50K+", label: "Active Users" },
            { icon: Gift, value: "100K+", label: "Rewards Claimed" },
            { icon: Shield, value: "4.9/5", label: "User Rating" }
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{value}</div>
              <div className="text-green-100">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}