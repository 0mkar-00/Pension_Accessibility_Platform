/**
 * Pension Service
 * Handles CRUD operations, state persistence, application tracking, document uploads,
 * verification workflows, and payment history.
 * Simulates async backend API with client-side storage fallback.
 */

import { storageService } from './storageService.js';
import { MOCK_PENSION_APPLICATIONS } from '../data/mockPensionApplications.js';
import { MOCK_PAYMENT_HISTORY } from '../data/mockPaymentHistory.js';
import {
  STORAGE_KEYS,
  APPLICATION_STATUS,
  PENSION_SCHEMES,
  USER_ROLES,
  HELPER_PERMISSIONS,
  DOCUMENT_STATUS,
  DOCUMENT_TYPES,
  VERIFICATION_STATUS,
  VERIFICATION_CHECK_CATEGORIES,
} from '../utils/constants.js';
import { validatePensionApplication } from '../utils/validators.js';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

class PensionService {
  constructor() {
    this.initData();
  }

  initData() {
    const existingApps = storageService.getItem(STORAGE_KEYS.APPLICATIONS);
    // If empty or missing documents / verification array in mock apps, reseed
    if (
      !existingApps ||
      !Array.isArray(existingApps) ||
      existingApps.length === 0 ||
      !existingApps[0]?.documents ||
      !existingApps[0]?.verification
    ) {
      storageService.setItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    }

    const existingPayments = storageService.getItem(STORAGE_KEYS.PAYMENTS);
    if (!existingPayments || !Array.isArray(existingPayments) || existingPayments.length === 0) {
      storageService.setItem(STORAGE_KEYS.PAYMENTS, MOCK_PAYMENT_HISTORY);
    }
  }

  /**
   * Fetch list of all applications or filtered by applicant
   */
  async getApplications(filter = {}) {
    await delay();
    let apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);

    if (filter.applicantId) {
      apps = apps.filter((app) => app.applicantId === filter.applicantId);
    }
    if (filter.status) {
      apps = apps.filter((app) => app.status === filter.status);
    }
    if (filter.schemeId) {
      apps = apps.filter((app) => app.schemeId === filter.schemeId);
    }

