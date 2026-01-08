import { useEffect } from 'react';
import { CheckIcon, AlertIcon, InfoIcon, CloseIcon } from './icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const ICON_MAP = {
  success: CheckIcon,
  error: AlertIcon,
  info: InfoIcon,
  warning: AlertIcon,
};

const COLOR_MAP = {
  success: 'bg-accent-green/20 border-accent-green/50 text-accent-green',
  error: 'bg-accent-red/20 border-accent-red/50 text-accent-red',
  info: 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue',
  warning: 'bg-accent-yellow/20 border-accent-yellow/50 text-accent-yellow',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, type, message, duration = 3000 } = toast;
  const Icon = ICON_MAP[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        border rounded-lg shadow-lg
        animate-slide-in
        ${COLOR_MAP[type]}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium text-text-primary">
        {message}
      </span>
      <button
        onClick={() => onDismiss(id)}
        className="p-1 rounded hover:bg-white/10 transition-colors"
      >
        <CloseIcon className="w-4 h-4 text-text-muted" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
