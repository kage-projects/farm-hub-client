/**
 * Axios Instance Configuration
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { tokenUtils, clearAuthData, rememberMeUtils } from '../utils/authUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Create axios instance
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor - Add auth token
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors and token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = tokenUtils.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data.data || response.data;
          if (token) {
            tokenUtils.setToken(token, rememberMeUtils.getRememberMe());
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          clearAuthData();
          // window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear auth and redirect to login
        clearAuthData();
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


