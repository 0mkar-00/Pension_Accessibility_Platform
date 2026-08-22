import { PensionPaymentStatus } from './PensionPaymentStatus.jsx';
import { formatCurrency, formatDate } from '../../../utils/formatters.js';

export const PensionPaymentItem = ({ payment, schemeName = '' }) => {
  const { id, periodMonth, disbursalDate, amount, status, referenceNumber } = payment;

  return (
    <article className="payment-record-card" aria-labelledby={`payment-title-${id}`}>
      <header className="payment-card-header">
        <div>
          <h3 id={`payment-title-${id}`} className="payment-period">
            {periodMonth}
          </h3>
          {schemeName && <p className="payment-scheme-name">{schemeName}</p>}
        </div>

        <PensionPaymentStatus status={status} />
      </header>

      <div className="payment-card-body">
        <p className="payment-amount-row">
          <span className="label">Amount:</span> <strong>{formatCurrency(amount)}</strong>
        </p>

        {disbursalDate && (
          <p className="payment-date-row">
            <span className="label">Date:</span>{' '}
            <time dateTime={disbursalDate}>{formatDate(disbursalDate)}</time>
          </p>
        )}

        {referenceNumber && (
          <p className="payment-ref-row">
            <span className="label">Reference:</span> <code>{referenceNumber}</code>
          </p>
        )}
      </div>
    </article>
  );
};
