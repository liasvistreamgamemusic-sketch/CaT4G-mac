/**
 * Hook for managing chord fingering preferences
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/api';
import type { ChordPreference, ChordFingering } from '@/types/database';

export interface UseChordPreferencesReturn {
  /** Map of chord name to preferred fingering */
  preferences: Map<string, ChordFingering>;
  /** All preferences as array (for settings UI) */
  preferencesArray: ChordPreference[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Get preferred fingering for a chord */
  getPreferred: (chordName: string) => ChordFingering | null;
  /** Check if chord has user preference */
  hasPreference: (chordName: string) => boolean;
  /** Set default fingering for a chord */
  setDefault: (chordName: string, fingering: ChordFingering) => Promise<void>;
  /** Remove preference (revert to system default) */
  removeDefault: (chordName: string) => Promise<void>;
  /** Clear all preferences */
  clearAll: () => Promise<void>;
  /** Refresh preferences from database */
  refresh: () => Promise<void>;
}

export function useChordPreferences(): UseChordPreferencesReturn {
  const [preferencesArray, setPreferencesArray] = useState<ChordPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Build Map from array for fast lookups
  const preferences = useMemo(() => {
    const map = new Map<string, ChordFingering>();
    for (const pref of preferencesArray) {
      map.set(pref.chordName, pref.fingering);
    }
    return map;
  }, [preferencesArray]);

  // Load preferences from database
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const prefs = await db.getChordPreferences();
      setPreferencesArray(prefs);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load preferences'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const getPreferred = useCallback(
    (chordName: string): ChordFingering | null => {
      return preferences.get(chordName) ?? null;
    },
    [preferences]
  );

  const hasPreference = useCallback(
    (chordName: string): boolean => {
      return preferences.has(chordName);
    },
    [preferences]
  );

  const setDefault = useCallback(
    async (chordName: string, fingering: ChordFingering): Promise<void> => {
      try {
        await db.setChordPreference(chordName, fingering);
        // Optimistic update
        setPreferencesArray((prev) => {
          const existingIndex = prev.findIndex((p) => p.chordName === chordName);
          const newPref: ChordPreference = {
            id: existingIndex >= 0 ? prev[existingIndex].id : crypto.randomUUID(),
            chordName,
            fingering,
            isDefault: true,
            createdAt: new Date().toISOString(),
          };
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newPref;
            return updated;
          }
          return [...prev, newPref];
        });
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to set preference'));
        throw e;
      }
    },
    []
  );

  const removeDefault = useCallback(async (chordName: string): Promise<void> => {
    try {
      await db.deleteChordPreference(chordName);
      // Optimistic update
      setPreferencesArray((prev) => prev.filter((p) => p.chordName !== chordName));
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to remove preference'));
      throw e;
    }
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      // Delete all preferences one by one
      for (const pref of preferencesArray) {
        await db.deleteChordPreference(pref.chordName);
      }
      setPreferencesArray([]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to clear preferences'));
      throw e;
    }
  }, [preferencesArray]);

  return {
    preferences,
    preferencesArray,
    isLoading,
    error,
    getPreferred,
    hasPreference,
    setDefault,
    removeDefault,
    clearAll,
    refresh: loadPreferences,
  };
}
