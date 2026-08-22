import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthProvider';
import { PensionProvider } from './context/PensionProvider';
import { DocumentsPage } from './features/documents';
import { useLanguage } from './features/regional-language/useLanguage';

import Welcome from './pages/Welcome/Welcome';
import AccessibilitySetup from './pages/AccessibilitySetup/AccessibilitySetup';
import Eligibility from './pages/Eligibility/Eligibility';
import PersonalDetails from './pages/PersonalDetails/PersonalDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import FinalReview from './pages/FinalReview/FinalReview';
import { VerificationPage } from './features/verification';
import { ApplicationStatusPage } from './features/application-status';
import { NotificationsPage } from './features/notifications';




const PensionHistoryPlaceholder = () => {
  const { translate } = useLanguage();
  return <h1>{translate('pensionHistory')}</h1>;
};

const NotificationsRoute = () => {
  const navigate = useNavigate();

  const handleNavigateFeature = (targetFeature) => {
    const routes = {
      documents: '/documents',
      verification: '/verification',
      applicationStatus: '/application-status',
      pensionHistory: '/pension-history',
      dashboard: '/dashboard',
    };

    const targetRoute = routes[targetFeature];

    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  return (
    <NotificationsPage
      onNavigateFeature={handleNavigateFeature}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <PensionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/accessibility" element={<AccessibilitySetup />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/personal-details" element={<PersonalDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/final-review" element={<FinalReview />} />

            <Route path="/documents" element={<DocumentsPage />} />
            <Route
              path="/verification"
              element={<VerificationPage />}
            />
            <Route
            path="/application-status"
            element={<ApplicationStatusPage />}
              />
            <Route
            path="/notifications"
            element={<NotificationsRoute />}
            />
            <Route
              path="/pension-history"
              element={<PensionHistoryPlaceholder />}
            />
          </Routes>
        </BrowserRouter>
      </PensionProvider>
    </AuthProvider>
  );
}

export default App;