/**
 * useAuthInitializer Hook
 * Initialize auth state from storage on app load
 * Sync isAuthenticated with token and user state
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { tokenUtils, userUtils } from '../utils/authUtils';

export const useAuthInitializer = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const store = useAuthStore();

  useEffect(() => {
    // Zustand persist already loads state from localStorage
    // But we need to sync with actual localStorage values to ensure consistency
    const token = tokenUtils.getToken();
    const refreshToken = tokenUtils.getRefreshToken();
    const user = userUtils.getUser();

    // If there's a mismatch, sync from localStorage
    // This handles cases where localStorage was modified externally
    if (token && token !== store.token) {
      setToken(token);
    }

    if (refreshToken && refreshToken !== store.refreshToken) {
      setRefreshToken(refreshToken);
    }

    if (user && user !== store.user) {
      setUser(user);
    }

    // If no token/user in localStorage but store has them, clear store
    if (!token && store.token) {
      setToken(null);
    }

    if (!user && store.user) {
      setUser(null);
    }
  }, []); // Only run once on mount
};

