import { useState, useCallback, useRef, useMemo } from 'react';

const DEFAULT_MAX_HISTORY = 50;
const DEFAULT_DEBOUNCE_MS = 300;

/** Options for the useUndoRedo hook */
export interface UseUndoRedoOptions {
  /** Maximum number of history states to keep (default: 50) */
  maxHistory?: number;
  /** Debounce delay in ms for grouping rapid changes (default: 300) */
  debounceMs?: number;
}

/** Return type for the useUndoRedo hook */
export interface UseUndoRedoReturn<T> {
  /** Current state */
  state: T;
  /** Update state and record in history */
  setState: (newState: T | ((prev: T) => T)) => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Undo to previous state */
  undo: () => void;
  /** Redo to next state */
  redo: () => void;
  /** Reset history (e.g., after save) */
  resetHistory: (newInitialState?: T) => void;
  /** Number of undo steps available */
  undoCount: number;
  /** Number of redo steps available */
  redoCount: number;
}

/**
 * useUndoRedo - 編集履歴管理フック
 *
 * Features:
 * - past/future スタックで状態履歴を管理
 * - デバウンスで連続入力をグループ化
 * - 最大履歴数の制限
 * - 保存後の履歴リセット
 *
 * @example
 * const { state, setState, canUndo, canRedo, undo, redo, resetHistory } = useUndoRedo(initialState);
 */
export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions = {}
): UseUndoRedoReturn<T> {
  const { maxHistory = DEFAULT_MAX_HISTORY, debounceMs = DEFAULT_DEBOUNCE_MS } =
    options;

  // Current state
  const [state, setStateInternal] = useState<T>(initialState);

  // History stacks stored in refs to avoid batching issues
  const pastStatesRef = useRef<T[]>([]);
  const futureStatesRef = useRef<T[]>([]);

  // Force re-render trigger for canUndo/canRedo
  const [historyVersion, setHistoryVersion] = useState(0);
  const triggerUpdate = useCallback(() => setHistoryVersion((v) => v + 1), []);

  // Refs for debouncing
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingStateRef = useRef<T | null>(null);
  const lastRecordedStateRef = useRef<T>(initialState);

  // Ref to current state for resetHistory
  const currentStateRef = useRef<T>(state);
  currentStateRef.current = state;

  // Flush pending state to history (synchronous, updates refs directly)
  const flushPendingState = useCallback(() => {
    if (pendingStateRef.current !== null) {
      const currentRecorded = lastRecordedStateRef.current;
      const pending = pendingStateRef.current;

      // Add to past
      pastStatesRef.current = [...pastStatesRef.current, currentRecorded].slice(
        -maxHistory
      );

      lastRecordedStateRef.current = pending;
      pendingStateRef.current = null;

      // Clear future on new change
      futureStatesRef.current = [];

      triggerUpdate();
    }
  }, [maxHistory, triggerUpdate]);

  // Set state with history recording (debounced)
  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setStateInternal((prev) => {
        const next =
          typeof newState === 'function'
            ? (newState as (prev: T) => T)(prev)
            : newState;

        // Store as pending state
        pendingStateRef.current = next;

        // Clear existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Set new timer to flush
        debounceTimerRef.current = setTimeout(() => {
          flushPendingState();
        }, debounceMs);

        return next;
      });
    },
    [debounceMs, flushPendingState]
  );

  // Undo - synchronous operations on refs, then single state update
  const undo = useCallback(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Flush any pending state first
    if (pendingStateRef.current !== null) {
      const currentRecorded = lastRecordedStateRef.current;
      const pending = pendingStateRef.current;

      pastStatesRef.current = [...pastStatesRef.current, currentRecorded].slice(
        -maxHistory
      );
      lastRecordedStateRef.current = pending;
      pendingStateRef.current = null;
      futureStatesRef.current = [];
    }

    // Now perform undo
    const past = pastStatesRef.current;
    if (past.length === 0) {
      triggerUpdate();
      return;
    }

    const previousState = past[past.length - 1];
    const currentState = lastRecordedStateRef.current;

    // Update refs synchronously
    pastStatesRef.current = past.slice(0, -1);
    futureStatesRef.current = [currentState, ...futureStatesRef.current].slice(
      0,
      maxHistory
    );
    lastRecordedStateRef.current = previousState;

    // Single state update
    setStateInternal(previousState);
    triggerUpdate();
  }, [maxHistory, triggerUpdate]);

  // Redo - synchronous operations on refs, then single state update
  const redo = useCallback(() => {
    const future = futureStatesRef.current;
    if (future.length === 0) {
      return;
    }

    const nextState = future[0];
    const currentState = lastRecordedStateRef.current;

    // Update refs synchronously
    futureStatesRef.current = future.slice(1);
    pastStatesRef.current = [...pastStatesRef.current, currentState].slice(
      -maxHistory
    );
    lastRecordedStateRef.current = nextState;

    // Single state update
    setStateInternal(nextState);
    triggerUpdate();
  }, [maxHistory, triggerUpdate]);

  // Reset history (useful after save or initial load)
  const resetHistory = useCallback(
    (newInitialState?: T) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      pendingStateRef.current = null;
      pastStatesRef.current = [];
      futureStatesRef.current = [];

      if (newInitialState !== undefined) {
        setStateInternal(newInitialState);
        lastRecordedStateRef.current = newInitialState;
      } else {
        lastRecordedStateRef.current = currentStateRef.current;
      }
      triggerUpdate();
    },
    [triggerUpdate]
  );

  // Computed values - depend on historyVersion to trigger re-render
  const canUndo = useMemo(
    () => pastStatesRef.current.length > 0 || pendingStateRef.current !== null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [historyVersion]
  );
  const canRedo = useMemo(
    () => futureStatesRef.current.length > 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [historyVersion]
  );
  const undoCount =
    pastStatesRef.current.length + (pendingStateRef.current !== null ? 1 : 0);
  const redoCount = futureStatesRef.current.length;

  return {
    state,
    setState,
    canUndo,
    canRedo,
    undo,
    redo,
    resetHistory,
    undoCount,
    redoCount,
  };
}
