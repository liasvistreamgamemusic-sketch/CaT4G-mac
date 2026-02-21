import { useEffect, useRef, useCallback } from 'react';

// Constants
const BASE_SCROLL_AMOUNT = 1; // px
const SCROLL_INTERVAL = 50; // ms
const BOTTOM_THRESHOLD = 10; // px tolerance for detecting bottom

/**
 * Options for the useAutoScroll hook
 */
export interface UseAutoScrollOptions {
  /** Whether auto-scroll is currently active */
  isPlaying: boolean;
  /** Scroll speed multiplier (0.5 - 2.0) */
  scrollSpeed: number;
  /** Optional BPM value for BPM-synced scrolling */
  bpm?: number;
  /** Enable BPM-based speed calculation */
  bpmSync: boolean;
  /** Reference to the scrollable container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Callback fired when scroll reaches the bottom */
  onReachEnd?: () => void;
}

/**
 * Return type for the useAutoScroll hook
 */
export interface UseAutoScrollReturn {
  /** Scroll to the top of the container */
  scrollToTop: () => void;
  /** Scroll to a specific section by index (using data-section attribute) */
  scrollToSection: (sectionIndex: number) => void;
  /** Current calculated scroll speed (includes BPM adjustment if enabled) */
  currentSpeed: number;
}

/**
 * Auto-scroll hook for chord sheet display
 *
 * Provides smooth automatic scrolling with configurable speed,
 * optional BPM synchronization, and utility functions for navigation.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { scrollToTop, scrollToSection } = useAutoScroll({
 *   isPlaying,
 *   scrollSpeed: 1.0,
 *   bpm: 120,
 *   bpmSync: true,
 *   containerRef,
 *   onReachEnd: () => setIsPlaying(false),
 * });
 * ```
 */
export function useAutoScroll({
  isPlaying,
  scrollSpeed,
  bpm,
  bpmSync,
  containerRef,
  onReachEnd,
}: UseAutoScrollOptions): UseAutoScrollReturn {
  const intervalRef = useRef<number | null>(null);
  const hasReachedEndRef = useRef(false);
  const accumulatedPixelsRef = useRef(0);

  /**
   * Calculate the effective scroll speed
   * When BPM sync is enabled, speed is adjusted relative to BPM 120 as baseline
   */
  const calculateSpeed = useCallback((): number => {
    if (bpmSync && bpm && bpm > 0) {
      // BPM 120 is the baseline: faster BPM = faster scroll
      return (bpm / 120) * scrollSpeed;
    }
    return scrollSpeed;
  }, [bpm, bpmSync, scrollSpeed]);

  const currentSpeed = calculateSpeed();

  /**
   * Check if the container has reached the bottom
   */
  const isAtBottom = useCallback((container: HTMLElement): boolean => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollTop + clientHeight >= scrollHeight - BOTTOM_THRESHOLD;
  }, []);

  /**
   * Clear the scroll interval
   */
  const clearScrollInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Store values in refs for real-time updates during scroll (avoid stale closures)
  const scrollSpeedRef = useRef(scrollSpeed);
  useEffect(() => {
    scrollSpeedRef.current = scrollSpeed;
  }, [scrollSpeed]);

  const bpmRef = useRef(bpm);
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const bpmSyncRef = useRef(bpmSync);
  useEffect(() => {
    bpmSyncRef.current = bpmSync;
  }, [bpmSync]);

  // Main scroll effect
  useEffect(() => {
    // Reset state when starting
    if (isPlaying) {
      hasReachedEndRef.current = false;
      accumulatedPixelsRef.current = 0;
    }

    if (isPlaying && containerRef.current) {
      const container = containerRef.current;

      intervalRef.current = window.setInterval(() => {
        if (!container) {
          clearScrollInterval();
          return;
        }

        // Check if already at bottom before scrolling
        if (isAtBottom(container)) {
          if (!hasReachedEndRef.current) {
            hasReachedEndRef.current = true;
            clearScrollInterval();
            onReachEnd?.();
          }
          return;
        }

        // Calculate speed in real-time (use refs for latest values)
        const currentScrollSpeed = scrollSpeedRef.current;
        const currentBpm = bpmRef.current;
        const currentBpmSync = bpmSyncRef.current;
        let speed = currentScrollSpeed;
        if (currentBpmSync && currentBpm && currentBpm > 0) {
          speed = (currentBpm / 120) * currentScrollSpeed;
        }

        // Accumulate sub-pixel scroll amounts
        accumulatedPixelsRef.current += BASE_SCROLL_AMOUNT * speed;

        // Only scroll when accumulated >= 1px (browsers ignore sub-pixel scrolls)
        if (accumulatedPixelsRef.current >= 1) {
          const pixelsToScroll = Math.floor(accumulatedPixelsRef.current);
          container.scrollBy({
            top: pixelsToScroll,
            behavior: 'auto',
          });
          accumulatedPixelsRef.current -= pixelsToScroll;

          // Check again after scrolling
          if (isAtBottom(container)) {
            if (!hasReachedEndRef.current) {
              hasReachedEndRef.current = true;
              clearScrollInterval();
              onReachEnd?.();
            }
          }
        }
      }, SCROLL_INTERVAL);
    }

    // Cleanup on pause or unmount
    return () => {
      clearScrollInterval();
    };
  }, [isPlaying, containerRef, onReachEnd, clearScrollInterval, isAtBottom]);

  /**
   * Scroll to the top of the container
   */
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      hasReachedEndRef.current = false;
    }
  }, [containerRef]);

  /**
   * Scroll to a specific section by index
   * Sections are identified by the data-section attribute
   */
  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      if (containerRef.current) {
        const sections = containerRef.current.querySelectorAll('[data-section]');
        const targetSection = sections[sectionIndex];

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          hasReachedEndRef.current = false;
        }
      }
    },
    [containerRef]
  );

  return {
    scrollToTop,
    scrollToSection,
    currentSpeed,
  };
}

export default useAutoScroll;
