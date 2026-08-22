/**
 * VerificationDetails Component
 * Displays individual verification checks (Identity, Documents, Eligibility, Bank DBT),
 * reviewer notes, next action recommendations, and officer review controls (for officer role).
 */

import { useState } from 'react';
import { VerificationStatus } from './VerificationStatus.jsx';
import { VERIFICATION_STATUS } from '../../../utils/constants.js';
import { formatDateTime } from '../../../utils/formatters.js';

export const VerificationDetails = ({
  check,
  isOfficer = false,
  onUpdateCheckStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(check.status);
  const [remarksInput, setRemarksInput] = useState(check.remarks || '');
  const [nextActionInput, setNextActionInput] = useState(check.nextAction || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActionRequired = check.status === VERIFICATION_STATUS.ACTION_REQUIRED;
  const isRejected = check.status === VERIFICATION_STATUS.REJECTED;
  const isVerified = check.status === VERIFICATION_STATUS.VERIFIED;

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!onUpdateCheckStatus) return;

    try {
      setIsSubmitting(true);
      await onUpdateCheckStatus(check.id, selectedStatus, remarksInput, nextActionInput);
      setIsEditing(false);
    } catch (err) {
      console.error('VerificationDetails: Failed to update check status', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article
      className={`verification-check-card ${
        isActionRequired ? 'check-action-required' : isRejected ? 'check-rejected' : isVerified ? 'check-verified' : ''
      }`.trim()}
      aria-labelledby={`check-title-${check.id}`}
    >
      <header className="check-card-header">
        <div className="check-title-group">
          <h3 id={`check-title-${check.id}`} className="check-name">
            {check.name}
          </h3>
          <p className="check-purpose">{check.purpose}</p>
        </div>

        <div className="check-status-wrapper">
          <VerificationStatus status={check.status} />
        </div>
      </header>

      <div className="check-card-body">
        {/* Timestamp and Reviewer */}
        <div className="check-meta-row">
          {check.timestamp && (
            <p className="check-meta-item">
              <span className="meta-label">Checked on:</span>{' '}
              <time dateTime={check.timestamp}>{formatDateTime(check.timestamp)}</time>
            </p>
          )}

          {check.reviewer && (
            <p className="check-meta-item">
              <span className="meta-label">Reviewer:</span> <strong>{check.reviewer}</strong>
            </p>
          )}
        </div>

        {/* Remarks */}
        {check.remarks && (
          <aside
            className={`check-remarks-box ${
              isActionRequired ? 'remarks-warning' : isRejected ? 'remarks-danger' : 'remarks-neutral'
            }`}
            aria-label="Verification notes"
          >
            <strong className="remarks-label">
              {isActionRequired ? '⚠️ Officer Note (Action Required):' : 'Officer Remarks:'}
            </strong>
            <p className="remarks-text">{check.remarks}</p>
          </aside>
        )}

        {/* Next Action Instruction */}
        {check.nextAction && (
          <div className="check-next-action-box" role="note" aria-label="Next Action Guidance">
            <strong className="next-action-title">👉 What you need to do:</strong>
            <p className="next-action-instruction">{check.nextAction}</p>
          </div>
        )}
      </div>

      {/* Officer Evaluation Controls (Shown only for Officer role) */}
      {isOfficer && (
        <footer className="check-officer-controls">
          {!isEditing ? (
            <button
              type="button"
              className="btn-officer-evaluate"
              onClick={() => setIsEditing(true)}
              aria-expanded={isEditing}
            >
              ⚙️ Evaluate / Update Check
            </button>
          ) : (
            <form className="officer-review-form" onSubmit={handleSaveReview}>
              <fieldset>
                <legend className="form-legend">Update Check Decision</legend>

                <div className="form-field">
                  <label htmlFor={`status-select-${check.id}`}>Decision Status:</label>
                  <select
                    id={`status-select-${check.id}`}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="officer-select"
                  >
                    <option value={VERIFICATION_STATUS.PENDING}>Pending</option>
                    <option value={VERIFICATION_STATUS.IN_REVIEW}>In Review</option>
                    <option value={VERIFICATION_STATUS.VERIFIED}>Verified & Cleared</option>
                    <option value={VERIFICATION_STATUS.ACTION_REQUIRED}>Action Required</option>
                    <option value={VERIFICATION_STATUS.REJECTED}>Rejected</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor={`remarks-input-${check.id}`}>Officer Remarks:</label>
                  <textarea
                    id={`remarks-input-${check.id}`}
                    value={remarksInput}
                    onChange={(e) => setRemarksInput(e.target.value)}
                    placeholder="Enter scrutiny observations or rejection reasons..."
                    rows={2}
                    className="officer-textarea"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor={`action-input-${check.id}`}>Applicant Next Action (Optional):</label>
                  <input
                    id={`action-input-${check.id}`}
                    type="text"
                    value={nextActionInput}
                    onChange={(e) => setNextActionInput(e.target.value)}
                    placeholder="e.g. Re-upload document on Documents page..."
                    className="officer-input"
                  />
                </div>

                <div className="officer-action-buttons">
                  <button type="submit" disabled={isSubmitting} className="btn-save-decision">
                    {isSubmitting ? 'Saving...' : 'Save Decision'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel-decision"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </footer>
      )}
    </article>
  );
};
