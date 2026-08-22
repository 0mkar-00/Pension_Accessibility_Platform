/**
 * Auth Provider
 * Manages user session, role-based states, and trusted helper permissions.
 */

import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.js';
import { authService } from '../services/authService.js';
import { USER_ROLES } from '../utils/constants.js';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const [user, users] = await Promise.all([
          authService.getCurrentUser(),
          authService.getAvailableUsers(),
        ]);
        if (isMounted) {
          setCurrentUser(user);
          setAvailableUsers(users);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('AuthProvider: Failed to initialize auth session', err);
          setError('Failed to load user session.');
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (userId) => {
    try {
      setIsLoading(true);
      const user = await authService.login(userId);
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Logout failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (userId) => {
    return login(userId);
  };

  const hasPermission = (requiredPermissionId) => {
    return authService.checkHelperPermission(currentUser, requiredPermissionId);
  };

  const value = {
    currentUser,
    availableUsers,
    isLoading,
    error,
    isAuthenticated: Boolean(currentUser),
    role: currentUser?.role || null,
    isPensioner: currentUser?.role === USER_ROLES.PENSIONER,
    isHelper: currentUser?.role === USER_ROLES.TRUSTED_HELPER,
    isOfficer: currentUser?.role === USER_ROLES.OFFICER,
    login,
    logout,
    switchUser,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
