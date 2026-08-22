import { useState } from 'react';
import { useAuth } from '../../context/useAuth.js';
import { usePension } from '../../context/usePension.js';
import { PensionHistorySummary } from './components/PensionHistorySummary.jsx';
import { PensionPaymentItem } from './components/PensionPaymentItem.jsx';
import { PAYMENT_STATUS } from '../../utils/constants.js';

export const PensionHistoryPage = () => {
  const { isHelper } = useAuth();
  const {
    applications,
    activeApplication,
    selectApplication,
    payments,
    isLoading,
    error,
  } = usePension();

  const [selectedAppId, setSelectedAppId] = useState(
    activeApplication?.id || applications[0]?.id || ''
  );

  const currentApp = selectedAppId
    ? applications.find((a) => a.id === selectedAppId) || activeApplication || applications[0] || null
    : activeApplication || applications[0] || null;

  const appPayments = currentApp
    ? payments.filter(
        (p) => p.applicationId === currentApp.id || p.applicantId === currentApp.applicantId
      )
    : [];

  const totalReceived = appPayments
    .filter((p) => p.status === PAYMENT_STATUS.SUCCESS)
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const handleApplicationChange = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    const found = applications.find((a) => a.id === appId);
    if (found && selectApplication) {
      selectApplication(found);
    }
  };

  return (
    <main className="pension-history-page-container" aria-labelledby="history-page-heading">
      <header className="pension-history-header">
        <h1 id="history-page-heading">Pension Payment History</h1>
        <p className="page-intro">
          Here you can see your pension payments and when they were received.
        </p>

        {isHelper && (
          <div className="helper-mode-badge" role="status" aria-label="Assisted mode notice">
            <strong>Assisted Mode:</strong> Viewing pension payment history on behalf of{' '}
            {currentApp?.applicantName || 'Pensioner'} as a Trusted Helper.
          </div>
        )}
      </header>

      {error && (
        <section className="history-error-banner" role="alert" aria-live="assertive">
          <p>Notice: {error}</p>
        </section>
      )}

      {applications.length > 1 && (
        <section className="application-selector-section" aria-label="Select Pension Application">
          <label htmlFor="select-history-app" className="selector-label">
            Active Pension Application:
          </label>
          <select
            id="select-history-app"
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

      {isLoading && !currentApp && (
        <div className="history-loading-state" role="status" aria-live="polite">
          <p>Loading your pension payment history...</p>
        </div>
      )}

      {!isLoading && !currentApp && (
        <section className="history-empty-state" aria-label="No application found">
          <h2>No Pension Record Found</h2>
          <p>You currently do not have an active pension application record.</p>
        </section>
      )}

      {currentApp && (
        <div className="history-content-wrapper">
          <PensionHistorySummary
            totalReceived={totalReceived}
            schemeName={currentApp.schemeName || ''}
          />

          <section className="payment-records-section" aria-label="Transaction Records">
            <h2 className="records-section-title">Past Payments</h2>

            {appPayments.length === 0 ? (
              <div className="no-payments-message" role="note">
                <p>No payments have been received yet for this application.</p>
              </div>
            ) : (
              <div className="payment-records-list">
                {appPayments.map((payment) => (
                  <PensionPaymentItem
                    key={payment.id}
                    payment={payment}
                    schemeName={currentApp.schemeName || ''}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
};
