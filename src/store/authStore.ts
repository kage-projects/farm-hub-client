/**
 * Authentication Store using Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  AuthStore, 
  User, 
  LoginCredentials, 
  RegisterData 
} from '../features/auth/types/auth';
import { 
  tokenUtils, 
  userUtils, 
  rememberMeUtils,
  clearAuthData,
} from '../utils/authUtils';
import { authApi } from '../features/auth/services/authApi';

/**
 * Auth Store
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.login(credentials);

          // Store tokens and user
          const rememberMe = credentials.rememberMe || false;
          tokenUtils.setToken(response.token, rememberMe);
          if (response.refreshToken) {
            tokenUtils.setRefreshToken(response.refreshToken, rememberMe);
          }
          userUtils.setUser(response.user, rememberMe);
          rememberMeUtils.setRememberMe(rememberMe);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Login gagal';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.register(data);

          // Store tokens and user
          const rememberMe = data.agreeTerms || false;
          tokenUtils.setToken(response.token, rememberMe);
          if (response.refreshToken) {
            tokenUtils.setRefreshToken(response.refreshToken, rememberMe);
          }
          userUtils.setUser(response.user, rememberMe);
          rememberMeUtils.setRememberMe(rememberMe);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Registrasi gagal';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear all auth data
          clearAuthData();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      refreshAuth: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await authApi.refreshToken(refreshToken);
          const rememberMe = rememberMeUtils.getRememberMe();
          
          tokenUtils.setToken(response.token, rememberMe);

          set({
            token: response.token,
          });
        } catch (error: any) {
          // Refresh failed, logout
          get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          const rememberMe = rememberMeUtils.getRememberMe();
          userUtils.setUser(user, rememberMe);
        } else {
          userUtils.removeUser();
        }
      },

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
        if (token) {
          const rememberMe = rememberMeUtils.getRememberMe();
          tokenUtils.setToken(token, rememberMe);
        } else {
          tokenUtils.removeToken();
        }
      },

      setRefreshToken: (refreshToken: string | null) => {
        set({ refreshToken });
        if (refreshToken) {
          const rememberMe = rememberMeUtils.getRememberMe();
          tokenUtils.setRefreshToken(refreshToken, rememberMe);
        } else {
          tokenUtils.removeRefreshToken();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

