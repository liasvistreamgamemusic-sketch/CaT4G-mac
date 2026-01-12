/**
 * SectionSettingsPanel - セクション固有の設定を行うポップオーバーパネル
 *
 * Features:
 * - カポ（capoOverride）: ドロップダウン（0〜12）
 * - BPM（bpmOverride）: 数値入力 40〜240
 * - カポ変更時にコード移調確認ダイアログ
 */

import { useCallback, useState, useEffect } from 'react';
import { X, RotateCcw, Timer, Guitar } from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

// ============================================
// Types
// ============================================

export interface SectionSettingsPanelProps {
  /** セクション固有のカポ値（nullで曲の設定を使用） */
  capoOverride: number | null;
  /** セクション固有のBPM（nullで曲の設定を使用） */
  bpmOverride: number | null;
  /** 曲のBPM（参考表示用） */
  songBpm: number | null;
  /** 曲のカポ（参考表示用） */
  songCapo: number;
  /** 繰り返し回数 */
  repeatCount: number;
  /** カポ変更コールバック */
  onCapoChange: (value: number | null, transposeChords: boolean) => void;
  /** BPM変更コールバック */
  onBpmChange: (value: number | null) => void;
  /** 繰り返し回数変更コールバック */
  onRepeatCountChange: (value: number) => void;
  /** パネルを閉じるコールバック */
  onClose: () => void;
}

// ============================================
// Sub-components
// ============================================

/**
 * CapoDropdown - カポドロップダウンコンポーネント
 */
interface CapoDropdownProps {
  value: number | null;
  songCapo: number;
  onChange: (value: number | null, transposeChords: boolean) => void;
}

