import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Section information with optional overrides
 */
export interface SectionInfo {
  /** Unique identifier for the section */
  id: string;
  /** Display name of the section (e.g., "Intro", "Verse 1", "Chorus") */
  name: string;
  /** Section-specific transpose override (null = use global) */
  transposeOverride: number | null;
  /** Section-specific BPM override (null = use global) */
  bpmOverride: number | null;
  /** Section-specific playback speed override (null = use global) */
  playbackSpeedOverride: number | null;
}

/**
 * Options for the usePlaybackSync hook
 */
export interface UsePlaybackSyncOptions {
  /** Reference to the scrollable container element */
  containerRef: React.RefObject<HTMLElement>;
  /** Array of section information to track */
  sections: SectionInfo[];
  /** Baseline position as a ratio from the top (0.0 - 1.0, default: 0.3 = 30%) */
  baselinePosition?: number;
  /** Whether auto-scroll/playback is currently active */
  isPlaying: boolean;
  /** Callback fired when the current section changes */
  onSectionChange?: (section: SectionInfo) => void;
}

/**
 * Return type for the usePlaybackSync hook
 */
export interface UsePlaybackSyncReturn {
  /** Currently active section at the baseline (null if none) */
  currentSection: SectionInfo | null;
  /** Index of the current section in the sections array (-1 if none) */
  currentSectionIndex: number;
  /** Y coordinate of the baseline in pixels */
  baselineY: number;
}

// Constants
const SCROLL_THROTTLE_MS = 50; // Throttle scroll event handling
const DEFAULT_BASELINE_POSITION = 0.3; // 30% from top

/**
 * Playback synchronization hook for section tracking
 *
 * Monitors scroll position and detects when sections cross a virtual "baseline"
 * position on screen. Used to trigger section-specific behaviors during playback.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { currentSection, baselineY } = usePlaybackSync({
 *   containerRef,
 *   sections: songSections,
 *   baselinePosition: 0.3,
 *   isPlaying: true,
 *   onSectionChange: (section) => {
 *     if (section.bpmOverride) setBpm(section.bpmOverride);
 *   },
 * });
 * ```
 */
export function usePlaybackSync({
  containerRef,
  sections,
  baselinePosition = DEFAULT_BASELINE_POSITION,
  isPlaying,
  onSectionChange,
}: UsePlaybackSyncOptions): UsePlaybackSyncReturn {
  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(-1);
  const [baselineY, setBaselineY] = useState<number>(0);

  // Refs for tracking
  const lastSectionIndexRef = useRef<number>(-1);
  const throttleRef = useRef<number | null>(null);
  const onSectionChangeRef = useRef(onSectionChange);

  // Keep callback ref updated
  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
  }, [onSectionChange]);

  // Memoize current section
  const currentSection = useMemo(() => {
    if (currentSectionIndex >= 0 && currentSectionIndex < sections.length) {
      return sections[currentSectionIndex];
    }
    return null;
  }, [currentSectionIndex, sections]);

  /**
   * Calculate the baseline Y coordinate based on container height
   */
  const calculateBaselineY = useCallback(() => {
    if (!containerRef.current) return 0;
    const containerRect = containerRef.current.getBoundingClientRect();
    return containerRect.top + containerRect.height * baselinePosition;
  }, [containerRef, baselinePosition]);

  /**
   * Find the section element by its ID using data-section-id attribute
   */
  const findSectionElement = useCallback(
    (sectionId: string): HTMLElement | null => {
      if (!containerRef.current) return null;
      return containerRef.current.querySelector(`[data-section-id="${sectionId}"]`);
    },
    [containerRef]
  );

  /**
   * Determine which section is currently at or above the baseline
   * Returns the index of the section that has most recently crossed the baseline
   */
  const findCurrentSectionIndex = useCallback((): number => {
    if (!containerRef.current || sections.length === 0) return -1;

    const baseline = calculateBaselineY();
    let currentIndex = -1;

    // Iterate through sections to find the one at or just above the baseline
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const element = findSectionElement(section.id);

      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const sectionTop = rect.top;

      // If section's top is at or above the baseline, it's a candidate
      // We want the last (lowest on page) section that's above the baseline
      if (sectionTop <= baseline) {
        currentIndex = i;
      } else {
        // Once we find a section below the baseline, stop
        // The previous section (if any) is the current one
        break;
      }
    }

    return currentIndex;
  }, [containerRef, sections, calculateBaselineY, findSectionElement]);

  /**
   * Handle scroll events with throttling
   */
  const handleScroll = useCallback(() => {
    if (throttleRef.current !== null) return;

    throttleRef.current = window.setTimeout(() => {
      throttleRef.current = null;

      const newIndex = findCurrentSectionIndex();

      if (newIndex !== lastSectionIndexRef.current) {
        lastSectionIndexRef.current = newIndex;
        setCurrentSectionIndex(newIndex);

        // Fire callback if section changed and we have a valid section
        if (newIndex >= 0 && newIndex < sections.length) {
          onSectionChangeRef.current?.(sections[newIndex]);
        }
      }
    }, SCROLL_THROTTLE_MS);
  }, [findCurrentSectionIndex, sections]);

  /**
   * Update baseline Y when container size changes
   */
  useEffect(() => {
    const updateBaseline = () => {
      setBaselineY(calculateBaselineY());
    };

    updateBaseline();

    // Listen for resize events
    window.addEventListener('resize', updateBaseline);

    return () => {
      window.removeEventListener('resize', updateBaseline);
    };
  }, [calculateBaselineY]);

  /**
   * Set up scroll monitoring when playing
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!isPlaying || !container) {
      // Clear throttle timer when stopping
      if (throttleRef.current !== null) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
      return;
    }

    // Initial check when starting playback
    handleScroll();

    // Add scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (throttleRef.current !== null) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
    };
  }, [isPlaying, containerRef, handleScroll]);

  /**
   * Reset section tracking when sections change
   */
  useEffect(() => {
    lastSectionIndexRef.current = -1;
    setCurrentSectionIndex(-1);

    // Re-evaluate current section if playing
    if (isPlaying) {
      handleScroll();
    }
  }, [sections, isPlaying, handleScroll]);

  return {
    currentSection,
    currentSectionIndex,
    baselineY,
  };
}

export default usePlaybackSync;
