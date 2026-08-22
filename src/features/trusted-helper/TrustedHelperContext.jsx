/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from 'react';

export const PERMISSIONS = {
  VIEW_APPLICATION: 'VIEW_APPLICATION',
  VIEW_STATUS: 'VIEW_STATUS',
  VIEW_NOTIFICATIONS: 'VIEW_NOTIFICATIONS',
  VIEW_PENSION_HISTORY: 'VIEW_PENSION_HISTORY',
  ASSIST_DOCUMENTS: 'ASSIST_DOCUMENTS'
};

export const CONSENT_STATES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVOKED: 'revoked'
};

// Mock data representing the helper requested
const MOCK_HELPER = {
  name: 'Aarav Sharma',
  relationship: 'Son',
  permissions: [
    PERMISSIONS.VIEW_APPLICATION,
    PERMISSIONS.VIEW_STATUS,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.VIEW_PENSION_HISTORY,
    PERMISSIONS.ASSIST_DOCUMENTS
  ]
};

export const TrustedHelperContext = createContext(null);

export const TrustedHelperProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [consentState, setConsentState] = useState(CONSENT_STATES.PENDING);
  const [helperIdentity, setHelperIdentity] = useState(null);

  const enableHelper = useCallback(() => {
    setIsEnabled(true);
    setHelperIdentity(MOCK_HELPER);
    setConsentState(CONSENT_STATES.PENDING);
  }, []);

  const disableHelper = useCallback(() => {
    setIsEnabled(false);
    setHelperIdentity(null);
    setConsentState(CONSENT_STATES.PENDING);
  }, []);

  const approve = useCallback(() => {
    setConsentState(CONSENT_STATES.APPROVED);
  }, []);

  const reject = useCallback(() => {
    setConsentState(CONSENT_STATES.REJECTED);
  }, []);

  const revoke = useCallback(() => {
    setConsentState(CONSENT_STATES.REVOKED);
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!isEnabled || consentState !== CONSENT_STATES.APPROVED || !helperIdentity) {
      return false;
    }
    return helperIdentity.permissions.includes(permission);
  }, [isEnabled, consentState, helperIdentity]);

  const value = {
    helperIdentity,
    isEnabled,
    consentState,
    enableHelper,
    disableHelper,
    approve,
    reject,
    revoke,
    hasPermission
  };

  return (
    <TrustedHelperContext.Provider value={value}>
      {children}
    </TrustedHelperContext.Provider>
  );
};
