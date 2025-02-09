import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { RewardsPage } from './pages/RewardsPage';
import { RedemptionHistoryPage } from './pages/RedemptionHistoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ShareEarnPage } from './pages/ShareEarnPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FAQPage } from './pages/FAQPage';
import { RocketGamePage } from './pages/RocketGamePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MultiplierProvider } from './context/MultiplierContext';
import { TutorialProvider } from './context/TutorialContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { TutorialOverlay } from './components/TutorialOverlay';

export function App() {
  return (
    <MultiplierProvider>
      <Router>
        <TutorialProvider>
          <AuthLayout>
            <Routes>
              {/* Auth routes - no header/footer */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/auth" element={<Navigate to="/signup" replace />} />

              {/* Public routes with header/footer */}
              <Route
                path="/"
                element={
                  <div className="min-h-screen">
                    <Header />
                    <HomePage />
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/how-it-works"
                element={
                  <div className="min-h-screen">
                    <Header />
                    <HowItWorksPage />
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/features"
                element={
                  <div className="min-h-screen">
                    <Header />
                    <FeaturesPage />
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/testimonials"
                element={
                  <div className="min-h-screen">
                    <Header />
                    <TestimonialsPage />
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/faq"
                element={
                  <div className="min-h-screen">
                    <Header />
                    <FAQPage />
                    <Footer />
                  </div>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                      <Header />
                      <DashboardPage />
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rewards"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                      <Header />
                      <RewardsPage />
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rewards/history"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                      <Header />
                      <RedemptionHistoryPage />
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                      <Header />
                      <LeaderboardPage />
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/share"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                      <Header />
                      <ShareEarnPage />
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rocket-game"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
                      <Header />
                      <RocketGamePage />
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <TutorialOverlay />
          </AuthLayout>
        </TutorialProvider>
      </Router>
    </MultiplierProvider>
  );
}