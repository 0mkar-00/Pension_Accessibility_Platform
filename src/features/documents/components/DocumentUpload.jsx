/**
 * DocumentUpload Component
 * Accessible, demo-safe document upload control with client-side validation.
 * Does not send data to real servers; simulates fictional demo upload.
 */

import { useState } from 'react';

const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const DocumentUpload = ({
  documentId,
  documentName,
  isReupload = false,
  isDisabled = false,
  disabledReason = '',
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const inputId = `doc-file-input-${documentId}`;
  const errorId = `doc-error-${documentId}`;
  const helpId = `doc-help-${documentId}`;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setValidationError(null);
    setUploadSuccess(false);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Type validation
    const hasValidType =
      ALLOWED_FILE_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidType) {
      setValidationError('Please select a valid PDF, JPG, or PNG document.');
      setSelectedFile(null);
      return;
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('File size exceeds 5MB limit. Please choose a smaller file.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || isDisabled || isUploading) return;

    try {
      setIsUploading(true);
      setValidationError(null);

      // Clean demo metadata
      const demoMetadata = {
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
      };

      if (onUpload) {
        await onUpload(demoMetadata);
      }

      setUploadSuccess(true);
      setSelectedFile(null);
    } catch (err) {
      setValidationError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isDisabled) {
    return (
      <div className="document-upload-disabled" role="note" aria-live="polite">
        <p className="disabled-notice">
          🔒 {disabledReason || 'Document upload is disabled under your current permission level.'}
        </p>
      </div>
    );
  }

  return (
    <form className="document-upload-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor={inputId} className="upload-label">
          {isReupload ? `Re-upload ${documentName} (Demo)` : `Select ${documentName} (Demo)`}
        </label>

        <input
          id={inputId}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={isUploading}
          aria-describedby={`${helpId} ${validationError ? errorId : ''}`.trim()}
          className="file-input"
        />

        <p id={helpId} className="upload-hint">
          Supported formats: PDF, JPG, PNG (Max 5MB). Simulated demo upload only.
        </p>
      </div>

      {validationError && (
        <div id={errorId} className="upload-error" role="alert" aria-live="assertive">
          ⚠️ {validationError}
        </div>
      )}

      {uploadSuccess && (
        <div className="upload-success-message" role="status" aria-live="polite">
          ✓ Document submitted successfully for verification.
        </div>
      )}

      {selectedFile && !validationError && (
        <div className="file-preview-summary">
          <p>
            Selected: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
          </p>
          <button
            type="submit"
            disabled={isUploading}
            className="btn-submit-upload"
            aria-label={isReupload ? `Confirm re-upload of ${documentName}` : `Confirm upload of ${documentName}`}
          >
            {isUploading
              ? 'Uploading Demo File...'
              : isReupload
              ? `Submit Re-uploaded Document`
              : `Submit Document`}
          </button>
        </div>
      )}
    </form>
  );
};
