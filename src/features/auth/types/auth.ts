/**
 * Authentication Types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
}

