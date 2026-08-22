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

export const DOCUMENT_STATUS = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  UPLOADED: 'UPLOADED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const DOCUMENT_STATUS_LABELS = {
  [DOCUMENT_STATUS.NOT_SUBMITTED]: 'Not Submitted',
  [DOCUMENT_STATUS.UPLOADED]: 'Uploaded (Pending Scrutiny)',
  [DOCUMENT_STATUS.UNDER_REVIEW]: 'Under Review',
  [DOCUMENT_STATUS.APPROVED]: 'Verified & Approved',
  [DOCUMENT_STATUS.REJECTED]: 'Rejected (Action Required)',
};

export const DOCUMENT_TYPES = {
  AGE_PROOF: {
    id: 'DOC_AGE_PROOF',
    name: 'Proof of Age',
    description: 'Birth Certificate, School Leaving Certificate, or Voter ID for age verification.',
    mandatory: true,
  },
  IDENTITY_PROOF: {
    id: 'DOC_IDENTITY_PROOF',
    name: 'Identity Verification Proof',
    description: 'Government-issued photo identification card (Demo copy).',
    mandatory: true,
  },
  INCOME_CERTIFICATE: {
    id: 'DOC_INCOME_CERT',
    name: 'Income Certificate / BPL Card',
    description: 'Annual income certificate issued by Revenue Authority or BPL ration card.',
    mandatory: true,
  },
  BANK_PASSBOOK: {
    id: 'DOC_BANK_PASSBOOK',
    name: 'Bank Passbook Front Page',
    description: 'Bank passbook copy or cancelled cheque showing account number and IFSC for DBT.',
    mandatory: true,
  },
  DISABILITY_CERTIFICATE: {
    id: 'DOC_DISABILITY_CERT',
    name: 'Disability Medical Assessment Certificate',
    description: 'Certificate from competent medical board showing 40% or higher disability.',
    mandatory: false,
  },
  DEATH_CERTIFICATE: {
    id: 'DOC_DEATH_CERT',
    name: 'Spouse Death Certificate',
    description: 'Official death certificate of deceased spouse (required for Widow Pension Scheme).',
    mandatory: false,
  },
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
export const VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  VERIFIED: 'VERIFIED',
  ACTION_REQUIRED: 'ACTION_REQUIRED',
  REJECTED: 'REJECTED',
};

export const VERIFICATION_STATUS_LABELS = {
  [VERIFICATION_STATUS.PENDING]: 'Verification Pending',
  [VERIFICATION_STATUS.IN_REVIEW]: 'Verification in Progress',
  [VERIFICATION_STATUS.VERIFIED]: 'Fully Verified & Cleared',
  [VERIFICATION_STATUS.ACTION_REQUIRED]: 'Action Required from Applicant',
  [VERIFICATION_STATUS.REJECTED]: 'Verification Rejected',
};

export const NOTIFICATION_TYPES = {
  ACTION_REQUIRED: {
    id: 'ACTION_REQUIRED',
    label: 'Action Needed',
    icon: '⚠',
  },
  SUCCESS: {
    id: 'SUCCESS',
    label: 'Update / Approved',
    icon: '✓',
  },
  INFO: {
    id: 'INFO',
    label: 'Information',
    icon: 'ℹ️',
  },
  WARNING: {
    id: 'WARNING',
    label: 'Notice',
    icon: '⚠️',
  },
};