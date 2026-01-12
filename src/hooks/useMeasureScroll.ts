import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Line information with measure count
 */
export interface LineInfo {
  /** Unique identifier for the line */
  id: string;
  /** Number of measures in this line (default: 4) */
  measures: number;
}

/**
 * Section information with lines and optional overrides
 */
export interface MeasureSectionInfo {
  /** Unique identifier for the section */
  id: string;
  /** Array of lines in this section */
  lines: LineInfo[];
  /** Section-specific BPM override (null = use song BPM) */
  bpmOverride: number | null;
  /** Section-specific playback speed override (null = use default 1.0) */
  playbackSpeedOverride: number | null;
}

/**
 * Options for the useMeasureScroll hook
 */
export interface UseMeasureScrollOptions {
  /** Reference to the scrollable container element */
  containerRef: React.RefObject<HTMLElement>;
  /** Array of section information with lines */
  sections: MeasureSectionInfo[];
  /** Base BPM for the song */
  songBpm: number;
  /** Time signature (e.g., '4/4', '3/4', '6/8') */
  songTimeSignature: string;
  /** Whether playback is currently active */
  isPlaying: boolean;
  /** Callback fired when the current line changes */
  onLineChange?: (sectionIndex: number, lineIndex: number) => void;
  /** External scroll function (from SongView) */
  scrollToLine?: (lineId: string) => void;
}

/**
 * Return type for the useMeasureScroll hook
 */
export interface UseMeasureScrollReturn {
  /** Index of the current section (0-based) */
  currentSectionIndex: number;
  /** Index of the current line within the section (0-based) */
  currentLineIndex: number;
  /** Current beat within the line (0-based) */
  currentBeat: number;
  /** Total beats in the current line */
  totalBeatsInLine: number;
  /** Manually scroll to a specific line by indices */
  scrollToLine: (sectionIndex: number, lineIndex: number) => void;
  /** Reset playback to the beginning */
  reset: () => void;
  /** Jump to a specific line by ID */
  jumpToLine: (lineId: string) => void;
}

// TICK_INTERVAL_MS removed - now using requestAnimationFrame for high-precision timing

/**
 * Parse time signature string to get beats per measure
 * @param timeSignature Time signature string (e.g., '4/4', '3/4', '6/8')
 * @returns Beats per measure (numerator of time signature)
 */
function parseBeatsPerMeasure(timeSignature: string): number {
  const parts = timeSignature.split('/');
  const numerator = parseInt(parts[0], 10);
  return isNaN(numerator) || numerator <= 0 ? 4 : numerator;
}

/**
 * Calculate milliseconds per beat from BPM
 * @param bpm Beats per minute
 * @returns Milliseconds per beat
 */
function calculateMsPerBeat(bpm: number): number {
  if (bpm <= 0) return 500; // Default to 120 BPM
  return 60000 / bpm;
}

/**
 * Measure-based auto-scroll hook for chord sheet playback
 *
 * Automatically scrolls through lines based on BPM, time signature,
 * and the number of measures in each line. Supports section-specific
 * BPM and playback speed overrides.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { currentSectionIndex, currentLineIndex, currentBeat, reset } = useMeasureScroll({
 *   containerRef,
 *   sections: [
 *     {
 *       id: 'intro',
 *       lines: [{ id: 'line-1', measures: 4 }],
 *       bpmOverride: null,
 *       playbackSpeedOverride: null,
 *     },
 *   ],
 *   songBpm: 120,
 *   songTimeSignature: '4/4',
 *   isPlaying: true,
 *   onLineChange: (sectionIdx, lineIdx) => console.log(`Line changed: ${sectionIdx}-${lineIdx}`),
 * });
 * ```
 */
