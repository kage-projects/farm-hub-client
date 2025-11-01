/**
 * API Service - Generic API calls
 */

import { axiosInstance } from './axiosInstance';
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
 * API Service object with all methods
 */
export const apiService = {
  get,
  post,
  put,
  patch,
  delete: del,
};

