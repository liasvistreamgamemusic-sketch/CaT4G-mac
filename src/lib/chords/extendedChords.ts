/**
 * CaT4G - Extended Chord Generator
 * 拡張コード（9系/7sus系/add系/m9系）の押さえ方を生成
 */

import type { ChordFingering, ChordDifficulty } from './types';
import { isFingeringDisplayable } from './utils';

// 6弦でのフレット位置（E=0, F=1, F#=2, G=3, ...）
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
 * 難易度を計算
 */
function calculateDifficulty(baseFret: number, hasBar: boolean): ChordDifficulty {
  if (baseFret === 1 && !hasBar) return 'easy';
  if (baseFret <= 5) return 'medium';
  return 'hard';
}

/**
 * 9コードの押さえ方を生成
 * 9th = R + 3 + 5 + b7 + 9（ドミナント9th）
 */
export function generate9Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // E9フォーム（6弦ルート、5th省略）: x-7-6-7-7-7 relative
  // E9 = [0, 2, 0, 1, 2, 0] -> 実際はE9は特殊形
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // E9開放形
      fingerings.push({
        id: `${root}9-E9-open`,
        frets: [0, 2, 0, 1, 2, 0],
        fingers: [null, 3, null, 1, 2, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret6 <= 9) {
      // E9フォームバレー（5th省略形）
      fingerings.push({
        id: `${root}9-E9-barre`,
        frets: [fret6, fret6 + 2, fret6, fret6 + 1, fret6 + 2, fret6],
        fingers: [1, 3, 1, 2, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: calculateDifficulty(fret6, true),
      });
    }
  }

  // A9フォーム（5弦ルート）: x-0-2-0-2-0 relative (Amadd9的)
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // A9開放形
      fingerings.push({
        id: `${root}9-A9-open`,
        frets: [0, 2, 0, 2, 0, null],
        fingers: [null, 2, null, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // A9フォームバレー
      fingerings.push({
        id: `${root}9-A9-barre`,
        frets: [fret5, fret5 + 2, fret5, fret5 + 2, fret5, null],
        fingers: [1, 2, 1, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // コンパクト9th（ジャズ系、4弦フォーム）
  if (fret6 !== undefined && fret6 >= 2 && fret6 <= 10) {
    fingerings.push({
      id: `${root}9-compact`,
      frets: [fret6 + 2, fret6 + 1, fret6 + 2, fret6, null, null],
      fingers: [3, 2, 4, 1, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: fret6,
      muted: [false, false, false, false, true, true],
      isDefault: false,
      difficulty: 'medium',
    });
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * M9コード（メジャー9th）の押さえ方を生成
 * M9 = R + 3 + 5 + 7 + 9
 */
export function generateM9Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // CM9形（5弦ルート開放）: x-3-2-0-0-0 -> CM9
  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // C root -> CM9開放形
      fingerings.push({
        id: `${root}M9-open`,
        frets: [0, 0, 0, 2, 3, null],
        fingers: [null, null, null, 1, 2, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // AM9フォームバレー
      fingerings.push({
        id: `${root}M9-A-barre`,
        frets: [fret5, fret5 + 1, fret5 + 1, fret5 + 2, fret5, null],
        fingers: [1, 2, 2, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // Eフォームベースバレー（6弦ルート）
  if (fret6 !== undefined && fret6 >= 1 && fret6 <= 9) {
    fingerings.push({
      id: `${root}M9-E-barre`,
      frets: [fret6, fret6, fret6 + 1, fret6 + 1, fret6 + 2, fret6],
      fingers: [1, 1, 2, 2, 3, 1],
      barreAt: fret6,
      barreStrings: [0, 5],
      baseFret: fret6,
      muted: [false, false, false, false, false, false],
      isDefault: fingerings.length === 0,
      difficulty: calculateDifficulty(fret6, true),
    });
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * m9コード（マイナー9th）の押さえ方を生成
 * m9 = R + b3 + 5 + b7 + 9
 */
export function generatem9Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Em9形（6弦ルート開放）: 0-2-0-0-0-0
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // Em9開放形
      fingerings.push({
        id: `${root}m9-Em9-open`,
        frets: [0, 0, 0, 0, 2, 0],
        fingers: [null, null, null, null, 2, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret6 <= 9) {
      // Em9フォームバレー
      fingerings.push({
        id: `${root}m9-Em9-barre`,
        frets: [fret6, fret6, fret6, fret6, fret6 + 2, fret6],
        fingers: [1, 1, 1, 1, 3, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: calculateDifficulty(fret6, true),
      });
    }
  }

  // Am9形（5弦ルート）: x-0-2-0-0-0 relative
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // Am9開放形
      fingerings.push({
        id: `${root}m9-Am9-open`,
        frets: [0, 0, 0, 2, 0, null],
        fingers: [null, null, null, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // Am9フォームバレー
      fingerings.push({
        id: `${root}m9-Am9-barre`,
        frets: [fret5, fret5, fret5, fret5 + 2, fret5, null],
        fingers: [1, 1, 1, 2, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * madd9コード（マイナーアドナイン）の押さえ方を生成
 * madd9 = R + b3 + 5 + 9（7thなし）
 */
export function generatemadd9Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  // Amadd9形（5弦ルート）: x-0-2-2-0-0
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // Amadd9開放形
      fingerings.push({
        id: `${root}madd9-Am-open`,
        frets: [0, 0, 2, 2, 0, null],
        fingers: [null, null, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // Amadd9フォームバレー
      fingerings.push({
        id: `${root}madd9-Am-barre`,
        frets: [fret5, fret5, fret5 + 2, fret5 + 2, fret5, null],
        fingers: [1, 1, 3, 4, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // Dmadd9形（4弦ルート）: x-x-0-2-3-0
  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // Dmadd9開放形
      fingerings.push({
        id: `${root}madd9-Dm-open`,
        frets: [0, 3, 2, 0, null, null],
        fingers: [null, 3, 2, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (fret4 <= 9) {
      // Dmadd9フォームバレー
      fingerings.push({
        id: `${root}madd9-Dm-barre`,
        frets: [fret4, fret4 + 3, fret4 + 2, fret4, null, null],
        fingers: [1, 4, 3, 1, null, null],
        barreAt: fret4,
        barreStrings: [0, 3],
        baseFret: fret4,
        muted: [false, false, false, false, true, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret4, true),
      });
    }
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * 7sus4コードの押さえ方を生成
 * 7sus4 = R + 4 + 5 + b7
 */
export function generate7sus4Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // E7sus4形（6弦ルート）: 0-0-2-0-2-0
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // E7sus4開放形
      fingerings.push({
        id: `${root}7sus4-E7sus4-open`,
        frets: [0, 0, 2, 0, 2, 0],
        fingers: [null, null, 2, null, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret6 <= 9) {
      // E7sus4フォームバレー
      fingerings.push({
        id: `${root}7sus4-E7sus4-barre`,
        frets: [fret6, fret6, fret6 + 2, fret6, fret6 + 2, fret6],
        fingers: [1, 1, 3, 1, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: calculateDifficulty(fret6, true),
      });
    }
  }

  // A7sus4形（5弦ルート）: x-0-2-0-3-0
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // A7sus4開放形
      fingerings.push({
        id: `${root}7sus4-A7sus4-open`,
        frets: [0, 3, 0, 2, 0, null],
        fingers: [null, 3, null, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // A7sus4フォームバレー
      fingerings.push({
        id: `${root}7sus4-A7sus4-barre`,
        frets: [fret5, fret5 + 3, fret5, fret5 + 2, fret5, null],
        fingers: [1, 4, 1, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // バレーフォーム（簡易形）
  if (fret6 !== undefined && fret6 >= 1 && fret6 <= 7) {
    fingerings.push({
      id: `${root}7sus4-simple-barre`,
      frets: [fret6, fret6, fret6, fret6, fret6 + 2, fret6],
      fingers: [1, 1, 1, 1, 3, 1],
      barreAt: fret6,
      barreStrings: [0, 5],
      baseFret: fret6,
      muted: [false, false, false, false, false, false],
      isDefault: false,
      difficulty: calculateDifficulty(fret6, true),
    });
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * 7sus2コードの押さえ方を生成
 * 7sus2 = R + 2 + 5 + b7
 */
export function generate7sus2Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // A7sus2形（5弦ルート）: x-0-2-0-0-0
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // A7sus2開放形
      fingerings.push({
        id: `${root}7sus2-A7sus2-open`,
        frets: [0, 0, 0, 2, 0, null],
        fingers: [null, null, null, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // A7sus2フォームバレー
      fingerings.push({
        id: `${root}7sus2-A7sus2-barre`,
        frets: [fret5, fret5, fret5, fret5 + 2, fret5, null],
        fingers: [1, 1, 1, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // E7sus2形（6弦ルート）: 0-2-4-2-0-0
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // E7sus2開放形
      fingerings.push({
        id: `${root}7sus2-E7sus2-open`,
        frets: [0, 0, 2, 4, 2, 0],
        fingers: [null, null, 1, 3, 2, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: fingerings.length === 0,
        difficulty: 'medium',
      });
    } else if (fret6 >= 1 && fret6 <= 8) {
      // E7sus2フォームバレー
      fingerings.push({
        id: `${root}7sus2-E7sus2-barre`,
        frets: [fret6, fret6, fret6 + 2, fret6 + 4, fret6 + 2, fret6],
        fingers: [1, 1, 2, 4, 3, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret6, true),
      });
    }
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * add9コードの押さえ方を生成
 * add9 = R + 3 + 5 + 9（7thなし）
 */
export function generateadd9Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  // Cadd9形（5弦ルート）: x-3-2-0-3-0
  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // Cadd9開放形（Cルート）
      fingerings.push({
        id: `${root}add9-Cadd9-open`,
        frets: [0, 3, 0, 2, 3, null],
        fingers: [null, 2, null, 1, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // Cadd9フォームバレー
      fingerings.push({
        id: `${root}add9-C-barre`,
        frets: [fret5, fret5 + 3, fret5, fret5 + 2, fret5, null],
        fingers: [1, 4, 1, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // Gadd9形（6弦ルート）: 3-0-0-0-0-3 -> Gルート
  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // Gadd9開放形（Gルート）
      fingerings.push({
        id: `${root}add9-Gadd9-open`,
        frets: [0, 3, 0, 0, 0, 3],
        fingers: [null, 2, null, null, null, 3],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (fret6 >= 1 && fret6 <= 9) {
      // Gadd9フォームバレー
      fingerings.push({
        id: `${root}add9-G-barre`,
        frets: [fret6, fret6 + 3, fret6, fret6, fret6, fret6 + 3],
        fingers: [1, 3, 1, 1, 1, 4],
        barreAt: fret6,
        barreStrings: [0, 4],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  // Dadd9形（4弦ルート）: x-x-0-2-3-2
  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // Dadd9開放形（Dルート）
      fingerings.push({
        id: `${root}add9-Dadd9-open`,
        frets: [2, 3, 2, 0, null, null],
        fingers: [1, 3, 2, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (fret4 <= 8) {
      // Dadd9フォームバレー
      fingerings.push({
        id: `${root}add9-D-barre`,
        frets: [fret4 + 2, fret4 + 3, fret4 + 2, fret4, null, null],
        fingers: [1, 3, 2, 1, null, null],
        barreAt: fret4,
        barreStrings: [0, 3],
        baseFret: fret4,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: calculateDifficulty(fret4, true),
      });
    }
  }

  // Aadd9形（5弦ルート）: x-0-2-2-0-0
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // Aadd9開放形（Aルート）
      fingerings.push({
        id: `${root}add9-Aadd9-open`,
        frets: [0, 0, 2, 2, 0, null],
        fingers: [null, null, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      });
    }
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * add2コードの押さえ方を生成
 * add2 = R + 2 + 3 + 5（add9と同等だが低い音域）
 */
export function generateadd2Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Eadd2形（6弦ルート）: 0-4-4-4-2-0 -> 簡易: 0-2-2-1-0-0
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // Eadd2開放形
      fingerings.push({
        id: `${root}add2-Eadd2-open`,
        frets: [0, 0, 1, 2, 2, 0],
        fingers: [null, null, 1, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret6 <= 9) {
      // Eadd2フォームバレー
      fingerings.push({
        id: `${root}add2-E-barre`,
        frets: [fret6, fret6, fret6 + 1, fret6 + 2, fret6 + 2, fret6],
        fingers: [1, 1, 2, 3, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: calculateDifficulty(fret6, true),
      });
    }
  }

  // Aadd2形（5弦ルート）: x-0-2-2-0-0
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // Aadd2開放形
      fingerings.push({
        id: `${root}add2-Aadd2-open`,
        frets: [0, 0, 2, 2, 0, null],
        fingers: [null, null, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // Aadd2フォームバレー
      fingerings.push({
        id: `${root}add2-A-barre`,
        frets: [fret5, fret5, fret5 + 2, fret5 + 2, fret5, null],
        fingers: [1, 1, 3, 4, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * add4コードの押さえ方を生成
 * add4 = R + 3 + 4 + 5
 */
export function generateadd4Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // Cadd4形（5弦ルート）: x-3-3-0-1-0
  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // Cadd4開放形（Cルート）
      fingerings.push({
        id: `${root}add4-Cadd4-open`,
        frets: [0, 1, 0, 3, 3, null],
        fingers: [null, 1, null, 3, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'medium',
      });
    } else if (fret5 <= 9) {
      // Cadd4フォームバレー
      fingerings.push({
        id: `${root}add4-C-barre`,
        frets: [fret5, fret5 + 1, fret5, fret5 + 3, fret5, null],
        fingers: [1, 2, 1, 4, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // Gadd4形（6弦ルート）: 3-0-0-0-1-3
  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // Gadd4開放形（Gルート）
      fingerings.push({
        id: `${root}add4-Gadd4-open`,
        frets: [3, 1, 0, 0, 0, 3],
        fingers: [2, 1, null, null, null, 3],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: fingerings.length === 0,
        difficulty: 'medium',
      });
    } else if (fret6 >= 1 && fret6 <= 9) {
      // Gadd4フォームバレー
      fingerings.push({
        id: `${root}add4-G-barre`,
        frets: [fret6 + 3, fret6 + 1, fret6, fret6, fret6, fret6 + 3],
        fingers: [3, 2, 1, 1, 1, 4],
        barreAt: fret6,
        barreStrings: [2, 4],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * 9sus4コードの押さえ方を生成
 * 9sus4 = R + P4 + P5 + m7 + M9（ドミナント9thサスペンデッド4th）
 * 構成音: [0, 5, 7, 10, 14]
 */
export function generate9sus4Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // A9sus4形（5弦ルート開放）: x-0-0-0-0-0
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // A9sus4開放形（全開放）
      fingerings.push({
        id: `${root}9sus4-A9sus4-open`,
        frets: [0, 0, 0, 0, 0, null],
        fingers: [null, null, null, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret5 <= 9) {
      // A9sus4フォームバレー（5弦ルート）: x-n-n-n-n-n
      fingerings.push({
        id: `${root}9sus4-A9sus4-barre`,
        frets: [fret5, fret5, fret5, fret5, fret5, null],
        fingers: [1, 1, 1, 1, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: true,
        difficulty: calculateDifficulty(fret5, true),
      });
    }
  }

  // G9sus4形（6弦ルート）: n-n-n-n-n-n（全バレー）
  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // G9sus4開放形
      fingerings.push({
        id: `${root}9sus4-G9sus4-open`,
        frets: [3, 3, 3, 3, 3, 3],
        fingers: [1, 1, 1, 1, 1, 1],
        barreAt: 3,
        barreStrings: [0, 5],
        baseFret: 3,
        muted: [false, false, false, false, false, false],
        isDefault: fingerings.length === 0,
        difficulty: 'medium',
      });
    } else if (fret6 >= 1 && fret6 <= 9) {
      // 6弦ルートバレー
      fingerings.push({
        id: `${root}9sus4-6str-barre`,
        frets: [fret6, fret6, fret6, fret6, fret6, fret6],
        fingers: [1, 1, 1, 1, 1, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret6, true),
      });
    }
  }

  // C9sus4形（5弦ルート）: x-3-3-3-3-3 または Bb/C形: x-3-3-3-3-1
  if (fret5 !== undefined && fret5 === 3) {
    // C9sus4 Bb/C形
    fingerings.push({
      id: `${root}9sus4-BbC-form`,
      frets: [1, 3, 3, 3, 3, null],
      fingers: [1, 2, 2, 2, 2, null],
      barreAt: 3,
      barreStrings: [1, 4],
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: false,
      difficulty: 'medium',
    });
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * M7b5コード（メジャーセブンフラットファイブ）の押さえ方を生成
 * M7b5 = R + M3 + b5 + M7
 * 構成音: [0, 4, 6, 11]
 * ジャズで使用される比較的レアなコード
 */
export function generateM7b5Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // CM7b5形（5弦ルート）: x-2-3-4-0-x
  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // CM7b5開放形（Cルート）
      fingerings.push({
        id: `${root}M7b5-CM7b5-open`,
        frets: [0, 4, 3, 2, null, null],
        fingers: [null, 3, 2, 1, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: true,
        difficulty: 'medium',
      });
    } else if (fret5 >= 1 && fret5 <= 9) {
      // 5弦ルートフォーム
      fingerings.push({
        id: `${root}M7b5-5str-form`,
        frets: [fret5 - 1, fret5 + 1, fret5, fret5 - 1, null, null],
        fingers: [1, 4, 3, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: Math.max(1, fret5 - 1),
        muted: [false, false, false, false, true, true],
        isDefault: true,
        difficulty: calculateDifficulty(fret5, false),
      });
    }
  }

  // GM7b5形（6弦ルート）: 2-2-0-3-x-x
  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // GM7b5開放形（Gルート）
      fingerings.push({
        id: `${root}M7b5-GM7b5-open`,
        frets: [3, 0, 2, 2, null, null],
        fingers: [3, null, 1, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: fingerings.length === 0,
        difficulty: 'medium',
      });
    } else if (fret6 >= 1 && fret6 <= 9) {
      // 6弦ルートフォーム（ジャズボイシング）
      fingerings.push({
        id: `${root}M7b5-6str-jazz`,
        frets: [fret6, fret6 - 1, fret6 - 1, fret6, null, null],
        fingers: [2, 1, 1, 3, null, null],
        barreAt: fret6 - 1,
        barreStrings: [1, 2],
        baseFret: Math.max(1, fret6 - 1),
        muted: [false, false, false, false, true, true],
        isDefault: fingerings.length === 0,
        difficulty: calculateDifficulty(fret6, true),
      });
    }
  }

  // コンパクト4弦フォーム（ジャズ系）
  if (fret5 !== undefined && fret5 >= 2 && fret5 <= 10) {
    fingerings.push({
      id: `${root}M7b5-compact`,
      frets: [fret5 - 1, fret5, fret5 - 1, fret5 - 1, null, null],
      fingers: [1, 4, 2, 3, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: Math.max(1, fret5 - 1),
      muted: [false, false, false, false, true, true],
      isDefault: false,
      difficulty: 'medium',
    });
  }

  return fingerings.filter(isFingeringDisplayable);
}

/**
 * 拡張コードかどうかを判定
 */
export function isExtendedChord(quality: string): boolean {
  const extendedQualities = [
    '9',
    'M9',
    'm9',
    'madd9',
    '7sus4',
    '7sus2',
    'add9',
    'add2',
    'add4',
    '9sus4',
    'M7b5',
    // 複雑なコード品質
    'augM7',
    'aug(M7)',
    '+M7',
    'M7#11',
    'maj7#11',
    'M7(#11)',
    'augM7#11',
    'augM7(#11)',
  ];
  return extendedQualities.includes(quality);
}

/**
 * コード名から拡張コードの押さえ方を取得
 */
export function getExtendedChordFingerings(chordName: string): ChordFingering[] {
  // コード名をパース（簡易版）
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return [];

  const [, root, quality] = match;

  switch (quality) {
    case '9':
      return generate9Fingerings(root);
    case 'M9':
      return generateM9Fingerings(root);
    case 'm9':
      return generatem9Fingerings(root);
    case 'madd9':
      return generatemadd9Fingerings(root);
    case '7sus4':
      return generate7sus4Fingerings(root);
    case '7sus2':
      return generate7sus2Fingerings(root);
    case 'add9':
      return generateadd9Fingerings(root);
    case 'add2':
      return generateadd2Fingerings(root);
    case 'add4':
      return generateadd4Fingerings(root);
    case '9sus4':
      return generate9sus4Fingerings(root);
    case 'M7b5':
      return generateM7b5Fingerings(root);
    default:
      return [];
  }
}
