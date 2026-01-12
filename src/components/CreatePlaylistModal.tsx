import { useState, useEffect } from 'react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
}

export function CreatePlaylistModal({
  isOpen,
  onClose,
  onSave,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), description.trim() || undefined);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-premium-elevated highlight-line rounded-[24px] max-w-md w-full mx-4 animate-modal-in">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            新規プレイリスト
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="btn-glass btn-glass-icon"
            aria-label="閉じる"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <hr className="divider-premium" />

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label
              htmlFor="playlist-name"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              プレイリスト名 <span className="text-red-400">*</span>
            </label>
            <input
              id="playlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="プレイリスト名を入力"
              className="input-glass"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="playlist-description"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              説明
            </label>
            <textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明を入力（任意）"
              rows={3}
              className="input-glass resize-none"
            />
          </div>
        </div>

        <hr className="divider-premium" />

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="btn-glass btn-glass-ghost"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="btn-glass btn-glass-primary"
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
}
