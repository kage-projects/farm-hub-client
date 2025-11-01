/**
 * Authentication Utilities
 */

import type { User } from '../features/auth/types/auth';

const TOKEN_KEY = 'farmhub_token';
const REFRESH_TOKEN_KEY = 'farmhub_refresh_token';
const USER_KEY = 'farmhub_user';
const REMEMBER_ME_KEY = 'farmhub_remember_me';

/**
 * Token Management
 */
export const tokenUtils = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string, rememberMe: boolean = false): void => {
    if (typeof window === 'undefined') return;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (refreshToken: string, rememberMe: boolean = false): void => {
    if (typeof window === 'undefined') return;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  removeRefreshToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

/**
 * User Management
 */
export const userUtils = {
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setUser: (user: User, rememberMe: boolean = false): void => {
    if (typeof window === 'undefined') return;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};

/**
 * Remember Me Management
 */
export const rememberMeUtils = {
  getRememberMe: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  },

  setRememberMe: (rememberMe: boolean): void => {
    if (typeof window === 'undefined') return;
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  },
};

/**
 * Clear all auth data
 */
export const clearAuthData = (): void => {
  tokenUtils.removeToken();
  tokenUtils.removeRefreshToken();
  userUtils.removeUser();
  rememberMeUtils.setRememberMe(false);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return tokenUtils.getToken() !== null && userUtils.getUser() !== null;
};

/**
 * Get auth headers
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = tokenUtils.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

