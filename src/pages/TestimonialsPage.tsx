import { Star, Quote, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

// Fixed rating and review count
const AVERAGE_RATING = 4.92;
const TOTAL_REVIEWS = 1053;

// Fixed rating distribution
const RATING_DISTRIBUTION = {
  5: Math.round(TOTAL_REVIEWS * 0.7),  // 70% 5-star
  4: Math.round(TOTAL_REVIEWS * 0.25), // 25% 4-star
  3: Math.round(TOTAL_REVIEWS * 0.03), // 3% 3-star
  2: Math.round(TOTAL_REVIEWS * 0.01), // 1% 2-star
  1: Math.round(TOTAL_REVIEWS * 0.01)  // 1% 1-star
};

// Generate 15 realistic testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: "Emma T.",
    role: "Student",
    quote: "I've earned over $500 in my spare time between classes. The daily streaks really add up, and the instant PayPal payouts are amazing!",
    earned: "$350+",
    rating: 5,
    date: "2 days ago",
    helpful: 124,
    verified: true
  },
  {
    id: 2,
    name: "James W.",
    role: "Freelancer", 
    quote: "Perfect for earning in my spare time. I usually complete offers while watching TV and it adds up quickly.",
    earned: "$750+",
    rating: 5,
    date: "1 week ago",
    helpful: 89,
    verified: true
  },
  {
    id: 3,
    name: "Sarah M.",
    role: "Teacher",
    quote: "The daily streaks really motivate me to stay active. I've earned over $200 just from maintaining my streak bonuses!",
    earned: "$500+",
    rating: 5,
    date: "2 weeks ago",
    helpful: 156,
    verified: true
  },
  {
    id: 4,
    name: "Michael R.",
    role: "Remote Worker",
    quote: "Best rewards site I've tried. The support team is responsive and they actually care about user feedback.",
    earned: "$1,200+",
    rating: 5,
    date: "3 weeks ago",
    helpful: 201,
    verified: true
  },
  {
    id: 5,
    name: "Jessica T.",
    role: "Stay-at-home Parent",
    quote: "Love how transparent everything is. You know exactly what you need to do and how much you'll earn.",
    earned: "$650+",
    rating: 4,
    date: "1 month ago",
    helpful: 167,
    verified: true
  },
  {
    id: 6,
    name: "David L.",
    role: "College Student",
    quote: "The mobile app makes it so convenient. I earn during my commute and lunch breaks.",
    earned: "$300+",
    rating: 5,
    date: "1 month ago",
    helpful: 92,
    verified: true
  },
  {
    id: 7,
    name: "Sophia C.",
    role: "Part-time Worker",
    quote: "Started using this to save for Christmas gifts and ended up making it a regular side hustle.",
    earned: "$850+",
    rating: 5,
    date: "1 month ago",
    helpful: 143,
    verified: true
  },
  {
    id: 8,
    name: "William K.",
    role: "Retiree",
    quote: "Really impressed with how quickly rewards are processed. No waiting weeks like other sites.",
    earned: "$400+",
    rating: 4,
    date: "2 months ago",
    helpful: 78,
    verified: true
  },
  {
    id: 9,
    name: "Olivia B.",
    role: "Student",
    quote: "The variety of tasks keeps it interesting. I never get bored and there's always something new.",
    earned: "$275+",
    rating: 5,
    date: "2 months ago",
    helpful: 112,
    verified: true
  },
  {
    id: 10,
    name: "Lucas G.",
    role: "Freelancer",
    quote: "Great community of earners. The referral program is generous and actually worth sharing.",
    earned: "$950+",
    rating: 5,
    date: "2 months ago",
    helpful: 189,
    verified: true
  },
  {
    id: 11,
    name: "Isabella L.",
    role: "Remote Worker",
    quote: "Been using this platform for 6 months and consistently earn $300-400 monthly.",
    earned: "$2,100+",
    rating: 5,
    date: "3 months ago",
    helpful: 234,
    verified: true
  },
  {
    id: 12,
    name: "Ethan T.",
    role: "Student",
    quote: "The achievement system makes it feel like a game. Love unlocking new reward tiers!",
    earned: "$425+",
    rating: 4,
    date: "3 months ago",
    helpful: 156,
    verified: true
  },
  {
    id: 13,
    name: "Ava M.",
    role: "Teacher",
    quote: "Finally found a legitimate way to earn from home that actually pays what they promise.",
    earned: "$800+",
    rating: 5,
    date: "3 months ago",
    helpful: 198,
    verified: true
  },
  {
    id: 14,
    name: "Noah A.",
    role: "College Student",
    quote: "The double points events are amazing. I've learned to save my bigger offers for these.",
    earned: "$550+",
    rating: 5,
    date: "3 months ago",
    helpful: 167,
    verified: true
  },
  {
    id: 15,
    name: "Charlotte W.",
    role: "Part-time Worker",
    quote: "As a student, this helps me cover my textbook costs each semester. So grateful I found it!",
    earned: "$600+",
    rating: 4,
    date: "3 months ago",
    helpful: 145,
    verified: true
  }
];

export function TestimonialsPage() {
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);

  const handleHelpfulClick = (reviewId: number) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new review object
      const newReview = {
        id: Math.max(...testimonials.map(t => t.id)) + 1,
        name: "You", // Could be replaced with actual user name
        role: "Verified User",
        quote: reviewText,
        earned: "$0+",
        rating: reviewRating,
        date: "Just now",
        helpful: 0,
        verified: true
      };

      // Add new review to the list
      setTestimonials(prev => [newReview, ...prev.slice(0, -1)]); // Remove last review to keep same count

      // Show success message
      alert('Thank you for your review! Your feedback helps improve our service.');

      // Reset form
      setReviewText('');
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-emerald-600/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            What Our Users Say
          </h1>
          <p className="text-xl text-green-50 max-w-3xl mx-auto">
            Join thousands of satisfied users who are already earning rewards daily
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Rating Summary */}
          <div className="max-w-4xl mx-auto mb-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Average Rating */}
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {AVERAGE_RATING}
                </div>
                <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(AVERAGE_RATING)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Based on {TOTAL_REVIEWS.toLocaleString()} reviews
                </div>
              </div>

              {/* Right Column - Rating Breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = RATING_DISTRIBUTION[rating as keyof typeof RATING_DISTRIBUTION];
                  const percentage = (count / TOTAL_REVIEWS) * 100;
                  return (
                    <div
                      key={rating}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-1 w-24">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-20 text-sm text-gray-600 dark:text-gray-400 text-right">
                        {count.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Write Review Button */}
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="max-w-4xl mx-auto mb-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmitReview}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Write Your Review
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewRating(rating)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= reviewRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Share your experience..."
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors relative"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
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
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.date}
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

                <div className="flex items-center justify-between">
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    Earned: {testimonial.earned}
                  </div>
                  <button
                    onClick={() => handleHelpfulClick(testimonial.id)}
                    className={`flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${
                      helpfulReviews.has(testimonial.id) ? 'font-bold' : ''
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({testimonial.helpful})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}