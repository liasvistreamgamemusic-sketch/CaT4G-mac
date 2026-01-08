/**
 * CaT4G - Chord Database
 * 基本コードの押さえ方データベース
 */

import type { ChordDefinition, ChordFingering, NoteRoot } from './types';

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
 */
export function getDefaultFingering(
  chordName: string
): ChordFingering | undefined {
  const def = getChordDefinition(chordName);
  if (!def) return undefined;
  return def.fingerings.find((f) => f.isDefault) || def.fingerings[0];
}

/**
 * 利用可能な全コード名のリストを取得
 */
export function getAllChordNames(): string[] {
  return Object.keys(CHORD_DATABASE);
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
