/**
 * Context for chord fingering preferences
 * Provides global access to user's chord preferences
 */

import { createContext, useContext, type ReactNode } from 'react';
import {
  useChordPreferences,
  type UseChordPreferencesReturn,
} from '@/hooks/useChordPreferences';

const ChordPreferencesContext = createContext<UseChordPreferencesReturn | null>(null);

interface ChordPreferencesProviderProps {
  children: ReactNode;
}

export function ChordPreferencesProvider({
  children,
}: ChordPreferencesProviderProps): JSX.Element {
  const chordPreferences = useChordPreferences();

  return (
    <ChordPreferencesContext.Provider value={chordPreferences}>
      {children}
    </ChordPreferencesContext.Provider>
  );
}

export function useChordPreferencesContext(): UseChordPreferencesReturn {
  const context = useContext(ChordPreferencesContext);
  if (!context) {
    throw new Error(
      'useChordPreferencesContext must be used within ChordPreferencesProvider'
    );
  }
  return context;
}

/**
 * Safe version that returns null if not within provider
 * Use this in components that may be rendered outside the provider
 */
export function useChordPreferencesContextSafe(): UseChordPreferencesReturn | null {
  return useContext(ChordPreferencesContext);
}
