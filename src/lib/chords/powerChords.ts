/**
 * CaT4G - Power Chord Generator
 * パワーコード（5）の押さえ方を生成
 */

import type { ChordFingering } from './types.ts';

// 6弦でのフレット位置（E=0, F=1, F#=2, ...）
const ROOT_TO_FRET_6STRING: Record<string, number> = {
  E: 0,
  Fb: 0,
  F: 1,
  'E#': 1,
  'F#': 2,
  Gb: 2,
  G: 3,
  'G#': 4,
  Ab: 4,
  A: 5,
  'A#': 6,
  Bb: 6,
  B: 7,
  Cb: 7,
  C: 8,
  'B#': 8,
  'C#': 9,
  Db: 9,
  D: 10,
  'D#': 11,
  Eb: 11,
};

// 5弦でのフレット位置（A=0, A#=1, B=2, C=3, ...）
const ROOT_TO_FRET_5STRING: Record<string, number> = {
  A: 0,
  'A#': 1,
  Bb: 1,
  B: 2,
  Cb: 2,
  C: 3,
  'B#': 3,
  'C#': 4,
  Db: 4,
  D: 5,
  'D#': 6,
  Eb: 6,
  E: 7,
  Fb: 7,
  F: 8,
  'E#': 8,
  'F#': 9,
  Gb: 9,
  G: 10,
  'G#': 11,
  Ab: 11,
};

/**
 * パワーコードの押さえ方を生成
 * @param root ルート音（C, C#, D, ...）
 * @returns ChordFingering配列
 */
export function generatePowerChordFingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Form A: 6弦ルート型
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // E5 開放弦
      fingerings.push({
        id: `${root}5-6str-open`,
        frets: [null, null, null, 2, 2, 0],
        fingers: [null, null, null, 3, 2, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [true, true, true, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // 移動形（バレー）
      fingerings.push({
        id: `${root}5-6str-barre`,
        frets: [null, null, null, fret6 + 2, fret6, fret6],
        fingers: [null, null, null, 3, 1, 1],
        barreAt: fret6,
        barreStrings: [4, 5],
        baseFret: fret6,
        muted: [true, true, true, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    }
  }

  // Form B: 5弦ルート型
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // A5 開放弦
      fingerings.push({
        id: `${root}5-5str-open`,
        frets: [null, null, null, 2, 0, null],
        fingers: [null, null, null, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [true, true, true, false, false, true],
        isDefault: fret6 === undefined,
        difficulty: 'easy',
      });
    } else {
      // 移動形
      fingerings.push({
        id: `${root}5-5str-barre`,
        frets: [null, null, null, fret5 + 2, fret5, null],
        fingers: [null, null, null, 3, 1, null],
        barreAt: null,
        barreStrings: null,
        baseFret: fret5,
        muted: [true, true, true, false, false, true],
        isDefault: fret6 === undefined,
        difficulty: 'easy',
      });
    }
  }

  // Form C: 低音弦のみバリエーション（高いフレットのルート用）
  // 6弦ルート型で fret > 5 の場合、3弦構成のバリエーションも追加
  if (fret6 !== undefined && fret6 >= 5) {
    fingerings.push({
      id: `${root}5-6str-compact`,
      frets: [null, null, null, null, fret6 + 2, fret6],
      fingers: [null, null, null, null, 3, 1],
      barreAt: null,
      barreStrings: null,
      baseFret: fret6,
      muted: [true, true, true, true, false, false],
      isDefault: false,
      difficulty: 'easy',
    });
  }

  return fingerings;
}

/**
 * コード品質がパワーコードかどうか判定
 * @param quality コード品質文字列
 * @returns パワーコードならtrue
 */
export function isPowerChord(quality: string): boolean {
  return quality === '5';
}

/**
 * コード名からパワーコードの押さえ方を取得
 * @param chordName コード名（例: "E5", "A5", "G5"）
 * @returns ChordFingering配列（パワーコードでない場合は空配列）
 */
export function getPowerChordFingerings(chordName: string): ChordFingering[] {
  // コード名をパース（例: "E5" -> root: "E", quality: "5"）
  const match = chordName.match(/^([A-G][#b]?)5$/);
  if (!match) {
    return [];
  }

  const root = match[1];
  return generatePowerChordFingerings(root);
}
