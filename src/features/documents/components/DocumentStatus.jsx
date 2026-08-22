/**
 * DocumentStatus Component
 * Displays the current status of a document with accessible text and indicators.
 */

import { DOCUMENT_STATUS, DOCUMENT_STATUS_LABELS } from '../../../utils/constants.js';

const STATUS_CONFIG = {
  [DOCUMENT_STATUS.APPROVED]: {
    icon: '✓',
    label: DOCUMENT_STATUS_LABELS[DOCUMENT_STATUS.APPROVED],
    badgeClass: 'status-badge-approved',
    ariaText: 'Document status: Approved and verified',
  },
  [DOCUMENT_STATUS.UNDER_REVIEW]: {
    icon: '⏳',
    label: DOCUMENT_STATUS_LABELS[DOCUMENT_STATUS.UNDER_REVIEW],
    badgeClass: 'status-badge-review',
    ariaText: 'Document status: Under review by verification officer',
  },
  [DOCUMENT_STATUS.UPLOADED]: {
    icon: '📄',
    label: DOCUMENT_STATUS_LABELS[DOCUMENT_STATUS.UPLOADED],
    badgeClass: 'status-badge-uploaded',
    ariaText: 'Document status: Uploaded and awaiting scrutiny',
  },
  [DOCUMENT_STATUS.REJECTED]: {
    icon: '⚠️',
    label: DOCUMENT_STATUS_LABELS[DOCUMENT_STATUS.REJECTED],
    badgeClass: 'status-badge-rejected',
    ariaText: 'Document status: Rejected, re-upload required',
  },
  [DOCUMENT_STATUS.NOT_SUBMITTED]: {
    icon: '⚪',
    label: DOCUMENT_STATUS_LABELS[DOCUMENT_STATUS.NOT_SUBMITTED],
    badgeClass: 'status-badge-not-submitted',
    ariaText: 'Document status: Not submitted yet',
  },
};

export const DocumentStatus = ({ status, className = '' }) => {
  const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG[DOCUMENT_STATUS.NOT_SUBMITTED];

  return (
    <span
      className={`document-status-badge ${currentConfig.badgeClass} ${className}`.trim()}
      role="status"
      aria-label={currentConfig.ariaText}
    >
      <span className="status-icon" aria-hidden="true">
        {currentConfig.icon}
      </span>{' '}
      <span className="status-text">{currentConfig.label}</span>
    </span>
  );
};
