/**
 * ApplicationTimeline Component
 * Chronologically displays application lifecycle stages (Completed, Current, Upcoming).
 * Uses accessible semantic markup understandable without visual styling.
 */

import { formatDateTime } from '../../../utils/formatters.js';

export const ApplicationTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="application-timeline-empty" role="note">
        <p>No timeline stages recorded yet for this application.</p>
      </div>
    );
  }

  // Find the index of the first incomplete step as the "current" active step
  const firstIncompleteIndex = timeline.findIndex((step) => !step.completed);
  const currentIndex = firstIncompleteIndex === -1 ? timeline.length - 1 : firstIncompleteIndex;

  return (
    <section className="application-timeline-section" aria-label="Application Stage Timeline">
      <h3 className="timeline-title">Application Progress Stages</h3>
      <ol className="application-timeline-list">
        {timeline.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = index === currentIndex && !isCompleted;

          let statusLabel = 'Upcoming';
          let statusIcon = '○';
          let itemClass = 'stage-upcoming';

          if (isCompleted) {
            statusLabel = 'Completed';
            statusIcon = '✓';
            itemClass = 'stage-completed';
          } else if (isCurrent) {
            statusLabel = 'CURRENT STAGE';
            statusIcon = '●';
            itemClass = 'stage-current';
          }

          return (
            <li key={step.step || index} className={`timeline-stage-item ${itemClass}`}>
              <header className="stage-header">
                <span className="stage-status-indicator" aria-hidden="true">
                  {statusIcon}
                </span>
                <h4 className="stage-name">{step.title}</h4>
                <span className="stage-status-badge" aria-label={`Stage status: ${statusLabel}`}>
                  [{statusLabel}]
                </span>
              </header>

              <div className="stage-body">
                {step.description && <p className="stage-description">{step.description}</p>}

                {step.timestamp && (
                  <p className="stage-timestamp">
                    <span className="meta-label">Completed on:</span>{' '}
                    <time dateTime={step.timestamp}>{formatDateTime(step.timestamp)}</time>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