    return apps;
  }

  /**
   * Get an application by its ID or tracking number
   */
  async getApplicationById(idOrTrackingNumber) {
    await delay();
    if (!idOrTrackingNumber) return null;

    const apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    const searchKey = idOrTrackingNumber.trim().toUpperCase();

    const application = apps.find(
      (app) =>
        app.id.toUpperCase() === searchKey ||
        (app.trackingNumber && app.trackingNumber.toUpperCase() === searchKey)
    );

    return application || null;
  }

  /**
   * Submit a new pension application
   */
  async submitApplication(formData, currentUser = null) {
    await delay(300);

    const validation = validatePensionApplication(formData);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors).join(' '));
    }

    const apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `PEN-2026-${randomSuffix}`;

    const schemeKey = Object.keys(PENSION_SCHEMES).find(
      (key) => PENSION_SCHEMES[key].id === formData.schemeId
    );
    const scheme = schemeKey ? PENSION_SCHEMES[schemeKey] : null;

    const isHelperSubmission = currentUser && currentUser.role === USER_ROLES.TRUSTED_HELPER;

    const initialDocuments = [
      {
        id: `DOC-${randomSuffix}-01`,
        typeId: DOCUMENT_TYPES.AGE_PROOF.id,
        name: DOCUMENT_TYPES.AGE_PROOF.name,
        description: DOCUMENT_TYPES.AGE_PROOF.description,
        mandatory: true,
        status: DOCUMENT_STATUS.NOT_SUBMITTED,
        fileName: null,
        fileSize: null,
        uploadedAt: null,
        uploadedBy: null,
        verifiedAt: null,
        reviewRemarks: null,
      },
      {
        id: `DOC-${randomSuffix}-02`,
        typeId: DOCUMENT_TYPES.IDENTITY_PROOF.id,
        name: DOCUMENT_TYPES.IDENTITY_PROOF.name,
        description: DOCUMENT_TYPES.IDENTITY_PROOF.description,
        mandatory: true,
        status: DOCUMENT_STATUS.NOT_SUBMITTED,
        fileName: null,
        fileSize: null,
        uploadedAt: null,
        uploadedBy: null,
        verifiedAt: null,
        reviewRemarks: null,
      },
      {
        id: `DOC-${randomSuffix}-03`,
        typeId: DOCUMENT_TYPES.INCOME_CERTIFICATE.id,
        name: DOCUMENT_TYPES.INCOME_CERTIFICATE.name,
        description: DOCUMENT_TYPES.INCOME_CERTIFICATE.description,
        mandatory: true,
        status: DOCUMENT_STATUS.NOT_SUBMITTED,
        fileName: null,
        fileSize: null,
        uploadedAt: null,
        uploadedBy: null,
        verifiedAt: null,
        reviewRemarks: null,
      },
      {
        id: `DOC-${randomSuffix}-04`,
        typeId: DOCUMENT_TYPES.BANK_PASSBOOK.id,
        name: DOCUMENT_TYPES.BANK_PASSBOOK.name,
        description: DOCUMENT_TYPES.BANK_PASSBOOK.description,
        mandatory: true,
        status: DOCUMENT_STATUS.NOT_SUBMITTED,
        fileName: null,
        fileSize: null,
        uploadedAt: null,
        uploadedBy: null,
        verifiedAt: null,
        reviewRemarks: null,
      },
    ];

    if (formData.schemeId === PENSION_SCHEMES.DISABILITY.id) {
      initialDocuments.push({
        id: `DOC-${randomSuffix}-05`,
        typeId: DOCUMENT_TYPES.DISABILITY_CERTIFICATE.id,
        name: DOCUMENT_TYPES.DISABILITY_CERTIFICATE.name,
        description: DOCUMENT_TYPES.DISABILITY_CERTIFICATE.description,
        mandatory: true,
        status: DOCUMENT_STATUS.NOT_SUBMITTED,
        fileName: null,
        fileSize: null,
        uploadedAt: null,
        uploadedBy: null,
        verifiedAt: null,
        reviewRemarks: null,
      });
    } else if (formData.schemeId === PENSION_SCHEMES.WIDOW.id) {
      initialDocuments.push({
        id: `DOC-${randomSuffix}-05`,
        typeId: DOCUMENT_TYPES.DEATH_CERTIFICATE.id,
        name: DOCUMENT_TYPES.DEATH_CERTIFICATE.name,
        description: DOCUMENT_TYPES.DEATH_CERTIFICATE.description,
        mandatory: true,
        status: DOCUMENT_STATUS.NOT_SUBMITTED,
        fileName: null,
        fileSize: null,
        uploadedAt: null,
        uploadedBy: null,
        verifiedAt: null,
        reviewRemarks: null,
      });
    }

    const initialVerification = {
      id: `VER-2026-${randomSuffix}`,
      applicationId: newId,
      overallStatus: VERIFICATION_STATUS.PENDING,
      initiatedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      completedAt: null,
      assignedOfficer: 'District Social Security Verification Cell',
      remarks: 'Application submitted. Verification docket queued for initial scrutiny.',
      nextAction: 'Upload all required verification documents on the Documents page.',
      checks: [
        {
          id: `CHK-${randomSuffix}-01`,
          name: VERIFICATION_CHECK_CATEGORIES.IDENTITY.title,
          purpose: VERIFICATION_CHECK_CATEGORIES.IDENTITY.description,
          status: VERIFICATION_STATUS.PENDING,
          remarks: 'Awaiting initial desk officer review.',
          reviewer: null,
          timestamp: null,
          nextAction: 'Ensure demo photo identity card is uploaded.',
        },
        {
          id: `CHK-${randomSuffix}-02`,
          name: VERIFICATION_CHECK_CATEGORIES.DOCUMENT_SCRUTINY.title,
          purpose: VERIFICATION_CHECK_CATEGORIES.DOCUMENT_SCRUTINY.description,
          status: VERIFICATION_STATUS.PENDING,
          remarks: 'Awaiting mandatory document uploads.',
          reviewer: null,
          timestamp: null,
          nextAction: 'Submit all mandatory scheme certificates.',
        },
        {
          id: `CHK-${randomSuffix}-03`,
          name: VERIFICATION_CHECK_CATEGORIES.ELIGIBILITY.title,
          purpose: VERIFICATION_CHECK_CATEGORIES.ELIGIBILITY.description,
          status: VERIFICATION_STATUS.PENDING,
          remarks: 'Awaiting scrutiny before field verification scheduling.',
          reviewer: null,
          timestamp: null,
          nextAction: null,
        },
        {
          id: `CHK-${randomSuffix}-04`,
          name: VERIFICATION_CHECK_CATEGORIES.BANK_DBT.title,
          purpose: VERIFICATION_CHECK_CATEGORIES.BANK_DBT.description,
          status: VERIFICATION_STATUS.PENDING,
          remarks: 'Bank passbook verification pending.',
          reviewer: null,
          timestamp: null,
          nextAction: 'Submit bank passbook copy.',
        },
      ],
      timeline: [
        {
          id: `VTL-${randomSuffix}-01`,
          title: 'Verification Docket Opened',
          status: VERIFICATION_STATUS.PENDING,
          timestamp: new Date().toISOString(),
          remarks: 'Verification process initiated following online application submission.',
          reviewer: isHelperSubmission
            ? `${currentUser.fullName} (Trusted Helper)`
            : 'Online Submission Portal',
        },
      ],
    };

    const newApplication = {
      id: newId,
      trackingNumber: newId,
      applicantId: currentUser?.id || `USR-DEMO-${randomSuffix}`,
      applicantName: formData.fullName,
      schemeId: formData.schemeId,
      schemeName: scheme ? scheme.name : 'Pension Scheme',
      monthlySanctionAmount: scheme ? scheme.monthlyAmount : 2000,
      status: APPLICATION_STATUS.SUBMITTED,
      submissionDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
      annualIncomeDeclared: Number(formData.annualIncome) || 30000,
      demoIdNumber: formData.demoIdNumber,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      disbursalAccount: {
        bankName: formData.bankName || 'Demo Bank',
        accountNumber: formData.accountNumber || '999900001234',
        ifscCode: formData.ifscCode || 'DEMO0001111',
        branch: formData.branch || 'Main Branch',
      },
      helperAssistance: {
        enabled: Boolean(isHelperSubmission || formData.helperAssistance),
        helperId: isHelperSubmission ? currentUser.id : null,
        helperName: isHelperSubmission ? currentUser.fullName : null,
        permissionLevel: isHelperSubmission
          ? HELPER_PERMISSIONS.ASSIST_APPLY.id
          : HELPER_PERMISSIONS.VIEW_ONLY.id,
      },
      documents: initialDocuments,
      verification: initialVerification,
      timeline: [
        {
          step: 1,
          status: APPLICATION_STATUS.SUBMITTED,
          title: 'Application Submitted Online',
          description: isHelperSubmission
            ? `Submitted by trusted helper ${currentUser.fullName} on behalf of pensioner.`
            : 'Application submitted directly by applicant.',
          timestamp: new Date().toISOString(),
          completed: true,
        },
        {
          step: 2,
          status: APPLICATION_STATUS.DOCUMENTS_VERIFIED,
          title: 'Document Verification',
          description: 'Awaiting document scrutiny by Social Welfare desk officer.',
          timestamp: null,
          completed: false,
        },
        {
          step: 3,
          status: APPLICATION_STATUS.FIELD_VERIFIED,
          title: 'Field Verification',
          description: 'Awaiting ground verification report from local revenue inspector.',
          timestamp: null,
          completed: false,
        },
        {
          step: 4,
          status: APPLICATION_STATUS.SANCTIONED,
          title: 'Sanction Approval',
          description: 'Awaiting sanction order from competent authority.',
          timestamp: null,
          completed: false,
        },
        {
          step: 5,
          status: APPLICATION_STATUS.DISBURSED,
          title: 'Pension Disbursal',
          description: 'Direct Benefit Transfer (DBT) will initiate post sanction approval.',
          timestamp: null,
          completed: false,
        },
      ],
    };

    const updatedApps = [newApplication, ...apps];
    storageService.setItem(STORAGE_KEYS.APPLICATIONS, updatedApps);
    return newApplication;
  }

  /**
   * Get all documents associated with an application
   */
  async getDocuments(applicationId) {
    await delay(150);
    const app = await this.getApplicationById(applicationId);
    return app ? app.documents || [] : [];
  }

  /**
   * Mock upload / re-upload a document for an application
   */
  async uploadDocument(applicationId, documentId, fileMetadata, currentUser = null) {
    await delay(250);

    const apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    const appIndex = apps.findIndex((a) => a.id === applicationId);

    if (appIndex === -1) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const app = { ...apps[appIndex] };
    const documents = Array.isArray(app.documents) ? [...app.documents] : [];
    const docIndex = documents.findIndex((d) => d.id === documentId);

    if (docIndex === -1) {
      throw new Error(`Document with ID ${documentId} not found.`);
    }

    const uploaderLabel = currentUser
      ? currentUser.role === USER_ROLES.TRUSTED_HELPER
        ? `${currentUser.fullName} (Trusted Helper)`
        : `${currentUser.fullName} (Self)`
      : 'Applicant (Demo)';

    documents[docIndex] = {
      ...documents[docIndex],
      status: DOCUMENT_STATUS.UPLOADED,
      fileName: fileMetadata.fileName || 'demo_uploaded_document.pdf',
      fileSize: fileMetadata.fileSize || '1.0 MB',
      uploadedAt: new Date().toISOString(),
      uploadedBy: uploaderLabel,
      reviewRemarks: null,
    };

    app.documents = documents;
    app.lastUpdatedDate = new Date().toISOString();

    // If verification was ACTION_REQUIRED due to this document, transition to IN_REVIEW
    if (app.verification && app.verification.overallStatus === VERIFICATION_STATUS.ACTION_REQUIRED) {
      app.verification = {
        ...app.verification,
        overallStatus: VERIFICATION_STATUS.IN_REVIEW,
        lastUpdatedAt: new Date().toISOString(),
        remarks: 'Re-uploaded document received. Verification scrutiny resumed.',
        nextAction: 'Awaiting officer review of re-uploaded document.',
        timeline: [
          ...(app.verification.timeline || []),
          {
            id: `VTL-REUP-${Date.now()}`,
            title: `Document Re-uploaded: ${documents[docIndex].name}`,
            status: VERIFICATION_STATUS.IN_REVIEW,
            timestamp: new Date().toISOString(),
            remarks: `Re-uploaded by ${uploaderLabel}. Queued for desk review.`,
            reviewer: uploaderLabel,
          },
        ],
      };
    }

    apps[appIndex] = app;
    storageService.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    return documents[docIndex];
  }

  /**
   * Update review status of a document
   */
  async updateDocumentReview(applicationId, documentId, newStatus, reviewRemarks = null) {
    await delay(200);

    const apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    const appIndex = apps.findIndex((a) => a.id === applicationId);

    if (appIndex === -1) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const app = { ...apps[appIndex] };
    const documents = Array.isArray(app.documents) ? [...app.documents] : [];
    const docIndex = documents.findIndex((d) => d.id === documentId);

    if (docIndex === -1) {
      throw new Error(`Document ${documentId} not found.`);
    }

    documents[docIndex] = {
      ...documents[docIndex],
      status: newStatus,
      verifiedAt: new Date().toISOString(),
      reviewRemarks: reviewRemarks || documents[docIndex].reviewRemarks,
    };

    app.documents = documents;
    app.lastUpdatedDate = new Date().toISOString();

    apps[appIndex] = app;
    storageService.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    return documents[docIndex];
  }

  /**
   * Get verification profile for an application
   */
  async getVerification(applicationId) {
    await delay(150);
    const app = await this.getApplicationById(applicationId);
    return app ? app.verification || null : null;
  }

  /**
   * Update an individual verification check status
   * @param {string} applicationId
   * @param {string} checkId
   * @param {string} status (VERIFICATION_STATUS)
   * @param {string} remarks
   * @param {string|null} nextAction
   * @param {Object} currentUser
   */
  async updateVerificationCheckStatus(
    applicationId,
    checkId,
    status,
    remarks = '',
    nextAction = null,
    currentUser = null
  ) {
    await delay(250);

    const apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    const appIndex = apps.findIndex((a) => a.id === applicationId);

    if (appIndex === -1) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const app = { ...apps[appIndex] };
    if (!app.verification || !Array.isArray(app.verification.checks)) {
      throw new Error(`No verification records found for application ${applicationId}.`);
    }

    const checks = [...app.verification.checks];
    const checkIndex = checks.findIndex((c) => c.id === checkId);

    if (checkIndex === -1) {
      throw new Error(`Verification check ${checkId} not found.`);
    }

    const reviewerName = currentUser
      ? `${currentUser.fullName} (${currentUser.designation || 'Verification Officer'})`
      : 'Verification Officer (Social Welfare Dept)';

    checks[checkIndex] = {
      ...checks[checkIndex],
      status,
      remarks: remarks || checks[checkIndex].remarks,
      reviewer: reviewerName,
      timestamp: new Date().toISOString(),
      nextAction: nextAction !== undefined ? nextAction : checks[checkIndex].nextAction,
    };

    // Recalculate overall verification status based on checks
    let calculatedOverallStatus = VERIFICATION_STATUS.IN_REVIEW;
    const allVerified = checks.every((c) => c.status === VERIFICATION_STATUS.VERIFIED);
    const hasRejected = checks.some((c) => c.status === VERIFICATION_STATUS.REJECTED);
    const hasActionRequired = checks.some((c) => c.status === VERIFICATION_STATUS.ACTION_REQUIRED);
    const allPending = checks.every((c) => c.status === VERIFICATION_STATUS.PENDING);

    if (hasRejected) {
      calculatedOverallStatus = VERIFICATION_STATUS.REJECTED;
    } else if (hasActionRequired) {
      calculatedOverallStatus = VERIFICATION_STATUS.ACTION_REQUIRED;
    } else if (allVerified) {
      calculatedOverallStatus = VERIFICATION_STATUS.VERIFIED;
    } else if (allPending) {
      calculatedOverallStatus = VERIFICATION_STATUS.PENDING;
    }

    const timelineEvent = {
      id: `VTL-CHK-${Date.now()}`,
      title: `${checks[checkIndex].name}: ${status}`,
      status,
      timestamp: new Date().toISOString(),
      remarks: remarks || `Verification status updated to ${status}.`,
      reviewer: reviewerName,
    };

    app.verification = {
      ...app.verification,
      checks,
      overallStatus: calculatedOverallStatus,
      lastUpdatedAt: new Date().toISOString(),
      completedAt: allVerified ? new Date().toISOString() : null,
      remarks:
        calculatedOverallStatus === VERIFICATION_STATUS.VERIFIED
          ? 'All verification checks completed and verified successfully.'
          : remarks || app.verification.remarks,
      nextAction: nextAction !== undefined ? nextAction : app.verification.nextAction,
      timeline: [...(app.verification.timeline || []), timelineEvent],
    };

    app.lastUpdatedDate = new Date().toISOString();
    apps[appIndex] = app;
    storageService.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    return app.verification;
  }

  /**
   * Update overall verification status directly
   */
  async updateOverallVerification(applicationId, status, remarks = '', nextAction = null, currentUser = null) {
    await delay(250);

    const apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    const appIndex = apps.findIndex((a) => a.id === applicationId);

    if (appIndex === -1) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const app = { ...apps[appIndex] };
    if (!app.verification) {
      throw new Error(`No verification records found for application ${applicationId}.`);
    }

    const reviewerName = currentUser
      ? `${currentUser.fullName} (${currentUser.designation || 'Verification Officer'})`
      : 'Verification Officer';

    const timelineEvent = {
      id: `VTL-OVR-${Date.now()}`,
      title: `Overall Status Updated: ${status}`,
      status,
      timestamp: new Date().toISOString(),
      remarks: remarks || `Overall verification status set to ${status}.`,
      reviewer: reviewerName,
    };

    app.verification = {
      ...app.verification,
      overallStatus: status,
      remarks: remarks || app.verification.remarks,
      nextAction: nextAction !== undefined ? nextAction : app.verification.nextAction,
      lastUpdatedAt: new Date().toISOString(),
      completedAt: status === VERIFICATION_STATUS.VERIFIED ? new Date().toISOString() : null,
      timeline: [...(app.verification.timeline || []), timelineEvent],
    };

    app.lastUpdatedDate = new Date().toISOString();
    apps[appIndex] = app;
    storageService.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    return app.verification;
  }

  /**
   * Update application status with updated timeline step
   */
  async updateApplicationStatus(applicationId, newStatus, note = '') {
    await delay(200);

    const apps = storageService.getItem(STORAGE_KEYS.APPLICATIONS, MOCK_PENSION_APPLICATIONS);
    const index = apps.findIndex((a) => a.id === applicationId);

    if (index === -1) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const app = { ...apps[index] };
    app.status = newStatus;
    app.lastUpdatedDate = new Date().toISOString();

    if (app.timeline && Array.isArray(app.timeline)) {
      app.timeline = app.timeline.map((step) => {
        if (step.status === newStatus) {
          return {
            ...step,
            completed: true,
            timestamp: new Date().toISOString(),
            description: note || step.description,
          };
        }
        return step;
      });
    }

    apps[index] = app;
    storageService.setItem(STORAGE_KEYS.APPLICATIONS, apps);
    return app;
  }

  /**
   * Get payment/disbursement history
   */
  async getPaymentHistory(filter = {}) {
    await delay();
    let payments = storageService.getItem(STORAGE_KEYS.PAYMENTS, MOCK_PAYMENT_HISTORY);

    if (filter.applicationId) {
      payments = payments.filter((p) => p.applicationId === filter.applicationId);
    }
    if (filter.applicantId) {
      payments = payments.filter((p) => p.applicantId === filter.applicantId);
    }
    if (filter.status) {
      payments = payments.filter((p) => p.status === filter.status);
    }

    return payments;
  }
}

export const pensionService = new PensionService();
