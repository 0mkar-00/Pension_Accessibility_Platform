import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AccessibilityProvider } from './features/accessibility/AccessibilityContext.jsx';
import { LanguageProvider } from './features/regional-language/LanguageContext.jsx';
import { TrustedHelperProvider } from './features/trusted-helper/TrustedHelperContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AccessibilityProvider>
        <TrustedHelperProvider>
          <App />
        </TrustedHelperProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </StrictMode>,
);