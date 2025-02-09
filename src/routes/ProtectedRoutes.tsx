import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { RewardsPage } from '../pages/RewardsPage';
import { RedemptionHistoryPage } from '../pages/RedemptionHistoryPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { ShareEarnPage } from '../pages/ShareEarnPage';
import { RocketGamePage } from '../pages/RocketGamePage';

const ProtectedPageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
    <Header />
    {children}
    <Footer />
  </div>
);

export function ProtectedRoutes() {
  return (
    <Fragment>
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
    </Fragment>
  );
}