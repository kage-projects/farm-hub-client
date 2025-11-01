/**
 * useAuthInitializer Hook
 * Initialize auth state from storage on app load
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { tokenUtils, userUtils, isAuthenticated } from '../utils/authUtils';

export const useAuthInitializer = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);

  useEffect(() => {
    // Initialize auth state from storage
    if (isAuthenticated()) {
      const token = tokenUtils.getToken();
      const refreshToken = tokenUtils.getRefreshToken();
      const user = userUtils.getUser();

      if (token) {
        setToken(token);
      }

      if (refreshToken) {
        setRefreshToken(refreshToken);
      }

      if (user) {
        setUser(user);
      }
    }
  }, [setUser, setToken, setRefreshToken]);
};

