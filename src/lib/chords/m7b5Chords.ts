/**
 * CaT4G - Half Diminished (m7b5) Chord Generator
 * ハーフディミニッシュコードの押さえ方を生成
 *
 * m7b5 (ハーフディミニッシュ / ø):
 * - 構成音: ルート + m3 + b5 + m7 [0, 3, 6, 10]
 * - ジャズ/クラシックで必須（ii-V-I進行のマイナーキーで頻出）
 * - dim7とは異なり、7thがm7（全音下がり）
 */

import type { ChordFingering } from './types.js';
import { normalizeQuality } from './utils.js';

/**
 * ハーフディミニッシュかどうか判定
 */
export function isHalfDiminished(quality: string): boolean {
  const normalized = normalizeQuality(quality);
  return (
    normalized === 'm7b5' ||
    quality === 'm7b5' ||
    quality === 'm7-5' ||
    quality === 'ø' ||
    quality === 'ø7' ||
    quality === 'Ø' ||
    quality === 'Ø7' ||
    quality === '-7b5' ||
    quality === 'min7b5'
  );
}

/**
 * コード名からハーフディミニッシュのフィンガリングを取得
 */
export function getHalfDiminishedFingerings(chordName: string): ChordFingering[] {
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return [];

  const root = match[1];
  const quality = match[2];

  if (!isHalfDiminished(quality)) return [];

  return generatem7b5Fingerings(root);
}

// 各ルートに対する正しいフィンガリングを定義
// 構成音: ルート, m3, b5, m7 [0, 3, 6, 10]

type M7b5FingeringData = {
  frets: (number | null)[];
  fingers: (number | null)[];
  barreAt: number | null;
  barreStrings: [number, number] | null;
  baseFret: number;
  muted: boolean[];
  difficulty: 'easy' | 'medium' | 'hard';
};

