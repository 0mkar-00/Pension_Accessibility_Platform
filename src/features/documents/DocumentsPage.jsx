/**
 * DocumentsPage Component
 * Main page for viewing, uploading, and managing pension scheme verification documents.
 * Integrates directly with AuthContext and PensionContext.
 */

import { useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth.js';
import { usePension } from '../../context/usePension.js';
import { DocumentCard } from './components/DocumentCard.jsx';
import { DOCUMENT_STATUS, HELPER_PERMISSIONS, USER_ROLES } from '../../utils/constants.js';

export const DocumentsPage = () => {
  const { currentUser, isHelper, hasPermission } = useAuth();
  const {
    applications,
    activeApplication,
    selectApplication,
    uploadDocument,
    isLoading,
    error,
  } = usePension();

  const [selectedAppId, setSelectedAppId] = useState(
    activeApplication?.id || applications[0]?.id || ''
  );
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Determine current application
  const currentApp = useMemo(() => {
    if (selectedAppId) {
      const match = applications.find((a) => a.id === selectedAppId);
      if (match) return match;
    }
    return activeApplication || applications[0] || null;
  }, [applications, selectedAppId, activeApplication]);

  // Document list for current application
  const documents = useMemo(() => {
    return currentApp?.documents || [];
  }, [currentApp]);

  // Statistics / Summary
  const stats = useMemo(() => {
    const total = documents.length;
    const approved = documents.filter((d) => d.status === DOCUMENT_STATUS.APPROVED).length;
    const underReview = documents.filter(
      (d) => d.status === DOCUMENT_STATUS.UNDER_REVIEW || d.status === DOCUMENT_STATUS.UPLOADED
    ).length;
    const actionRequired = documents.filter(
      (d) => d.status === DOCUMENT_STATUS.REJECTED || d.status === DOCUMENT_STATUS.NOT_SUBMITTED
    ).length;

    return { total, approved, underReview, actionRequired };
  }, [documents]);

  // Check upload permissions
  const { canUpload, permissionReason } = useMemo(() => {
    if (!currentUser) {
      return { canUpload: false, permissionReason: 'You must be logged in to manage documents.' };
    }

    if (currentUser.role === USER_ROLES.OFFICER) {
      return { canUpload: false, permissionReason: 'Verification officers evaluate submitted documents.' };
    }

    if (isHelper) {
      const canAssist = hasPermission(HELPER_PERMISSIONS.ASSIST_APPLY.id);
      if (!canAssist) {
        return {
          canUpload: false,
          permissionReason: 'Your trusted helper access level is View-Only. Document uploads require Assist or Full Management permissions.',
        };
      }
    }

    return { canUpload: true, permissionReason: '' };
  }, [currentUser, isHelper, hasPermission]);

  const handleApplicationChange = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    const found = applications.find((a) => a.id === appId);
    if (found && selectApplication) {
      selectApplication(found);
    }
    setActionSuccessMsg('');
  };

  const handleDocumentUpload = async (docId, fileMetadata) => {
    if (!currentApp) return;
    try {
      await uploadDocument(currentApp.id, docId, fileMetadata);
      setActionSuccessMsg(`Document successfully uploaded and queued for review.`);
      setTimeout(() => setActionSuccessMsg(''), 5000);
    } catch (err) {
      console.error('DocumentsPage: Upload error', err);
    }
  };

  return (
    <main className="documents-page-container" aria-labelledby="documents-page-heading">
      <header className="documents-page-header">
        <h1 id="documents-page-heading">Application Documents</h1>
        <p className="page-intro">
          Review, upload, and track verification documents required for your pension scheme.
        </p>

        {isHelper && (
          <div className="helper-mode-badge" role="status" aria-label="Assisted mode notice">
            🤝 <strong>Assisted Mode:</strong> Viewing documents on behalf of{' '}
            {currentApp?.applicantName || 'Pensioner'} as a Trusted Helper.
          </div>
        )}
      </header>

      {/* Global Error Banner */}
      {error && (
        <section className="documents-error-banner" role="alert" aria-live="assertive">
          <p>⚠️ {error}</p>
        </section>
      )}

      {/* Success Notification */}
      {actionSuccessMsg && (
        <section className="documents-success-banner" role="status" aria-live="polite">
          <p>✓ {actionSuccessMsg}</p>
        </section>
      )}

      {/* Application Selector (if multiple exist) */}
      {applications.length > 1 && (
        <section className="application-selector-section" aria-label="Select Pension Application">
          <label htmlFor="select-pension-app" className="selector-label">
            Active Pension Application:
          </label>
          <select
            id="select-pension-app"
            value={currentApp?.id || ''}
            onChange={handleApplicationChange}
            className="app-select-dropdown"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.trackingNumber} - {app.schemeName} ({app.applicantName})
              </option>
            ))}
          </select>
        </section>
      )}

      {/* Loading State */}
      {isLoading && documents.length === 0 && (
        <div className="documents-loading-state" role="status" aria-live="polite">
          <p>Loading application documents...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!currentApp || documents.length === 0) && (
        <section className="documents-empty-state" aria-label="No documents found">
          <h2>No Documents Found</h2>
          <p>There are currently no document requirements listed for this application.</p>
        </section>
      )}

      {/* Main Document Content */}
      {currentApp && documents.length > 0 && (
        <>
          {/* Progress / Status Summary */}
          <section className="documents-summary-panel" aria-label="Document Verification Summary">
            <h2 className="summary-title">Verification Summary</h2>
            <div className="summary-metrics-grid">
              <div className="metric-card">
                <span className="metric-number">{stats.total}</span>
                <span className="metric-label">Total Documents</span>
              </div>
              <div className="metric-card metric-approved">
                <span className="metric-number">{stats.approved}</span>
                <span className="metric-label">Approved</span>
              </div>
              <div className="metric-card metric-review">
                <span className="metric-number">{stats.underReview}</span>
                <span className="metric-label">In Review</span>
              </div>
              <div className="metric-card metric-action">
                <span className="metric-number">{stats.actionRequired}</span>
                <span className="metric-label">Action Required</span>
              </div>
            </div>

            {stats.actionRequired > 0 && (
              <div className="summary-alert-action" role="alert">
                ℹ️ You have {stats.actionRequired} document{stats.actionRequired > 1 ? 's' : ''}{' '}
                that require{stats.actionRequired === 1 ? 's' : ''} submission or re-upload.
              </div>
            )}
          </section>

          {/* Document Cards Grid */}
          <section className="documents-list-section" aria-label="Required Documents List">
            <h2 className="section-title">Required Scheme Documents</h2>
            <div className="documents-grid">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  canUpload={canUpload}
                  permissionReason={permissionReason}
                  onUpload={handleDocumentUpload}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};
