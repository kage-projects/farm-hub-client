import { toaster } from '../ui/toaster';

/**
 * Toast options
 */
export interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
}

/**
 * Toast utility wrapper around Chakra's toaster
 * - Pre-configured with brand defaults
 * - Supports all status types
 * - Auto-dismiss or persistent
 */
export const toast = {
  /**
   * Show a success toast
   */
  success: (options: Omit<ToastOptions, 'type'>) => {
    toaster.create({
      ...options,
      type: 'success',
      duration: options.duration ?? 5000,
    });
  },

  /**
   * Show an error toast
   */
  error: (options: Omit<ToastOptions, 'type'>) => {
    toaster.create({
      ...options,
      type: 'error',
      duration: options.duration ?? 7000,
    });
  },

  /**
   * Show a warning toast
   */
  warning: (options: Omit<ToastOptions, 'type'>) => {
    toaster.create({
      ...options,
      type: 'warning',
      duration: options.duration ?? 6000,
    });
  },

  /**
   * Show an info toast
   */
  info: (options: Omit<ToastOptions, 'type'>) => {
    toaster.create({
      ...options,
      type: 'info',
      duration: options.duration ?? 5000,
    });
  },

  /**
   * Show a loading toast
   */
  loading: (options: Omit<ToastOptions, 'type'>) => {
    toaster.create({
      ...options,
      type: 'loading',
      duration: options.duration ?? null,
    });
  },

  /**
   * Dismiss a specific toast or all toasts
   */
  dismiss: (id?: string) => {
    if (id) {
      toaster.dismiss(id);
    } else {
      toaster.dismissAll();
    }
  },
};

