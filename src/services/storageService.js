/**
 * Storage Service
 * Provides robust localStorage wrapper with fallback in-memory store for SSR/private browsing.
 */

class StorageService {
  constructor() {
    this.memoryStore = new Map();
    this.isLocalStorageAvailable = this.checkLocalStorage();
  }

  checkLocalStorage() {
    try {
      const testKey = '__pension_app_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      if (this.isLocalStorageAvailable) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return this.memoryStore.has(key) ? this.memoryStore.get(key) : defaultValue;
    } catch (error) {
      console.warn(`StorageService: Error reading key "${key}"`, error);
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (this.isLocalStorageAvailable) {
        window.localStorage.setItem(key, serialized);
      }
      this.memoryStore.set(key, value);
      return true;
    } catch (error) {
      console.warn(`StorageService: Error saving key "${key}"`, error);
      this.memoryStore.set(key, value);
      return false;
    }
  }

  removeItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
      return true;
    } catch (error) {
      console.warn(`StorageService: Error removing key "${key}"`, error);
      return false;
    }
  }

  clear() {
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.clear();
      }
      this.memoryStore.clear();
      return true;
    } catch (error) {
      console.warn('StorageService: Error clearing storage', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
