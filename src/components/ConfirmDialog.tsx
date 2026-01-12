import { useEffect, useCallback } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 確認ダイアログコンポーネント
 * 削除や重要な操作の前に確認を求める
 * Premium glassmorphism styling applied
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // ESCキーでキャンセル
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter') {
        onConfirm();
      }
    },
    [onCancel, onConfirm]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-red-500/15 border border-red-500/30',
      buttonClass: 'btn-glass-danger',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
    warning: {
      iconBg: 'bg-yellow-500/15 border border-yellow-500/30',
      buttonClass: 'btn-glass bg-yellow-500/15 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/25 hover:border-yellow-500/40',
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      iconBg: 'bg-blue-500/15 border border-blue-500/30',
      buttonClass: 'btn-glass-primary',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[8px] animate-fade-in"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative glass-premium-elevated highlight-line rounded-[24px] p-6 max-w-sm w-full mx-4 animate-modal-in">
        <div className="flex items-start gap-4">
          {/* Icon with circular background */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${styles.iconBg}`}>
            {styles.icon}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {title}
            </h3>
            <p className="text-sm text-text-secondary">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="btn-glass btn-glass-ghost px-4 py-2 text-sm font-medium"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn-glass px-4 py-2 text-sm font-medium ${styles.buttonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
