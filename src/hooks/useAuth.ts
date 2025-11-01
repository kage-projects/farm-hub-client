/**
 * useAuth Hook
 * Provides easy access to auth store
 */

import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, RegisterData } from '../features/auth/types/auth';

export const useAuth = () => {
  const store = useAuthStore();

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    login: async (credentials: LoginCredentials) => {
      try {
        await store.login(credentials);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Login gagal' };
      }
    },

    register: async (data: RegisterData) => {
      try {
        await store.register(data);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Registrasi gagal' };
      }
    },

    logout: () => {
      store.logout();
    },

    clearError: () => {
      store.clearError();
    },
  };
};

