import { useEffect, useCallback } from 'react';

export interface KeyboardShortcutHandlers {
  onPlayPause: () => void;
  onSpeedUp: () => void;
  onSpeedDown: () => void;
  onScrollToTop: () => void;
  onScrollToEnd?: () => void;
  onMetronomeToggle?: () => void;
}

/**
 * Custom hook for handling keyboard shortcuts in the guitar chord sheet app.
 *
 * Shortcuts:
 * - Space: Play/Pause toggle
 * - ArrowUp: Speed +0.1
 * - ArrowDown: Speed -0.1
 * - Home: Scroll to top
 * - End: Scroll to bottom (optional)
 *
 * @param handlers - Callback functions for each shortcut action
 * @param enabled - Whether shortcuts are active (default: true)
 */
export function useKeyboardShortcuts(
  handlers: KeyboardShortcutHandlers,
  enabled: boolean = true
): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if shortcuts are disabled
      if (!enabled) return;

      // Skip if user is typing in an input field
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isEditable =
        tagName === 'input' ||
        tagName === 'textarea' ||
        target.isContentEditable;

      if (isEditable) return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          handlers.onPlayPause();
          break;

        case 'ArrowUp':
          event.preventDefault();
          handlers.onSpeedUp();
          break;

        case 'ArrowDown':
          event.preventDefault();
          handlers.onSpeedDown();
          break;

        case 'Home':
          event.preventDefault();
          handlers.onScrollToTop();
          break;

        case 'End':
          if (handlers.onScrollToEnd) {
            event.preventDefault();
            handlers.onScrollToEnd();
          }
          break;

        case 'm':
        case 'M':
          if (handlers.onMetronomeToggle) {
            event.preventDefault();
            handlers.onMetronomeToggle();
          }
          break;

        default:
          // No action for other keys
          break;
      }
    },
    [enabled, handlers]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

export default useKeyboardShortcuts;
