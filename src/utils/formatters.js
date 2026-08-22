/**
 * Formatting Utilities
 * For formatting currencies, dates, masked demo IDs, and statuses.
 */

import { APPLICATION_STATUS_LABELS } from './constants.js';

/**
 * Format a number as Indian Rupee currency (₹)
 * @param {number} amount
 * @returns {string} e.g. "₹2,500"
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date string or Date object into human-readable format
 * @param {string|Date} dateValue
 * @param {Object} [options]
 * @returns {string} e.g. "12 Oct 2025"
 */
export const formatDate = (dateValue, options = {}) => {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
};

/**
 * Format date with time for tracking logs and timestamps
 * @param {string|Date} dateValue
 * @returns {string} e.g. "12 Oct 2025, 02:30 PM"
 */
export const formatDateTime = (dateValue) => {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Mask a fictional identification number showing only the last 4 digits
 * e.g., "999988881234" -> "XXXX-XXXX-1234"
 * @param {string} idString
 * @returns {string}
 */
export const maskFictionalId = (idString) => {
  if (!idString || typeof idString !== 'string') return 'XXXX-XXXX-0000';
  const clean = idString.replace(/[\s-]/g, '');
  if (clean.length < 4) return 'XXXX';
  const lastFour = clean.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
};

/**
 * Mask a fictional bank account number
 * e.g., "0000123456789" -> "•••• •••• 6789"
 * @param {string} accountNumber
 * @returns {string}
 */
export const maskBankAccount = (accountNumber) => {
  if (!accountNumber || typeof accountNumber !== 'string') return '•••• 0000';
  const lastFour = accountNumber.slice(-4);
  return `•••• •••• ${lastFour}`;
};

/**
 * Get user-friendly text for an application status code
 * @param {string} statusCode
 * @returns {string}
 */
export const getStatusLabel = (statusCode) => {
  return APPLICATION_STATUS_LABELS[statusCode] || statusCode || 'Unknown Status';
};
