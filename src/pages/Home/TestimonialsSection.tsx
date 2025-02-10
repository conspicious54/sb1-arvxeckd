import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  // Fixed average rating of 4.92
  const averageRating = 4.92;
  const totalReviews = 1053;

  // Top 5 testimonials
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Student",
      quote: "I've earned over $500 in my spare time between classes. The daily streaks really add up, and the instant PayPal payouts are amazing!",
      earned: "$500+",
      rating: 5,
      verified: true
    },
    {
      name: "Michael R.",
      role: "Freelancer",
      quote: "The best reward site I've used. Clean interface, instant payouts, and great support. I recommend it to all my friends.",
      earned: "$1,200+",
      rating: 5,
      verified: true
    },
    {
      name: "Jessica T.",
      role: "Stay-at-home Mom",
      quote: "Love how I can earn while watching the kids. The PayPal cashouts are always instant, and the support team is fantastic!",
      earned: "$750+",
      rating: 5,
      verified: true
    },
    {
      name: "David L.",
      role: "College Student",
      quote: "Perfect for earning extra cash between classes. The mobile app makes it easy to complete offers anywhere.",
      earned: "$300+",
      rating: 5,
      verified: true
    },
    {
      name: "Emma W.",
      role: "Part-time Worker",
      quote: "I was skeptical at first, but this platform really delivers. The variety of tasks keeps it interesting.",
      earned: "$900+",
      rating: 4,
      verified: true
    }
  ];

  // Fixed rating distribution for 1,053 total reviews
  const ratingDistribution = {
    5: Math.round(totalReviews * 0.7), // 70% 5-star
    4: Math.round(totalReviews * 0.25), // 25% 4-star
    3: Math.round(totalReviews * 0.03), // 3% 3-star
    2: Math.round(totalReviews * 0.01), // 1% 2-star
    1: Math.round(totalReviews * 0.01)  // 1% 1-star
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join thousands of satisfied users already earning rewards
          </p>
        </div>

        {/* Rating Summary */}
        <div className="max-w-4xl mx-auto mb-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Average Rating */}
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {averageRating}
              </div>
              <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Based on {totalReviews.toLocaleString()} reviews
              </div>
            </div>

            {/* Right Column - Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = (count / totalReviews) * 100;
                return (
                  <div
                    key={rating}
                    className="w-full flex items-center gap-2 p-1 rounded"
                  >
                    <div className="flex items-center gap-1 w-24">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">
                      {count.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center text-lg font-bold text-green-600 dark:text-green-400">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {testimonial.name}
                        {testimonial.verified && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Quote className="w-8 h-8 text-green-600/20 dark:text-green-400/20 mb-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  {testimonial.quote}
                </p>
              </div>

              <div className="text-green-600 dark:text-green-400 font-medium">
                Earned: {testimonial.earned}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}