import { Star, Quote, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TestimonialsPage() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "I've earned over $500 in my spare time between classes. The daily streaks really add up, and the instant PayPal payouts are amazing!",
      earned: "$500+",
      rating: 5,
      location: "United States"
    },
    {
      name: "Michael R.",
      role: "Freelancer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "The best reward site I've used. Clean interface, instant payouts, and great support. I recommend it to all my friends.",
      earned: "$1,200+",
      rating: 5,
      location: "Canada"
    },
    {
      name: "Jessica T.",
      role: "Stay-at-home Mom",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "Love how I can earn while watching the kids. The PayPal cashouts are always instant, and the support team is fantastic!",
      earned: "$750+",
      rating: 5,
      location: "United Kingdom"
    },
    {
      name: "David L.",
      role: "College Student",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "Perfect for earning extra cash between classes. The mobile app makes it easy to complete offers anywhere.",
      earned: "$300+",
      rating: 4,
      location: "Australia"
    },
    {
      name: "Emma W.",
      role: "Part-time Worker",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "I was skeptical at first, but this platform really delivers. The variety of tasks keeps it interesting.",
      earned: "$900+",
      rating: 5,
      location: "Germany"
    },
    {
      name: "James H.",
      role: "Gig Worker",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "The referral program is incredible. I've built a nice passive income stream just by sharing with friends.",
      earned: "$2,000+",
      rating: 5,
      location: "United States"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Total Paid", value: "$250K+" },
    { label: "Avg. Rating", value: "4.8/5" },
    { label: "Countries", value: "150+" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              What Our Users Say
            </h1>
            <p className="text-xl text-green-50 max-w-3xl mx-auto">
              Join thousands of satisfied users who are already earning rewards daily
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <Quote className="w-8 h-8 text-green-600/20 dark:text-green-400/20 mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {testimonial.quote}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {testimonial.location}
                    </span>
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    Earned: {testimonial.earned}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Start earning rewards today and become our next success story
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors group"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}