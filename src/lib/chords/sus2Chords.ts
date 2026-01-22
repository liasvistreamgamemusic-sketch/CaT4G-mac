/**
 * CaT4G - Sus2 Chord Generator
 * sus2コード（サスペンデッド2nd）の押さえ方を生成
 *
 * 構成音: ルート, M2, P5 [0, 2, 7]
 * 3度がなく、代わりに2度が入る
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

// 4弦でのフレット位置（D=0, D#=1, E=2, F=3, ...）
const ROOT_TO_FRET_4STRING: Record<string, number> = {
  D: 0,
  'D#': 1,
  Eb: 1,
  E: 2,
  F: 3,
  'F#': 4,
  Gb: 4,
  G: 5,
  'G#': 6,
  Ab: 6,
  A: 7,
  'A#': 8,
  Bb: 8,
  B: 9,
  C: 10,
  'C#': 11,
  Db: 11,
};

/**
 * sus2コードの押さえ方を生成
 * @param root ルート音（C, C#, D, ...）
 * @returns ChordFingering配列
 */
export function generateSus2Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  // Asus2 オープンフォーム（5弦ルート）: [0, 0, 2, 2, 0, x]
  if (fret5 === 0) {
    fingerings.push({
      id: `${root}sus2-A-open`,
      frets: [0, 0, 2, 2, 0, null],
      fingers: [null, null, 1, 2, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    });
  }

  // Dsus2 オープンフォーム（4弦ルート）: [0, 3, 2, 0, x, x]
  if (fret4 === 0) {
    fingerings.push({
      id: `${root}sus2-D-open`,
      frets: [0, 3, 2, 0, null, null],
      fingers: [null, 2, 1, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    });
  }

  // Esus2 オープンフォーム（6弦ルート）: [0, 2, 4, 4, 0, 0]
  if (fret6 === 0) {
    fingerings.push({
      id: `${root}sus2-E-open`,
      frets: [0, 2, 4, 4, 0, 0],
      fingers: [null, 1, 3, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    });
    // Esus2 簡易版: [0, 2, 2, x, 0, 0]
    fingerings.push({
      id: `${root}sus2-E-easy`,
      frets: [0, 2, 2, null, 0, 0],
      fingers: [null, 1, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, true, false, false],
      isDefault: false,
      difficulty: 'easy',
    });
  }

  // Gsus2 オープンフォーム: [0, 0, 0, 0, 3, 3]
  if (root === 'G') {
    fingerings.push({
      id: `${root}sus2-G-open`,
      frets: [0, 0, 0, 0, 3, 3],
      fingers: [null, null, null, null, 1, 2],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: fret5 !== 0 && fret4 !== 0 && fret6 !== 0,
      difficulty: 'easy',
    });
  }

  // Csus2 オープンフォーム: [0, 3, 0, 0, 3, x]
  if (root === 'C') {
    fingerings.push({
      id: `${root}sus2-C-open`,
      frets: [0, 3, 0, 0, 3, null],
      fingers: [null, 1, null, null, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: fret5 !== 0 && fret4 !== 0 && fret6 !== 0,
      difficulty: 'easy',
    });
  }

  // Asus2 バレーフォーム（5弦ルート）- 移動形
  if (fret5 !== undefined && fret5 > 0) {
    fingerings.push({
      id: `${root}sus2-A-barre`,
      frets: [fret5, fret5, fret5 + 2, fret5 + 2, fret5, null],
      fingers: [1, 1, 3, 4, 1, null],
      barreAt: fret5,
      barreStrings: [0, 4],
      baseFret: fret5,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    });
  }

  // Esus2 バレーフォーム（6弦ルート）- 移動形
  if (fret6 !== undefined && fret6 > 0) {
    fingerings.push({
      id: `${root}sus2-E-barre`,
      frets: [fret6, fret6 + 2, fret6 + 4, fret6 + 4, fret6, fret6],
      fingers: [1, 2, 3, 4, 1, 1],
      barreAt: fret6,
      barreStrings: [0, 5],
      baseFret: fret6,
      muted: [false, false, false, false, false, false],
      isDefault: fret5 === undefined || fret5 === 0,
      difficulty: 'hard',
    });
  }

  // Dsus2 移動フォーム（4弦ルート）- 高フレット用
  if (fret4 !== undefined && fret4 > 0 && fret4 <= 7) {
    fingerings.push({
      id: `${root}sus2-D-movable`,
      frets: [fret4, fret4 + 3, fret4 + 2, fret4, null, null],
      fingers: [1, 3, 2, 1, null, null],
      barreAt: fret4,
      barreStrings: [0, 3],
      baseFret: fret4,
      muted: [false, false, false, false, true, true],
      isDefault: fret5 === undefined && fret6 === undefined,
      difficulty: 'medium',
    });
  }

  return fingerings;
}

/**
 * コード品質がsus2コードかどうか判定
 * @param quality コード品質文字列
 * @returns sus2コードならtrue
 */
export function isSus2Chord(quality: string): boolean {
  return quality === 'sus2';
}

/**
 * コード名からsus2コードの押さえ方を取得
 * @param chordName コード名（例: "Asus2", "Dsus2", "Gsus2"）
 * @returns ChordFingering配列（sus2コードでない場合は空配列）
 */
export function getSus2ChordFingerings(chordName: string): ChordFingering[] {
  // コード名をパース（例: "Asus2" -> root: "A", quality: "sus2"）
  const match = chordName.match(/^([A-G][#b]?)sus2$/);
  if (!match) {
    return [];
  }

  const root = match[1];
  return generateSus2Fingerings(root);
}
