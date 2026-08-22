/**
 * NotificationStatus Component
 * Displays simple, text-based notification category/status.
 * Does not rely on color alone.
 */

import { NOTIFICATION_TYPES } from '../../../utils/constants.js';

const TYPE_CONFIG = {
  [NOTIFICATION_TYPES.ACTION_REQUIRED.id]: {
    icon: '⚠',
    label: 'Action Needed',
    badgeClass: 'notif-badge-action',
    ariaLabel: 'Notification category: Action needed from applicant',
  },
  [NOTIFICATION_TYPES.SUCCESS.id]: {
    icon: '✓',
    label: 'Update / Approved',
    badgeClass: 'notif-badge-success',
    ariaLabel: 'Notification category: Successful update or approval',
  },
  [NOTIFICATION_TYPES.INFO.id]: {
    icon: 'ℹ️',
    label: 'Information',
    badgeClass: 'notif-badge-info',
    ariaLabel: 'Notification category: Information update',
  },
  [NOTIFICATION_TYPES.WARNING.id]: {
    icon: '⚠️',
    label: 'Notice',
    badgeClass: 'notif-badge-warning',
    ariaLabel: 'Notification category: Important notice',
  },
};

export const NotificationStatus = ({ type, className = '' }) => {
  const current = TYPE_CONFIG[type] || TYPE_CONFIG[NOTIFICATION_TYPES.INFO.id];

  return (
    <span
      className={`notification-status-badge ${current.badgeClass} ${className}`.trim()}
      role="status"
      aria-label={current.ariaLabel}
    >
      <span className="notif-icon" aria-hidden="true">
        {current.icon}
      </span>{' '}
      <span className="notif-label">{current.label}</span>
    </span>
  );
};
