/**
 * CaT4G - Chord Utilities
 * コード関連ユーティリティのエクスポート
 */

// Types
export type {
  NoteRoot,
  ChordQuality,
  ChordDifficulty,
  ChordFingering,
  ChordDefinition,
  ParsedChord,
  UserChordPreference,
} from './types';

// Transpose utilities
export {
  NOTES,
  NOTES_FLAT,
  NOTE_ALIASES,
  normalizeNote,
  parseChord,
  transposeNote,
  transposeChord,
  getRecommendedCapo,
  guessKeyFromChords,
} from './transpose';

// Chord database
export {
  CHORD_DATABASE,
  getChordDefinition,
  getDefaultFingering,
  getAllChordNames,
  buildChordName,
} from './database';

// Standard chord library (comprehensive fingering database)
export {
  STANDARD_CHORD_FINGERINGS,
  getStandardChordFingerings,
  hasStandardChord,
} from './standardChords';

// CAGED system chord generator
export {
  getCAGEDChordFingerings,
  isCAGEDSupported,
  generateMajorCAGED,
  generateMinorCAGED,
} from './cagedChords';

// Dynamic chord generator
export { generateChordFingering, generateChordFingerings } from './generator';
