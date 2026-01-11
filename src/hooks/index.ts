/**
 * CaT4G - Custom Hooks
 */

export { useAutoScroll } from './useAutoScroll';
export type {
  UseAutoScrollOptions,
  UseAutoScrollReturn,
} from './useAutoScroll';

export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export type { KeyboardShortcutHandlers } from './useKeyboardShortcuts';

export { useMetronome } from './useMetronome';
export type {
  TimeSignature,
  UseMetronomeOptions,
  UseMetronomeReturn,
} from './useMetronome';

export { usePlaylistPlayback } from './usePlaylistPlayback';
export type {
  UsePlaylistPlaybackOptions,
  UsePlaylistPlaybackReturn,
} from './usePlaylistPlayback';

export { useToast } from './useToast';
export type { UseToastReturn } from './useToast';

export { useTheme } from './useTheme';
export type { Theme } from './useTheme';

export { useViewMode, getViewModeSettings, VIEW_MODE_DESCRIPTIONS } from './useViewMode';
export type { ViewMode, ViewModeSettings } from './useViewMode';

export { useUndoRedo } from './useUndoRedo';
export type { UseUndoRedoOptions, UseUndoRedoReturn } from './useUndoRedo';
