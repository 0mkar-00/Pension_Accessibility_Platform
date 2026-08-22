/**
 * Mock Users Dataset
 * Strictly fictional demo users representing the primary platform personas.
 * No real personal or sensitive information is used.
 */

import { USER_ROLES, HELPER_PERMISSIONS } from '../utils/constants.js';

export const MOCK_USERS = [
  {
    id: 'USR-DEMO-001',
    fullName: 'Ramachandra Murthy',
    role: USER_ROLES.PENSIONER,
    dateOfBirth: '1958-04-14',
    age: 68,
    gender: 'Male',
    phoneNumber: '9876543210',
    demoIdNumber: '999988881234',
    address: {
      line1: 'House No. 42, Shanti Nagar, 2nd Cross',
      district: 'Mysuru',
      state: 'Karnataka',
      pincode: '570001',
    },
    bankDetails: {
      accountHolderName: 'Ramachandra Murthy',
      bankName: 'National Demo Bank',
      accountNumber: '98765432109876',
      ifscCode: 'DEMO0001234',
      branch: 'Main City Branch',
    },
    trustedHelpers: [
      {
        helperId: 'USR-DEMO-002',
        helperName: 'Priya Murthy',
        relationship: 'Daughter',
        phoneNumber: '9876543211',
        permission: HELPER_PERMISSIONS.FULL_MANAGEMENT.id,
        isVerified: true,
        assignedDate: '2026-01-10',
      },
    ],
  },
  {
    id: 'USR-DEMO-002',
    fullName: 'Priya Murthy',
    role: USER_ROLES.TRUSTED_HELPER,
    relationship: 'Daughter / Primary Caregiver',
    phoneNumber: '9876543211',
    demoIdNumber: '888877774321',
    address: {
      line1: 'Apartment 3B, Sunshine Residency',
      district: 'Mysuru',
      state: 'Karnataka',
      pincode: '570002',
    },
    delegatedPensioners: [
      {
        pensionerId: 'USR-DEMO-001',
        pensionerName: 'Ramachandra Murthy',
        applicationId: 'PEN-2026-8812',
        permissionLevel: HELPER_PERMISSIONS.FULL_MANAGEMENT.id,
      },
    ],
  },
  {
    id: 'USR-DEMO-003',
    fullName: 'Anand Kumar',
    role: USER_ROLES.OFFICER,
    designation: 'Senior Pension Verification Officer',
    department: 'Social Security Welfare Department',
    officeLocation: 'Mysuru District Administrative Complex',
    phoneNumber: '9876543212',
    demoIdNumber: '777766665555',
  },
];

export const DEFAULT_CURRENT_USER = MOCK_USERS[0];
