/**
 * CaT4G - Chord Utilities
 * 共有ユーティリティ関数
 */

import type { ChordFingering } from './types';

/** Number of frets displayed in the chord diagram (baseFret to baseFret + DISPLAYED_FRET_COUNT) */
export const DISPLAYED_FRET_COUNT = 4;

/**
 * Check if a chord fingering can be displayed within the diagram's fret range.
 * Returns true if all finger positions are within baseFret ~ baseFret + 4.
 *
 * @param fingering - The chord fingering to validate
 * @returns true if the fingering can be displayed correctly
 */
export function isFingeringDisplayable(fingering: ChordFingering): boolean {
  const minAllowedFret = fingering.baseFret;
  const maxAllowedFret = fingering.baseFret + DISPLAYED_FRET_COUNT;

  return fingering.frets.every((fret, i) => {
    // Null frets, muted strings, and open strings (0) are always OK
    if (fret === null || fingering.muted[i] || fret === 0) return true;
    // Fret must be within the displayable range: baseFret <= fret <= baseFret + 4
    return fret >= minAllowedFret && fret <= maxAllowedFret;
  });
}

/**
 * Filter an array of fingerings to only include those that can be displayed.
 *
 * @param fingerings - Array of fingerings to filter
 * @returns Array of fingerings that fit within display range
 */
export function filterDisplayableFingerings(
  fingerings: ChordFingering[]
): ChordFingering[] {
  return fingerings.filter(isFingeringDisplayable);
}

/**
 * 品質文字列を正規化（エイリアス解決）
 * 様々な表記法を標準形式に変換
 */
export function normalizeQuality(quality: string): string {
  // 一般的なエイリアスマッピング
  const aliases: Record<string, string> = {
    // メジャーセブンス
    'Δ': 'M7',
    'Δ7': 'M7',
    'ma7': 'M7',
    'Maj7': 'M7',
    'maj7': 'M7',
    'major7': 'M7',
    // メジャー
    'maj': '',
    'major': '',
    // マイナー
    'mi': 'm',
    'min': 'm',
    'minor': 'm',
    '-': 'm',
    // マイナーセブンス
    'mi7': 'm7',
    'min7': 'm7',
    'minor7': 'm7',
    '-7': 'm7',
    // マイナーメジャーセブンス
    'minMaj7': 'mM7',
    'mMaj7': 'mM7',
    'm(M7)': 'mM7',
    'm/M7': 'mM7',
    'min/maj7': 'mM7',
    'minmaj7': 'mM7',
    '-Δ7': 'mM7',
    'mΔ7': 'mM7',
    // ディミニッシュ
    'o': 'dim',
    '°': 'dim',
    'o7': 'dim7',
    '°7': 'dim7',
    // ハーフディミニッシュ
    'Ø': 'm7b5',
    'Ø7': 'm7b5',
    'ø': 'm7b5',
    'ø7': 'm7b5',
    '-7b5': 'm7b5',
    'min7b5': 'm7b5',
    'm7-5': 'm7b5',
    // オーギュメント
    'aug': '+',
    // 6th
    'maj6': '6',
    'add6': '6',
    'M6': '6',
    'min6': 'm6',
    '-6': 'm6',
    // sus
    'sus': 'sus4',
    'suspended4': 'sus4',
    'suspended2': 'sus2',
  };

  return aliases[quality] || quality;
}
