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
  /** スケール係数（0.6〜1.0、デフォルト1.0） */
  scale?: number;
}

// ============================================
// サブコンポーネント
// ============================================

interface MetadataBadgeProps {
  label: string;
  value: string | number;
  color?: 'default' | 'orange' | 'blue' | 'green' | 'purple';
  scale?: number;
}

function MetadataBadge({ label, value, color = 'default', scale = 1.0 }: MetadataBadgeProps) {
  const colorClasses = {
    default: 'badge-glass',
    orange: 'badge-glass bg-orange-500/15 border-orange-500/30 text-orange-400',
    blue: 'badge-glass bg-blue-500/15 border-blue-500/30 text-blue-400',
    green: 'badge-glass bg-green-500/15 border-green-500/30 text-green-400',
    purple: 'badge-glass bg-purple-500/15 border-purple-500/30 text-purple-400',
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full font-medium shadow-[inset_0_1px_0_var(--glass-premium-highlight)] ${colorClasses[color]}`}
      style={{
        fontSize: `${12 * scale}px`,
        padding: `${4 * scale}px ${12 * scale}px`,
      }}
    >
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
  scale?: number;
}

function ViewModeButton({ mode, currentMode, onClick, icon, tooltip, scale = 1.0 }: ViewModeButtonProps) {
  const isActive = mode === currentMode;
  const btnSize = 28 * scale;
  return (
    <button
      onClick={onClick}
      className={`btn-glass transition-all ${
        isActive
          ? 'active'
          : 'text-text-muted hover:text-text-primary'
      }`}
      style={{
        width: `${btnSize}px`,
        height: `${btnSize}px`,
        padding: `${4 * scale}px`,
      }}
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
  scale = 1.0,
}: SongTopBarProps) {
  const { song: songData, artist } = song;
  const { toggleTheme, isDark } = useTheme();

  // スケーリングされたサイズ
  const iconSize = 16 * scale;
  const smallIconSize = 12 * scale;
  const btnHeight = 32 * scale;

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
    <div
      className="flex items-center justify-between glass-premium border-b border-[var(--glass-premium-border)] rounded-xl"
      style={{ padding: `${16 * scale}px ${24 * scale}px` }}
    >
      {/* 左側: タイトル・アーティスト */}
      <div className="flex items-center min-w-0 flex-1" style={{ gap: `${16 * scale}px` }}>
        <div className="min-w-0">
          <h1
            className="font-bold text-text-primary truncate"
            style={{ fontSize: `${18 * scale}px` }}
          >
            {songData.title}
          </h1>
          {artist && (
            <p
              className="text-text-secondary truncate"
              style={{ fontSize: `${14 * scale}px` }}
            >
              {artist.name}
            </p>
          )}
        </div>

        {/* メタデータバッジ */}
        <div className="flex items-center flex-wrap" style={{ gap: `${8 * scale}px` }}>
          {songData.capo > 0 && (
            <MetadataBadge
              label="Capo"
              value={`${songData.capo}f`}
              color="orange"
              scale={scale}
            />
          )}
          {songData.capo === -1 && (
            <MetadataBadge
              label="Tuning"
              value="半音下げ"
              color="blue"
              scale={scale}
            />
          )}
          {songData.capo === -2 && (
            <MetadataBadge
              label="Tuning"
              value="全音下げ"
              color="blue"
              scale={scale}
            />
          )}
          {songData.bpm && (
            <MetadataBadge
              label="BPM"
              value={songData.bpm}
              scale={scale}
            />
          )}
          <MetadataBadge
            label="拍子"
            value={songData.timeSignature}
            scale={scale}
          />
          {playbackSpeed !== 1.0 && (
            <MetadataBadge
              label="速度"
              value={`${playbackSpeed.toFixed(1)}x`}
              color="purple"
              scale={scale}
            />
          )}
        </div>

        {/* 元サイトリンク */}
        {songData.sourceUrl && (
          <a
            href={songData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-text-muted hover:text-accent-primary transition-colors"
            style={{ gap: `${4 * scale}px`, fontSize: `${12 * scale}px` }}
          >
            <ExternalLink style={{ width: `${smallIconSize}px`, height: `${smallIconSize}px` }} />
            <span>元サイト</span>
          </a>
        )}
      </div>

      {/* 右側: ビューモード・モード切り替え */}
      <div className="flex items-center" style={{ gap: `${12 * scale}px` }}>
        {/* ビューモードトグル */}
        <div
          className="flex items-center bg-[var(--input-bg)] border border-[var(--glass-premium-border)] rounded-xl"
          style={{ gap: `${2 * scale}px`, padding: `${4 * scale}px` }}
        >
          <ViewModeButton
            mode="compact"
            currentMode={viewMode}
            onClick={() => onViewModeChange('compact')}
            icon={<LayoutList style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />}
            tooltip="コンパクト（コード名のみ）"
            scale={scale}
          />
          <ViewModeButton
            mode="standard"
            currentMode={viewMode}
            onClick={() => onViewModeChange('standard')}
            icon={<Layout style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />}
            tooltip="標準（コード + ダイアグラム）"
            scale={scale}
          />
          <ViewModeButton
            mode="detailed"
            currentMode={viewMode}
            onClick={() => onViewModeChange('detailed')}
            icon={<LayoutGrid style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />}
            tooltip="詳細（全情報表示）"
            scale={scale}
          />
        </div>

        {/* テーマ切り替えボタン */}
        <button
          onClick={toggleTheme}
          className="btn-glass hover:bg-[var(--btn-glass-hover)] transition-all duration-300"
          style={{
            width: `${btnHeight}px`,
            height: `${btnHeight}px`,
            padding: `${6 * scale}px`,
          }}
          title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        >
          <div className="relative" style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
            <Sun
              className={`
                absolute inset-0 text-yellow-400
                transition-all duration-300
                ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}
              `}
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            />
            <Moon
              className={`
                absolute inset-0 text-blue-400
                transition-all duration-300
                ${isDark ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
              `}
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            />
          </div>
        </button>

        {/* 再生中インジケーター */}
        {isPlaying && mode === 'play' && (
          <div
            className="flex items-center rounded-full bg-green-500/20 border border-green-500/30"
            style={{ gap: `${6 * scale}px`, padding: `${4 * scale}px ${8 * scale}px` }}
          >
            <div
              className="rounded-full bg-green-500 animate-pulse"
              style={{ width: `${8 * scale}px`, height: `${8 * scale}px` }}
            />
            <span style={{ fontSize: `${12 * scale}px` }} className="text-green-400">再生中</span>
          </div>
        )}

        {/* Undo/Redo buttons (編集モードのみ) */}
        {mode === 'edit' && (onUndo || onRedo) && (
          <div className="flex items-center" style={{ gap: `${2 * scale}px` }}>
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="btn-glass text-text-secondary"
              style={{
                width: `${btnHeight}px`,
                height: `${btnHeight}px`,
                padding: `${6 * scale}px`,
              }}
              title="元に戻す (Ctrl+Z)"
              aria-label="元に戻す"
            >
              <Undo2 style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="btn-glass text-text-secondary"
              style={{
                width: `${btnHeight}px`,
                height: `${btnHeight}px`,
                padding: `${6 * scale}px`,
              }}
              title="やり直す (Ctrl+Y)"
              aria-label="やり直す"
            >
              <Redo2 style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
            </button>
          </div>
        )}

        {/* 編集モードでのキャンセルボタン */}
        {mode === 'edit' && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="btn-glass btn-glass-ghost text-text-muted flex items-center"
            style={{
              height: `${btnHeight}px`,
              padding: `${6 * scale}px ${12 * scale}px`,
              fontSize: `${14 * scale}px`,
              gap: `${4 * scale}px`,
            }}
            title="保存せずに戻る"
          >
            <X style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
            <span>キャンセル</span>
          </button>
        )}

        {/* 編集モードでの保存ボタン */}
        {mode === 'edit' && (
          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`btn-glass ${
              hasUnsavedChanges
                ? 'btn-glass-primary'
                : 'bg-[var(--input-bg)] text-text-muted cursor-not-allowed'
            }`}
            style={{
              height: `${btnHeight}px`,
              padding: `${6 * scale}px ${12 * scale}px`,
              fontSize: `${14 * scale}px`,
            }}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        )}

        {/* モード切り替えボタン */}
        {mode === 'play' ? (
          <button
            onClick={handleEditClick}
            className="btn-glass btn-glass-primary flex items-center"
            style={{
              height: `${btnHeight}px`,
              padding: `${6 * scale}px ${12 * scale}px`,
              fontSize: `${14 * scale}px`,
              gap: `${4 * scale}px`,
            }}
          >
            <Edit3 style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
            <span>編集</span>
          </button>
        ) : (
          <button
            onClick={handleDoneClick}
            className="btn-glass bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 shadow-[0_2px_8px_rgba(34,197,94,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center"
            style={{
              height: `${btnHeight}px`,
              padding: `${6 * scale}px ${12 * scale}px`,
              fontSize: `${14 * scale}px`,
              gap: `${4 * scale}px`,
            }}
          >
            <Check style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
            <span>完了</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SongTopBar;
