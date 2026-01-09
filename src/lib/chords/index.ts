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
  // Full CAGED generators (all 5 positions)
  generateMajorCAGED,
  generateMinorCAGED,
  generate7thCAGED,
  generateMinor7thCAGED,
  generateMajor7thCAGED,
  generateMinor6thCAGED,
  generateMajor6thCAGED,
  generateMinorMajor7thCAGED,
  generateSus4CAGED,
  // C-Form generators
  generateMajorCForm,
  generateMinorCForm,
  generate7thCForm,
  generateMinor7thCForm,
  generateMajor7thCForm,
  generateMinorMajor7thCForm,
  generateMajor6thCForm,
  generateMinor6thCForm,
  generateSus4CForm,
  // G-Form generators
  generateMajorGForm,
  generateMinorGForm,
  generate7thGForm,
  generateMinor7thGForm,
  generateMajor7thGForm,
  generateMinorMajor7thGForm,
  generateMajor6thGForm,
  generateMinor6thGForm,
  generateSus4GForm,
  // D-Form generators
  generateMajorDForm,
  generateMinorDForm,
  generate7thDForm,
  generateMinor7thDForm,
  generateMajor7thDForm,
  generateMinorMajor7thDForm,
  generateMajor6thDForm,
  generateMinor6thDForm,
  generateSus4DForm,
} from './cagedChords';

// Dynamic chord generator
export { generateChordFingering, generateChordFingerings } from './generator';

// Shared utilities
export { normalizeQuality } from './utils';
