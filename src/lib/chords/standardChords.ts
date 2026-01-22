/**
 * CaT4G - Standard Chord Fingering Library
 * 標準的なコードの押さえ方ライブラリ
 *
 * ベストプラクティスに従った、実用的で弾きやすい押さえ方を提供
 */

import type { ChordFingering } from './types';

// 標準コードフォームのデータ
// キー: コード名（例: "F#m", "Dm6"）
// 値: フィンガリングの配列（最初が最も一般的/推奨）
export const STANDARD_CHORD_FINGERINGS: Record<string, ChordFingering[]> = {
  // ============================================
  // メジャーコード - 全ルート音
  // ============================================

  // C Major
  'C': [
    {
      id: 'C-open',
      frets: [0, 1, 0, 2, 3, null],
      fingers: [null, 1, null, 2, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'C-barre-A',
      frets: [3, 5, 5, 5, 3, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
    {
      id: 'C-barre-E',
      frets: [8, 8, 9, 10, 10, 8],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 8,
      barreStrings: [0, 5],
      baseFret: 8,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],

  // C# / Db Major
  'C#': [
    {
      id: 'C#-barre-A',
      frets: [4, 6, 6, 6, 4, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'C#-barre-E',
      frets: [9, 9, 10, 11, 11, 9],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 9,
      barreStrings: [0, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],
  'Db': [
    {
      id: 'Db-barre-A',
      frets: [4, 6, 6, 6, 4, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // D Major
  'D': [
    {
      id: 'D-open',
      frets: [2, 3, 2, 0, null, null],
      fingers: [1, 3, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'D-barre-A',
      frets: [5, 7, 7, 7, 5, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 5,
      barreStrings: [0, 4],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
    {
      id: 'D-barre-E',
      frets: [10, 10, 11, 12, 12, 10],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 10,
      barreStrings: [0, 5],
      baseFret: 10,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],

  // D# / Eb Major
  'D#': [
    {
      id: 'D#-barre-A',
      frets: [6, 8, 8, 8, 6, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Eb': [
    {
      id: 'Eb-barre-A',
      frets: [6, 8, 8, 8, 6, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // E Major
  'E': [
    {
      id: 'E-open',
      frets: [0, 0, 1, 2, 2, 0],
      fingers: [null, null, 1, 3, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'E-barre-A',
      frets: [7, 9, 9, 9, 7, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 7,
      barreStrings: [0, 4],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // F Major
  'F': [
    {
      id: 'F-barre',
      frets: [1, 1, 2, 3, 3, 1],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
    {
      id: 'F-easy',
      frets: [1, 1, 2, 3, null, null],
      fingers: [1, 1, 2, 3, null, null],
      barreAt: 1,
      barreStrings: [0, 1],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: false,
      difficulty: 'medium',
    },
    {
      id: 'F-barre-A',
      frets: [8, 10, 10, 10, 8, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 8,
      barreStrings: [0, 4],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // F# / Gb Major
  'F#': [
    {
      id: 'F#-barre-E',
      frets: [2, 2, 3, 4, 4, 2],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'F#-barre-A',
      frets: [9, 11, 11, 11, 9, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 9,
      barreStrings: [0, 4],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Gb': [
    {
      id: 'Gb-barre-E',
      frets: [2, 2, 3, 4, 4, 2],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // G Major
  'G': [
    {
      id: 'G-open',
      frets: [3, 0, 0, 0, 2, 3],
      fingers: [4, null, null, null, 1, 2],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'G-barre-E',
      frets: [3, 3, 4, 5, 5, 3],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
    {
      id: 'G-barre-A',
      frets: [10, 12, 12, 12, 10, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 10,
      barreStrings: [0, 4],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'hard',
    },
  ],

  // G# / Ab Major
  'G#': [
    {
      id: 'G#-barre-E',
      frets: [4, 4, 5, 6, 6, 4],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'G#-barre-A',
      frets: [11, 13, 13, 13, 11, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 11,
      barreStrings: [0, 4],
      baseFret: 11,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'hard',
    },
  ],
  'Ab': [
    {
      id: 'Ab-barre-E',
      frets: [4, 4, 5, 6, 6, 4],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // A Major
  'A': [
    {
      id: 'A-open',
      frets: [0, 2, 2, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'A-barre-E',
      frets: [5, 5, 6, 7, 7, 5],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 5,
      barreStrings: [0, 5],
      baseFret: 5,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // A# / Bb Major
  'A#': [
    {
      id: 'A#-barre-A',
      frets: [1, 3, 3, 3, 1, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'A#-barre-E',
      frets: [6, 6, 7, 8, 8, 6],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Bb': [
    {
      id: 'Bb-barre-A',
      frets: [1, 3, 3, 3, 1, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Bb-barre-E',
      frets: [6, 6, 7, 8, 8, 6],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // B Major
  'B': [
    {
      id: 'B-barre-A',
      frets: [2, 4, 4, 4, 2, null],
      fingers: [1, 3, 3, 3, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'B-barre-E',
      frets: [7, 7, 8, 9, 9, 7],
      fingers: [1, 1, 2, 4, 3, 1],
      barreAt: 7,
      barreStrings: [0, 5],
      baseFret: 7,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーコード - 全ルート音
  // ============================================

  // C Minor
  'Cm': [
    {
      id: 'Cm-barre-A',
      frets: [3, 4, 5, 5, 3, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Cm-barre-E',
      frets: [8, 8, 8, 10, 10, 8],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 8,
      barreStrings: [0, 5],
      baseFret: 8,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],

  // C# / Db Minor
  'C#m': [
    {
      id: 'C#m-barre-A',
      frets: [4, 5, 6, 6, 4, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'C#m-barre-E',
      frets: [9, 9, 9, 11, 11, 9],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 9,
      barreStrings: [0, 5],
      baseFret: 9,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],
  'Dbm': [
    {
      id: 'Dbm-barre-A',
      frets: [4, 5, 6, 6, 4, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // D Minor
  'Dm': [
    {
      id: 'Dm-open',
      frets: [1, 3, 2, 0, null, null],
      fingers: [1, 3, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Dm-barre-A',
      frets: [5, 6, 7, 7, 5, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 5,
      barreStrings: [0, 4],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
    {
      id: 'Dm-barre-E',
      frets: [10, 10, 10, 12, 12, 10],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 10,
      barreStrings: [0, 5],
      baseFret: 10,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],

  // D# / Eb Minor
  'D#m': [
    {
      id: 'D#m-barre-A',
      frets: [6, 7, 8, 8, 6, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Ebm': [
    {
      id: 'Ebm-barre-A',
      frets: [6, 7, 8, 8, 6, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // E Minor
  'Em': [
    {
      id: 'Em-open',
      frets: [0, 0, 0, 2, 2, 0],
      fingers: [null, null, null, 2, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Em-barre-A',
      frets: [7, 8, 9, 9, 7, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 7,
      barreStrings: [0, 4],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // F Minor
  'Fm': [
    {
      id: 'Fm-barre-E',
      frets: [1, 1, 1, 3, 3, 1],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
    {
      id: 'Fm-barre-A',
      frets: [8, 9, 10, 10, 8, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 8,
      barreStrings: [0, 4],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // F# / Gb Minor
  'F#m': [
    {
      id: 'F#m-barre-E',
      frets: [2, 2, 2, 4, 4, 2],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'F#m-barre-A',
      frets: [9, 10, 11, 11, 9, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 9,
      barreStrings: [0, 4],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Gbm': [
    {
      id: 'Gbm-barre-E',
      frets: [2, 2, 2, 4, 4, 2],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // G Minor
  'Gm': [
    {
      id: 'Gm-barre-E',
      frets: [3, 3, 3, 5, 5, 3],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Gm-barre-A',
      frets: [10, 11, 12, 12, 10, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 10,
      barreStrings: [0, 4],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'hard',
    },
  ],

  // G# / Ab Minor
  'G#m': [
    {
      id: 'G#m-barre-E',
      frets: [4, 4, 4, 6, 6, 4],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Abm': [
    {
      id: 'Abm-barre-E',
      frets: [4, 4, 4, 6, 6, 4],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // A Minor
  'Am': [
    {
      id: 'Am-open',
      frets: [0, 1, 2, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Am-barre-E',
      frets: [5, 5, 5, 7, 7, 5],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 5,
      barreStrings: [0, 5],
      baseFret: 5,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // A# / Bb Minor
  'A#m': [
    {
      id: 'A#m-barre-A',
      frets: [1, 2, 3, 3, 1, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'A#m-barre-E',
      frets: [6, 6, 6, 8, 8, 6],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Bbm': [
    {
      id: 'Bbm-barre-A',
      frets: [1, 2, 3, 3, 1, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 1,
      barreStrings: [0, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Bbm-barre-E',
      frets: [6, 6, 6, 8, 8, 6],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // B Minor
  'Bm': [
    {
      id: 'Bm-barre-A',
      frets: [2, 3, 4, 4, 2, null],
      fingers: [1, 2, 4, 3, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Bm-barre-E',
      frets: [7, 7, 7, 9, 9, 7],
      fingers: [1, 1, 1, 4, 3, 1],
      barreAt: 7,
      barreStrings: [0, 5],
      baseFret: 7,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // メジャー6th コード
  // ============================================

  'C6': [
    {
      id: 'C6-open',
      frets: [0, 1, 2, 2, 3, null],
      fingers: [null, 1, 2, 3, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'D6': [
    {
      id: 'D6-open',
      frets: [2, 0, 2, 2, 0, null],
      fingers: [2, null, 3, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'E6': [
    {
      id: 'E6-open',
      frets: [0, 2, 1, 2, 2, 0],
      fingers: [null, 3, 1, 2, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'F6': [
    {
      id: 'F6-barre',
      frets: [1, 3, 2, 3, null, 1],
      fingers: [1, 3, 2, 4, null, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'G6': [
    {
      id: 'G6-open',
      frets: [0, 0, 0, 0, 2, 3],
      fingers: [null, null, null, null, 1, 2],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'A6': [
    {
      id: 'A6-open',
      frets: [2, 2, 2, 2, 0, null],
      fingers: [1, 2, 3, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナー6th コード (m6)
  // ============================================

  'Cm6': [
    {
      id: 'Cm6-barre',
      frets: [3, 5, 5, 5, 3, null],
      fingers: [1, 3, 3, 4, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Dm6': [
    {
      id: 'Dm6-open',
      frets: [1, 0, 2, 0, null, null],
      fingers: [1, null, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Dm6-alt',
      frets: [1, 2, 2, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: false,
      difficulty: 'easy',
    },
  ],

  'Em6': [
    {
      id: 'Em6-open',
      frets: [0, 2, 0, 2, 2, 0],
      fingers: [null, 1, null, 2, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Fm6': [
    {
      id: 'Fm6-barre',
      frets: [1, 3, 1, 3, 3, 1],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'F#m6': [
    {
      id: 'F#m6-barre',
      frets: [2, 4, 2, 4, 4, 2],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],
  'Gbm6': [
    {
      id: 'Gbm6-barre',
      frets: [2, 4, 2, 4, 4, 2],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'Gm6': [
    {
      id: 'Gm6-barre',
      frets: [3, 5, 3, 5, 5, 3],
      fingers: [1, 3, 1, 4, 2, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'Am6': [
    {
      id: 'Am6-open',
      frets: [0, 1, 2, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Am6-alt',
      frets: [2, 1, 2, 2, 0, null],
      fingers: [2, 1, 3, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],

  'Bm6': [
    {
      id: 'Bm6-barre',
      frets: [2, 3, 4, 4, 2, null],
      fingers: [1, 2, 3, 4, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーメジャー7th コード (mM7)
  // ============================================

  'CmM7': [
    {
      id: 'CmM7-barre',
      frets: [3, 4, 4, 5, 3, null],
      fingers: [1, 2, 2, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'DmM7': [
    {
      id: 'DmM7-open',
      frets: [1, 3, 2, 1, null, null],
      fingers: [1, 4, 2, 1, null, null],
      barreAt: 1,
      barreStrings: [0, 3],
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'EmM7': [
    {
      id: 'EmM7-open',
      frets: [0, 0, 0, 2, 1, 0],
      fingers: [null, null, null, 2, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'FmM7': [
    {
      id: 'FmM7-barre',
      frets: [1, 1, 1, 3, 2, 1],
      fingers: [1, 1, 1, 4, 2, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'F#mM7': [
    {
      id: 'F#mM7-barre',
      frets: [2, 2, 2, 4, 3, 2],
      fingers: [1, 1, 1, 4, 2, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'GmM7': [
    {
      id: 'GmM7-barre',
      frets: [3, 3, 3, 5, 4, 3],
      fingers: [1, 1, 1, 4, 2, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'AmM7': [
    {
      id: 'AmM7-open',
      frets: [0, 1, 1, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'BmM7': [
    {
      id: 'BmM7-barre',
      frets: [2, 3, 3, 4, 2, null],
      fingers: [1, 2, 2, 3, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  // ============================================
  // セブンスコード (7)
  // ============================================

  'C7': [
    {
      id: 'C7-open',
      frets: [0, 1, 3, 2, 3, null],
      fingers: [null, 1, 3, 2, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'D7': [
    {
      id: 'D7-open',
      frets: [2, 1, 2, 0, null, null],
      fingers: [3, 1, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'E7': [
    {
      id: 'E7-open',
      frets: [0, 0, 1, 0, 2, 0],
      fingers: [null, null, 1, null, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'F7': [
    {
      id: 'F7-barre',
      frets: [1, 1, 2, 1, 3, 1],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'F#7': [
    {
      id: 'F#7-barre',
      frets: [2, 2, 3, 2, 4, 2],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],
  'Gb7': [
    {
      id: 'Gb7-barre',
      frets: [2, 2, 3, 2, 4, 2],
      fingers: [1, 1, 2, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'G7': [
    {
      id: 'G7-open',
      frets: [1, 0, 0, 0, 2, 3],
      fingers: [1, null, null, null, 2, 3],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'A7': [
    {
      id: 'A7-open',
      frets: [0, 2, 0, 2, 0, null],
      fingers: [null, 2, null, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'B7': [
    {
      id: 'B7-open',
      frets: [2, 0, 2, 1, 2, null],
      fingers: [2, null, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // マイナーセブンスコード (m7)
  // ============================================

  'Cm7': [
    {
      id: 'Cm7-barre',
      frets: [3, 4, 3, 5, 3, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // C#m7 / Dbm7
  'C#m7': [
    {
      id: 'C#m7-barre',
      frets: [4, 4, 4, 4, 6, 4],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Dbm7': [
    {
      id: 'Dbm7-barre',
      frets: [4, 4, 4, 4, 6, 4],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Dm7': [
    {
      id: 'Dm7-open',
      frets: [1, 1, 2, 0, null, null],
      fingers: [1, 1, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // D#m7 / Ebm7
  'D#m7': [
    {
      id: 'D#m7-barre',
      frets: [6, 6, 6, 6, 8, 6],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Ebm7': [
    {
      id: 'Ebm7-barre',
      frets: [6, 6, 6, 6, 8, 6],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Em7': [
    {
      id: 'Em7-open',
      frets: [0, 0, 0, 0, 2, 0],
      fingers: [null, null, null, null, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Fm7': [
    {
      id: 'Fm7-barre',
      frets: [1, 1, 1, 1, 3, 1],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'F#m7': [
    {
      id: 'F#m7-barre',
      frets: [2, 2, 2, 2, 4, 2],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Gbm7': [
    {
      id: 'Gbm7-barre',
      frets: [2, 2, 2, 2, 4, 2],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Gm7': [
    {
      id: 'Gm7-barre',
      frets: [3, 3, 3, 3, 5, 3],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // G#m7 / Abm7
  'G#m7': [
    {
      id: 'G#m7-barre',
      frets: [4, 4, 4, 4, 6, 4],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Abm7': [
    {
      id: 'Abm7-barre',
      frets: [4, 4, 4, 4, 6, 4],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Am7': [
    {
      id: 'Am7-open',
      frets: [0, 1, 0, 2, 0, null],
      fingers: [null, 1, null, 2, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // A#m7 / Bbm7
  'A#m7': [
    {
      id: 'A#m7-barre',
      frets: [1, 1, 1, 1, 3, 1],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Bbm7': [
    {
      id: 'Bbm7-barre',
      frets: [1, 1, 1, 1, 3, 1],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Bm7': [
    {
      id: 'Bm7-barre',
      frets: [2, 3, 2, 4, 2, null],
      fingers: [1, 2, 1, 4, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // メジャーセブンスコード (M7 / maj7)
  // ============================================

  'CM7': [
    {
      id: 'CM7-open',
      frets: [0, 0, 0, 2, 3, null],
      fingers: [null, null, null, 2, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'DM7': [
    {
      id: 'DM7-open',
      frets: [2, 2, 2, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'EM7': [
    {
      id: 'EM7-open',
      frets: [0, 0, 1, 1, 2, 0],
      fingers: [null, null, 1, 2, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'FM7': [
    {
      id: 'FM7-open',
      frets: [0, 1, 2, 3, null, null],
      fingers: [null, 1, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'F#M7': [
    {
      id: 'F#M7-barre',
      frets: [2, 2, 3, 3, 4, 2],
      fingers: [1, 1, 2, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],
  'GbM7': [
    {
      id: 'GbM7-barre',
      frets: [2, 2, 3, 3, 4, 2],
      fingers: [1, 1, 2, 3, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'GM7': [
    {
      id: 'GM7-open',
      frets: [2, 0, 0, 0, 2, 3],
      fingers: [1, null, null, null, 2, 3],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'AM7': [
    {
      id: 'AM7-open',
      frets: [0, 2, 1, 2, 0, null],
      fingers: [null, 3, 1, 2, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'BM7': [
    {
      id: 'BM7-barre',
      frets: [2, 4, 3, 4, 2, null],
      fingers: [1, 3, 2, 4, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  // ============================================
  // sus4 コード
  // ============================================

  'Csus4': [
    {
      id: 'Csus4-open',
      frets: [1, 1, 0, 3, 3, null],
      fingers: [1, 1, null, 3, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Dsus4': [
    {
      id: 'Dsus4-open',
      frets: [3, 3, 2, 0, null, null],
      fingers: [3, 4, 1, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Esus4': [
    {
      id: 'Esus4-open',
      frets: [0, 0, 2, 2, 2, 0],
      fingers: [null, null, 2, 3, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Fsus4': [
    {
      id: 'Fsus4-barre',
      frets: [1, 1, 3, 3, 3, 1],
      fingers: [1, 1, 3, 3, 4, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'Gsus4': [
    {
      id: 'Gsus4-open',
      frets: [3, 1, 0, 0, 3, 3],
      fingers: [3, 1, null, null, 4, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Asus4': [
    {
      id: 'Asus4-open',
      frets: [0, 3, 2, 2, 0, null],
      fingers: [null, 4, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Bsus4': [
    {
      id: 'Bsus4-barre',
      frets: [2, 5, 4, 4, 2, null],
      fingers: [1, 4, 3, 2, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  // ============================================
  // sus2 コード
  // ============================================

  'Csus2': [
    {
      id: 'Csus2-open',
      frets: [0, 3, 0, 0, 3, null],
      fingers: [null, 2, null, null, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Dsus2': [
    {
      id: 'Dsus2-open',
      frets: [0, 3, 2, 0, null, null],
      fingers: [null, 3, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Esus2': [
    {
      id: 'Esus2-open',
      frets: [2, 4, 4, 2, 2, null],
      fingers: [1, 3, 4, 1, 1, null],
      barreAt: 2,
      barreStrings: [0, 4],
      baseFret: 2,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Gsus2': [
    {
      id: 'Gsus2-open',
      frets: [3, 0, 0, 0, 0, 3],
      fingers: [3, null, null, null, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Asus2': [
    {
      id: 'Asus2-open',
      frets: [0, 0, 2, 2, 0, null],
      fingers: [null, null, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // ============================================
  // ディミニッシュコード (dim)
  // ============================================

  'Cdim': [
    {
      id: 'Cdim-open',
      frets: [2, 4, 2, 4, null, null],
      fingers: [1, 3, 1, 4, null, null],
      barreAt: 2,
      barreStrings: [0, 2],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Ddim': [
    {
      id: 'Ddim-open',
      frets: [1, 3, 1, null, null, null],
      fingers: [1, 3, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, true, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Edim': [
    {
      id: 'Edim-open',
      frets: [2, 4, 2, 3, null, null],
      fingers: [1, 4, 1, 2, null, null],
      barreAt: 2,
      barreStrings: [0, 2],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Fdim': [
    {
      id: 'Fdim-open',
      frets: [1, 2, null, 1, null, null],
      fingers: [1, 2, null, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, true, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Gdim': [
    {
      id: 'Gdim-open',
      frets: [2, 3, null, 3, null, null],
      fingers: [1, 2, null, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, true, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Adim': [
    {
      id: 'Adim-open',
      frets: [1, 2, 1, 2, null, null],
      fingers: [1, 3, 2, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Bdim': [
    {
      id: 'Bdim-open',
      frets: [2, 3, 4, 2, null, null],
      fingers: [1, 2, 3, 1, null, null],
      barreAt: 2,
      barreStrings: [0, 3],
      baseFret: 2,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // オーギュメントコード (aug)
  // ============================================

  'Caug': [
    {
      id: 'Caug-open',
      frets: [0, 1, 1, 2, 3, null],
      fingers: [null, 1, 2, 3, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Daug': [
    {
      id: 'Daug-open',
      frets: [2, 3, 3, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Eaug': [
    {
      id: 'Eaug-open',
      frets: [0, 1, 1, 2, 2, 0],
      fingers: [null, 1, 2, 3, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Faug': [
    {
      id: 'Faug-barre',
      frets: [1, 2, 2, 3, 3, 1],
      fingers: [1, 2, 2, 4, 3, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],

  'Gaug': [
    {
      id: 'Gaug-open',
      frets: [3, 0, 1, 0, 2, 3],
      fingers: [4, null, 1, null, 2, 3],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Aaug': [
    {
      id: 'Aaug-open',
      frets: [1, 2, 2, 2, 0, null],
      fingers: [1, 2, 3, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Baug': [
    {
      id: 'Baug-open',
      frets: [3, 4, 4, 4, null, null],
      fingers: [1, 2, 3, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 3,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // ============================================
  // add9 コード
  // ============================================

  'Cadd9': [
    {
      id: 'Cadd9-open',
      frets: [0, 3, 0, 2, 3, null],
      fingers: [null, 2, null, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Dadd9': [
    {
      id: 'Dadd9-open',
      frets: [0, 3, 2, 0, null, null],
      fingers: [null, 3, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Eadd9': [
    {
      id: 'Eadd9-open',
      frets: [0, 0, 1, 2, 2, 2],
      fingers: [null, null, 1, 2, 3, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'Gadd9': [
    {
      id: 'Gadd9-open',
      frets: [3, 0, 2, 0, 0, 3],
      fingers: [3, null, 2, null, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'Aadd9': [
    {
      id: 'Aadd9-open',
      frets: [0, 0, 2, 2, 0, null],
      fingers: [null, null, 1, 2, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // ============================================
  // 9th コード
  // ============================================

  'C9': [
    {
      id: 'C9-open',
      frets: [0, 3, 2, 3, 3, null],
      fingers: [null, 2, 1, 3, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'D9': [
    {
      id: 'D9-open',
      frets: [0, 1, 2, 0, null, null],
      fingers: [null, 1, 2, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'E9': [
    {
      id: 'E9-open',
      frets: [0, 2, 0, 1, 2, 0],
      fingers: [null, 2, null, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  'G9': [
    {
      id: 'G9-open',
      frets: [1, 0, 0, 0, 0, 3],
      fingers: [1, null, null, null, null, 2],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  'A9': [
    {
      id: 'A9-open',
      frets: [0, 2, 2, 2, 0, null],
      fingers: [null, 1, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // ============================================
  // m7b5 (ハーフディミニッシュ) - 全ルート音
  // ============================================

  // Cm7b5 / Cm7-5
  'Cm7b5': [
    {
      id: 'Cm7b5-open',
      frets: [3, 4, 3, 4, 3, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Cm7-5': [
    {
      id: 'Cm7-5-std',
      frets: [3, 4, 3, 4, 3, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 3,
      barreStrings: [0, 4],
      baseFret: 3,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // C#m7b5 / Dbm7b5
  'C#m7b5': [
    {
      id: 'C#m7b5-std',
      frets: [4, 5, 4, 5, 4, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'C#m7-5': [
    {
      id: 'C#m7-5-std',
      frets: [4, 5, 4, 5, 4, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Dbm7b5': [
    {
      id: 'Dbm7b5-std',
      frets: [4, 5, 4, 5, 4, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 4,
      barreStrings: [0, 4],
      baseFret: 4,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // Dm7b5
  'Dm7b5': [
    {
      id: 'Dm7b5-open',
      frets: [1, 1, 1, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Dm7b5-barre',
      frets: [5, 6, 5, 6, 5, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 5,
      barreStrings: [0, 4],
      baseFret: 5,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Dm7-5': [
    {
      id: 'Dm7-5-open',
      frets: [1, 1, 1, 0, null, null],
      fingers: [1, 2, 3, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // D#m7b5 / Ebm7b5
  'D#m7b5': [
    {
      id: 'D#m7b5-std',
      frets: [6, 7, 6, 7, 6, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Ebm7b5': [
    {
      id: 'Ebm7b5-std',
      frets: [6, 7, 6, 7, 6, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 6,
      barreStrings: [0, 4],
      baseFret: 6,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // Em7b5
  'Em7b5': [
    {
      id: 'Em7b5-open',
      frets: [0, 0, 0, 0, 2, 0],
      fingers: [null, null, null, null, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Em7b5-barre',
      frets: [7, 8, 7, 8, 7, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 7,
      barreStrings: [0, 4],
      baseFret: 7,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Em7-5': [
    {
      id: 'Em7-5-open',
      frets: [0, 0, 0, 0, 2, 0],
      fingers: [null, null, null, null, 1, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // Fm7b5
  'Fm7b5': [
    {
      id: 'Fm7b5-std',
      frets: [1, 2, 1, 1, null, 1],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Fm7b5-barre',
      frets: [8, 9, 8, 9, 8, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 8,
      barreStrings: [0, 4],
      baseFret: 8,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Fm7-5': [
    {
      id: 'Fm7-5-std',
      frets: [1, 2, 1, 1, null, 1],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // F#m7b5 / Gbm7b5
  'F#m7b5': [
    {
      id: 'F#m7b5-std',
      frets: [2, 3, 2, 2, null, 2],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'F#m7b5-barre',
      frets: [9, 10, 9, 10, 9, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 9,
      barreStrings: [0, 4],
      baseFret: 9,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'F#m7-5': [
    {
      id: 'F#m7-5-std',
      frets: [2, 3, 2, 2, null, 2],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Gbm7b5': [
    {
      id: 'Gbm7b5-std',
      frets: [2, 3, 2, 2, null, 2],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // Gm7b5
  'Gm7b5': [
    {
      id: 'Gm7b5-std',
      frets: [3, 4, 3, 3, null, 3],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Gm7b5-barre',
      frets: [10, 11, 10, 11, 10, null],
      fingers: [1, 2, 1, 3, 1, null],
      barreAt: 10,
      barreStrings: [0, 4],
      baseFret: 10,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Gm7-5': [
    {
      id: 'Gm7-5-std',
      frets: [3, 4, 3, 3, null, 3],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // G#m7b5 / Abm7b5
  'G#m7b5': [
    {
      id: 'G#m7b5-std',
      frets: [4, 5, 4, 4, null, 4],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Abm7b5': [
    {
      id: 'Abm7b5-std',
      frets: [4, 5, 4, 4, null, 4],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // Am7b5
  'Am7b5': [
    {
      id: 'Am7b5-open',
      frets: [0, 1, 0, 1, 0, null],
      fingers: [null, 1, null, 2, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Am7b5-std',
      frets: [5, 6, 5, 5, null, 5],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 5,
      barreStrings: [0, 5],
      baseFret: 5,
      muted: [false, false, false, false, true, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Am7-5': [
    {
      id: 'Am7-5-open',
      frets: [0, 1, 0, 1, 0, null],
      fingers: [null, 1, null, 2, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // A#m7b5 / Bbm7b5
  'A#m7b5': [
    {
      id: 'A#m7b5-std',
      frets: [6, 7, 6, 6, null, 6],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Bbm7b5': [
    {
      id: 'Bbm7b5-std',
      frets: [6, 7, 6, 6, null, 6],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, true, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],

  // Bm7b5
  'Bm7b5': [
    {
      id: 'Bm7b5-open',
      frets: [0, 0, 2, 2, 2, null],
      fingers: [null, null, 1, 2, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Bm7b5-std',
      frets: [7, 8, 7, 7, null, 7],
      fingers: [1, 2, 1, 1, null, 1],
      barreAt: 7,
      barreStrings: [0, 5],
      baseFret: 7,
      muted: [false, false, false, false, true, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Bm7-5': [
    {
      id: 'Bm7-5-open',
      frets: [0, 0, 2, 2, 2, null],
      fingers: [null, null, 1, 2, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],

  // ============================================
  // Diminished 7th Chords (dim7)
  // ============================================

  'Cdim7': [
    {
      id: 'Cdim7-std',
      frets: [null, 3, 4, 2, 4, null],
      fingers: [null, 2, 3, 1, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Cdim7-alt',
      frets: [2, null, 1, 2, 1, null],
      fingers: [3, null, 1, 4, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'C#dim7': [
    {
      id: 'C#dim7-std',
      frets: [null, 4, 5, 3, 5, null],
      fingers: [null, 2, 3, 1, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'C#dim7-alt',
      frets: [null, null, 2, 3, 2, 3],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'Dbdim7': [
    {
      id: 'Dbdim7-std',
      frets: [null, 4, 5, 3, 5, null],
      fingers: [null, 2, 3, 1, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 3,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Ddim7': [
    {
      id: 'Ddim7-open',
      frets: [null, null, 0, 1, 0, 1],
      fingers: [null, null, null, 1, null, 2],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Ddim7-barre',
      frets: [null, 5, 6, 4, 6, null],
      fingers: [null, 2, 3, 1, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'D#dim7': [
    {
      id: 'D#dim7-open',
      frets: [null, null, 1, 2, 1, 2],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'D#dim7-barre',
      frets: [null, 6, 7, 5, 7, null],
      fingers: [null, 2, 3, 1, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Ebdim7': [
    {
      id: 'Ebdim7-open',
      frets: [null, null, 1, 2, 1, 2],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
  ],
  'Edim7': [
    {
      id: 'Edim7-open',
      frets: [0, 1, 2, 0, 2, 0],
      fingers: [null, 1, 2, null, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Edim7-alt',
      frets: [null, null, 2, 3, 2, 3],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'Fdim7': [
    {
      id: 'Fdim7-barre',
      frets: [1, 2, 3, 1, 3, 1],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 1,
      barreStrings: [0, 5],
      baseFret: 1,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Fdim7-alt',
      frets: [null, null, 3, 4, 3, 4],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'F#dim7': [
    {
      id: 'F#dim7-barre',
      frets: [2, 3, 4, 2, 4, 2],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'F#dim7-alt',
      frets: [null, null, 4, 5, 4, 5],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'Gbdim7': [
    {
      id: 'Gbdim7-barre',
      frets: [2, 3, 4, 2, 4, 2],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 2,
      barreStrings: [0, 5],
      baseFret: 2,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Gdim7': [
    {
      id: 'Gdim7-barre',
      frets: [3, 4, 5, 3, 5, 3],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 3,
      barreStrings: [0, 5],
      baseFret: 3,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Gdim7-alt',
      frets: [null, null, 5, 6, 5, 6],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 5,
      muted: [true, true, false, false, false, false],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'G#dim7': [
    {
      id: 'G#dim7-barre',
      frets: [4, 5, 6, 4, 6, 4],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
    {
      id: 'G#dim7-open',
      frets: [null, null, 0, 1, 0, 1],
      fingers: [null, null, null, 2, null, 3],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'Abdim7': [
    {
      id: 'Abdim7-barre',
      frets: [4, 5, 6, 4, 6, 4],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 4,
      barreStrings: [0, 5],
      baseFret: 4,
      muted: [false, false, false, false, false, false],
      isDefault: true,
      difficulty: 'hard',
    },
  ],
  'Adim7': [
    {
      id: 'Adim7-open',
      frets: [null, 0, 1, 2, 1, 2],
      fingers: [null, null, 1, 3, 2, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Adim7-barre',
      frets: [5, 6, 7, 5, 7, 5],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 5,
      barreStrings: [0, 5],
      baseFret: 5,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],
  'A#dim7': [
    {
      id: 'A#dim7-std',
      frets: [null, 1, 2, 3, 2, 3],
      fingers: [null, 1, 2, 4, 3, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'A#dim7-barre',
      frets: [6, 7, 8, 6, 8, 6],
      fingers: [1, 2, 3, 1, 4, 1],
      barreAt: 6,
      barreStrings: [0, 5],
      baseFret: 6,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: 'hard',
    },
  ],
  'Bbdim7': [
    {
      id: 'Bbdim7-std',
      frets: [null, 1, 2, 3, 2, 3],
      fingers: [null, 1, 2, 4, 3, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Bdim7': [
    {
      id: 'Bdim7-std',
      frets: [null, 2, 3, 4, 3, 4],
      fingers: [null, 1, 2, 4, 3, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, false],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Bdim7-open',
      frets: [null, null, 0, 1, 0, 1],
      fingers: [null, null, null, 2, null, 3],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, true, false, false, false, false],
      isDefault: false,
      difficulty: 'easy',
    },
  ],

  // ============================================
  // Blackadder Chord (blk) - 分数aug
  // 構成音: Root + M2 + #4 + m7 = [0, 2, 6, 10]
  // 例: Cblk = C + D + F# + Bb = F#aug/C
  // ============================================
  'Cblk': [
    {
      id: 'Cblk-A',
      frets: [null, 3, 4, 3, 3, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Cblk-E',
      frets: [8, null, 8, 7, 7, null],
      fingers: [4, null, 3, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 7,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'C#blk': [
    {
      id: 'C#blk-A',
      frets: [null, 4, 5, 4, 4, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'C#blk-E',
      frets: [9, null, 9, 8, 8, null],
      fingers: [4, null, 3, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 8,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'hard',
    },
  ],
  'Dbblk': [
    {
      id: 'Dbblk-A',
      frets: [null, 4, 5, 4, 4, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 4,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Dblk': [
    {
      id: 'Dblk-A',
      frets: [null, 5, 6, 5, 5, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 5,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Dblk-E',
      frets: [10, null, 10, 9, 9, null],
      fingers: [4, null, 3, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 9,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'hard',
    },
  ],
  'D#blk': [
    {
      id: 'D#blk-A',
      frets: [null, 6, 7, 6, 6, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Ebblk': [
    {
      id: 'Ebblk-A',
      frets: [null, 6, 7, 6, 6, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 6,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Eblk': [
    {
      id: 'Eblk-A',
      frets: [null, 7, 8, 7, 7, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 7,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
    {
      id: 'Eblk-open',
      frets: [0, null, 0, 3, null, 2],
      fingers: [null, null, null, 3, null, 2],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, true, false],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'Fblk': [
    {
      id: 'Fblk-A',
      frets: [null, 8, 9, 8, 8, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 8,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'hard',
    },
    {
      id: 'Fblk-E',
      frets: [1, null, 1, 0, 0, null],
      fingers: [2, null, 3, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'F#blk': [
    {
      id: 'F#blk-A',
      frets: [null, 9, 10, 9, 9, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 9,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'hard',
    },
    {
      id: 'F#blk-E',
      frets: [2, null, 2, 1, 1, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'Gbblk': [
    {
      id: 'Gbblk-E',
      frets: [2, null, 2, 1, 1, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],
  'Gblk': [
    {
      id: 'Gblk-A',
      frets: [null, 10, 11, 10, 10, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 10,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'hard',
    },
    {
      id: 'Gblk-E',
      frets: [3, null, 3, 2, 2, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'easy',
    },
  ],
  'G#blk': [
    {
      id: 'G#blk-E',
      frets: [4, null, 4, 3, 3, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Abblk': [
    {
      id: 'Abblk-E',
      frets: [4, null, 4, 3, 3, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: true,
      difficulty: 'medium',
    },
  ],
  'Ablk': [
    {
      id: 'Ablk-open',
      frets: [null, 0, 1, 0, 0, null],
      fingers: [null, null, 1, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Ablk-E',
      frets: [5, null, 5, 4, 4, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'A#blk': [
    {
      id: 'A#blk-A',
      frets: [null, 1, 2, 1, 1, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'A#blk-E',
      frets: [6, null, 6, 5, 5, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 5,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
  'Bbblk': [
    {
      id: 'Bbblk-A',
      frets: [null, 1, 2, 1, 1, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
  ],
  'Bblk': [
    {
      id: 'Bblk-A',
      frets: [null, 2, 3, 2, 2, null],
      fingers: [null, 2, 4, 1, 3, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    },
    {
      id: 'Bblk-E',
      frets: [7, null, 7, 6, 6, null],
      fingers: [3, null, 4, 1, 2, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 6,
      muted: [false, true, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    },
  ],
};

/**
 * 標準コードライブラリからフィンガリングを取得
 * @param chordName コード名（例: "F#m", "Dm6"）
 * @returns フィンガリングの配列、見つからない場合は空配列
 */
// 異名同音のルート音変換マップ
const ENHARMONIC_ROOTS: Record<string, string> = {
  Fb: 'E',
  Cb: 'B',
  'E#': 'F',
  'B#': 'C',
};

export function getStandardChordFingerings(chordName: string): ChordFingering[] {
  // そのまま検索
  if (STANDARD_CHORD_FINGERINGS[chordName]) {
    return STANDARD_CHORD_FINGERINGS[chordName];
  }

  // 正規化して検索（♯→#、♭→b）
  const normalized = chordName.replace(/♯/g, '#').replace(/♭/g, 'b');
  if (STANDARD_CHORD_FINGERINGS[normalized]) {
    return STANDARD_CHORD_FINGERINGS[normalized];
  }

  // 異名同音変換して検索（Fb→E, Cb→B など）
  const enharmonicMatch = normalized.match(/^([A-G][#b]?)(.*)$/);
  if (enharmonicMatch) {
    const root = enharmonicMatch[1];
    const quality = enharmonicMatch[2];
    const enharmonicRoot = ENHARMONIC_ROOTS[root];
    if (enharmonicRoot) {
      const enharmonicChord = enharmonicRoot + quality;
      if (STANDARD_CHORD_FINGERINGS[enharmonicChord]) {
        return STANDARD_CHORD_FINGERINGS[enharmonicChord];
      }
    }
  }

  // エイリアスで検索（maj7 → M7, min → m など）
  const aliases: Record<string, string> = {
    'maj7': 'M7',
    'Maj7': 'M7',
    'maj': '',
    'min': 'm',
    'mi': 'm',
    '-': 'm',
    'min7': 'm7',
    '-7': 'm7',
    'minMaj7': 'mM7',
    'min/maj7': 'mM7',
    'mMaj7': 'mM7',
    'm(M7)': 'mM7',
    'm/M7': 'mM7',
    '-6': 'm6',
    'min6': 'm6',
    'aug': 'aug',
    '+': 'aug',
    'o': 'dim',
    '°': 'dim',
  };

  // コード名をルートと品質に分離
  const match = normalized.match(/^([A-G][#b]?)(.*)$/);
  if (match) {
    const root = match[1];
    let quality = match[2];

    // 品質のエイリアスを変換
    if (aliases[quality]) {
      quality = aliases[quality];
    }

    const aliasedName = root + quality;
    if (STANDARD_CHORD_FINGERINGS[aliasedName]) {
      return STANDARD_CHORD_FINGERINGS[aliasedName];
    }
  }

  return [];
}

/**
 * 標準コードライブラリにコードが存在するかチェック
 */
export function hasStandardChord(chordName: string): boolean {
  return getStandardChordFingerings(chordName).length > 0;
}
