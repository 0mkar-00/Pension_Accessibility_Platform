/**
 * ApplicationNextAction Component
 * Clearly answers "Do I need to do anything right now?"
 * Handles: No action required, Action needed, and Approved/Completed cases.
 */

import { APPLICATION_STATUS } from '../../../utils/constants.js';
import { formatCurrency, formatDate } from '../../../utils/formatters.js';

export const ApplicationNextAction = ({
  status,
  isActionRequired = false,
  actionMessage = '',
  sanctionDate = null,
  monthlyAmount = null,
  onActionClick,
}) => {
  const isApproved =
    status === APPLICATION_STATUS.SANCTIONED || status === APPLICATION_STATUS.DISBURSED;
  const isDisbursed = status === APPLICATION_STATUS.DISBURSED;

  // Case 2: Action Needed
  if (isActionRequired) {
    return (
      <aside className="next-action-card next-action-urgent" role="alert" aria-label="Action Required">
        <div className="next-action-header">
          <span className="action-icon" aria-hidden="true">
            ⚠
          </span>
          <h3 className="next-action-heading">Action Needed</h3>
        </div>

        <p className="next-action-body">
          {actionMessage || 'Additional information or a document re-upload is required to continue processing your application.'}
        </p>

        {onActionClick && (
          <button
            type="button"
            className="btn-next-action"
            onClick={onActionClick}
            aria-label="Proceed to required action"
          >
            Review Required Action →
          </button>
        )}
      </aside>
    );
  }

  // Case 3: Approved / Completed
  if (isApproved) {
    return (
      <aside className="next-action-card next-action-approved" role="note" aria-label="Pension Approval Information">
        <div className="next-action-header">
          <span className="action-icon" aria-hidden="true">
            ✓
          </span>
          <h3 className="next-action-heading">
            {isDisbursed ? 'Pension Active & Disbursed' : 'Pension Approved'}
          </h3>
        </div>

        <p className="next-action-body">
          {isDisbursed
            ? 'Your pension is active and monthly benefit transfers have been released to your registered bank account.'
            : 'Your pension application has been successfully sanctioned by the Social Security Department.'}
        </p>

        <div className="approval-details">
          {monthlyAmount && (
            <p className="detail-item">
              <span className="meta-label">Monthly Sanction Amount:</span>{' '}
              <strong>{formatCurrency(monthlyAmount)}/month</strong>
            </p>
          )}
          {sanctionDate && (
            <p className="detail-item">
              <span className="meta-label">Sanction Order Date:</span>{' '}
              <time dateTime={sanctionDate}>{formatDate(sanctionDate)}</time>
            </p>
          )}
        </div>
      </aside>
    );
  }

  // Case 1: No Action Required (Default In-Progress)
  return (
    <aside className="next-action-card next-action-normal" role="note" aria-label="Next Steps">
      <div className="next-action-header">
        <span className="action-icon" aria-hidden="true">
          ℹ️
        </span>
        <h3 className="next-action-heading">No Action Required</h3>
      </div>

      <p className="next-action-body">
        Your application is currently being reviewed by the social security verification desk. You do not need to do anything right now.
      </p>

      <p className="next-action-subtext">
        You will receive updates here whenever the verification stage progresses.
      </p>
    </aside>
  );
};
