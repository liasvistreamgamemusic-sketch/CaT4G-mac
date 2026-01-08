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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-surface rounded-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            新規プレイリスト
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label
              htmlFor="playlist-name"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              プレイリスト名 <span className="text-red-500">*</span>
            </label>
            <input
              id="playlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="プレイリスト名を入力"
              className="w-full px-3 py-2 bg-background-primary rounded border border-border focus:border-accent-primary focus:outline-none text-text-primary placeholder-text-secondary/50"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="playlist-description"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              説明
            </label>
            <textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明を入力（任意）"
              rows={3}
              className="w-full px-3 py-2 bg-background-primary rounded border border-border focus:border-accent-primary focus:outline-none text-text-primary placeholder-text-secondary/50 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-background-surface hover:bg-border rounded text-text-primary transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/80 rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
}
