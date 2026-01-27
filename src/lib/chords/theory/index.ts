/**
 * CaT4G - Music Theory Module
 * 音楽理論に基づくコード定義の統一システム
 */

// インターバル関連
export {
  INTERVALS,
  EXTENDED_INTERVALS,
  getIntervalSemitones,
  normalizeToOctave,
  normalizeIntervals,
  getSemitoneName,
  INTERVAL_NAMES_JP,
} from './intervals';

export type { IntervalName, ExtendedIntervalName, AllIntervalName } from './intervals';

// コード公式関連
export {
  formulaToIntervals,
  formulaToString,
  COMMON_FORMULAS,
} from './formulas';

export type {
  ChordBase,
  SeventhType,
  Extension,
  Alteration,
  ChordFormula,
} from './formulas';

// レジストリ関連
export {
  CHORD_REGISTRY,
  CHORD_ALIASES,
  getIntervalsFromRegistry,
  normalizeQualityFromRegistry,
  isInRegistry,
  getAllRegisteredQualities,
  getAllAliases,
} from './registry';

// 分数コード関連
export {
  SLASH_CHORD_PATTERNS,
  getSlashChordNotes,
  parseSlashChord,
  calculateBassInterval,
  getSlashChordInfo,
  getAllSlashChordPatterns,
  getSupportedBassIntervals,
} from './slashChords';

export type { SlashChordDefinition } from './slashChords';

// 分数コードフィンガリング生成
export {
  generateSlashChordFingerings,
  generateFingeringFromSlashChordName,
} from './slashChordGenerator';
