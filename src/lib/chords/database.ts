/**
 * CaT4G - Chord Database
 * 基本コードの押さえ方データベース
 */

import type { ChordDefinition, ChordFingering, NoteRoot } from './types';
import { isFingeringDisplayable } from './utils';

// 基本コードの押さえ方データ
export const CHORD_DATABASE: Record<string, ChordDefinition> = {
  // ============================================
  // メジャーコード
  // ============================================
  C: {
    root: 'C',
    quality: '',
    fingerings: [
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
    ],
  },
  D: {
    root: 'D',
    quality: '',
    fingerings: [
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
    ],
  },
  E: {
    root: 'E',
    quality: '',
    fingerings: [
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
    ],
  },
  F: {
    root: 'F',
    quality: '',
    fingerings: [
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
    ],
  },
  G: {
    root: 'G',
    quality: '',
    fingerings: [
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
    ],
  },
  A: {
    root: 'A',
    quality: '',
    fingerings: [
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
    ],
  },
  B: {
    root: 'B',
    quality: '',
    fingerings: [
      {
        id: 'B-barre',
        frets: [2, 4, 4, 4, 2, null],
        fingers: [1, 3, 3, 3, 1, null],
        barreAt: 2,
        barreStrings: [0, 4],
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'hard',
      },
    ],
  },

  // ============================================
  // マイナーコード
  // ============================================
  Am: {
    root: 'A',
    quality: 'm',
    fingerings: [
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
    ],
  },
  Dm: {
    root: 'D',
    quality: 'm',
    fingerings: [
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
    ],
  },
  Em: {
    root: 'E',
    quality: 'm',
    fingerings: [
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
    ],
  },
  Fm: {
    root: 'F',
    quality: 'm',
    fingerings: [
      {
        id: 'Fm-barre',
        frets: [1, 1, 1, 3, 3, 1],
        fingers: [1, 1, 1, 4, 3, 1],
        barreAt: 1,
        barreStrings: [0, 5],
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'hard',
      },
    ],
  },
  Gm: {
    root: 'G',
    quality: 'm',
    fingerings: [
      {
        id: 'Gm-barre',
        frets: [3, 3, 3, 5, 5, 3],
        fingers: [1, 1, 1, 4, 3, 1],
        barreAt: 3,
        barreStrings: [0, 5],
        baseFret: 3,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'hard',
      },
    ],
  },
  Bm: {
    root: 'B',
    quality: 'm',
    fingerings: [
      {
        id: 'Bm-barre',
        frets: [2, 3, 4, 4, 2, null],
        fingers: [1, 2, 4, 3, 1, null],
        barreAt: 2,
        barreStrings: [0, 4],
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'hard',
      },
    ],
  },

  // ============================================
  // セブンスコード
  // ============================================
  C7: {
    root: 'C',
    quality: '7',
    fingerings: [
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
  },
  D7: {
    root: 'D',
    quality: '7',
    fingerings: [
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
  },
  E7: {
    root: 'E',
    quality: '7',
    fingerings: [
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
  },
  G7: {
    root: 'G',
    quality: '7',
    fingerings: [
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
  },
  A7: {
    root: 'A',
    quality: '7',
    fingerings: [
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
  },
  B7: {
    root: 'B',
    quality: '7',
    fingerings: [
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
  },

  // ============================================
  // マイナーセブンス
  // ============================================
  Cm7: {
    root: 'C',
    quality: 'm7',
    fingerings: [
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
  },
  'C#m7': {
    root: 'C#',
    quality: 'm7',
    fingerings: [
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
  },
  Dm7: {
    root: 'D',
    quality: 'm7',
    fingerings: [
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
  },
  'D#m7': {
    root: 'D#',
    quality: 'm7',
    fingerings: [
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
  },
  Em7: {
    root: 'E',
    quality: 'm7',
    fingerings: [
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
  },
  Fm7: {
    root: 'F',
    quality: 'm7',
    fingerings: [
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
  },
  'F#m7': {
    root: 'F#',
    quality: 'm7',
    fingerings: [
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
  },
  Gm7: {
    root: 'G',
    quality: 'm7',
    fingerings: [
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
  },
  'G#m7': {
    root: 'G#',
    quality: 'm7',
    fingerings: [
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
  },
  Am7: {
    root: 'A',
    quality: 'm7',
    fingerings: [
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
  },
  'A#m7': {
    root: 'A#',
    quality: 'm7',
    fingerings: [
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
  },
  Bm7: {
    root: 'B',
    quality: 'm7',
    fingerings: [
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
  },

  // ============================================
  // メジャーセブンス
  // ============================================
  CM7: {
    root: 'C',
    quality: 'M7',
    fingerings: [
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
  },
  DM7: {
    root: 'D',
    quality: 'M7',
    fingerings: [
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
  },
  FM7: {
    root: 'F',
    quality: 'M7',
    fingerings: [
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
  },
  GM7: {
    root: 'G',
    quality: 'M7',
    fingerings: [
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
  },
  AM7: {
    root: 'A',
    quality: 'M7',
    fingerings: [
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
  },

  // ============================================
  // sus4 コード
  // ============================================
  Dsus4: {
    root: 'D',
    quality: 'sus4',
    fingerings: [
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
  },
  Asus4: {
    root: 'A',
    quality: 'sus4',
    fingerings: [
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
  },
  Esus4: {
    root: 'E',
    quality: 'sus4',
    fingerings: [
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
  },

  // ============================================
  // add9 コード
  // ============================================
  Cadd9: {
    root: 'C',
    quality: 'add9',
    fingerings: [
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
  },
  Gadd9: {
    root: 'G',
    quality: 'add9',
    fingerings: [
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
  },

  // ============================================
  // 分数コード
  // ============================================
  'D/F#': {
    root: 'D',
    quality: '',
    bass: 'F#',
    fingerings: [
      {
        id: 'D/F#-open',
        frets: [2, 3, 2, 0, 0, 2],
        fingers: [1, 3, 2, null, null, 1],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'medium',
      },
    ],
  },
  'G/B': {
    root: 'G',
    quality: '',
    bass: 'B',
    fingerings: [
      {
        id: 'G/B-open',
        frets: [3, 0, 0, 0, 2, null],
        fingers: [4, null, null, null, 1, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      },
    ],
  },
  'C/E': {
    root: 'C',
    quality: '',
    bass: 'E',
    fingerings: [
      {
        id: 'C/E-open',
        frets: [0, 1, 0, 2, 3, 0],
        fingers: [null, 1, null, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      },
    ],
  },
  'Am/G': {
    root: 'A',
    quality: 'm',
    bass: 'G',
    fingerings: [
      {
        id: 'Am/G-open',
        frets: [0, 1, 2, 2, 0, 3],
        fingers: [null, 1, 2, 3, null, 4],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'medium',
      },
    ],
  },
};

/**
 * コード名を正規化（♯→#、♭→b）
 */
function normalizeChordName(chordName: string): string {
  return chordName.replace(/♯/g, '#').replace(/♭/g, 'b');
}

/**
 * コード名からコード定義を取得
 */
export function getChordDefinition(
  chordName: string
): ChordDefinition | undefined {
  // まず正規化して検索
  const normalized = normalizeChordName(chordName);
  if (CHORD_DATABASE[normalized]) {
    return CHORD_DATABASE[normalized];
  }
  // そのまま検索
  return CHORD_DATABASE[chordName];
}

/**
 * コード名からデフォルトのフィンガリングを取得
 * Only returns fingerings that can be properly displayed (all frets within baseFret+4)
 */
export function getDefaultFingering(
  chordName: string
): ChordFingering | undefined {
  const def = getChordDefinition(chordName);
  if (!def) return undefined;

  // First, try to find a displayable default fingering
  const defaultFingering = def.fingerings.find((f) => f.isDefault);
  if (defaultFingering && isFingeringDisplayable(defaultFingering)) {
    return defaultFingering;
  }

  // If default isn't displayable, find the first displayable one
  // User explicitly stated: "表示フレット以外を押さえるコードは必要ない"
  // So return undefined if no displayable fingering exists
  return def.fingerings.find((f) => isFingeringDisplayable(f));
}

/**
 * 利用可能な全コード名のリストを取得（データベースに定義があるもののみ）
 */
export function getAllChordNames(): string[] {
  return Object.keys(CHORD_DATABASE);
}

/**
 * 全ての一般的なコード名のリストを取得（Genkhord基準: 40種類 × 12ルート = 480コード）
 * データベースに押さえ方がないコードも含む（動的に生成可能）
 */
export function getAllCommonChordNames(): string[] {
  const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Genkhord準拠の30品質（分数コード以外）+ m7
  const qualities = [
    // 基本 (5種)
    '', 'm', '7', 'm7', 'M7',
    // ハーフディミニッシュ系 (2種)
    'm7-5', 'm-5',
    // ディミニッシュ/オーギュメント (3種)
    'dim', 'dim7', 'aug',
    // サスペンド系 (3種)
    'sus2', 'sus4', '7sus4',
    // シックス系 (2種)
    '6', 'm6',
    // マイナーメジャー (1種)
    'mM7',
    // ナインス系 (5種)
    '9', 'm9', 'M9', '9sus4', 'add9',
    // シックスナインス系 (2種)
    '69', 'm69',
    // オルタード系 (6種)
    '-5', '7-5', '7+5', 'M7-5', 'm7+5', '7+9',
    // 特殊 (2種)
    '4.4', 'blk',
  ];

  const chords: string[] = [];

  // 基本コード（30品質 × 12ルート = 360）
  for (const root of roots) {
    for (const quality of qualities) {
      chords.push(root + quality);
    }
  }

  // 分数コード（10種 × 12ルート = 120）
  const intervals = {
    major: [2, 4, 5, 7, 9, 10],  // 全音上, 長3度, 完全4度, 完全5度, 長6度, 短7度
    minor: [3, 7],               // 短3度, 完全5度
    minor7: [5, 10],             // 完全4度, 短7度
  };

  for (const root of roots) {
    const rootIndex = roots.indexOf(root);

    // メジャー分数コード (6種)
    for (const interval of intervals.major) {
      const bassIndex = (rootIndex + interval) % 12;
      const bass = roots[bassIndex];
      chords.push(`${root}/${bass}`);
    }

    // マイナー分数コード (2種)
    for (const interval of intervals.minor) {
      const bassIndex = (rootIndex + interval) % 12;
      const bass = roots[bassIndex];
      chords.push(`${root}m/${bass}`);
    }

    // マイナー7分数コード (2種)
    for (const interval of intervals.minor7) {
      const bassIndex = (rootIndex + interval) % 12;
      const bass = roots[bassIndex];
      chords.push(`${root}m7/${bass}`);
    }
  }

  return chords;
}

/**
 * ルート音と品質からコード名を生成
 */
export function buildChordName(
  root: NoteRoot,
  quality: string,
  bass?: NoteRoot
): string {
  let name = root + quality;
  if (bass) {
    name += '/' + bass;
  }
  return name;
}
