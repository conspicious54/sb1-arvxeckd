import { BrowserRouter as Router } from 'react-router-dom';
import { MultiplierProvider } from './context/MultiplierContext';
import { TutorialProvider } from './context/TutorialContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { TutorialOverlay } from './components/TutorialOverlay';
import { RedemptionNotification } from './components/RedemptionNotification';
import { AddToHomeScreen } from './components/AddToHomeScreen';
import { AppRoutes } from './routes';

export function App() {
  return (
    <MultiplierProvider>
      <Router>
        <TutorialProvider>
          <AuthLayout>
            <AppRoutes />
            <TutorialOverlay />
            <RedemptionNotification />
            <AddToHomeScreen />
          </AuthLayout>
        </TutorialProvider>
      </Router>
    </MultiplierProvider>
  );
}