function CapoDropdown({ value, songCapo, onChange }: CapoDropdownProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCapoValue, setPendingCapoValue] = useState<number | null>(null);
  const [oldCapoValue, setOldCapoValue] = useState<number>(0);

  const handleCapoSelect = useCallback((newValue: number | null) => {
    const oldValue = value ?? songCapo;
    const newEffectiveValue = newValue ?? songCapo;

    // カポ値が変わった場合は確認ダイアログを表示
    if (oldValue !== newEffectiveValue) {
      setOldCapoValue(oldValue);
      setPendingCapoValue(newValue);
      setShowConfirmDialog(true);
    }
  }, [value, songCapo]);

  const handleConfirmTranspose = useCallback((transposeChords: boolean) => {
    onChange(pendingCapoValue, transposeChords);
    setShowConfirmDialog(false);
    setPendingCapoValue(null);
  }, [pendingCapoValue, onChange]);

  const handleReset = useCallback(() => {
    if (value !== null) {
      setOldCapoValue(value);
      setPendingCapoValue(null);
      setShowConfirmDialog(true);
    }
  }, [value]);

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-secondary">
            <Guitar className="w-4 h-4" />
            <span className="text-xs font-medium">カポ</span>
          </div>
          {value !== null && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-text-muted hover:text-text-secondary hover:bg-[var(--btn-glass-hover)] rounded transition-colors"
              title="リセット"
            >
              <RotateCcw className="w-3 h-3" />
              リセット
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={value === null ? 'inherit' : value}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'inherit') {
                handleCapoSelect(null);
              } else {
                handleCapoSelect(parseInt(val, 10));
              }
            }}
            className="flex-1 px-3 py-2 bg-background border border-[var(--glass-premium-border)] rounded-lg
                       text-center font-mono text-sm text-text-primary
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                       transition-all duration-200 cursor-pointer"
          >
            <option value="inherit">曲の設定を使用 ({songCapo})</option>
            {[...Array(13)].map((_, i) => (
              <option key={i} value={i}>
                {i === 0 ? 'カポなし (0)' : `${i}フレット`}
              </option>
            ))}
          </select>
        </div>

        {/* 現在の状態表示 */}
        <p className="text-[10px] text-text-muted">
          {value === null ? (
            <>曲のカポを使用</>
          ) : (
            <>このセクションのカポ: {value}フレット</>
          )}
        </p>
      </div>

      {/* 確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--backdrop-bg)] backdrop-blur-sm">
          <div className="bg-background-surface border border-border rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              コードを移調しますか？
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              カポを {oldCapoValue} → {pendingCapoValue ?? songCapo} に変更します。
            </p>
            <p className="text-sm text-text-secondary mb-6">
              このセクションのコードを移調しますか？
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleConfirmTranspose(true)}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
              >
                移調する
              </button>
              <button
                type="button"
                onClick={() => handleConfirmTranspose(false)}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors"
              >
                移調しない（カポ位置のみ変更）
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingCapoValue(null);
                }}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-secondary transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * BpmInput - BPM入力コンポーネント
 */
interface BpmInputProps {
  value: number | null;
  songBpm: number | null;
  onChange: (value: number | null) => void;
}

function BpmInput({ value, songBpm, onChange }: BpmInputProps) {
  const [inputValue, setInputValue] = useState<string>(value?.toString() ?? '');

  // valueプロップが変更されたら入力も更新
  useEffect(() => {
    setInputValue(value?.toString() ?? '');
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // 数字のみ許可（空文字も許可）
    if (val === '' || /^\d*$/.test(val)) {
      setInputValue(val);
    }
  }, []);

  const handleBlur = useCallback(() => {
    if (inputValue === '') {
      onChange(null);
    } else {
      const parsed = parseInt(inputValue, 10);
      if (!isNaN(parsed)) {
        // 40〜240の範囲に制限
        const clamped = Math.max(40, Math.min(240, parsed));
        setInputValue(clamped.toString());
        onChange(clamped);
      }
    }
  }, [inputValue, onChange]);

  const handleReset = useCallback(() => {
    setInputValue('');
    onChange(null);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <Timer className="w-4 h-4" />
          <span className="text-xs font-medium">BPM</span>
        </div>
        {value !== null && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-text-muted hover:text-text-secondary hover:bg-[var(--btn-glass-hover)] rounded transition-colors"
            title="リセット"
          >
            <RotateCcw className="w-3 h-3" />
            リセット
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={songBpm?.toString() ?? '120'}
          className="flex-1 px-3 py-2 bg-background border border-[var(--glass-premium-border)] rounded-lg
                     text-center font-mono text-sm text-text-primary
                     placeholder:text-text-muted/50
                     focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                     transition-all duration-200"
        />
      </div>

      {/* Helper text */}
      <p className="text-[10px] text-text-muted">
        {value === null ? (
          <>
            曲のBPMを使用
            {songBpm !== null && (
              <span className="ml-1 text-text-secondary">({songBpm})</span>
            )}
          </>
        ) : (
          '40〜240の範囲'
        )}
      </p>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

/**
 * SectionSettingsPanel
 * セクション固有の設定（カポ、BPM）を行うポップオーバーパネル
 */
export function SectionSettingsPanel({
  capoOverride,
  bpmOverride,
  songBpm,
  songCapo,
  repeatCount,
  onCapoChange,
  onBpmChange,
  onRepeatCountChange,
  onClose,
}: SectionSettingsPanelProps) {
  return (
    <div className="w-72 bg-background-surface border border-[var(--glass-premium-border)] rounded-xl shadow-xl overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-premium-border)]">
        <h3 className="text-sm font-medium text-text-primary">セクション設定</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[var(--btn-glass-hover)] transition-colors"
          title="閉じる"
        >
          <X className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-5">
        {/* 繰り返し回数 */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary">
            繰り返し回数
          </label>
          <NumberStepper
            value={repeatCount}
            onChange={onRepeatCountChange}
            min={1}
            max={10}
            suffix="回"
          />
        </div>

        {/* 区切り線 */}
        <div className="border-t border-[var(--glass-premium-border)]" />

        {/* カポ設定 */}
        <CapoDropdown
          value={capoOverride}
          songCapo={songCapo}
          onChange={onCapoChange}
        />

        {/* 区切り線 */}
        <div className="border-t border-[var(--glass-premium-border)]" />

        {/* BPM設定 */}
        <BpmInput
          value={bpmOverride}
          songBpm={songBpm}
          onChange={onBpmChange}
        />
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-[var(--glass-premium-border)] bg-background/50">
        <p className="text-[10px] text-text-muted text-center">
          各設定をリセットすると曲全体の設定が適用されます
        </p>
      </div>
    </div>
  );
}

export default SectionSettingsPanel;
