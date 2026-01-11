import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Eye,
  Save,
  Sun,
  Moon,
  LayoutList,
  Layout,
  LayoutGrid,
  Loader2,
  Check,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

type ViewMode = 'compact' | 'standard' | 'detailed';

interface EditorHeaderProps {
  title: string;
  artistName: string | null;
  onTitleChange: (title: string) => void;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPreview?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

const VIEW_MODE_CONFIG: Record<
  ViewMode,
  { icon: typeof LayoutList; label: string; tooltip: string }
> = {
  compact: {
    icon: LayoutList,
    label: 'Compact',
    tooltip: 'コード名のみ表示',
  },
  standard: {
    icon: Layout,
    label: 'Standard',
    tooltip: 'コード名 + 小ダイアグラム',
  },
  detailed: {
    icon: LayoutGrid,
    label: 'Detailed',
    tooltip: '全情報表示',
  },
};

/**
 * EditorHeader - 編集画面のヘッダーコンポーネント
 *
 * Features:
 * - 戻るボタン
 * - 曲名のインライン編集
 * - アーティスト名表示
 * - ViewMode切り替え（Compact/Standard/Detailed）
 * - テーマ切り替え（ダーク/ライト）
 * - プレビューボタン
 * - 保存ボタン（変更検出・ローディング状態対応）
 */
export function EditorHeader({
  title,
  artistName,
  onTitleChange,
  onBack,
  onSave,
  isSaving,
  hasChanges,
  viewMode,
  onViewModeChange,
  onPreview,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: EditorHeaderProps) {
  const { toggleTheme, isDark } = useTheme();

  // Title inline editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync editedTitle with prop when not editing
  useEffect(() => {
    if (!isEditingTitle) {
      setEditedTitle(title);
    }
  }, [title, isEditingTitle]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Handle title edit completion
  const handleTitleSubmit = useCallback(() => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== title) {
      onTitleChange(trimmed);
    } else {
      setEditedTitle(title);
    }
    setIsEditingTitle(false);
  }, [editedTitle, title, onTitleChange]);

  // Handle keyboard events in title input
  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleTitleSubmit();
      } else if (e.key === 'Escape') {
        setEditedTitle(title);
        setIsEditingTitle(false);
      }
    },
    [handleTitleSubmit, title]
  );

  // Handle save
  const handleSave = useCallback(() => {
    if (hasChanges && !isSaving) {
      onSave();
    }
  }, [hasChanges, isSaving, onSave]);

  // Handle save with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <header className="h-14 flex items-center justify-between px-4 glass border-b border-border sticky top-0 z-50">
      {/* Left section: Back button + Title/Artist */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center
                     rounded-lg text-text-secondary hover:text-text-primary
                     bg-background-surface/50 hover:bg-background-hover
                     border border-border hover:border-border-light
                     transition-all duration-200 ease-out
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="戻る"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Title and Artist */}
        <div className="flex flex-col min-w-0 gap-0.5">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold bg-transparent border-b-2 border-primary
                         text-text-primary focus:outline-none min-w-[200px] max-w-[400px]
                         transition-colors duration-200"
              aria-label="曲名を編集"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="group text-lg font-semibold text-text-primary hover:text-primary
                         truncate text-left transition-colors duration-200
                         focus:outline-none focus:underline focus:decoration-primary
                         flex items-center gap-2"
              title="クリックして曲名を編集"
              aria-label={`曲名: ${title}（クリックで編集）`}
            >
              <span className="truncate">{title || '無題'}</span>
              <span className="text-text-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                編集
              </span>
            </button>
          )}
          {artistName && (
            <span className="text-xs text-text-muted truncate">{artistName}</span>
          )}
        </div>

        {/* Unsaved changes indicator */}
        {hasChanges && !isSaving && (
          <span
            className="flex-shrink-0 w-2 h-2 rounded-full bg-accent-yellow animate-pulse"
            title="未保存の変更があります"
            aria-label="未保存の変更あり"
          />
        )}
      </div>

      {/* Center section: View Mode Toggle (hidden on small screens) */}
      <div className="hidden sm:flex items-center">
        <div
          className="flex items-center bg-background-surface/80 rounded-lg p-1 gap-0.5
                        border border-border"
          role="group"
          aria-label="表示モード切り替え"
        >
          {(Object.keys(VIEW_MODE_CONFIG) as ViewMode[]).map((mode) => {
            const config = VIEW_MODE_CONFIG[mode];
            const Icon = config.icon;
            const isActive = viewMode === mode;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
                  transition-all duration-200 ease-out
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-hover'
                  }
                `}
                title={config.tooltip}
                aria-pressed={isActive}
                aria-label={`${config.label}モード: ${config.tooltip}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right section: Mobile ViewMode, Theme toggle, Preview, Save */}
      <div className="flex items-center gap-2">
        {/* Mobile View Mode dropdown */}
        <div className="sm:hidden">
          <select
            value={viewMode}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            className="bg-background-surface border border-border rounded-lg px-2 py-1.5
                       text-sm text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="表示モード選択"
          >
            {(Object.keys(VIEW_MODE_CONFIG) as ViewMode[]).map((mode) => (
              <option key={mode} value={mode}>
                {VIEW_MODE_CONFIG[mode].label}
              </option>
            ))}
          </select>
        </div>

        {/* Undo/Redo buttons */}
        {(onUndo || onRedo) && (
          <div className="flex items-center gap-0.5 mr-1">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="w-8 h-8 flex items-center justify-center
                         rounded-lg text-text-secondary hover:text-text-primary
                         disabled:opacity-30 disabled:cursor-not-allowed
                         hover:bg-background-hover transition-colors
                         focus:outline-none focus:ring-2 focus:ring-primary/50"
              title="元に戻す (Ctrl+Z)"
              aria-label="元に戻す"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="w-8 h-8 flex items-center justify-center
                         rounded-lg text-text-secondary hover:text-text-primary
                         disabled:opacity-30 disabled:cursor-not-allowed
                         hover:bg-background-hover transition-colors
                         focus:outline-none focus:ring-2 focus:ring-primary/50"
              title="やり直す (Ctrl+Y)"
              aria-label="やり直す"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center
                     rounded-lg text-text-secondary hover:text-text-primary
                     bg-background-surface/50 hover:bg-background-hover
                     border border-border hover:border-border-light
                     transition-all duration-200 ease-out
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          title={isDark ? 'ライトモード' : 'ダークモード'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Preview button */}
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="w-9 h-9 flex items-center justify-center
                       rounded-lg text-text-secondary hover:text-text-primary
                       bg-background-surface/50 hover:bg-background-hover
                       border border-border hover:border-border-light
                       transition-all duration-200 ease-out
                       focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="プレビュー"
            title="プレビュー"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`
            flex items-center gap-2 px-4 h-9
            rounded-lg font-medium text-sm
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:cursor-not-allowed
            ${
              hasChanges && !isSaving
                ? `bg-gradient-to-r from-primary to-primary-hover text-white
                   shadow-lg shadow-primary/30
                   hover:shadow-xl hover:shadow-primary/40
                   active:scale-95`
                : `bg-background-surface text-text-muted
                   border border-border`
            }
          `}
          aria-label={isSaving ? '保存中...' : hasChanges ? '変更を保存' : '保存済み'}
          title={isSaving ? '保存中...' : hasChanges ? '保存 (Cmd/Ctrl+S)' : '変更なし'}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">保存中</span>
            </>
          ) : hasChanges ? (
            <>
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">保存</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">保存済</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
