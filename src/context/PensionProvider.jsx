/**
 * Pension Provider
 * Manages global pension application state, active tracking status, document uploads,
 * verification status, notifications, and payment history.
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
          if (apps.length > 0) {
            setActiveApplication((prev) => prev || apps[0]);
          }
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

  const selectApplication = (app) => {
    setActiveApplication(app);
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

  const uploadDocument = async (applicationId, documentId, fileMetadata) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedDoc = await pensionService.uploadDocument(
        applicationId,
        documentId,
        fileMetadata,
        currentUser
      );

      const updatedApp = await pensionService.getApplicationById(applicationId);

      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updatedApp : app))
      );

      setActiveApplication((prev) => {
        if (!prev || prev.id !== applicationId) return prev;
        return updatedApp;
      });

      return updatedDoc;
    } catch (err) {
      console.error('PensionProvider: Upload error', err);
      setError(err.message || 'Failed to upload document.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocumentReview = async (applicationId, documentId, newStatus, reviewRemarks = null) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedDoc = await pensionService.updateDocumentReview(
        applicationId,
        documentId,
        newStatus,
        reviewRemarks
      );

      const updatedApp = await pensionService.getApplicationById(applicationId);

      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updatedApp : app))
      );

      setActiveApplication((prev) => {
        if (!prev || prev.id !== applicationId) return prev;
        return updatedApp;
      });

      return updatedDoc;
    } catch (err) {
      console.error('PensionProvider: Document review error', err);
      setError(err.message || 'Failed to update document review status.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getVerification = async (applicationId) => {
    try {
      return await pensionService.getVerification(applicationId);
    } catch (err) {
      console.error('PensionProvider: Error getting verification', err);
      return null;
    }
  };

  const updateVerificationCheck = async (
    applicationId,
    checkId,
    status,
    remarks = '',
    nextAction = null
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedVerification = await pensionService.updateVerificationCheckStatus(
        applicationId,
        checkId,
        status,
        remarks,
        nextAction,
        currentUser
      );

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          return {
            ...app,
            verification: updatedVerification,
            lastUpdatedDate: new Date().toISOString(),
          };
        })
      );

      setActiveApplication((prev) => {
        if (!prev || prev.id !== applicationId) return prev;
        return {
          ...prev,
          verification: updatedVerification,
          lastUpdatedDate: new Date().toISOString(),
        };
      });

      return updatedVerification;
    } catch (err) {
      console.error('PensionProvider: Update verification check error', err);
      setError(err.message || 'Failed to update verification check.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOverallVerification = async (
    applicationId,
    status,
    remarks = '',
    nextAction = null
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedVerification = await pensionService.updateOverallVerification(
        applicationId,
        status,
        remarks,
        nextAction,
        currentUser
      );

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          return {
            ...app,
            verification: updatedVerification,
            lastUpdatedDate: new Date().toISOString(),
          };
        })
      );

      setActiveApplication((prev) => {
        if (!prev || prev.id !== applicationId) return prev;
        return {
          ...prev,
          verification: updatedVerification,
          lastUpdatedDate: new Date().toISOString(),
        };
      });

      return updatedVerification;
    } catch (err) {
      console.error('PensionProvider: Update overall verification error', err);
      setError(err.message || 'Failed to update overall verification.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getNotifications = async (applicationId) => {
    try {
      return await pensionService.getNotifications(applicationId);
    } catch (err) {
      console.error('PensionProvider: Error fetching notifications', err);
      return [];
    }
  };

  const markNotificationRead = async (applicationId, notificationId) => {
    try {
      const updatedNotif = await pensionService.markNotificationRead(applicationId, notificationId);

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          const notifs = (app.notifications || []).map((n) =>
            n.id === notificationId ? updatedNotif : n
          );
          return { ...app, notifications: notifs };
        })
      );

      setActiveApplication((prev) => {
        if (!prev || prev.id !== applicationId) return prev;
        const notifs = (prev.notifications || []).map((n) =>
          n.id === notificationId ? updatedNotif : n
        );
        return { ...prev, notifications: notifs };
      });

      return updatedNotif;
    } catch (err) {
      console.error('PensionProvider: Error marking notification read', err);
      throw err;
    }
  };

  const markAllNotificationsRead = async (applicationId) => {
    try {
      const updatedNotifs = await pensionService.markAllNotificationsRead(applicationId);

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          return { ...app, notifications: updatedNotifs };
        })
      );

      setActiveApplication((prev) => {
        if (!prev || prev.id !== applicationId) return prev;
        return { ...prev, notifications: updatedNotifs };
      });

      return updatedNotifs;
    } catch (err) {
      console.error('PensionProvider: Error marking all notifications read', err);
      throw err;
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
      setActiveApplication((prev) => {
        if (prev?.id === applicationId) {
          return updated;
        }
        return prev;
      });
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
    selectApplication,
    trackApplication,
    submitApplication,
    uploadDocument,
    updateDocumentReview,
    getVerification,
    updateVerificationCheck,
    updateOverallVerification,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    updateStatus,
    clearActiveApplication,
  };

  return <PensionContext.Provider value={value}>{children}</PensionContext.Provider>;
};
