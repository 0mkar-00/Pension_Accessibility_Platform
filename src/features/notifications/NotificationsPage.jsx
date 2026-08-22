/**
 * NotificationsPage Component
 * Main page displaying all alerts and updates for the active pension application.
 * Answers: What happened, what does it mean, and what action is required.
 */

import { useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth.js';
import { usePension } from '../../context/usePension.js';
import { NotificationItem } from './components/NotificationItem.jsx';

export const NotificationsPage = ({ onNavigateFeature }) => {
  const { isHelper } = useAuth();
  const {
    applications,
    activeApplication,
    selectApplication,
    markNotificationRead,
    markAllNotificationsRead,
    isLoading,
    error,
  } = usePension();

  const [selectedAppId, setSelectedAppId] = useState(
    activeApplication?.id || applications[0]?.id || ''
  );
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Determine active application
  const currentApp = useMemo(() => {
    if (selectedAppId) {
      const match = applications.find((a) => a.id === selectedAppId);
      if (match) return match;
    }
    return activeApplication || applications[0] || null;
  }, [applications, selectedAppId, activeApplication]);

  const notifications = useMemo(() => {
    return currentApp?.notifications || [];
  }, [currentApp]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleApplicationChange = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    const found = applications.find((a) => a.id === appId);
    if (found && selectApplication) {
      selectApplication(found);
    }
    setFeedbackMessage('');
  };

  const handleMarkSingleRead = async (notificationId) => {
    if (!currentApp) return;
    try {
      await markNotificationRead(currentApp.id, notificationId);
      setFeedbackMessage('Notification marked as read.');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } catch (err) {
      console.error('NotificationsPage: Error marking notification read', err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!currentApp) return;
    try {
      await markAllNotificationsRead(currentApp.id);
      setFeedbackMessage('All notifications marked as read.');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } catch (err) {
      console.error('NotificationsPage: Error marking all read', err);
    }
  };

  const handleActionClick = (targetFeature, notification) => {
    if (onNavigateFeature) {
      onNavigateFeature(targetFeature, notification);
    } else {
      setFeedbackMessage(
        `Action triggered for ${targetFeature || 'feature'}. (Routing can be connected by Developer 1)`
      );
      setTimeout(() => setFeedbackMessage(''), 4000);
    }
  };

  return (
    <main className="notifications-page-container" aria-labelledby="notifications-heading">
      <header className="notifications-header">
        <div className="notifications-title-row">
          <h1 id="notifications-heading">Notifications & Updates</h1>
          {unreadCount > 0 && (
            <span
              className="unread-count-pill"
              role="status"
              aria-label={`${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
            >
              {unreadCount} Unread
            </span>
          )}
        </div>

        <p className="page-intro">
          Updates, verification milestone notices, and required actions for your pension application.
        </p>

        {isHelper && (
          <div className="helper-mode-badge" role="status" aria-label="Assisted mode notice">
            🤝 <strong>Assisted Mode:</strong> Viewing notifications on behalf of{' '}
            {currentApp?.applicantName || 'Pensioner'} as a Trusted Helper.
          </div>
        )}
      </header>

      {/* Global Error Banner */}
      {error && (
        <section className="notifications-error-banner" role="alert" aria-live="assertive">
          <p>⚠️ {error}</p>
        </section>
      )}

      {/* Feedback Toast */}
      {feedbackMessage && (
        <section className="notifications-feedback-banner" role="status" aria-live="polite">
          <p>✓ {feedbackMessage}</p>
        </section>
      )}

      {/* Application Selector (if multiple applications exist) */}
      {applications.length > 1 && (
        <section className="application-selector-section" aria-label="Select Pension Application">
          <label htmlFor="select-notif-app" className="selector-label">
            Active Pension Application:
          </label>
          <select
            id="select-notif-app"
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

      {/* Action Bar (Mark All As Read) */}
      {unreadCount > 0 && (
        <div className="notifications-actions-bar">
          <button
            type="button"
            className="btn-mark-all-read"
            onClick={handleMarkAllRead}
            aria-label="Mark all notifications as read"
          >
            ✓ Mark All as Read ({unreadCount})
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !currentApp && (
        <div className="notifications-loading-state" role="status" aria-live="polite">
          <p>Loading notifications...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!currentApp || notifications.length === 0) && (
        <section className="notifications-empty-state" aria-label="No notifications">
          <h2>No Notifications Yet</h2>
          <p>You have no new alerts or pending notices for this application.</p>
        </section>
      )}

      {/* Populated Notifications List */}
      {currentApp && notifications.length > 0 && (
        <section className="notifications-list-section" aria-label="List of Notifications">
          <div className="notifications-list">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={handleMarkSingleRead}
                onActionClick={handleActionClick}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
