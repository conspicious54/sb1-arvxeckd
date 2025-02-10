import { 
  HeroSection,
  StatsSection,
  FeaturesSection, 
  HowItWorksSection,
  RewardsSection,
  TestimonialsSection,
  FAQSection,
  CTASection 
} from './sections';
import { LivePayoutFeed } from '../../components/LivePayoutFeed';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <StatsSection />
      <LivePayoutFeed />
      <FeaturesSection />
      <HowItWorksSection />
      <RewardsSection />
      <TestimonialsSection />
      <FAQSection />

      {/* Final Call to Action */}
      <CTASection />
    </div>
  );
}