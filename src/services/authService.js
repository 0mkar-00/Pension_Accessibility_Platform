/**
 * Authentication Service
 * Manages user sessions, role identification, and trusted helper permissions.
 * Simulates async API responses using mock datasets.
 */

import { storageService } from './storageService.js';
import { MOCK_USERS, DEFAULT_CURRENT_USER } from '../data/mockUsers.js';
import { STORAGE_KEYS, USER_ROLES, HELPER_PERMISSIONS } from '../utils/constants.js';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
  constructor() {
    this.initSession();
  }

  initSession() {
    const savedUser = storageService.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!savedUser) {
      storageService.setItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_CURRENT_USER);
    }
  }

  async getCurrentUser() {
    await delay();
    return storageService.getItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_CURRENT_USER);
  }

  async getAvailableUsers() {
    await delay();
    return MOCK_USERS;
  }

  async login(userId) {
    await delay();
    const matchedUser = MOCK_USERS.find((u) => u.id === userId);
    if (!matchedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    storageService.setItem(STORAGE_KEYS.CURRENT_USER, matchedUser);
    return matchedUser;
  }

  async logout() {
    await delay();
    storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
    return true;
  }

  async switchPersona(userId) {
    return this.login(userId);
  }

  checkHelperPermission(user, requiredPermissionId) {
    if (!user) return false;
    if (user.role === USER_ROLES.PENSIONER || user.role === USER_ROLES.OFFICER) {
      return true;
    }

    if (user.role === USER_ROLES.TRUSTED_HELPER) {
      if (requiredPermissionId === HELPER_PERMISSIONS.VIEW_ONLY.id) {
        return true;
      }
      if (requiredPermissionId === HELPER_PERMISSIONS.ASSIST_APPLY.id) {
        return user.delegatedPensioners?.some(
          (d) =>
            d.permissionLevel === HELPER_PERMISSIONS.ASSIST_APPLY.id ||
            d.permissionLevel === HELPER_PERMISSIONS.FULL_MANAGEMENT.id
        );
      }
      if (requiredPermissionId === HELPER_PERMISSIONS.FULL_MANAGEMENT.id) {
        return user.delegatedPensioners?.some(
          (d) => d.permissionLevel === HELPER_PERMISSIONS.FULL_MANAGEMENT.id
        );
      }
    }

    return false;
  }
}

export const authService = new AuthService();
