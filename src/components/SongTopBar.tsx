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
} from 'lucide-react';
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
    default: 'bg-background-surface border-border text-text-secondary',
    orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${colorClasses[color]}`}>
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
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? 'bg-accent-primary/20 text-accent-primary'
          : 'text-text-muted hover:text-text-primary hover:bg-background-hover'
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
}: SongTopBarProps) {
  const { song: songData, artist } = song;

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
    <div className="flex items-center justify-between px-4 py-3 bg-background-surface border-b border-border">
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
        <div className="flex items-center gap-1 bg-background-primary rounded-lg p-1">
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

        {/* 再生中インジケーター */}
        {isPlaying && mode === 'play' && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">再生中</span>
          </div>
        )}

        {/* 編集モードでの保存ボタン */}
        {mode === 'edit' && (
          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-accent-primary to-purple-600 text-white hover:opacity-90'
                : 'bg-background-hover text-text-muted cursor-not-allowed'
            }`}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        )}

        {/* モード切り替えボタン */}
        {mode === 'play' ? (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-accent-primary hover:bg-accent-primary/20 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm font-medium">編集</span>
          </button>
        ) : (
          <button
            onClick={handleDoneClick}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">完了</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default SongTopBar;
