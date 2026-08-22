/**
 * ApplicationStatusPage Component
 * Main page answering "Where is my pension application right now?"
 * Uses senior-friendly language, accessible timeline, plain status, and ID copy control.
 */

import { useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth.js';
import { usePension } from '../../context/usePension.js';
import { ApplicationStatusBadge } from './components/ApplicationStatusBadge.jsx';
import { ApplicationTimeline } from './components/ApplicationTimeline.jsx';
import { ApplicationNextAction } from './components/ApplicationNextAction.jsx';
import { VERIFICATION_STATUS, DOCUMENT_STATUS } from '../../utils/constants.js';

export const ApplicationStatusPage = () => {
  const { isHelper } = useAuth();
  const {
    applications,
    activeApplication,
    selectApplication,
    isLoading,
    error,
  } = usePension();

  const [selectedAppId, setSelectedAppId] = useState(
    activeApplication?.id || applications[0]?.id || ''
  );
  const [copyFeedback, setCopyFeedback] = useState('');

  // Determine current active application
  const currentApp = useMemo(() => {
    if (selectedAppId) {
      const match = applications.find((a) => a.id === selectedAppId);
      if (match) return match;
    }
    return activeApplication || applications[0] || null;
  }, [applications, selectedAppId, activeApplication]);

  // Determine if action is required (e.g. rejected document or verification action required)
  const { isActionRequired, actionMessage } = useMemo(() => {
    if (!currentApp) return { isActionRequired: false, actionMessage: '' };

    // Check verification status
    if (currentApp.verification?.overallStatus === VERIFICATION_STATUS.ACTION_REQUIRED) {
      return {
        isActionRequired: true,
        actionMessage:
          currentApp.verification.nextAction ||
          currentApp.verification.remarks ||
          'Action is required on one or more verification items.',
      };
    }

    // Check if any document is rejected
    const rejectedDoc = (currentApp.documents || []).find(
      (d) => d.status === DOCUMENT_STATUS.REJECTED
    );
    if (rejectedDoc) {
      return {
        isActionRequired: true,
        actionMessage:
          rejectedDoc.reviewRemarks ||
          `Document "${rejectedDoc.name}" needs to be re-uploaded.`,
      };
    }

    return { isActionRequired: false, actionMessage: '' };
  }, [currentApp]);

  // Current stage description
  const currentStageName = useMemo(() => {
    if (!currentApp?.timeline) return 'Under Review';
    const incomplete = currentApp.timeline.find((t) => !t.completed);
    return incomplete ? incomplete.title : 'All Stages Completed';
  }, [currentApp]);

  // Copy Application ID to clipboard safely
  const handleCopyId = async () => {
    if (!currentApp?.trackingNumber && !currentApp?.id) return;
    const textToCopy = currentApp.trackingNumber || currentApp.id;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-secure or older contexts
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopyFeedback(`Application ID ${textToCopy} copied to clipboard.`);
      setTimeout(() => setCopyFeedback(''), 4000);
    } catch {
      setCopyFeedback(`Application ID: ${textToCopy}`);
      setTimeout(() => setCopyFeedback(''), 4000);
    }
  };

  const handleApplicationChange = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    const found = applications.find((a) => a.id === appId);
    if (found && selectApplication) {
      selectApplication(found);
    }
    setCopyFeedback('');
  };

  return (
    <main className="app-status-page-container" aria-labelledby="status-page-heading">
      <header className="app-status-page-header">
        <h1 id="status-page-heading">Application Status</h1>
        <p className="page-intro">
          Check where your pension application is right now and what steps remain.
        </p>

        {isHelper && (
          <div className="helper-mode-badge" role="status" aria-label="Assisted mode notice">
            🤝 <strong>Assisted Mode:</strong> Viewing application status on behalf of{' '}
            {currentApp?.applicantName || 'Pensioner'} as a Trusted Helper.
          </div>
        )}
      </header>

      {/* Global Error Banner */}
      {error && (
        <section className="status-error-banner" role="alert" aria-live="assertive">
          <p>⚠️ {error}</p>
        </section>
      )}

      {/* Application Selector (if multiple exist) */}
      {applications.length > 1 && (
        <section className="application-selector-section" aria-label="Select Pension Application">
          <label htmlFor="select-status-app" className="selector-label">
            Active Pension Application:
          </label>
          <select
            id="select-status-app"
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
      {isLoading && !currentApp && (
        <div className="status-loading-state" role="status" aria-live="polite">
          <p>Loading your pension application status...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !currentApp && (
        <section className="status-empty-state" aria-label="No application found">
          <h2>No Application Found</h2>
          <p>You currently do not have an active pension application record.</p>
        </section>
      )}

      {/* Main Content */}
      {currentApp && (
        <div className="status-content-wrapper">
          {/* Primary Status Card */}
          <section className="status-hero-card" aria-label="Current Application Status Overview">
            <div className="status-hero-header">
              <span className="scheme-tag">{currentApp.schemeName}</span>
              <h2 className="applicant-heading">
                Status for {currentApp.applicantName}
              </h2>

              {/* Secondary ID display with Copy control */}
              <div className="app-id-row">
                <span className="app-id-label">Application ID:</span>{' '}
                <strong className="app-id-code">
                  {currentApp.trackingNumber || currentApp.id}
                </strong>
                <button
                  type="button"
                  className="btn-copy-id"
                  onClick={handleCopyId}
                  aria-label={`Copy Application ID ${currentApp.trackingNumber || currentApp.id}`}
                >
                  📋 Copy ID
                </button>
                {copyFeedback && (
                  <span className="copy-feedback-text" role="status" aria-live="polite">
                    ✓ {copyFeedback}
                  </span>
                )}
              </div>
            </div>

            <div className="status-hero-body">
              <div className="status-badge-row">
                <span className="status-title-label">Current Status:</span>
                <ApplicationStatusBadge
                  status={currentApp.status}
                  isActionRequired={isActionRequired}
                  isLarge={true}
                />
              </div>

              <p className="current-stage-callout">
                <span className="stage-callout-label">Current Stage:</span>{' '}
                <strong>{currentStageName}</strong>
              </p>
            </div>
          </section>

          {/* Next Action Box */}
          <ApplicationNextAction
            status={currentApp.status}
            isActionRequired={isActionRequired}
            actionMessage={actionMessage}
            sanctionDate={currentApp.sanctionDate}
            monthlyAmount={currentApp.monthlySanctionAmount}
          />

          {/* Important Remarks if available */}
          {(currentApp.verification?.remarks || currentApp.remarks) && (
            <aside className="status-remarks-card" aria-label="Official Remarks">
              <h3 className="remarks-title">Official Department Notes</h3>
              <p className="remarks-body">
                {currentApp.verification?.remarks || currentApp.remarks}
              </p>
            </aside>
          )}

          {/* Chronological Lifecycle Timeline */}
          <ApplicationTimeline timeline={currentApp.timeline || []} />
        </div>
      )}
    </main>
  );
};
