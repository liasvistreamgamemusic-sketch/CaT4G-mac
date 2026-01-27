/**
 * CaT4G - Chord Data Index
 * 全12ルートのコードデータをエクスポート
 *
 * 各ルートファイル:
 * - 31種類の基本品質 (major, minor, 7, m7, M7, etc.)
 * - 10種類の分数コードパターン
 * = 41種類/ルート × 12ルート = 492コード
 */

// Type definitions
export * from './types';

// Root chord data imports
import { C_BASIC, C_SLASH } from './roots/C';
import { CS_BASIC, CS_SLASH } from './roots/Cs';
import { D_BASIC, D_SLASH } from './roots/D';
import { DS_BASIC, DS_SLASH } from './roots/Ds';
import { E_BASIC, E_SLASH } from './roots/E';
import { F_BASIC, F_SLASH } from './roots/F';
import { FS_BASIC, FS_SLASH } from './roots/Fs';
import { G_BASIC, G_SLASH } from './roots/G';
import { GS_BASIC, GS_SLASH } from './roots/Gs';
import { A_BASIC, A_SLASH } from './roots/A';
import { AS_BASIC, AS_SLASH } from './roots/As';
import { B_BASIC, B_SLASH } from './roots/B';

import type { RootNote, ChordQuality, SlashChordPattern, Fingering, AllChordData, RootChordData } from './types';

// Individual root exports
export { C_BASIC, C_SLASH } from './roots/C';
export { CS_BASIC, CS_SLASH } from './roots/Cs';
export { D_BASIC, D_SLASH } from './roots/D';
export { DS_BASIC, DS_SLASH } from './roots/Ds';
export { E_BASIC, E_SLASH } from './roots/E';
export { F_BASIC, F_SLASH } from './roots/F';
export { FS_BASIC, FS_SLASH } from './roots/Fs';
export { G_BASIC, G_SLASH } from './roots/G';
export { GS_BASIC, GS_SLASH } from './roots/Gs';
export { A_BASIC, A_SLASH } from './roots/A';
export { AS_BASIC, AS_SLASH } from './roots/As';
export { B_BASIC, B_SLASH } from './roots/B';

// All chord data organized by root
export const ALL_CHORD_DATA: AllChordData = {
  'C': { basic: C_BASIC, slash: C_SLASH },
  'C#': { basic: CS_BASIC, slash: CS_SLASH },
  'D': { basic: D_BASIC, slash: D_SLASH },
  'D#': { basic: DS_BASIC, slash: DS_SLASH },
  'E': { basic: E_BASIC, slash: E_SLASH },
  'F': { basic: F_BASIC, slash: F_SLASH },
  'F#': { basic: FS_BASIC, slash: FS_SLASH },
  'G': { basic: G_BASIC, slash: G_SLASH },
  'G#': { basic: GS_BASIC, slash: GS_SLASH },
  'A': { basic: A_BASIC, slash: A_SLASH },
  'A#': { basic: AS_BASIC, slash: AS_SLASH },
  'B': { basic: B_BASIC, slash: B_SLASH },
};

// Mapping from root note to basic chord data
const BASIC_DATA_MAP: Record<RootNote, RootChordData> = {
  'C': C_BASIC,
  'C#': CS_BASIC,
  'D': D_BASIC,
  'D#': DS_BASIC,
  'E': E_BASIC,
  'F': F_BASIC,
  'F#': FS_BASIC,
  'G': G_BASIC,
  'G#': GS_BASIC,
  'A': A_BASIC,
  'A#': AS_BASIC,
  'B': B_BASIC,
};

// Mapping from root note to slash chord data
const SLASH_DATA_MAP: Record<RootNote, Record<SlashChordPattern, Fingering[]>> = {
  'C': C_SLASH,
  'C#': CS_SLASH,
  'D': D_SLASH,
  'D#': DS_SLASH,
  'E': E_SLASH,
  'F': F_SLASH,
  'F#': FS_SLASH,
  'G': G_SLASH,
  'G#': GS_SLASH,
  'A': A_SLASH,
  'A#': AS_SLASH,
  'B': B_SLASH,
};

/**
 * Get fingerings for a basic chord (non-slash)
 * @param root Root note (C, C#, D, etc.)
 * @param quality Chord quality ('', 'm', '7', 'm7', 'M7', etc.)
 * @returns Array of fingerings or empty array if not found
 */
