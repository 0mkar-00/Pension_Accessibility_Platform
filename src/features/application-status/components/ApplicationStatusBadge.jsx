/**
 * ApplicationStatusBadge Component
 * Senior-friendly plain language status badge.
 * Does not rely on color alone to communicate status.
 */

import { APPLICATION_STATUS } from '../../../utils/constants.js';

const STATUS_MAPPINGS = {
  [APPLICATION_STATUS.DISBURSED]: {
    icon: '✓',
    title: 'Payment Released',
    description: 'Your pension payment has been released.',
    badgeClass: 'app-badge-disbursed',
  },
  [APPLICATION_STATUS.SANCTIONED]: {
    icon: '✓',
    title: 'Pension Approved',
    description: 'Your pension application has been officially approved.',
    badgeClass: 'app-badge-approved',
  },
  [APPLICATION_STATUS.FIELD_VERIFIED]: {
    icon: '●',
    title: 'Verification Complete',
    description: 'Field and document verification has been completed.',
    badgeClass: 'app-badge-progress',
  },
  [APPLICATION_STATUS.DOCUMENTS_VERIFIED]: {
    icon: '●',
    title: 'Documents Verified',
    description: 'Your submitted documents have been verified.',
    badgeClass: 'app-badge-progress',
  },
  [APPLICATION_STATUS.SUBMITTED]: {
    icon: '●',
    title: 'Under Review',
    description: 'Your application has been submitted and is currently being reviewed.',
    badgeClass: 'app-badge-progress',
  },
  [APPLICATION_STATUS.REJECTED]: {
    icon: '✕',
    title: 'Not Approved',
    description: 'Your application was not approved at this stage.',
    badgeClass: 'app-badge-rejected',
  },
  [APPLICATION_STATUS.DRAFT]: {
    icon: '⚪',
    title: 'Draft Saved',
    description: 'Your application has been saved as a draft.',
    badgeClass: 'app-badge-draft',
  },
};

export const ApplicationStatusBadge = ({
  status,
  isActionRequired = false,
  isLarge = false,
  className = '',
}) => {
  if (isActionRequired) {
    return (
      <span
        className={`app-status-badge app-badge-action-needed ${
          isLarge ? 'badge-large' : ''
        } ${className}`.trim()}
        role="status"
        aria-label="Status: Action needed from applicant"
      >
        <span className="badge-icon" aria-hidden="true">
          ⚠
        </span>{' '}
        <span className="badge-text">Action Needed</span>
      </span>
    );
  }

  const current = STATUS_MAPPINGS[status] || STATUS_MAPPINGS[APPLICATION_STATUS.SUBMITTED];

  return (
    <span
      className={`app-status-badge ${current.badgeClass} ${
        isLarge ? 'badge-large' : ''
      } ${className}`.trim()}
      role="status"
      aria-label={`Status: ${current.title} - ${current.description}`}
    >
      <span className="badge-icon" aria-hidden="true">
        {current.icon}
      </span>{' '}
      <span className="badge-text">{current.title}</span>
    </span>
  );
};
