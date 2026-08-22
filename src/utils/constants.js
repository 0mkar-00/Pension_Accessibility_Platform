/**
 * Application Constants and Enums
 * For Pension Accessibility Platform
 */

export const PENSION_SCHEMES = {
  OLD_AGE: {
    id: 'SCHEME_OLD_AGE',
    name: 'National Old Age Pension Scheme (NOAPS)',
    description: 'Financial assistance for senior citizens aged 60 years and above.',
    minAge: 60,
    monthlyAmount: 2500,
  },
  WIDOW: {
    id: 'SCHEME_WIDOW',
    name: 'Widow Pension Scheme (Indira Gandhi National)',
    description: 'Financial support for widowed individuals under specified income limits.',
    minAge: 40,
    monthlyAmount: 2200,
  },
  DISABILITY: {
    id: 'SCHEME_DISABILITY',
    name: 'Disability Pension Scheme (Divyangjan Sahayata)',
    description: 'Financial aid for persons with 40% or higher certified disability.',
    minAge: 18,
    monthlyAmount: 3000,
  },
};

export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  DOCUMENTS_VERIFIED: 'DOCUMENTS_VERIFIED',
  FIELD_VERIFIED: 'FIELD_VERIFIED',
  SANCTIONED: 'SANCTIONED',
  REJECTED: 'REJECTED',
  DISBURSED: 'DISBURSED',
};

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.DRAFT]: 'Draft Saved',
  [APPLICATION_STATUS.SUBMITTED]: 'Application Submitted',
  [APPLICATION_STATUS.DOCUMENTS_VERIFIED]: 'Documents Verified',
  [APPLICATION_STATUS.FIELD_VERIFIED]: 'Field Verification Complete',
  [APPLICATION_STATUS.SANCTIONED]: 'Pension Sanctioned & Approved',
  [APPLICATION_STATUS.REJECTED]: 'Application Rejected',
  [APPLICATION_STATUS.DISBURSED]: 'First Disbursement Released',
};

export const USER_ROLES = {
  PENSIONER: 'PENSIONER',
  TRUSTED_HELPER: 'TRUSTED_HELPER',
  OFFICER: 'OFFICER',
};

export const HELPER_PERMISSIONS = {
  VIEW_ONLY: {
    id: 'VIEW_ONLY',
    label: 'View Only',
    description: 'Helper can check application status and payment records only.',
  },
  ASSIST_APPLY: {
    id: 'ASSIST_APPLY',
    label: 'Assist & Apply',
    description: 'Helper can draft and submit applications on behalf of the pensioner.',
  },
  FULL_MANAGEMENT: {
    id: 'FULL_MANAGEMENT',
    label: 'Full Management',
    description: 'Helper has full delegated access to manage details and queries.',
  },
};

export const PAYMENT_STATUS = {
  SUCCESS: 'SUCCESS',
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED',
};

export const STORAGE_KEYS = {
  CURRENT_USER: 'pension_app_current_user',
  APPLICATIONS: 'pension_app_applications',
  PAYMENTS: 'pension_app_payments',
  USER_PREFERENCES: 'pension_app_preferences',
};