export function getBasicChordFingerings(root: RootNote, quality: ChordQuality): Fingering[] {
  const rootData = BASIC_DATA_MAP[root];
  if (!rootData) return [];
  return rootData[quality] || [];
}

/**
 * Get fingerings for a slash chord
 * @param root Root note (C, C#, D, etc.)
 * @param pattern Slash chord pattern ('major/2', 'minor/3', etc.)
 * @returns Array of fingerings or empty array if not found
 */
export function getSlashChordFingerings(root: RootNote, pattern: SlashChordPattern): Fingering[] {
  const rootData = SLASH_DATA_MAP[root];
  if (!rootData) return [];
  return rootData[pattern] || [];
}

/**
 * Get all fingerings for a chord by name
 * @param chordName Full chord name (e.g., 'C', 'Cm7', 'F#dim', 'Am/E')
 * @returns Array of fingerings or empty array if not found
 */
export function getChordFingerings(chordName: string): Fingering[] {
  // Parse chord name
  const parsed = parseChordName(chordName);
  if (!parsed) return [];

  const { root, quality, bass } = parsed;

  // Check if it's a slash chord
  if (bass) {
    const pattern = getSlashPattern(root, quality, bass);
    if (pattern) {
      return getSlashChordFingerings(root as RootNote, pattern);
    }
    // Fallback to basic chord if slash pattern not found
  }

  // Return basic chord fingerings
  return getBasicChordFingerings(root as RootNote, quality as ChordQuality);
}

/**
 * Parse a chord name into root, quality, and optional bass
 */
function parseChordName(chordName: string): { root: string; quality: string; bass?: string } | null {
  // Handle slash chords
  const slashMatch = chordName.match(/^([A-G][#b]?)([^/]*)\/([A-G][#b]?)$/);
  if (slashMatch) {
    return {
      root: normalizeRoot(slashMatch[1]),
      quality: slashMatch[2] || '',
      bass: normalizeRoot(slashMatch[3]),
    };
  }

  // Handle regular chords
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (match) {
    return {
      root: normalizeRoot(match[1]),
      quality: match[2] || '',
    };
  }

  return null;
}

/**
 * Normalize root note to sharp notation
 */
function normalizeRoot(root: string): string {
  const flatToSharp: Record<string, string> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Fb': 'E',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
    'Cb': 'B',
  };
  return flatToSharp[root] || root;
}

/**
 * Determine the slash chord pattern based on root, quality, and bass
 */
function getSlashPattern(root: string, quality: string, bass: string): SlashChordPattern | null {
  const rootMidi = getRootMidi(root);
  const bassMidi = getRootMidi(bass);
  if (rootMidi === -1 || bassMidi === -1) return null;

  const interval = (bassMidi - rootMidi + 12) % 12;

  // Determine quality type
  // Note: Pattern names don't always match semitone intervals
  if (quality === '' || quality === 'maj' || quality === 'M') {
    // Major slash chords (interval -> pattern)
    const majorPatterns: Record<number, SlashChordPattern> = {
      2: 'major/2',   // C/D - 2nd
      4: 'major/4',   // C/E - 3rd
      5: 'major/5',   // C/F - 4th
      7: 'major/5th', // C/G - 5th ★追加
      9: 'major/9',   // C/A - 6th
      10: 'major/10', // C/Bb - minor 7th
      11: 'major/7',  // C/B - major 7th (pattern name is '/7' but interval is 11)
    };
    return majorPatterns[interval] || null;
  } else if (quality === 'm' || quality === 'min') {
    // Minor slash chords
    const minorPatterns: Record<number, SlashChordPattern> = {
      3: 'minor/3',   // Cm/Eb - minor 3rd
      7: 'minor/7',   // Cm/G - 5th
    };
    return minorPatterns[interval] || null;
  } else if (quality === 'm7' || quality === 'min7') {
    // Minor 7 slash chords
    const minor7Patterns: Record<number, SlashChordPattern> = {
      7: 'minor7/5',   // Cm7/G - 5th (pattern name is '/5' but interval is 7)
      10: 'minor7/10', // Cm7/Bb - minor 7th
    };
    return minor7Patterns[interval] || null;
  }

  return null;
}

/**
 * Get MIDI number for a root note
 */
function getRootMidi(root: string): number {
  const midiMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'Fb': 4,
    'F': 5, 'E#': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11, 'Cb': 11, 'B#': 0,
  };
  return midiMap[root] ?? -1;
}
