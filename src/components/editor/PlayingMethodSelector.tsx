import type { PlayingMethod } from '@/types/database';

interface PlayingMethodSelectorProps {
  value?: PlayingMethod;
  onChange?: (method: PlayingMethod) => void;
  disabled?: boolean;
}

/**
 * PlayingMethodSelector
 * コードの演奏方法（ストローク/アルペジオ）を切り替えるセレクター
 * Based on the toggle button pattern from ControlBar.tsx
 */
export function PlayingMethodSelector({
  value,
  onChange,
  disabled = false,
}: PlayingMethodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-secondary">演奏</span>
      <div className="flex items-center rounded-lg overflow-hidden border border-border">
        <button
          type="button"
          className={`px-2 py-1 text-xs transition-colors ${
            value === 'stroke'
              ? 'bg-accent-primary text-white'
              : 'bg-background-surface hover:bg-background-surface/80 text-text-secondary'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => onChange?.('stroke')}
          disabled={disabled}
          title="ストローク奏法"
        >
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Down-up arrow icon for stroke */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            ストローク
          </span>
        </button>
        <button
          type="button"
          className={`px-2 py-1 text-xs transition-colors ${
            value === 'arpeggio'
              ? 'bg-accent-primary text-white'
              : 'bg-background-surface hover:bg-background-surface/80 text-text-secondary'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => onChange?.('arpeggio')}
          disabled={disabled}
          title="アルペジオ奏法"
        >
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Wave icon for arpeggio */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            アルペジオ
          </span>
        </button>
      </div>
    </div>
  );
}
