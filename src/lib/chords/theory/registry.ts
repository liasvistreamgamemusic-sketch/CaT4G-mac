/**
 * CaT4G - Music Theory: Chord Registry
 * 全コードタイプの一元管理レジストリ
 *
 * このモジュールは、コード品質名からインターバル配列への変換を一元管理する。
 * 新しいコードタイプを追加する際は、ここに定義を追加するだけで良い。
 */

import { ChordFormula, formulaToIntervals, COMMON_FORMULAS } from './formulas';

/**
 * コードレジストリ
 * 全てのコード品質をChordFormulaで定義
 */
export const CHORD_REGISTRY: Record<string, ChordFormula> = {
  // === 基本トライアド ===
  '': COMMON_FORMULAS.major,
  maj: COMMON_FORMULAS.major,
  M: COMMON_FORMULAS.major,
  m: COMMON_FORMULAS.minor,
  min: COMMON_FORMULAS.minor,
  mi: COMMON_FORMULAS.minor,
  '-': COMMON_FORMULAS.minor,
  dim: COMMON_FORMULAS.dim,
  '°': COMMON_FORMULAS.dim,
  o: COMMON_FORMULAS.dim,
  aug: COMMON_FORMULAS.aug,
  '+': COMMON_FORMULAS.aug,
  sus2: COMMON_FORMULAS.sus2,
  sus4: COMMON_FORMULAS.sus4,
  sus: COMMON_FORMULAS.sus4,
  '5': COMMON_FORMULAS.power,

  // === 6th コード ===
  '6': COMMON_FORMULAS['6'],
  M6: COMMON_FORMULAS['6'],
  maj6: COMMON_FORMULAS['6'],
  add6: COMMON_FORMULAS['6'],
  m6: COMMON_FORMULAS.m6,
  min6: COMMON_FORMULAS.m6,
  '-6': COMMON_FORMULAS.m6,

  // === 7th コード ===
  '7': COMMON_FORMULAS['7'],
  M7: COMMON_FORMULAS.M7,
  maj7: COMMON_FORMULAS.M7,
  Maj7: COMMON_FORMULAS.M7,
  'Δ': COMMON_FORMULAS.M7,
  'Δ7': COMMON_FORMULAS.M7,
  m7: COMMON_FORMULAS.m7,
  min7: COMMON_FORMULAS.m7,
  mi7: COMMON_FORMULAS.m7,
  '-7': COMMON_FORMULAS.m7,
  mM7: COMMON_FORMULAS.mM7,
  minMaj7: COMMON_FORMULAS.mM7,
  mMaj7: COMMON_FORMULAS.mM7,
  'm(M7)': COMMON_FORMULAS.mM7,
  'm/M7': COMMON_FORMULAS.mM7,
  'mΔ7': COMMON_FORMULAS.mM7,
  '-Δ7': COMMON_FORMULAS.mM7,
  dim7: COMMON_FORMULAS.dim7,
  '°7': COMMON_FORMULAS.dim7,
  o7: COMMON_FORMULAS.dim7,
  m7b5: COMMON_FORMULAS.m7b5,
  'm7-5': COMMON_FORMULAS.m7b5,
  'ø': COMMON_FORMULAS.m7b5,
  'ø7': COMMON_FORMULAS.m7b5,
  'Ø': COMMON_FORMULAS.m7b5,
  'Ø7': COMMON_FORMULAS.m7b5,
  '-7b5': COMMON_FORMULAS.m7b5,
  aug7: { base: 'aug', seventh: 'dom7' },
  '+7': { base: 'aug', seventh: 'dom7' },
  augM7: { base: 'aug', seventh: 'maj7' },
  'aug(M7)': { base: 'aug', seventh: 'maj7' },
  '+M7': { base: 'aug', seventh: 'maj7' },

  // === 9th コード ===
  '9': COMMON_FORMULAS['9'],
  M9: COMMON_FORMULAS.M9,
  M79: COMMON_FORMULAS.M9, // M7(9) alias
  'M7(9)': COMMON_FORMULAS.M9,
  maj9: COMMON_FORMULAS.M9,
  m9: COMMON_FORMULAS.m9,
  m79: COMMON_FORMULAS.m9, // m7(9) alias
  'm7(9)': COMMON_FORMULAS.m9,
  min9: COMMON_FORMULAS.m9,
  add9: COMMON_FORMULAS.add9,
  add2: { base: 'major', extensions: ['add9'] }, // add2 = add9
  madd9: COMMON_FORMULAS.madd9,

  // === 11th コード ===
  '11': COMMON_FORMULAS['11'],
  m11: COMMON_FORMULAS.m11,
  add11: { base: 'major', extensions: ['add11'] },
  add4: { base: 'major', extensions: ['add11'] },

  // === 13th コード ===
  '13': COMMON_FORMULAS['13'],
  M13: COMMON_FORMULAS.M13,
  maj13: COMMON_FORMULAS.M13,
  m13: COMMON_FORMULAS.m13,
  min13: COMMON_FORMULAS.m13,
  '7(13)': { base: 'major', seventh: 'dom7', extensions: ['13'] },
  'm7(13)': { base: 'minor', seventh: 'dom7', extensions: ['13'] },

  // === 6/9 コード ===
  '69': COMMON_FORMULAS['69'],
  m69: COMMON_FORMULAS.m69,

  // === sus系 7th ===
  '7sus4': COMMON_FORMULAS['7sus4'],
  '7sus': COMMON_FORMULAS['7sus4'],
  '7sus2': COMMON_FORMULAS['7sus2'],
  '9sus4': COMMON_FORMULAS['9sus4'],
  '9sus': COMMON_FORMULAS['9sus4'],

  // === オルタード ===
  '7b5': COMMON_FORMULAS['7b5'],
  '7-5': COMMON_FORMULAS['7b5'],
  '7#5': COMMON_FORMULAS['7#5'],
  '7+5': COMMON_FORMULAS['7#5'],
  'm7+5': { base: 'minor', seventh: 'dom7', alterations: ['#5'] },
  '-5': { base: 'major', alterations: ['b5'] },
  'm-5': { base: 'minor', alterations: ['b5'] },
  'M7-5': { base: 'major', seventh: 'maj7', alterations: ['b5'] },
  'M7b5': { base: 'major', seventh: 'maj7', alterations: ['b5'] },
  'M7#5': { base: 'major', seventh: 'maj7', alterations: ['#5'] },
  'maj7#5': { base: 'major', seventh: 'maj7', alterations: ['#5'] },

  // === オルタードテンション ===
  '7b9': { base: 'major', seventh: 'dom7', extensions: ['b9'] },
  '7#9': { base: 'major', seventh: 'dom7', extensions: ['#9'] },
  '7+9': { base: 'major', seventh: 'dom7', extensions: ['#9'] },
  '7#11': { base: 'major', seventh: 'dom7', extensions: ['#11'] },
  '7(#11)': { base: 'major', seventh: 'dom7', extensions: ['#11'] },
  'M7#11': { base: 'major', seventh: 'maj7', extensions: ['#11'] },
  'maj7#11': { base: 'major', seventh: 'maj7', extensions: ['#11'] },
  'M7(#11)': { base: 'major', seventh: 'maj7', extensions: ['#11'] },
  '7b13': { base: 'major', seventh: 'dom7', extensions: ['b13'] },
  '7(b13)': { base: 'major', seventh: 'dom7', extensions: ['b13'] },

  // === 複合オルタード ===
  '7b5b9': { base: 'major', seventh: 'dom7', alterations: ['b5'], extensions: ['b9'] },
  '7#5b9': { base: 'major', seventh: 'dom7', alterations: ['#5'], extensions: ['b9'] },
  '7#5#9': { base: 'major', seventh: 'dom7', alterations: ['#5'], extensions: ['#9'] },
  'augM7#11': { base: 'aug', seventh: 'maj7', extensions: ['#11'] },
  'augM7(#11)': { base: 'aug', seventh: 'maj7', extensions: ['#11'] },

  // === 特殊コード ===
  '4.4': { base: 'sus4', customIntervals: [0, 5, 10] }, // Quartal chord (C-F-Bb)
  blk: { base: 'major', customIntervals: [0, 2, 6, 10] }, // Blackadder chord
};