export function useMeasureScroll({
  containerRef: _containerRef,
  sections,
  songBpm,
  songTimeSignature,
  isPlaying,
  onLineChange,
  scrollToLine: externalScrollToLine,
}: UseMeasureScrollOptions): UseMeasureScrollReturn {
  // containerRef is kept for API compatibility but scroll is now handled externally
  void _containerRef;
  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Refs for timer management
  const animationFrameIdRef = useRef<number | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  const currentBeatRef = useRef(0);
  const onLineChangeRef = useRef(onLineChange);
  const handleTickRef = useRef<() => void>(() => {});

  // Keep callback ref updated
  useEffect(() => {
    onLineChangeRef.current = onLineChange;
  }, [onLineChange]);

  /**
   * Get the current line info based on section and line indices
   */
  const getCurrentLineInfo = useCallback((): LineInfo | null => {
    if (currentSectionIndex < 0 || currentSectionIndex >= sections.length) {
      return null;
    }
    const section = sections[currentSectionIndex];
    if (currentLineIndex < 0 || currentLineIndex >= section.lines.length) {
      return null;
    }
    return section.lines[currentLineIndex];
  }, [sections, currentSectionIndex, currentLineIndex]);

  /**
   * Get effective BPM for current section (with override support)
   */
  const getEffectiveBpm = useCallback((): number => {
    if (currentSectionIndex < 0 || currentSectionIndex >= sections.length) {
      return songBpm;
    }
    const section = sections[currentSectionIndex];
    const baseBpm = section.bpmOverride ?? songBpm;
    const speedMultiplier = section.playbackSpeedOverride ?? 1.0;
    return baseBpm * speedMultiplier;
  }, [sections, currentSectionIndex, songBpm]);

  /**
   * Calculate total beats in the current line
   */
  const calculateTotalBeatsInLine = useCallback((): number => {
    const lineInfo = getCurrentLineInfo();
    if (!lineInfo) return 0;
    const beatsPerMeasure = parseBeatsPerMeasure(songTimeSignature);
    return lineInfo.measures * beatsPerMeasure;
  }, [getCurrentLineInfo, songTimeSignature]);

  /**
   * Calculate line duration in milliseconds
   */
  const calculateLineDuration = useCallback((): number => {
    const totalBeats = calculateTotalBeatsInLine();
    const effectiveBpm = getEffectiveBpm();
    const msPerBeat = calculateMsPerBeat(effectiveBpm);
    return totalBeats * msPerBeat;
  }, [calculateTotalBeatsInLine, getEffectiveBpm]);

  /**
   * Advance to the next line
   * Returns true if advanced, false if reached end
   */
  const advanceToNextLine = useCallback((): boolean => {
    if (sections.length === 0) return false;

    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return false;

    // Check if we can advance within the same section
    if (currentLineIndex < currentSection.lines.length - 1) {
      const nextLineIndex = currentLineIndex + 1;
      const nextLine = currentSection.lines[nextLineIndex];

      setCurrentLineIndex(nextLineIndex);
      setCurrentBeat(0);
      currentBeatRef.current = 0;
      playbackStartTimeRef.current = performance.now();

      externalScrollToLine?.(nextLine.id);
      onLineChangeRef.current?.(currentSectionIndex, nextLineIndex);

      return true;
    }

    // Check if we can advance to the next section
    if (currentSectionIndex < sections.length - 1) {
      const nextSectionIndex = currentSectionIndex + 1;
      const nextSection = sections[nextSectionIndex];

      if (nextSection.lines.length > 0) {
        const nextLine = nextSection.lines[0];

        setCurrentSectionIndex(nextSectionIndex);
        setCurrentLineIndex(0);
        setCurrentBeat(0);
        currentBeatRef.current = 0;
        playbackStartTimeRef.current = performance.now();

        externalScrollToLine?.(nextLine.id);
        onLineChangeRef.current?.(nextSectionIndex, 0);

        return true;
      }
    }

    // Reached the end of the song
    return false;
  }, [sections, currentSectionIndex, currentLineIndex, externalScrollToLine]);

  /**
   * Main timer tick handler - uses performance.now() for high-precision timing
   */
  const handleTick = useCallback(() => {
    const lineDuration = calculateLineDuration();
    if (lineDuration <= 0) return;

    const totalBeats = calculateTotalBeatsInLine();
    const msPerBeat = lineDuration / totalBeats;

    // Calculate elapsed time using performance.now() for high precision
    const elapsedMs = performance.now() - playbackStartTimeRef.current;

    // Calculate current beat (use ref for comparison to avoid dependency issues)
    const newBeat = Math.floor(elapsedMs / msPerBeat);
    if (newBeat !== currentBeatRef.current && newBeat < totalBeats) {
      currentBeatRef.current = newBeat;
      setCurrentBeat(newBeat);
    }

    // Check if line duration has elapsed
    if (elapsedMs >= lineDuration) {
      const advanced = advanceToNextLine();
      if (!advanced) {
        // End of song - stop the timer
        if (animationFrameIdRef.current !== null) {
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
        }
      }
    }
  }, [calculateLineDuration, calculateTotalBeatsInLine, advanceToNextLine]);

  // Keep handleTickRef updated with latest handleTick
  useEffect(() => {
    handleTickRef.current = handleTick;
  }, [handleTick]);

  /**
   * Start/stop timer based on isPlaying state
   * Uses requestAnimationFrame for high-precision timing (~16ms vs 50ms with setInterval)
   * Uses ref to avoid recreating the effect when handleTick changes
   */
  useEffect(() => {
    if (isPlaying) {
      // Initialize playback start time
      playbackStartTimeRef.current = performance.now();

      // Start the animation frame loop (use ref to avoid dependency issues)
      const tick = () => {
        handleTickRef.current();
        animationFrameIdRef.current = requestAnimationFrame(tick);
      };
      animationFrameIdRef.current = requestAnimationFrame(tick);
    } else {
      // Stop the timer
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isPlaying]); // Only depend on isPlaying, not handleTick

  /**
   * Manually scroll to a specific line by indices
   */
  const scrollToLine = useCallback(
    (sectionIndex: number, lineIndex: number) => {
      if (sectionIndex < 0 || sectionIndex >= sections.length) return;

      const section = sections[sectionIndex];
      if (lineIndex < 0 || lineIndex >= section.lines.length) return;

      const line = section.lines[lineIndex];

      setCurrentSectionIndex(sectionIndex);
      setCurrentLineIndex(lineIndex);
      setCurrentBeat(0);
      currentBeatRef.current = 0;
      playbackStartTimeRef.current = performance.now();

      externalScrollToLine?.(line.id);
      onLineChangeRef.current?.(sectionIndex, lineIndex);
    },
    [sections, externalScrollToLine]
  );

  /**
   * Jump to a specific line by ID
   */
  const jumpToLine = useCallback(
    (lineId: string) => {
      for (let si = 0; si < sections.length; si++) {
        const li = sections[si].lines.findIndex(l => l.id === lineId);
        if (li !== -1) {
          setCurrentSectionIndex(si);
          setCurrentLineIndex(li);
          setCurrentBeat(0);
          currentBeatRef.current = 0;
          playbackStartTimeRef.current = performance.now();
          externalScrollToLine?.(lineId);
          return;
        }
      }
    },
    [sections, externalScrollToLine]
  );

  /**
   * Reset playback to the beginning
   */
  const reset = useCallback(() => {
    setCurrentSectionIndex(0);
    setCurrentLineIndex(0);
    setCurrentBeat(0);
    currentBeatRef.current = 0;
    playbackStartTimeRef.current = performance.now();
  }, []);

  // Reset when sections change
  useEffect(() => {
    reset();
  }, [sections]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentSectionIndex,
    currentLineIndex,
    currentBeat,
    totalBeatsInLine: calculateTotalBeatsInLine(),
    scrollToLine,
    reset,
    jumpToLine,
  };
}

export default useMeasureScroll;
