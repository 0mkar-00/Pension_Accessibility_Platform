/**
 * VerificationTimeline Component
 * Chronologically displays verification history, audit steps, and officer notes.
 * Semantic and readable without CSS dependencies.
 */

import { VerificationStatus } from './VerificationStatus.jsx';
import { formatDateTime } from '../../../utils/formatters.js';

export const VerificationTimeline = ({ timelineEvents = [] }) => {
  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <div className="verification-timeline-empty" role="note">
        <p>No verification history entries recorded yet.</p>
      </div>
    );
  }

  return (
    <section className="verification-timeline-container" aria-label="Verification History Timeline">
      <h3 className="timeline-heading">Verification History & Audit Log</h3>
      <ol className="verification-timeline-list">
        {timelineEvents.map((event, index) => (
          <li key={event.id || index} className="timeline-item">
            <header className="timeline-item-header">
              <div className="timeline-step-indicator" aria-hidden="true">
                <span className="step-number">{index + 1}</span>
              </div>
              <h4 className="timeline-event-title">{event.title}</h4>
              <div className="timeline-event-status">
                <VerificationStatus status={event.status} />
              </div>
            </header>

            <div className="timeline-item-body">
              {event.timestamp && (
                <p className="timeline-timestamp">
                  <span className="meta-label">Date & Time:</span>{' '}
                  <time dateTime={event.timestamp}>{formatDateTime(event.timestamp)}</time>
                </p>
              )}

              {event.reviewer && (
                <p className="timeline-reviewer">
                  <span className="meta-label">Officer / System:</span>{' '}
                  <strong>{event.reviewer}</strong>
                </p>
              )}

              {event.remarks && (
                <blockquote className="timeline-remarks">
                  <span className="meta-label">Remarks:</span> {event.remarks}
                </blockquote>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
