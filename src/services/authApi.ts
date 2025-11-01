/**
 * Authentication API Service
 */

import { post } from './apiService';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '../types/auth';
import type { ApiResponse } from '../types/global';

/**
 * Login user
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await post<AuthResponse>('/login', {
    email: credentials.email,
    password: credentials.password,
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Login gagal');
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await post<AuthResponse>('/register', {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Registrasi gagal');
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await post('/auth/logout');
  } catch (error) {
    // Even if logout fails on server, clear local auth
    console.error('Logout error:', error);
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<{ token: string }> => {
  const response = await post<{ token: string }>('/auth/refresh', {
    refreshToken,
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Token refresh gagal');
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await post<User>('/auth/me');

  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || 'Gagal mendapatkan data user');
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string): Promise<void> => {
  const response = await post('/auth/verify-email', { token });

  if (!response.success) {
    throw new Error(response.message || 'Verifikasi email gagal');
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const response = await post('/auth/forgot-password', { email });

  if (!response.success) {
    throw new Error(response.message || 'Gagal mengirim email reset password');
  }
};

/**
 * Reset password
 */
export const resetPassword = async (
  token: string,
  password: string
): Promise<void> => {
  const response = await post('/auth/reset-password', { token, password });

  if (!response.success) {
    throw new Error(response.message || 'Reset password gagal');
  }
};

/**
 * Auth API object
 */
export const authApi = {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};

