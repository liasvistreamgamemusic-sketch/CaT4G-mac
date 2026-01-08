import { useState, useEffect } from 'react';
import { CloseIcon, VolumeIcon, VolumeMuteIcon } from './icons';
import type { AppSettings } from '@/types/database';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultBpm: 120,
  defaultScrollSpeed: 1.0,
  metronomeVolume: 0.7,
  metronomeSound: 'click',
};

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-background-elevated border border-white/10 rounded-2xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-text-primary">設定</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Default BPM */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              デフォルトBPM
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="40"
                max="240"
                value={localSettings.defaultBpm}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultBpm: Number(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-background-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="w-12 text-right text-text-primary font-mono">
                {localSettings.defaultBpm}
              </span>
            </div>
          </div>

          {/* Default Scroll Speed */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              デフォルトスクロール速度
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={localSettings.defaultScrollSpeed}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultScrollSpeed: Number(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-background-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="w-12 text-right text-text-primary font-mono">
                {localSettings.defaultScrollSpeed.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Metronome Volume */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              メトロノーム音量
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    metronomeVolume: localSettings.metronomeVolume > 0 ? 0 : 0.7,
                  })
                }
                className="p-2 rounded-lg hover:bg-background-hover text-text-muted hover:text-text-primary transition-colors"
              >
                {localSettings.metronomeVolume > 0 ? (
                  <VolumeIcon className="w-5 h-5" />
                ) : (
                  <VolumeMuteIcon className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.metronomeVolume}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    metronomeVolume: Number(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-background-surface rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="w-12 text-right text-text-primary font-mono">
                {Math.round(localSettings.metronomeVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Metronome Sound */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              メトロノーム音
            </label>
            <div className="flex gap-2">
              {(['click', 'beep', 'wood'] as const).map((sound) => (
                <button
                  key={sound}
                  onClick={() =>
                    setLocalSettings({ ...localSettings, metronomeSound: sound })
                  }
                  className={`
                    flex-1 py-2 px-4 rounded-lg font-medium transition-all
                    ${
                      localSettings.metronomeSound === sound
                        ? 'bg-primary text-white'
                        : 'bg-background-surface text-text-secondary hover:bg-background-hover'
                    }
                  `}
                >
                  {sound === 'click' && 'クリック'}
                  {sound === 'beep' && 'ビープ'}
                  {sound === 'wood' && 'ウッド'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={() => setLocalSettings(DEFAULT_SETTINGS)}
            className="px-4 py-2 rounded-lg text-text-secondary hover:bg-background-hover transition-colors"
          >
            リセット
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-background-surface text-text-primary hover:bg-background-hover transition-colors"
          >
            キャンセル
          </button>
          <button onClick={handleSave} className="btn-primary">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
