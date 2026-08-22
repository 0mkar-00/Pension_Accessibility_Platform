/**
 * Validation Utilities
 * Validates application inputs and fictional demo formats.
 */

import { PENSION_SCHEMES } from './constants.js';

/**
 * Validate that a field is not empty
 * @param {string|any} value
 * @param {string} fieldName
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required.`;
  }
  return null;
};

/**
 * Validate applicant age based on date of birth and scheme minimum age
 * @param {string|Date} dob
 * @param {number} minAge
 * @returns {{ isValid: boolean, age: number, error: string|null }}
 */
export const validateAge = (dob, minAge = 60) => {
  if (!dob) {
    return { isValid: false, age: 0, error: 'Date of birth is required.' };
  }

  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, age: 0, error: 'Invalid date of birth.' };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < minAge) {
    return {
      isValid: false,
      age,
      error: `Applicant must be at least ${minAge} years old (Current age: ${age}).`,
    };
  }

  return { isValid: true, age, error: null };
};

/**
 * Validate fictional 10-digit phone number format
 * @param {string} phone
 * @returns {string|null}
 */
export const validateDemoPhone = (phone) => {
  if (!phone) return 'Mobile number is required.';
  const cleaned = phone.replace(/[\s-]/g, '');
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
  }
  return null;
};

/**
 * Validate fictional 12-digit demo ID format (strictly for demo purposes)
 * @param {string} idString
 * @returns {string|null}
 */
export const validateDemoId = (idString) => {
  if (!idString) return 'Identification number is required.';
  const cleaned = idString.replace(/[\s-]/g, '');
  if (!/^\d{12}$/.test(cleaned)) {
    return 'ID must be exactly 12 digits (demo format).';
  }
  return null;
};

/**
 * Validate complete pension application submission
 * @param {Object} applicationData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validatePensionApplication = (applicationData) => {
  const errors = {};

  // Name validation
  const nameErr = validateRequired(applicationData.fullName, 'Full name');
  if (nameErr) errors.fullName = nameErr;

  // Phone validation
  const phoneErr = validateDemoPhone(applicationData.phoneNumber);
  if (phoneErr) errors.phoneNumber = phoneErr;

  // Scheme & Age validation
  const schemeKey = Object.keys(PENSION_SCHEMES).find(
    (key) => PENSION_SCHEMES[key].id === applicationData.schemeId
  );
  const scheme = schemeKey ? PENSION_SCHEMES[schemeKey] : null;

  if (!scheme) {
    errors.schemeId = 'Please select a valid pension scheme.';
  } else {
    const ageResult = validateAge(applicationData.dateOfBirth, scheme.minAge);
    if (!ageResult.isValid) {
      errors.dateOfBirth = ageResult.error;
    }
  }

  // Address validation
  const addressErr = validateRequired(applicationData.address, 'Address');
  if (addressErr) errors.address = addressErr;

  // Demo ID validation
  const idErr = validateDemoId(applicationData.demoIdNumber);
  if (idErr) errors.demoIdNumber = idErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
