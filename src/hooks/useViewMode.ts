import { useState, useCallback, useMemo } from 'react';

export type ViewMode = 'compact' | 'standard' | 'detailed';

const VIEW_MODE_STORAGE_KEY = 'cat4g-editor-view-mode';

/**
 * 各ViewModeの表示設定
 */
export interface ViewModeSettings {
  showDiagram: boolean;
  showPlayingMethod: boolean;
  showDuration: boolean;
  showTechniques: boolean;
  showAnnotation: boolean;
}

/**
 * ViewModeごとのデフォルト設定
 */
const VIEW_MODE_DEFAULTS: Record<ViewMode, ViewModeSettings> = {
  compact: {
    showDiagram: false,
    showPlayingMethod: false,
    showDuration: false,
    showTechniques: false,
    showAnnotation: false,
  },
  standard: {
    showDiagram: true,
    showPlayingMethod: true,
    showDuration: false,
    showTechniques: false,
    showAnnotation: false,
  },
  detailed: {
    showDiagram: true,
    showPlayingMethod: true,
    showDuration: true,
    showTechniques: true,
    showAnnotation: true,
  },
};

/**
 * ViewModeの説明
 */
export const VIEW_MODE_DESCRIPTIONS: Record<ViewMode, { label: string; description: string }> = {
  compact: {
    label: 'コンパクト',
    description: 'コード名のみ表示。全体確認や印刷向け',
  },
  standard: {
    label: 'スタンダード',
    description: 'コード名と押さえ方を表示。練習用',
  },
  detailed: {
    label: '詳細',
    description: '全情報を表示。TAB譜編集向け',
  },
};

/**
 * ViewMode管理フック
 * - ローカルストレージに保存
 * - 各モードの表示設定を提供
 */
export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as ViewMode | null;
    if (stored === 'compact' || stored === 'standard' || stored === 'detailed') {
      return stored;
    }
    return 'standard'; // デフォルト
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  }, []);

  const cycleViewMode = useCallback(() => {
    setViewModeState(prev => {
      const modes: ViewMode[] = ['compact', 'standard', 'detailed'];
      const currentIndex = modes.indexOf(prev);
      const nextIndex = (currentIndex + 1) % modes.length;
      const nextMode = modes[nextIndex];
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, nextMode);
      return nextMode;
    });
  }, []);

  const settings = useMemo(() => VIEW_MODE_DEFAULTS[viewMode], [viewMode]);

  const isCompact = viewMode === 'compact';
  const isStandard = viewMode === 'standard';
  const isDetailed = viewMode === 'detailed';

  return {
    viewMode,
    setViewMode,
    cycleViewMode,
    settings,
    isCompact,
    isStandard,
    isDetailed,
  };
}

/**
 * ViewMode設定を取得するユーティリティ
 */
export function getViewModeSettings(viewMode: ViewMode): ViewModeSettings {
  return VIEW_MODE_DEFAULTS[viewMode];
}
