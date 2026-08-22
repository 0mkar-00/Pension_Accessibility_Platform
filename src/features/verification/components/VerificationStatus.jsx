/**
 * VerificationStatus Component
 * Displays accessible status badge with icon, textual description, and ARIA attributes.
 * Avoids relying purely on color for status comprehension.
 */

import { VERIFICATION_STATUS, VERIFICATION_STATUS_LABELS } from '../../../utils/constants.js';

const STATUS_CONFIG = {
  [VERIFICATION_STATUS.VERIFIED]: {
    icon: '✓',
    label: VERIFICATION_STATUS_LABELS[VERIFICATION_STATUS.VERIFIED],
    badgeClass: 'verif-badge-verified',
    ariaText: 'Verification status: Fully verified and cleared',
  },
  [VERIFICATION_STATUS.IN_REVIEW]: {
    icon: '⏳',
    label: VERIFICATION_STATUS_LABELS[VERIFICATION_STATUS.IN_REVIEW],
    badgeClass: 'verif-badge-in-review',
    ariaText: 'Verification status: Scrutiny and verification currently in progress',
  },
  [VERIFICATION_STATUS.ACTION_REQUIRED]: {
    icon: '⚠️',
    label: VERIFICATION_STATUS_LABELS[VERIFICATION_STATUS.ACTION_REQUIRED],
    badgeClass: 'verif-badge-action-required',
    ariaText: 'Verification status: Action required from applicant to proceed',
  },
  [VERIFICATION_STATUS.PENDING]: {
    icon: '⚪',
    label: VERIFICATION_STATUS_LABELS[VERIFICATION_STATUS.PENDING],
    badgeClass: 'verif-badge-pending',
    ariaText: 'Verification status: Verification pending initial review',
  },
  [VERIFICATION_STATUS.REJECTED]: {
    icon: '❌',
    label: VERIFICATION_STATUS_LABELS[VERIFICATION_STATUS.REJECTED],
    badgeClass: 'verif-badge-rejected',
    ariaText: 'Verification status: Verification failed or rejected',
  },
};

export const VerificationStatus = ({ status, isLarge = false, className = '' }) => {
  const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG[VERIFICATION_STATUS.PENDING];

  return (
    <span
      className={`verification-status-badge ${currentConfig.badgeClass} ${
        isLarge ? 'status-badge-large' : ''
      } ${className}`.trim()}
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
