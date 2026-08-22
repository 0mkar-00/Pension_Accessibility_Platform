import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const VerificationPlaceholder = () => {
  const { translate } = useLanguage();
  return <h1>{translate('verification')}</h1>;
};

const ApplicationStatusPlaceholder = () => {
  const { translate } = useLanguage();
  return <h1>{translate('applicationStatus')}</h1>;
};

const NotificationsPlaceholder = () => {
  const { translate } = useLanguage();
  return <h1>{translate('notifications')}</h1>;
};

const PensionHistoryPlaceholder = () => {
  const { translate } = useLanguage();
  return <h1>{translate('pensionHistory')}</h1>;
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
              element={<VerificationPlaceholder />}
            />
            <Route
              path="/application-status"
              element={<ApplicationStatusPlaceholder />}
            />
            <Route
              path="/notifications"
              element={<NotificationsPlaceholder />}
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