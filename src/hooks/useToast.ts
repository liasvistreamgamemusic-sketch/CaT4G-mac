import { useState, useCallback } from 'react';
import type { ToastData, ToastType } from '@/components/Toast';

let toastIdCounter = 0;

export interface UseToastReturn {
  toasts: ToastData[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = `toast-${++toastIdCounter}`;
      const newToast: ToastData = { id, type, message, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return { toasts, showToast, dismissToast, clearToasts };
}
