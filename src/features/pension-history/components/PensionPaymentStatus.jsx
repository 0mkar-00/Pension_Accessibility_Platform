import { PAYMENT_STATUS } from '../../../utils/constants.js';

const STATUS_CONFIG = {
  [PAYMENT_STATUS.SUCCESS]: {
    label: 'Received',
    badgeClass: 'payment-status-success',
  },
  [PAYMENT_STATUS.PROCESSING]: {
    label: 'Processing',
    badgeClass: 'payment-status-processing',
  },
  [PAYMENT_STATUS.FAILED]: {
    label: 'Failed',
    badgeClass: 'payment-status-failed',
  },
};

export const PensionPaymentStatus = ({ status, className = '' }) => {
  const current = STATUS_CONFIG[status] || STATUS_CONFIG[PAYMENT_STATUS.SUCCESS];

  return (
    <span
      className={`payment-status-badge ${current.badgeClass} ${className}`.trim()}
      role="status"
      aria-label={`Payment status: ${current.label}`}
    >
      {current.label}
    </span>
  );
};
