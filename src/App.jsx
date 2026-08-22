import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthProvider';
import { PensionProvider } from './context/PensionProvider';
import { DocumentsPage } from './features/documents';

import Welcome from './pages/Welcome/Welcome';
import AccessibilitySetup from './pages/AccessibilitySetup/AccessibilitySetup';
import Eligibility from './pages/Eligibility/Eligibility';
import PersonalDetails from './pages/PersonalDetails/PersonalDetails';
import Dashboard from './pages/Dashboard/Dashboard';
import FinalReview from './pages/FinalReview/FinalReview';

const VerificationPlaceholder = () => <h1>Verification</h1>;
const ApplicationStatusPlaceholder = () => <h1>Application Status</h1>;
const NotificationsPlaceholder = () => <h1>Notifications</h1>;
const PensionHistoryPlaceholder = () => <h1>Pension History</h1>;

function App() {
  return (
    <AuthProvider>
      <PensionProvider>
        <BrowserRouter>
      <Routes>
        {/* Developer 1 routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/accessibility" element={<AccessibilitySetup />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/final-review" element={<FinalReview />} />

        {/* Developer 3 routes - temporary placeholders */}
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/verification" element={<VerificationPlaceholder />} />
        <Route
          path="/application-status"
          element={<ApplicationStatusPlaceholder />}
        />
        <Route path="/notifications" element={<NotificationsPlaceholder />} />
        <Route path="/pension-history" element={<PensionHistoryPlaceholder />} />
      </Routes>
        </BrowserRouter>
      </PensionProvider>
    </AuthProvider>
  );
}

export default App;