/**
 * エイリアスマッピング（正規化用）
 * 左のキーを右の値に正規化する
 */
export const CHORD_ALIASES: Record<string, string> = {
  // メジャー
  maj: '',
  M: '',
  major: '',

  // マイナー
  min: 'm',
  mi: 'm',
  minor: 'm',
  '-': 'm',

  // 7th
  ma7: 'M7',
  Maj7: 'M7',
  maj7: 'M7',
  major7: 'M7',
  'Δ': 'M7',
  'Δ7': 'M7',
  mi7: 'm7',
  min7: 'm7',
  minor7: 'm7',
  '-7': 'm7',
  minMaj7: 'mM7',
  mMaj7: 'mM7',
  'm(M7)': 'mM7',
  'm/M7': 'mM7',
  'min/maj7': 'mM7',
  'minmaj7': 'mM7',
  '-Δ7': 'mM7',
  'mΔ7': 'mM7',

  // ディミニッシュ
  o: 'dim',
  '°': 'dim',
  o7: 'dim7',
  '°7': 'dim7',

  // ハーフディミニッシュ
  'Ø': 'm7b5',
  'Ø7': 'm7b5',
  'ø': 'm7b5',
  'ø7': 'm7b5',
  '-7b5': 'm7b5',
  'min7b5': 'm7b5',
  'm7-5': 'm7b5',

  // 6th
  maj6: '6',
  add6: '6',
  M6: '6',
  min6: 'm6',
  '-6': 'm6',

  // sus
  sus: 'sus4',
  suspended4: 'sus4',
  suspended2: 'sus2',

  // 9th aliases
  M79: 'M9',
  'M7(9)': 'M9',
  m79: 'm9',
  'm7(9)': 'm9',
  min9: 'm9',

  // その他
  '+': 'aug',
  '7+5': '7#5',
  '7-5': '7b5',
};

/**
 * コード品質からインターバル配列を取得
 * レジストリにない場合はnullを返す
 */
export function getIntervalsFromRegistry(quality: string): number[] | null {
  const formula = CHORD_REGISTRY[quality];
  if (formula) {
    return formulaToIntervals(formula);
  }
  return null;
}

/**
 * 品質名を正規化（エイリアス解決）
 */
export function normalizeQualityFromRegistry(quality: string): string {
  return CHORD_ALIASES[quality] || quality;
}

/**
 * レジストリに登録されているか確認
 */
export function isInRegistry(quality: string): boolean {
  return quality in CHORD_REGISTRY;
}

/**
 * 全ての登録済み品質名を取得
 */
export function getAllRegisteredQualities(): string[] {
  return Object.keys(CHORD_REGISTRY);
}

/**
 * 全てのエイリアスを取得
 */
export function getAllAliases(): Record<string, string> {
  return { ...CHORD_ALIASES };
}