const M7B5_FINGERINGS: Record<string, M7b5FingeringData[]> = {
  // 配列順序: [1弦, 2弦, 3弦, 4弦, 5弦, 6弦]
  // 6弦ルート形をデフォルトに統一: 6弦fret-5弦X-4弦fret-3弦fret-2弦(fret-1)-1弦X
  // → [null, fret-1, fret, fret, null, fret]

  // Am7b5: A, C, Eb, G (6弦5f = A)
  A: [
    {
      // 5th fret - 6弦ルート形（デフォルト）
      frets: [null, 4, 5, 5, null, 5],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 4,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // Open position - 5弦ルート形
      frets: [null, 1, 0, 1, 0, null],
      fingers: [null, 2, null, 1, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
  ],

  // A#/Bbm7b5: Bb, Db, E, Ab (6弦6f = Bb)
  'A#': [
    {
      // 6th fret - 6弦ルート形（デフォルト）
      frets: [null, 5, 6, 6, null, 6],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 5,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 1st fret - 5弦ルート形
      frets: [null, 2, 1, 2, 1, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 1,
      barreStrings: [2, 4],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Bm7b5: B, D, F, A (6弦7f = B)
  B: [
    {
      // 7th fret - 6弦ルート形（デフォルト）
      frets: [null, 6, 7, 7, null, 7],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 6,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 2nd fret - 5弦ルート形
      frets: [null, 3, 2, 3, 2, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 2,
      barreStrings: [2, 4],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Cm7b5: C, Eb, Gb, Bb (6弦8f = C)
  C: [
    {
      // 8th fret - 6弦ルート形（デフォルト）
      frets: [null, 7, 8, 8, null, 8],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 7,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 3rd fret - 5弦ルート形
      frets: [null, 4, 3, 4, 3, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 3,
      barreStrings: [2, 4],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // C#/Dbm7b5: Db, E, G, B (6弦9f = C#)
  'C#': [
    {
      // 9th fret - 6弦ルート形（デフォルト）
      frets: [null, 8, 9, 9, null, 9],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 8,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 4th fret - 5弦ルート形
      frets: [null, 5, 4, 5, 4, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 4,
      barreStrings: [2, 4],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // Dm7b5: D, F, Ab, C (6弦10f = D)
  D: [
    {
      // 10th fret - 6弦ルート形（デフォルト）
      frets: [null, 9, 10, 10, null, 10],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 9,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // Open/5th fret - 5弦ルート形
      frets: [null, 6, 5, 6, 5, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 5,
      barreStrings: [2, 4],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#/Ebm7b5: Eb, Gb, A, Db (6弦11f = D#)
  'D#': [
    {
      // 11th fret - 6弦ルート形（デフォルト）
      frets: [null, 10, 11, 11, null, 11],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 10,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 6th fret - 5弦ルート形
      frets: [null, 7, 6, 7, 6, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 6,
      barreStrings: [2, 4],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Em7b5: E, G, Bb, D (6弦0f/12f = E)
  E: [
    {
      // Open position - 6弦ルート形（デフォルト）
      // 6弦開放=E, 2弦は-1fが無理なので開放弦の異なるボイシング
      frets: [null, 2, 0, 0, null, 0],
      fingers: [null, 1, null, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, true, false],
      difficulty: 'easy',
    },
    {
      // 7th fret - 5弦ルート形
      frets: [null, 8, 7, 8, 7, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 7,
      barreStrings: [2, 4],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Fm7b5: F, Ab, B, Eb (6弦1f = F)
  F: [
    {
      // 1st fret - 6弦ルート形（デフォルト）
      frets: [null, 0, 1, 1, null, 1],
      fingers: [null, null, 1, 2, null, 3],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 8th fret - 5弦ルート形
      frets: [null, 9, 8, 9, 8, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 8,
      barreStrings: [2, 4],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // F#/Gbm7b5: Gb, A, C, E (6弦2f = F#)
  'F#': [
    {
      // 2nd fret - 6弦ルート形（デフォルト）
      frets: [null, 1, 2, 2, null, 2],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 9th fret - 5弦ルート形
      frets: [null, 10, 9, 10, 9, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 9,
      barreStrings: [2, 4],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Gm7b5: G, Bb, Db, F (6弦3f = G)
  G: [
    {
      // 3rd fret - 6弦ルート形（デフォルト）
      frets: [null, 2, 3, 3, null, 3],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 2,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 10th fret - 5弦ルート形
      frets: [null, 11, 10, 11, 10, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 10,
      barreStrings: [2, 4],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#/Abm7b5: Ab, B, D, Gb (6弦4f = G#)
  'G#': [
    {
      // 4th fret - 6弦ルート形（デフォルト）
      frets: [null, 3, 4, 4, null, 4],
      fingers: [null, 1, 2, 3, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 3,
      muted: [true, false, false, false, true, false],
      difficulty: 'medium',
    },
    {
      // 11th fret - 5弦ルート形
      frets: [null, 12, 11, 12, 11, null],
      fingers: [null, 3, 1, 4, 2, null],
      barreAt: 11,
      barreStrings: [2, 4],
      baseFret: 11,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],
};

// エンハーモニック（異名同音）のマッピング
const ENHARMONIC_MAP: Record<string, string> = {
  Bb: 'A#',
  Cb: 'B',
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  'E#': 'F',
  'B#': 'C',
};

/**
 * m7b5コードのフィンガリングを生成
 */
export function generatem7b5Fingerings(root: string): ChordFingering[] {
  // エンハーモニックを正規化
  const normalizedRoot = ENHARMONIC_MAP[root] ?? root;
  const fingeringData = M7B5_FINGERINGS[normalizedRoot];

  if (!fingeringData) {
    return [];
  }

  return fingeringData.map((data, index) => ({
    id: `${root}m7b5-form${index + 1}`,
    frets: data.frets,
    fingers: data.fingers,
    barreAt: data.barreAt,
    barreStrings: data.barreStrings,
    baseFret: data.baseFret,
    muted: data.muted,
    isDefault: index === 0,
    difficulty: data.difficulty,
  }));
}
