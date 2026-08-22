/**
 * DocumentCard Component
 * Displays document metadata, status, history, review remarks, and upload actions.
 */

import { useState } from 'react';
import { DocumentStatus } from './DocumentStatus.jsx';
import { DocumentUpload } from './DocumentUpload.jsx';
import { DOCUMENT_STATUS } from '../../../utils/constants.js';
import { formatDateTime } from '../../../utils/formatters.js';

export const DocumentCard = ({
  document,
  canUpload = true,
  permissionReason = '',
  onUpload,
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const isRejected = document.status === DOCUMENT_STATUS.REJECTED;
  const isNotSubmitted = document.status === DOCUMENT_STATUS.NOT_SUBMITTED;
  const isApproved = document.status === DOCUMENT_STATUS.APPROVED;
  const isActionRequired = isRejected || isNotSubmitted;

  const handleUploadSubmit = async (fileMetadata) => {
    if (onUpload) {
      await onUpload(document.id, fileMetadata);
      setIsUploadOpen(false);
    }
  };

  return (
    <article
      className={`document-card ${isActionRequired ? 'card-action-required' : ''} ${
        isApproved ? 'card-approved' : ''
      }`.trim()}
      aria-labelledby={`doc-title-${document.id}`}
    >
      <header className="document-card-header">
        <div className="document-title-group">
          <h3 id={`doc-title-${document.id}`} className="document-name">
            {document.name}
          </h3>
          {document.mandatory ? (
            <span className="badge-required" aria-label="Mandatory document">
              Required
            </span>
          ) : (
            <span className="badge-optional" aria-label="Optional document">
              Optional
            </span>
          )}
        </div>

        <div className="document-status-wrapper">
          <DocumentStatus status={document.status} />
        </div>
      </header>

      <p className="document-description">{document.description}</p>

      {/* Uploaded file metadata */}
      {document.fileName && (
        <div className="document-file-info" aria-label="Uploaded file details">
          <p className="file-info-item">
            <span className="file-info-label">File:</span>{' '}
            <strong className="file-name">{document.fileName}</strong>{' '}
            {document.fileSize && <span className="file-size">({document.fileSize})</span>}
          </p>
          {document.uploadedAt && (
            <p className="file-info-item">
              <span className="file-info-label">Submitted on:</span>{' '}
              <time dateTime={document.uploadedAt}>
                {formatDateTime(document.uploadedAt)}
              </time>
              {document.uploadedBy && (
                <span className="uploader-name"> by {document.uploadedBy}</span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Review Remarks / Rejection Reason */}
      {document.reviewRemarks && (
        <aside
          className={`document-remarks ${isRejected ? 'remarks-rejection' : 'remarks-info'}`}
          aria-label={isRejected ? 'Document rejection reason' : 'Officer review remarks'}
        >
          <strong className="remarks-heading">
            {isRejected ? '⚠️ Action Required - Rejection Reason:' : 'Officer Review Note:'}
          </strong>
          <p className="remarks-text">{document.reviewRemarks}</p>
        </aside>
      )}

      {/* Action Controls */}
      <footer className="document-card-actions">
        {!isApproved && (
          <>
            {!isUploadOpen ? (
              <button
                type="button"
                className={`btn-action ${isActionRequired ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setIsUploadOpen(true)}
                disabled={!canUpload}
                aria-expanded={isUploadOpen}
                aria-controls={`upload-section-${document.id}`}
              >
                {isRejected
                  ? `Re-upload Document`
                  : isNotSubmitted
                  ? `Upload Document`
                  : `Replace / Re-upload Document`}
              </button>
            ) : (
              <div id={`upload-section-${document.id}`} className="document-upload-section">
                <DocumentUpload
                  documentId={document.id}
                  documentName={document.name}
                  isReupload={!isNotSubmitted}
                  isDisabled={!canUpload}
                  disabledReason={permissionReason}
                  onUpload={handleUploadSubmit}
                />
                <button
                  type="button"
                  className="btn-cancel-upload"
                  onClick={() => setIsUploadOpen(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

        {!canUpload && !isApproved && (
          <p className="permission-warning" role="note">
            ℹ️ {permissionReason || 'Your current access role is View-Only.'}
          </p>
        )}
      </footer>
    </article>
  );
};
