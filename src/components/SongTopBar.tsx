/**
 * SongTopBar - 演奏画面のトップバー
 * 曲のメタデータバッジと編集ボタンを表示
 *
 * Features:
 * - 曲タイトル・アーティスト表示
 * - メタデータバッジ（Capo, BPM, 拍子, 再生速度）
 * - 編集モード切り替えボタン
 * - ビューモード切り替え
 */

import { useCallback } from 'react';
import {
  Edit3,
  Check,
  LayoutList,
  Layout,
  LayoutGrid,
  ExternalLink,
  Undo2,
  Redo2,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/hooks';
import type { SongWithDetails } from '@/types/database';

// ============================================
// 型定義
// ============================================

export type ViewMode = 'compact' | 'standard' | 'detailed';
export type AppMode = 'play' | 'edit';

interface SongTopBarProps {
  /** 曲データ */
  song: SongWithDetails;
  /** アプリモード */
  mode: AppMode;
  /** 表示モード */
  viewMode: ViewMode;
  /** 再生速度 */
  playbackSpeed: number;
  /** 再生中かどうか */
  isPlaying: boolean;
  /** モード切り替えコールバック */
  onModeChange: (mode: AppMode) => void;
  /** ビューモード切り替えコールバック */
  onViewModeChange: (mode: ViewMode) => void;
  /** 未保存の変更があるか（編集モード用） */
  hasUnsavedChanges?: boolean;
  /** 保存コールバック（編集モード用） */
  onSave?: () => void | Promise<void>;
  /** 保存中かどうか */
  isSaving?: boolean;
  /** Undo可能かどうか */
  canUndo?: boolean;
  /** Redo可能かどうか */
  canRedo?: boolean;
  /** Undoコールバック */
  onUndo?: () => void;
  /** Redoコールバック */
  onRedo?: () => void;
  /** キャンセル（保存せずに戻る）コールバック */
  onCancel?: () => void;
}

// ============================================
// サブコンポーネント
// ============================================

interface MetadataBadgeProps {
  label: string;
  value: string | number;
  color?: 'default' | 'orange' | 'blue' | 'green' | 'purple';
}

function MetadataBadge({ label, value, color = 'default' }: MetadataBadgeProps) {
  const colorClasses = {
    default: 'badge-glass',
    orange: 'badge-glass bg-orange-500/15 border-orange-500/30 text-orange-400',
    blue: 'badge-glass bg-blue-500/15 border-blue-500/30 text-blue-400',
    green: 'badge-glass bg-green-500/15 border-green-500/30 text-green-400',
    purple: 'badge-glass bg-purple-500/15 border-purple-500/30 text-purple-400',
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shadow-[inset_0_1px_0_var(--glass-premium-highlight)] ${colorClasses[color]}`}>
      <span className="text-text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}

interface ViewModeButtonProps {
  mode: ViewMode;
  currentMode: ViewMode;
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
}

function ViewModeButton({ mode, currentMode, onClick, icon, tooltip }: ViewModeButtonProps) {
  const isActive = mode === currentMode;
  return (
    <button
      onClick={onClick}
      className={`btn-glass btn-glass-icon-sm transition-all ${
        isActive
          ? 'active'
          : 'text-text-muted hover:text-text-primary'
      }`}
      title={tooltip}
    >
      {icon}
    </button>
  );
}

// ============================================
// メインコンポーネント
// ============================================

export function SongTopBar({
  song,
  mode,
  viewMode,
  playbackSpeed,
  isPlaying,
  onModeChange,
  onViewModeChange,
  hasUnsavedChanges = false,
  onSave,
  isSaving = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onCancel,
}: SongTopBarProps) {
  const { song: songData, artist } = song;
  const { toggleTheme, isDark } = useTheme();

  // 編集モードへの切り替え
  const handleEditClick = useCallback(() => {
    onModeChange('edit');
  }, [onModeChange]);

  // 完了（保存して閲覧モードへ）
  const handleDoneClick = useCallback(async () => {
    // 未保存の変更があれば保存
    if (hasUnsavedChanges && onSave) {
      await onSave();
    }
    onModeChange('play');
  }, [hasUnsavedChanges, onSave, onModeChange]);

  return (
    <div className="flex items-center justify-between px-6 py-4 glass-premium border-b border-[var(--glass-premium-border)] rounded-xl">
      {/* 左側: タイトル・アーティスト */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-text-primary truncate">
            {songData.title}
          </h1>
          {artist && (
            <p className="text-sm text-text-secondary truncate">{artist.name}</p>
          )}
        </div>

        {/* メタデータバッジ */}
        <div className="flex items-center gap-2 flex-wrap">
          {songData.capo > 0 && (
            <MetadataBadge
              label="Capo"
              value={`${songData.capo}f`}
              color="orange"
            />
          )}
          {songData.capo === -1 && (
            <MetadataBadge
              label="Tuning"
              value="半音下げ"
              color="blue"
            />
          )}
          {songData.capo === -2 && (
            <MetadataBadge
              label="Tuning"
              value="全音下げ"
              color="blue"
            />
          )}
          {songData.bpm && (
            <MetadataBadge
              label="BPM"
              value={songData.bpm}
            />
          )}
          <MetadataBadge
            label="拍子"
            value={songData.timeSignature}
          />
          {playbackSpeed !== 1.0 && (
            <MetadataBadge
              label="速度"
              value={`${playbackSpeed.toFixed(1)}x`}
              color="purple"
            />
          )}
        </div>

        {/* 元サイトリンク */}
        {songData.sourceUrl && (
          <a
            href={songData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>元サイト</span>
          </a>
        )}
      </div>

      {/* 右側: ビューモード・モード切り替え */}
      <div className="flex items-center gap-3">
        {/* ビューモードトグル */}
        <div className="flex items-center gap-0.5 bg-[var(--input-bg)] border border-[var(--glass-premium-border)] rounded-xl p-1">
          <ViewModeButton
            mode="compact"
            currentMode={viewMode}
            onClick={() => onViewModeChange('compact')}
            icon={<LayoutList className="w-4 h-4" />}
            tooltip="コンパクト（コード名のみ）"
          />
          <ViewModeButton
            mode="standard"
            currentMode={viewMode}
            onClick={() => onViewModeChange('standard')}
            icon={<Layout className="w-4 h-4" />}
            tooltip="標準（コード + ダイアグラム）"
          />
          <ViewModeButton
            mode="detailed"
            currentMode={viewMode}
            onClick={() => onViewModeChange('detailed')}
            icon={<LayoutGrid className="w-4 h-4" />}
            tooltip="詳細（全情報表示）"
          />
        </div>

        {/* テーマ切り替えボタン */}
        <button
          onClick={toggleTheme}
          className="btn-glass btn-glass-icon-sm hover:bg-[var(--btn-glass-hover)] transition-all duration-300"
          title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        >
          <div className="relative w-4 h-4">
            <Sun
              className={`
                absolute inset-0 w-4 h-4 text-yellow-400
                transition-all duration-300
                ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}
              `}
            />
            <Moon
              className={`
                absolute inset-0 w-4 h-4 text-blue-400
                transition-all duration-300
                ${isDark ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
              `}
            />
          </div>
        </button>

        {/* 再生中インジケーター */}
        {isPlaying && mode === 'play' && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">再生中</span>
          </div>
        )}

        {/* Undo/Redo buttons (編集モードのみ) */}
        {mode === 'edit' && (onUndo || onRedo) && (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="btn-glass btn-glass-icon-sm text-text-secondary"
              title="元に戻す (Ctrl+Z)"
              aria-label="元に戻す"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="btn-glass btn-glass-icon-sm text-text-secondary"
              title="やり直す (Ctrl+Y)"
              aria-label="やり直す"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 編集モードでのキャンセルボタン */}
        {mode === 'edit' && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="btn-glass btn-glass-ghost btn-glass-sm text-text-muted"
            title="保存せずに戻る"
          >
            <X className="w-4 h-4" />
            <span>キャンセル</span>
          </button>
        )}

        {/* 編集モードでの保存ボタン */}
        {mode === 'edit' && (
          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`btn-glass btn-glass-sm ${
              hasUnsavedChanges
                ? 'btn-glass-primary'
                : 'bg-[var(--input-bg)] text-text-muted cursor-not-allowed'
            }`}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        )}

        {/* モード切り替えボタン */}
        {mode === 'play' ? (
          <button
            onClick={handleEditClick}
            className="btn-glass btn-glass-sm btn-glass-primary"
          >
            <Edit3 className="w-4 h-4" />
            <span>編集</span>
          </button>
        ) : (
          <button
            onClick={handleDoneClick}
            className="btn-glass btn-glass-sm bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 shadow-[0_2px_8px_rgba(34,197,94,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <Check className="w-4 h-4" />
            <span>完了</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SongTopBar;
