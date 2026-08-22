/**
 * NotificationItem Component
 * Clearly answers:
 * 1. What happened?
 * 2. What does it mean?
 * 3. Do I need to do anything?
 * Uses accessible, semantic HTML with keyboard-accessible read/action controls.
 */

import { NotificationStatus } from './NotificationStatus.jsx';
import { formatDateTime } from '../../../utils/formatters.js';

export const NotificationItem = ({
  notification,
  onMarkRead,
  onActionClick,
}) => {
  const {
    id,
    type,
    title,
    message,
    meaning,
    timestamp,
    read,
    actionRequired,
    actionLabel,
    targetFeature,
  } = notification;

  return (
    <article
      className={`notification-card ${read ? 'notif-read' : 'notif-unread'} ${
        actionRequired ? 'notif-action-required' : ''
      }`.trim()}
      aria-labelledby={`notif-title-${id}`}
    >
      <header className="notification-card-header">
        <div className="notif-header-left">
          {!read && (
            <span className="unread-indicator-badge" aria-label="Unread notification">
              [NEW]
            </span>
          )}
          <h3 id={`notif-title-${id}`} className="notif-title">
            {title}
          </h3>
        </div>

        <div className="notif-header-right">
          <NotificationStatus type={type} />
        </div>
      </header>

      <div className="notification-card-body">
        {/* Question 1: What happened? */}
        <div className="notif-section">
          <strong className="notif-section-label">What happened:</strong>
          <p className="notif-message-text">{message}</p>
        </div>

        {/* Question 2: What does it mean? */}
        {meaning && (
          <div className="notif-section notif-meaning-section">
            <strong className="notif-section-label">What it means:</strong>
            <p className="notif-meaning-text">{meaning}</p>
          </div>
        )}

        {/* Question 3: Do I need to do anything? */}
        <div className="notif-section notif-action-section">
          <strong className="notif-section-label">Do you need to do anything:</strong>
          {actionRequired ? (
            <p className="notif-action-text notif-action-urgent">
              👉 <strong>Action required:</strong> Please resolve this item to continue processing.
            </p>
          ) : (
            <p className="notif-action-text notif-action-none">
              ✓ No action is needed from you right now.
            </p>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p className="notif-timestamp">
            <span className="meta-label">Received on:</span>{' '}
            <time dateTime={timestamp}>{formatDateTime(timestamp)}</time>
          </p>
        )}
      </div>

      <footer className="notification-card-footer">
        {/* Action Button if actionable */}
        {actionRequired && (
          <button
            type="button"
            className="btn-notif-action"
            onClick={() => onActionClick && onActionClick(targetFeature, notification)}
            aria-label={`Action: ${actionLabel || 'Resolve notification item'}`}
          >
            {actionLabel || 'Fix / Review Now →'}
          </button>
        )}

        {/* Mark as Read Button if unread */}
        {!read && onMarkRead && (
          <button
            type="button"
            className="btn-mark-read"
            onClick={() => onMarkRead(id)}
            aria-label={`Mark notification "${title}" as read`}
          >
            ✓ Mark as Read
          </button>
        )}
      </footer>
    </article>
  );
};
