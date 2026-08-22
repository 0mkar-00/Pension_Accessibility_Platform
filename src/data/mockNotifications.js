/**
 * Mock Notifications Dataset
 * Contains sample notification updates answering:
 * 1. What happened? (title / type)
 * 2. What does it mean? (message)
 * 3. Do I need to do anything? (actionRequired / actionLabel / actionTarget)
 *
 * All records are fictional demo data for frontend simulation.
 */

import { NOTIFICATION_TYPES } from '../utils/constants.js';

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NOTIF-8812-01',
    applicationId: 'PEN-2026-8812',
    type: NOTIFICATION_TYPES.SUCCESS.id,
    title: 'Monthly Pension Payment Disbursed',
    message: 'Your monthly pension amount of ₹2,500 has been credited directly to your registered bank account via DBT.',
    timestamp: '2026-07-05T09:30:00Z',
    read: false,
    actionRequired: false,
    actionLabel: 'View Application Status',
    actionTarget: '/application-status',
  },
  {
    id: 'NOTIF-8812-02',
    applicationId: 'PEN-2026-8812',
    type: NOTIFICATION_TYPES.SUCCESS.id,
    title: 'Pension Sanction Approved',
    message: 'Your Old Age Pension application has been formally sanctioned and approved by the Social Welfare department.',
    timestamp: '2026-04-20T14:30:00Z',
    read: true,
    actionRequired: false,
    actionLabel: 'View Application Status',
    actionTarget: '/application-status',
  },
  {
    id: 'NOTIF-8812-03',
    applicationId: 'PEN-2026-8812',
    type: NOTIFICATION_TYPES.SUCCESS.id,
    title: 'Document Verification Cleared',
    message: 'Your age proof, identity card, income certificate, and bank passbook have all been verified and approved.',
    timestamp: '2026-03-02T17:00:00Z',
    read: true,
    actionRequired: false,
    actionLabel: 'View Documents',
    actionTarget: '/documents',
  },
  {
    id: 'NOTIF-9401-01',
    applicationId: 'PEN-2026-9401',
    type: NOTIFICATION_TYPES.ACTION_REQUIRED.id,
    title: 'Action Needed: Re-upload Income Certificate',
    message: 'Your uploaded income certificate was unclear and unreadable. Please upload a clear photo or scanned copy to continue verification.',
    timestamp: '2026-07-28T15:30:00Z',
    read: false,
    actionRequired: true,
    actionLabel: 'Fix Now',
    actionTarget: '/documents',
  },
  {
    id: 'NOTIF-9401-02',
    applicationId: 'PEN-2026-9401',
    type: NOTIFICATION_TYPES.SUCCESS.id,
    title: 'Age Proof & Identity Verified',
    message: 'Your age proof and identity documents have been scrutinized and approved by the verification officer.',
    timestamp: '2026-07-28T14:35:00Z',
    read: false,
    actionRequired: false,
    actionLabel: 'View Documents',
    actionTarget: '/documents',
  },
  {
    id: 'NOTIF-9401-03',
    applicationId: 'PEN-2026-9401',
    type: NOTIFICATION_TYPES.INFO.id,
    title: 'Widow Pension Application Submitted',
    message: 'Your Widow Pension application has been received and queued for document scrutiny.',
    timestamp: '2026-07-10T09:30:00Z',
    read: true,
    actionRequired: false,
    actionLabel: 'Track Status',
    actionTarget: '/application-status',
  },
  {
    id: 'NOTIF-4190-01',
    applicationId: 'PEN-2026-4190',
    type: NOTIFICATION_TYPES.INFO.id,
    title: 'Disability Pension Application Received',
    message: 'Your application and scheme documents have been submitted and are currently in the verification queue.',
    timestamp: '2026-08-01T14:30:00Z',
    read: false,
    actionRequired: false,
    actionLabel: 'Track Status',
    actionTarget: '/application-status',
  },
];
