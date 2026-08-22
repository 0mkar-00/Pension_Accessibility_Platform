import { formatCurrency } from '../../../utils/formatters.js';

export const PensionHistorySummary = ({ totalReceived = 0, schemeName = '' }) => {
  return (
    <section className="pension-history-summary" aria-label="Payment Summary Overview">
      <h2 className="summary-section-title">Payment Summary</h2>

      <div className="summary-cards-grid">
        <div className="summary-card total-received-card">
          <span className="summary-card-label">Total Pension Received</span>
          <strong className="summary-card-value">{formatCurrency(totalReceived)}</strong>
        </div>

        {schemeName && (
          <div className="summary-card scheme-card">
            <span className="summary-card-label">Pension Scheme</span>
            <strong className="summary-card-value">{schemeName}</strong>
          </div>
        )}
      </div>
    </section>
  );
};
