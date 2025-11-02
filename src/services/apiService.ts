/**
 * API Service - Generic API calls
 */

import { axiosInstance } from './axiosInstance';
import { tokenUtils } from '../utils/authUtils';
import type { ApiResponse, RequestConfig, HttpMethod } from '../types/global';

/**
 * Generic API request function
 */
export const apiRequest = async <T = any>(
  method: HttpMethod,
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      method,
      url: endpoint,
      data,
      params: config?.params,
      headers: config?.headers,
      timeout: config?.timeout,
    });

    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || error.message || 'Terjadi kesalahan',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * GET request
 */
export const get = <T = any>(
  endpoint: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('GET', endpoint, undefined, config);
};

/**
 * POST request
 */
export const post = <T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('POST', endpoint, data, config);
};

/**
 * PUT request
 */
export const put = <T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('PUT', endpoint, data, config);
};

/**
 * PATCH request
 */
export const patch = <T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('PATCH', endpoint, data, config);
};

/**
 * DELETE request
 */
export const del = <T = any>(
  endpoint: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>('DELETE', endpoint, undefined, config);
};

/**
 * SSE Stream event types
 */
export interface SSEEvent {
  type: 'status' | 'chunk' | 'result' | 'completed' | 'error';
  message?: string;
  text?: string;
  progress?: number;
  chunk_count?: number;
  data?: any;
  success?: boolean;
  ringkasan_awal?: any;
}

/**
 * SSE Stream handler callback
 */
export interface SSEStreamHandler {
  onStatus?: (message: string, progress: number) => void;
  onChunk?: (text: string, progress: number, chunkCount?: number) => void;
  onResult?: (data: any, progress: number) => void;
  onCompleted?: (data: any, ringkasan_awal: any) => void;
  onError?: (message: string) => void;
}

/**
 * Stream POST request with SSE support
 * Uses fetch API instead of axios for SSE support
 */
export const streamPost = async (
  endpoint: string,
  data: any,
  handlers: SSEStreamHandler
): Promise<void> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  // Get token using tokenUtils (same way as axiosInstance)
  const token = tokenUtils.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    'ngrok-skip-browser-warning': 'true',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    handlers.onError?.(errorMessage);
    throw new Error(errorMessage);
  }

  if (!response.body) {
    handlers.onError?.('Response body tidak tersedia');
    throw new Error('Response body tidak tersedia');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        // Skip empty lines and comments
        if (!line.trim() || line.startsWith(':')) {
          continue;
        }

        // Parse SSE format: data: {...}
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();
          
          // Skip empty data lines
          if (!jsonStr) {
            continue;
          }

          try {
            const event: SSEEvent = JSON.parse(jsonStr);

            // Handle events based on type
            switch (event.type) {
              case 'status':
                handlers.onStatus?.(event.message || '', event.progress || 0);
                break;
              
              case 'chunk':
                handlers.onChunk?.(event.text || '', event.progress || 0, event.chunk_count);
                break;
              
              case 'result':
                handlers.onResult?.(event.data, event.progress || 0);
                break;
              
              case 'completed':
                if (event.success && event.data && event.ringkasan_awal) {
                  handlers.onCompleted?.(event.data, event.ringkasan_awal);
                } else {
                  handlers.onError?.(event.message || 'Completed dengan error');
                }
                return; // Exit after completed
                break;
              
              case 'error':
                handlers.onError?.(event.message || 'Terjadi kesalahan');
                return; // Exit on error
                break;
              
              default:
                console.warn('Unknown event type:', event.type);
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.warn('Failed to parse SSE event:', jsonStr, e);
          }
        }
      }
    }
  } catch (error: any) {
    handlers.onError?.(error.message || 'Terjadi kesalahan saat membaca stream');
    throw error;
  } finally {
    reader.releaseLock();
  }
};

/**
 * API Service object with all methods
 */
export const apiService = {
  get,
  post,
  put,
  patch,
  delete: del,
  streamPost,
};

