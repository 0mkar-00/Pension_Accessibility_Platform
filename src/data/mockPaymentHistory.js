/**
 * Mock Payment History Dataset
 * Contains sample DBT (Direct Benefit Transfer) pension payouts and status logs.
 * All records are fictional and intended for frontend logic simulation.
 */

import { PAYMENT_STATUS } from '../utils/constants.js';

export const MOCK_PAYMENT_HISTORY = [
  {
    id: 'TXN-DEMO-202607-001',
    applicationId: 'PEN-2026-8812',
    applicantId: 'USR-DEMO-001',
    pensionerName: 'Ramachandra Murthy',
    periodMonth: 'July 2026',
    disbursalDate: '2026-07-05T08:30:00Z',
    amount: 2500,
    status: PAYMENT_STATUS.SUCCESS,
    paymentMode: 'Direct Benefit Transfer (DBT)',
    referenceNumber: 'UTR-DEMO-9823412091',
    bankName: 'National Demo Bank',
    accountMasked: '•••• •••• 9876',
    remarks: 'Monthly Old Age Pension credited successfully.',
  },
  {
    id: 'TXN-DEMO-202606-002',
    applicationId: 'PEN-2026-8812',
    applicantId: 'USR-DEMO-001',
    pensionerName: 'Ramachandra Murthy',
    periodMonth: 'June 2026',
    disbursalDate: '2026-06-05T09:15:00Z',
    amount: 2500,
    status: PAYMENT_STATUS.SUCCESS,
    paymentMode: 'Direct Benefit Transfer (DBT)',
    referenceNumber: 'UTR-DEMO-8712391823',
    bankName: 'National Demo Bank',
    accountMasked: '•••• •••• 9876',
    remarks: 'Monthly Old Age Pension credited successfully.',
  },
  {
    id: 'TXN-DEMO-202605-003',
    applicationId: 'PEN-2026-8812',
    applicantId: 'USR-DEMO-001',
    pensionerName: 'Ramachandra Murthy',
    periodMonth: 'May 2026',
    disbursalDate: '2026-05-05T09:00:00Z',
    amount: 2500,
    status: PAYMENT_STATUS.SUCCESS,
    paymentMode: 'Direct Benefit Transfer (DBT)',
    referenceNumber: 'UTR-DEMO-7612098432',
    bankName: 'National Demo Bank',
    accountMasked: '•••• •••• 9876',
    remarks: 'Initial Pension Disbursal credited successfully.',
  },
  {
    id: 'TXN-DEMO-202608-004',
    applicationId: 'PEN-2026-8812',
    applicantId: 'USR-DEMO-001',
    pensionerName: 'Ramachandra Murthy',
    periodMonth: 'August 2026',
    disbursalDate: '2026-08-05T09:00:00Z',
    amount: 2500,
    status: PAYMENT_STATUS.PROCESSING,
    paymentMode: 'Direct Benefit Transfer (DBT)',
    referenceNumber: 'UTR-DEMO-PENDING-001',
    bankName: 'National Demo Bank',
    accountMasked: '•••• •••• 9876',
    remarks: 'Disbursal file submitted to bank clearing house.',
  },
];
