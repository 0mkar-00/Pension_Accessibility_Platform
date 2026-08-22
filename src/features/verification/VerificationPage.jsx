/**
 * VerificationPage Component
 * Main page for viewing comprehensive verification status, checks, timeline, and next actions.
 * Integrates directly with AuthContext and PensionContext.
 */

import { useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth.js';
import { usePension } from '../../context/usePension.js';
import { VerificationStatus } from './components/VerificationStatus.jsx';
import { VerificationDetails } from './components/VerificationDetails.jsx';
import { VerificationTimeline } from './components/VerificationTimeline.jsx';
import { VERIFICATION_STATUS } from '../../utils/constants.js';
import { formatDateTime } from '../../utils/formatters.js';

export const VerificationPage = () => {
  const { currentUser, isHelper, isOfficer } = useAuth();
  const {
    applications,
    activeApplication,
    selectApplication,
    updateVerificationCheck,
    isLoading,
    error,
  } = usePension();

  const [selectedAppId, setSelectedAppId] = useState(
    activeApplication?.id || applications[0]?.id || ''
  );
  const [successMessage, setSuccessMessage] = useState('');

  // Determine active application
  const currentApp = useMemo(() => {
    if (selectedAppId) {
      const match = applications.find((a) => a.id === selectedAppId);
      if (match) return match;
    }
    return activeApplication || applications[0] || null;
  }, [applications, selectedAppId, activeApplication]);

  const verification = currentApp?.verification || null;
  const checks = useMemo(() => verification?.checks || [], [verification]);
  const timelineEvents = useMemo(() => verification?.timeline || [], [verification]);

  // Verification metrics
  const stats = useMemo(() => {
    const total = checks.length;
    const verified = checks.filter((c) => c.status === VERIFICATION_STATUS.VERIFIED).length;
    const inReview = checks.filter((c) => c.status === VERIFICATION_STATUS.IN_REVIEW).length;
    const actionRequired = checks.filter(
      (c) => c.status === VERIFICATION_STATUS.ACTION_REQUIRED
    ).length;
    const pending = checks.filter((c) => c.status === VERIFICATION_STATUS.PENDING).length;

    const progressPercentage = total > 0 ? Math.round((verified / total) * 100) : 0;

    return { total, verified, inReview, actionRequired, pending, progressPercentage };
  }, [checks]);

  const handleApplicationChange = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    const found = applications.find((a) => a.id === appId);
    if (found && selectApplication) {
      selectApplication(found);
    }
    setSuccessMessage('');
  };

  const handleUpdateCheck = async (checkId, status, remarks, nextAction) => {
    if (!currentApp) return;
    try {
      await updateVerificationCheck(currentApp.id, checkId, status, remarks, nextAction);
      setSuccessMessage('Verification decision updated successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('VerificationPage: Check update error', err);
    }
  };

  return (
    <main className="verification-page-container" aria-labelledby="verification-page-heading">
      <header className="verification-page-header">
        <h1 id="verification-page-heading">Application Verification</h1>
        <p className="page-intro">
          Track real-time progress of identity, document, scheme eligibility, and bank mandate checks.
        </p>

        {isHelper && (
          <div className="helper-mode-badge" role="status" aria-label="Assisted mode notice">
            🤝 <strong>Assisted Mode:</strong> Viewing verification progress on behalf of{' '}
            {currentApp?.applicantName || 'Pensioner'} as a Trusted Helper.
          </div>
        )}

        {isOfficer && (
          <div className="officer-mode-badge" role="status" aria-label="Officer mode notice">
            🛡️ <strong>Officer Desk:</strong> Logged in as {currentUser?.fullName} (
            {currentUser?.designation || 'Verification Officer'}). Evaluation controls enabled.
          </div>
        )}
      </header>

      {/* Global Error Banner */}
      {error && (
        <section className="verification-error-banner" role="alert" aria-live="assertive">
          <p>⚠️ {error}</p>
        </section>
      )}

      {/* Success Notification */}
      {successMessage && (
        <section className="verification-success-banner" role="status" aria-live="polite">
          <p>✓ {successMessage}</p>
        </section>
      )}

      {/* Application Selector */}
      {applications.length > 1 && (
        <section className="application-selector-section" aria-label="Select Pension Application">
          <label htmlFor="select-verification-app" className="selector-label">
            Active Pension Application:
          </label>
          <select
            id="select-verification-app"
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
      {isLoading && !verification && (
        <div className="verification-loading-state" role="status" aria-live="polite">
          <p>Loading verification records...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!currentApp || !verification) && (
        <section className="verification-empty-state" aria-label="No verification records">
          <h2>No Verification Docket Found</h2>
          <p>There is currently no verification record initialized for this application.</p>
        </section>
      )}

      {/* Populated Content */}
      {currentApp && verification && (
        <>
          {/* Overall Verification Status Card */}
          <section className="overall-verification-card" aria-label="Overall Verification Status">
            <header className="overall-card-header">
              <div className="overall-info-group">
                <span className="app-badge">{currentApp.schemeName}</span>
                <h2 className="overall-app-title">
                  Application Tracking #{currentApp.trackingNumber}
                </h2>
                <p className="applicant-name">Applicant: <strong>{currentApp.applicantName}</strong></p>
              </div>

              <div className="overall-status-group">
                <span className="status-caption">Overall Status:</span>
                <VerificationStatus status={verification.overallStatus} isLarge={true} />
              </div>
            </header>

            <div className="overall-card-body">
              {verification.remarks && (
                <div className="overall-remarks">
                  <strong>Verification Summary:</strong>
                  <p>{verification.remarks}</p>
                </div>
              )}

              {verification.assignedOfficer && (
                <p className="assigned-officer-info">
                  <span className="meta-label">Assigned Desk:</span> {verification.assignedOfficer}
                </p>
              )}

              {verification.lastUpdatedAt && (
                <p className="last-updated-info">
                  <span className="meta-label">Last Updated:</span>{' '}
                  <time dateTime={verification.lastUpdatedAt}>
                    {formatDateTime(verification.lastUpdatedAt)}
                  </time>
                </p>
              )}
            </div>

            {/* Next Action Banner */}
            {verification.nextAction && (
              <aside
                className={`next-action-banner ${
                  verification.overallStatus === VERIFICATION_STATUS.ACTION_REQUIRED
                    ? 'action-urgent'
                    : 'action-informational'
                }`}
                role="note"
                aria-label="Next Step Guidance"
              >
                <strong className="next-action-heading">
                  {verification.overallStatus === VERIFICATION_STATUS.ACTION_REQUIRED
                    ? '⚠️ Action Required:'
                    : '👉 Recommended Next Step:'}
                </strong>
                <p className="next-action-text">{verification.nextAction}</p>
              </aside>
            )}
          </section>

          {/* Progress / Metrics Bar */}
          <section className="verification-metrics-panel" aria-label="Verification Progress Metrics">
            <header className="metrics-header">
              <h2 className="metrics-title">Verification Checklist Progress</h2>
              <span className="progress-percentage-label">{stats.progressPercentage}% Completed</span>
            </header>

            <div
              className="progress-bar-container"
              role="progressbar"
              aria-valuenow={stats.progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall verification progress"
            >
              <div
                className="progress-bar-fill"
                style={{ width: `${stats.progressPercentage}%` }}
              />
            </div>

            <div className="metrics-cards-grid">
              <div className="metric-box">
                <span className="metric-count">{stats.total}</span>
                <span className="metric-title">Total Checks</span>
              </div>
              <div className="metric-box metric-box-verified">
                <span className="metric-count">{stats.verified}</span>
                <span className="metric-title">Verified</span>
              </div>
              <div className="metric-box metric-box-in-review">
                <span className="metric-count">{stats.inReview}</span>
                <span className="metric-title">In Review</span>
              </div>
              <div className="metric-box metric-box-action">
                <span className="metric-count">{stats.actionRequired}</span>
                <span className="metric-title">Action Required</span>
              </div>
              <div className="metric-box metric-box-pending">
                <span className="metric-count">{stats.pending}</span>
                <span className="metric-title">Pending</span>
              </div>
            </div>
          </section>

          {/* Individual Checks List */}
          <section className="verification-checks-section" aria-label="Individual Verification Checks">
            <h2 className="section-title">Individual Verification Checks</h2>
            <div className="checks-grid">
              {checks.map((check) => (
                <VerificationDetails
                  key={check.id}
                  check={check}
                  isOfficer={isOfficer}
                  onUpdateCheckStatus={handleUpdateCheck}
                />
              ))}
            </div>
          </section>

          {/* Chronological Audit Timeline */}
          <VerificationTimeline timelineEvents={timelineEvents} />
        </>
      )}
    </main>
  );
};
