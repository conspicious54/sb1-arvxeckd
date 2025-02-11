import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { HomePage } from '../pages/HomePage';
import { HowItWorksPage } from '../pages/HowItWorksPage';
import { FeaturesPage } from '../pages/FeaturesPage';
import { TestimonialsPage } from '../pages/TestimonialsPage';
import { FAQPage } from '../pages/FAQPage';
import { DashboardPage } from '../pages/DashboardPage';
import { RewardsPage } from '../pages/RewardsPage';
import { RedemptionHistoryPage } from '../pages/RedemptionHistoryPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { ShareEarnPage } from '../pages/ShareEarnPage';
import { RocketGamePage } from '../pages/RocketGamePage';

const PublicPageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Header />
    {children}
    <Footer />
  </div>
);

const ProtectedPageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
    <Header />
    {children}
    <Footer />
  </div>
);

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes - no header/footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth" element={<Navigate to="/signup" replace />} />

      {/* Public routes with header/footer */}
      <Route
        path="/"
        element={
          <PublicPageLayout>
            <HomePage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/how-it-works"
        element={
          <PublicPageLayout>
            <HowItWorksPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/features"
        element={
          <PublicPageLayout>
            <FeaturesPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/testimonials"
        element={
          <PublicPageLayout>
            <TestimonialsPage />
          </PublicPageLayout>
        }
      />
      <Route
        path="/faq"
        element={
          <PublicPageLayout>
            <FAQPage />
          </PublicPageLayout>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProtectedPageLayout>
              <DashboardPage />
            </ProtectedPageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rewards"
        element={
          <ProtectedRoute>
            <ProtectedPageLayout>
              <RewardsPage />
            </ProtectedPageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rewards/history"
        element={
          <ProtectedRoute>
            <ProtectedPageLayout>
              <RedemptionHistoryPage />
            </ProtectedPageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <ProtectedPageLayout>
              <LeaderboardPage />
            </ProtectedPageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/share"
        element={
          <ProtectedRoute>
            <ProtectedPageLayout>
              <ShareEarnPage />
            </ProtectedPageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rocket-game"
        element={
          <ProtectedRoute>
            <ProtectedPageLayout>
              <RocketGamePage />
            </ProtectedPageLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}