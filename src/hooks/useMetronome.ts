import { useState, useEffect, useRef, useCallback } from 'react';

export type TimeSignature = '4/4' | '3/4' | '6/8' | '2/4';

export interface UseMetronomeOptions {
  bpm: number;
  timeSignature: TimeSignature;
  volume: number;
  accentFirstBeat?: boolean;
}

export interface UseMetronomeReturn {
  isPlaying: boolean;
  currentBeat: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

// BPM constraints
const MIN_BPM = 40;
const MAX_BPM = 240;
const DEFAULT_BPM = 120;

// Audio settings
const ACCENT_FREQUENCY = 1000; // Hz
const NORMAL_FREQUENCY = 800; // Hz
const CLICK_DURATION = 0.1; // seconds
const SCHEDULE_AHEAD_TIME = 0.1; // 100ms look-ahead

/**
 * Clamp BPM to valid range
 */
function clampBpm(bpm: number): number {
  if (isNaN(bpm) || !isFinite(bpm)) {
    return DEFAULT_BPM;
  }
  return Math.max(MIN_BPM, Math.min(MAX_BPM, bpm));
}

/**
 * Get beats per measure from time signature
 */
function getBeatsPerMeasure(timeSignature: TimeSignature): number {
  const beats = parseInt(timeSignature.split('/')[0], 10);
  return isNaN(beats) ? 4 : beats;
}

/**
 * useMetronome - Web Audio API based metronome hook
 *
 * Provides precise timing using AudioContext scheduling with
 * requestAnimationFrame for UI updates.
 */
export function useMetronome({
  bpm,
  timeSignature,
  volume,
  accentFirstBeat = true,
}: UseMetronomeOptions): UseMetronomeReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Refs for audio state (not triggering re-renders)
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const schedulerIdRef = useRef<number | null>(null);
  const currentBeatRef = useRef(0);

  // Store latest values in refs to avoid stale closures in scheduler
  const bpmRef = useRef(clampBpm(bpm));
  const volumeRef = useRef(Math.max(0, Math.min(1, volume)));
  const accentFirstBeatRef = useRef(accentFirstBeat);
  const beatsPerMeasureRef = useRef(getBeatsPerMeasure(timeSignature));

  // Update refs when props change
  useEffect(() => {
    bpmRef.current = clampBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
  }, [volume]);

  useEffect(() => {
    accentFirstBeatRef.current = accentFirstBeat;
  }, [accentFirstBeat]);

  useEffect(() => {
    beatsPerMeasureRef.current = getBeatsPerMeasure(timeSignature);
  }, [timeSignature]);

  /**
   * Schedule a click sound at a specific time
   */
  const scheduleClick = useCallback((time: number, isAccent: boolean) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Accent beat uses higher frequency
    osc.frequency.value = isAccent ? ACCENT_FREQUENCY : NORMAL_FREQUENCY;
    osc.type = 'sine';

    // Set initial volume (accent is louder)
    const vol = volumeRef.current;
    const initialGain = vol * (isAccent ? 1.0 : 0.7);
    gain.gain.setValueAtTime(initialGain, time);

    // Exponential decay to near-zero
    gain.gain.exponentialRampToValueAtTime(0.001, time + CLICK_DURATION);

    osc.start(time);
    osc.stop(time + CLICK_DURATION);
  }, []);

  /**
   * Scheduler loop - schedules notes ahead of time for precise timing
   */
  const scheduler = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const secondsPerBeat = 60.0 / bpmRef.current;

    // Schedule all notes that fall within our look-ahead window
    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
      const isAccent = accentFirstBeatRef.current && currentBeatRef.current === 0;

      // Schedule the click at the precise time
      scheduleClick(nextNoteTimeRef.current, isAccent);

      // UI更新用に現在のビート番号を保存（インクリメント前）
      const beatToDisplay = currentBeatRef.current;
      const delayMs = Math.max(0, (nextNoteTimeRef.current - ctx.currentTime) * 1000);
      setTimeout(() => {
        setCurrentBeat(beatToDisplay);
      }, delayMs);

      // Advance to next beat（UI更新のスケジュール後）
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasureRef.current;

      nextNoteTimeRef.current += secondsPerBeat;
    }

    // Continue scheduling
    schedulerIdRef.current = requestAnimationFrame(scheduler);
  }, [scheduleClick]);

  /**
   * Start the metronome
   */
  const start = useCallback(() => {
    // Create AudioContext if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Reset beat position
    currentBeatRef.current = 0;
    setCurrentBeat(0);

    // Start scheduling from now
    nextNoteTimeRef.current = ctx.currentTime;

    setIsPlaying(true);
    scheduler();
  }, [scheduler]);

  /**
   * Stop the metronome
   */
  const stop = useCallback(() => {
    // Cancel any scheduled animation frame
    if (schedulerIdRef.current !== null) {
      cancelAnimationFrame(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }

    setIsPlaying(false);
    setCurrentBeat(0);
    currentBeatRef.current = 0;
  }, []);

  /**
   * Toggle metronome on/off
   */
  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  // Restart when BPM or time signature changes while playing
  useEffect(() => {
    if (isPlaying) {
      stop();
      const timeoutId = setTimeout(() => {
        start();
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [bpm, timeSignature]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (schedulerIdRef.current !== null) {
        cancelAnimationFrame(schedulerIdRef.current);
        schedulerIdRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  return {
    isPlaying,
    currentBeat,
    start,
    stop,
    toggle,
  };
}

export default useMetronome;
