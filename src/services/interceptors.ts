/**
 * Axios Interceptors
 * Separated for better organization
 */

import { axiosInstance } from './axiosInstance';
import { tokenUtils, clearAuthData, rememberMeUtils } from '../utils/authUtils';
import type { InternalAxiosRequestConfig } from 'axios';

/**
 * Setup request interceptor
 */
export const setupRequestInterceptor = () => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenUtils.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

/**
 * Setup response interceptor
 */
export const setupResponseInterceptor = () => {
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh token
        const refreshToken = tokenUtils.getRefreshToken();
        if (refreshToken) {
          try {
            const response: any = await axiosInstance.post('/auth/refresh', {
              refreshToken,
            });

            const { token } = (response.data?.data || response.data) as { token: string };
            if (token) {
              const rememberMe = rememberMeUtils.getRememberMe();
              tokenUtils.setToken(token, rememberMe);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            clearAuthData();
            if (typeof window !== 'undefined') {
            //   window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token, clear auth and redirect to login
          clearAuthData();
          if (typeof window !== 'undefined') {
            // window.location.href = '/login';
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Initialize interceptors
 */
export const initializeInterceptors = () => {
  setupRequestInterceptor();
  setupResponseInterceptor();
};

