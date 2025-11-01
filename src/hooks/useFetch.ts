/**
 * useFetch Hook
 * Custom hook for API calls with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse } from '../types/global';

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export const useFetch = <T = any>(
  fetchFn: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const { immediate = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchFn(...args);

        if (response.success && response.data) {
          setData(response.data);
          onSuccess?.(response.data);
        } else {
          const errorMessage = response.message || 'Terjadi kesalahan';
          setError(errorMessage);
          onError?.(errorMessage);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Terjadi kesalahan';
        setError(errorMessage);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

