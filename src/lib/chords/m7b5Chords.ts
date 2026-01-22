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
  // Am7b5: A, C, Eb, G
  A: [
    {
      // Open position - 最も簡単
      frets: [null, 0, 1, 0, 1, null],
      fingers: [null, null, 1, null, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      // 5th fret barre
      frets: [5, 6, 5, 5, null, null],
      fingers: [1, 2, 1, 1, null, null],
      barreAt: 5,
      barreStrings: [0, 3],
      baseFret: 5,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
  ],

  // A#/Bbm7b5: Bb, Db, E, Ab
  'A#': [
    {
      // 1st fret barre (based on Am7b5 shape)
      frets: [null, 1, 2, 1, 2, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 1,
      barreStrings: [1, 3],
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // 6th fret
      frets: [6, 7, 6, 6, null, null],
      fingers: [1, 2, 1, 1, null, null],
      barreAt: 6,
      barreStrings: [0, 3],
      baseFret: 6,
      muted: [false, false, false, false, true, true],
      difficulty: 'hard',
    },
  ],

  // Bm7b5: B, D, F, A
  B: [
    {
      // 2nd fret - スタンダード形
      frets: [null, 2, 3, 2, 3, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 2,
      barreStrings: [1, 3],
      baseFret: 2,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // 7th fret
      frets: [7, 8, 7, 7, null, null],
      fingers: [1, 2, 1, 1, null, null],
      barreAt: 7,
      barreStrings: [0, 3],
      baseFret: 7,
      muted: [false, false, false, false, true, true],
      difficulty: 'hard',
    },
  ],

  // Cm7b5: C, Eb, Gb, Bb
  C: [
    {
      // 3rd fret barre
      frets: [null, 3, 4, 3, 4, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 3,
      barreStrings: [1, 3],
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // 8th fret
      frets: [null, 8, 8, 8, 7, null],
      fingers: [null, 2, 3, 4, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // C#/Dbm7b5: Db, E, G, B
  'C#': [
    {
      // 4th fret barre
      frets: [null, 4, 5, 4, 5, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 4,
      barreStrings: [1, 3],
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // 9th fret
      frets: [null, 9, 9, 9, 8, null],
      fingers: [null, 2, 3, 4, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Dm7b5: D, F, Ab, C
  D: [
    {
      // Open position
      frets: [null, null, 0, 1, 1, 1],
      fingers: [null, null, null, 1, 2, 3],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      difficulty: 'easy',
    },
    {
      // 5th fret barre
      frets: [null, 5, 6, 5, 6, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 5,
      barreStrings: [1, 3],
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      difficulty: 'medium',
    },
  ],

  // D#/Ebm7b5: Eb, Gb, A, Db
  'D#': [
    {
      // 6th fret barre
      frets: [null, 6, 7, 6, 7, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 6,
      barreStrings: [1, 3],
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
    {
      // 1st fret (based on open D shape)
      frets: [null, null, 1, 2, 2, 2],
      fingers: [null, null, 1, 2, 3, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      difficulty: 'medium',
    },
  ],

  // Em7b5: E, G, Bb, D
  E: [
    {
      // Open position
      frets: [0, 1, 0, 0, 2, null],
      fingers: [null, 1, null, null, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'easy',
    },
    {
      // 7th fret barre
      frets: [null, 7, 8, 7, 8, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 7,
      barreStrings: [1, 3],
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Fm7b5: F, Ab, B, Eb
  F: [
    {
      // 1st fret
      frets: [1, 2, 1, 1, 3, null],
      fingers: [1, 2, 1, 1, 3, null],
      barreAt: 1,
      barreStrings: [0, 3],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // 8th fret barre
      frets: [null, 8, 9, 8, 9, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 8,
      barreStrings: [1, 3],
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // F#/Gbm7b5: Gb, A, C, E
  'F#': [
    {
      // 2nd fret
      frets: [2, 3, 2, 2, 4, null],
      fingers: [1, 2, 1, 1, 3, null],
      barreAt: 2,
      barreStrings: [0, 3],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      difficulty: 'medium',
    },
    {
      // 9th fret barre
      frets: [null, 9, 10, 9, 10, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 9,
      barreStrings: [1, 3],
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // Gm7b5: G, Bb, Db, F
  G: [
    {
      // 3rd fret
      frets: [3, 4, 3, 3, null, null],
      fingers: [1, 2, 1, 1, null, null],
      barreAt: 3,
      barreStrings: [0, 3],
      baseFret: 3,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
    {
      // 10th fret barre
      frets: [null, 10, 11, 10, 11, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 10,
      barreStrings: [1, 3],
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      difficulty: 'hard',
    },
  ],

  // G#/Abm7b5: Ab, B, D, Gb
  'G#': [
    {
      // 4th fret
      frets: [4, 5, 4, 4, null, null],
      fingers: [1, 2, 1, 1, null, null],
      barreAt: 4,
      barreStrings: [0, 3],
      baseFret: 4,
      muted: [false, false, false, false, true, true],
      difficulty: 'medium',
    },
    {
      // 11th fret barre
      frets: [null, 11, 12, 11, 12, null],
      fingers: [null, 1, 2, 1, 3, null],
      barreAt: 11,
      barreStrings: [1, 3],
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
