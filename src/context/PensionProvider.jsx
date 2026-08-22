/**
 * Pension Provider
 * Manages global pension application state, active tracking status, and payment history.
 */

import { useState, useEffect, useCallback } from 'react';
import { PensionContext } from './PensionContext.js';
import { pensionService } from '../services/pensionService.js';
import { useAuth } from './useAuth.js';

export const PensionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [activeApplication, setActiveApplication] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async (filter = {}) => {
    try {
      setIsLoading(true);
      const data = await pensionService.getApplications(filter);
      setApplications(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('PensionProvider: Error fetching applications', err);
      setError('Failed to load applications.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async (filter = {}) => {
    try {
      setIsLoading(true);
      const data = await pensionService.getPaymentHistory(filter);
      setPayments(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('PensionProvider: Error fetching payment history', err);
      setError('Failed to load payment history.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [apps, paymentData] = await Promise.all([
          pensionService.getApplications(),
          pensionService.getPaymentHistory(),
        ]);
        if (isMounted) {
          setApplications(apps);
          setPayments(paymentData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('PensionProvider: Initial data load error', err);
          setError('Failed to load initial pension data.');
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const trackApplication = async (idOrTrackingNumber) => {
    try {
      setIsLoading(true);
      setError(null);
      const found = await pensionService.getApplicationById(idOrTrackingNumber);
      if (!found) {
        setError(`No application found matching "${idOrTrackingNumber}".`);
        setActiveApplication(null);
        return null;
      }
      setActiveApplication(found);
      return found;
    } catch (err) {
      console.error('PensionProvider: Tracking error', err);
      setError('Failed to track application.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitApplication = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      const newApp = await pensionService.submitApplication(formData, currentUser);
      setApplications((prev) => [newApp, ...prev]);
      setActiveApplication(newApp);
      return newApp;
    } catch (err) {
      console.error('PensionProvider: Submission error', err);
      setError(err.message || 'Failed to submit application.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus, note = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await pensionService.updateApplicationStatus(applicationId, newStatus, note);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updated : app))
      );
      if (activeApplication?.id === applicationId) {
        setActiveApplication(updated);
      }
      return updated;
    } catch (err) {
      console.error('PensionProvider: Update status error', err);
      setError(err.message || 'Failed to update application status.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearActiveApplication = () => {
    setActiveApplication(null);
    setError(null);
  };

  const value = {
    applications,
    activeApplication,
    payments,
    isLoading,
    error,
    fetchApplications,
    fetchPayments,
    trackApplication,
    submitApplication,
    updateStatus,
    clearActiveApplication,
  };

  return <PensionContext.Provider value={value}>{children}</PensionContext.Provider>;
};
