/**
 * CaT4G - CAGED System Chord Generator
 * CAGEDシステムに基づいたバレーコードを動的に生成
 *
 * CAGEDシステム:
 * - Cフォーム: Cコードの形をフレット移動
 * - Aフォーム: Aコードの形をフレット移動（5弦ルート）
 * - Gフォーム: Gコードの形をフレット移動
 * - Eフォーム: Eコードの形をフレット移動（6弦ルート）
 * - Dフォーム: Dコードの形をフレット移動（4弦ルート）
 */

import type { ChordFingering } from './types';

// ルート音からフレット位置へのマッピング
// 6弦でのフレット位置（E=0, F=1, F#=2, G=3, ...）
const ROOT_TO_FRET_6STRING: Record<string, number> = {
  'E': 0, 'F': 1, 'F#': 2, 'Gb': 2, 'G': 3, 'G#': 4, 'Ab': 4,
  'A': 5, 'A#': 6, 'Bb': 6, 'B': 7, 'C': 8, 'C#': 9, 'Db': 9,
  'D': 10, 'D#': 11, 'Eb': 11,
};

// 5弦でのフレット位置（A=0, A#=1, B=2, C=3, ...）
const ROOT_TO_FRET_5STRING: Record<string, number> = {
  'A': 0, 'A#': 1, 'Bb': 1, 'B': 2, 'C': 3, 'C#': 4, 'Db': 4,
  'D': 5, 'D#': 6, 'Eb': 6, 'E': 7, 'F': 8, 'F#': 9, 'Gb': 9,
  'G': 10, 'G#': 11, 'Ab': 11,
};

// 4弦でのフレット位置（D=0, D#=1, E=2, F=3, ...）
// 将来のDフォーム拡張用に保持
// const ROOT_TO_FRET_4STRING: Record<string, number> = {
//   'D': 0, 'D#': 1, 'Eb': 1, 'E': 2, 'F': 3, 'F#': 4, 'Gb': 4,
//   'G': 5, 'G#': 6, 'Ab': 6, 'A': 7, 'A#': 8, 'Bb': 8,
//   'B': 9, 'C': 10, 'C#': 11, 'Db': 11,
// };

/**
 * メジャーコードのCAGEDフォームを生成
 */
export function generateMajorCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Eフォーム（6弦ルート）- 常に利用可能
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦Eコード
      fingerings.push({
        id: `${root}-E-open`,
        frets: [0, 0, 1, 2, 2, 0],
        fingers: [null, null, 1, 3, 2, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // Eフォームバレー
      fingerings.push({
        id: `${root}-E-barre`,
        frets: [fret6, fret6, fret6 + 1, fret6 + 2, fret6 + 2, fret6],
        fingers: [1, 1, 2, 4, 3, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // Aフォーム（5弦ルート）- 常に利用可能
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦Aコード
      fingerings.push({
        id: `${root}-A-open`,
        frets: [0, 2, 2, 2, 0, null],
        fingers: [null, 1, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // Aフォームバレー
      fingerings.push({
        id: `${root}-A-barre`,
        frets: [fret5, fret5 + 2, fret5 + 2, fret5 + 2, fret5, null],
        fingers: [1, 3, 3, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーコードのCAGEDフォームを生成
 */
export function generateMinorCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Emフォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦Emコード
      fingerings.push({
        id: `${root}m-Em-open`,
        frets: [0, 0, 0, 2, 2, 0],
        fingers: [null, null, null, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // Emフォームバレー
      fingerings.push({
        id: `${root}m-Em-barre`,
        frets: [fret6, fret6, fret6, fret6 + 2, fret6 + 2, fret6],
        fingers: [1, 1, 1, 4, 3, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // Amフォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦Amコード
      fingerings.push({
        id: `${root}m-Am-open`,
        frets: [0, 1, 2, 2, 0, null],
        fingers: [null, 1, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // Amフォームバレー
      fingerings.push({
        id: `${root}m-Am-barre`,
        frets: [fret5, fret5 + 1, fret5 + 2, fret5 + 2, fret5, null],
        fingers: [1, 2, 4, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * セブンスコード(7)のCAGEDフォームを生成
 */
export function generate7thCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // E7フォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦E7コード
      fingerings.push({
        id: `${root}7-E7-open`,
        frets: [0, 0, 1, 0, 2, 0],
        fingers: [null, null, 1, null, 2, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // E7フォームバレー
      fingerings.push({
        id: `${root}7-E7-barre`,
        frets: [fret6, fret6, fret6 + 1, fret6, fret6 + 2, fret6],
        fingers: [1, 1, 2, 1, 3, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // A7フォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦A7コード
      fingerings.push({
        id: `${root}7-A7-open`,
        frets: [0, 2, 0, 2, 0, null],
        fingers: [null, 2, null, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // A7フォームバレー
      fingerings.push({
        id: `${root}7-A7-barre`,
        frets: [fret5, fret5 + 2, fret5, fret5 + 2, fret5, null],
        fingers: [1, 3, 1, 4, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーセブンスコード(m7)のCAGEDフォームを生成
 */
export function generateMinor7thCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Em7フォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦Em7コード
      fingerings.push({
        id: `${root}m7-Em7-open`,
        frets: [0, 0, 0, 0, 2, 0],
        fingers: [null, null, null, null, 1, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // Em7フォームバレー
      fingerings.push({
        id: `${root}m7-Em7-barre`,
        frets: [fret6, fret6, fret6, fret6, fret6 + 2, fret6],
        fingers: [1, 1, 1, 1, 3, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // Am7フォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦Am7コード
      fingerings.push({
        id: `${root}m7-Am7-open`,
        frets: [0, 1, 0, 2, 0, null],
        fingers: [null, 1, null, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // Am7フォームバレー
      fingerings.push({
        id: `${root}m7-Am7-barre`,
        frets: [fret5, fret5 + 1, fret5, fret5 + 2, fret5, null],
        fingers: [1, 2, 1, 4, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャーセブンスコード(M7/maj7)のCAGEDフォームを生成
 */
export function generateMajor7thCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // EM7フォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦EM7コード
      fingerings.push({
        id: `${root}M7-EM7-open`,
        frets: [0, 0, 1, 1, 2, 0],
        fingers: [null, null, 1, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // EM7フォームバレー
      fingerings.push({
        id: `${root}M7-EM7-barre`,
        frets: [fret6, fret6, fret6 + 1, fret6 + 1, fret6 + 2, fret6],
        fingers: [1, 1, 2, 3, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // AM7フォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦AM7コード
      fingerings.push({
        id: `${root}M7-AM7-open`,
        frets: [0, 2, 1, 2, 0, null],
        fingers: [null, 3, 1, 2, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // AM7フォームバレー
      fingerings.push({
        id: `${root}M7-AM7-barre`,
        frets: [fret5, fret5 + 2, fret5 + 1, fret5 + 2, fret5, null],
        fingers: [1, 3, 2, 4, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナー6thコード(m6)のCAGEDフォームを生成
 */
export function generateMinor6thCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Em6フォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦Em6コード
      fingerings.push({
        id: `${root}m6-Em6-open`,
        frets: [0, 2, 0, 2, 2, 0],
        fingers: [null, 1, null, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'medium',
      });
    } else {
      // Em6フォームバレー
      fingerings.push({
        id: `${root}m6-Em6-barre`,
        frets: [fret6, fret6 + 2, fret6, fret6 + 2, fret6 + 2, fret6],
        fingers: [1, 3, 1, 4, 2, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // Am6フォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦Am6コード
      fingerings.push({
        id: `${root}m6-Am6-open`,
        frets: [0, 1, 2, 2, 0, null],
        fingers: [null, 1, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // Am6フォームバレー（5弦ルートで6thを含む）
      fingerings.push({
        id: `${root}m6-Am6-barre`,
        frets: [fret5, fret5 + 1, fret5 + 2, fret5 + 2, fret5, null],
        fingers: [1, 2, 3, 4, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャー6thコード(6)のCAGEDフォームを生成
 */
export function generateMajor6thCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // E6フォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦E6コード
      fingerings.push({
        id: `${root}6-E6-open`,
        frets: [0, 2, 1, 2, 2, 0],
        fingers: [null, 3, 1, 2, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'medium',
      });
    } else {
      // E6フォームバレー
      fingerings.push({
        id: `${root}6-E6-barre`,
        frets: [fret6, fret6 + 2, fret6 + 1, fret6 + 2, fret6 + 2, fret6],
        fingers: [1, 3, 2, 3, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // A6フォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦A6コード
      fingerings.push({
        id: `${root}6-A6-open`,
        frets: [2, 2, 2, 2, 0, null],
        fingers: [1, 2, 3, 4, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'medium',
      });
    } else {
      // A6フォームバレー
      fingerings.push({
        id: `${root}6-A6-barre`,
        frets: [fret5 + 2, fret5 + 2, fret5 + 2, fret5 + 2, fret5, null],
        fingers: [2, 3, 3, 4, 1, null],
        barreAt: fret5,
        barreStrings: [4, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーメジャーセブンスコード(mM7)のCAGEDフォームを生成
 */
export function generateMinorMajor7thCAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // EmM7フォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦EmM7コード
      fingerings.push({
        id: `${root}mM7-EmM7-open`,
        frets: [0, 0, 0, 2, 1, 0],
        fingers: [null, null, null, 2, 1, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // EmM7フォームバレー
      fingerings.push({
        id: `${root}mM7-EmM7-barre`,
        frets: [fret6, fret6, fret6, fret6 + 2, fret6 + 1, fret6],
        fingers: [1, 1, 1, 4, 2, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // AmM7フォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦AmM7コード
      fingerings.push({
        id: `${root}mM7-AmM7-open`,
        frets: [0, 1, 1, 2, 0, null],
        fingers: [null, 1, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // AmM7フォームバレー
      fingerings.push({
        id: `${root}mM7-AmM7-barre`,
        frets: [fret5, fret5 + 1, fret5 + 1, fret5 + 2, fret5, null],
        fingers: [1, 2, 2, 3, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * sus4コードのCAGEDフォームを生成
 */
export function generateSus4CAGED(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // Esus4フォーム（6弦ルート）
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦Esus4コード
      fingerings.push({
        id: `${root}sus4-Esus4-open`,
        frets: [0, 0, 2, 2, 2, 0],
        fingers: [null, null, 2, 3, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else {
      // Esus4フォームバレー
      fingerings.push({
        id: `${root}sus4-Esus4-barre`,
        frets: [fret6, fret6, fret6 + 2, fret6 + 2, fret6 + 2, fret6],
        fingers: [1, 1, 3, 3, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: fret6 <= 4 ? 'medium' : 'hard',
      });
    }
  }

  // Asus4フォーム（5弦ルート）
  if (fret5 !== undefined) {
    if (fret5 === 0) {
      // 開放弦Asus4コード
      fingerings.push({
        id: `${root}sus4-Asus4-open`,
        frets: [0, 3, 2, 2, 0, null],
        fingers: [null, 4, 2, 3, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else {
      // Asus4フォームバレー
      fingerings.push({
        id: `${root}sus4-Asus4-barre`,
        frets: [fret5, fret5 + 3, fret5 + 2, fret5 + 2, fret5, null],
        fingers: [1, 4, 3, 2, 1, null],
        barreAt: fret5,
        barreStrings: [0, 4],
        baseFret: fret5,
        muted: [false, false, false, false, false, true],
        isDefault: fingerings.length === 0,
        difficulty: fret5 <= 5 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * コード名からルート音と品質を分離
 */
function parseChordForCAGED(chordName: string): { root: string; quality: string } | null {
  const normalized = chordName.replace(/♯/g, '#').replace(/♭/g, 'b');
  const match = normalized.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return null;
  return { root: match[1], quality: match[2] || '' };
}

/**
 * 品質を正規化
 */
function normalizeQualityForCAGED(quality: string): string {
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
  };
  return aliases[quality] || quality;
}

/**
 * CAGEDシステムに基づいてコードのフィンガリングを取得
 */
export function getCAGEDChordFingerings(chordName: string): ChordFingering[] {
  const parsed = parseChordForCAGED(chordName);
  if (!parsed) return [];

  const { root } = parsed;
  const quality = normalizeQualityForCAGED(parsed.quality);

  switch (quality) {
    case '':
      return generateMajorCAGED(root);
    case 'm':
      return generateMinorCAGED(root);
    case '7':
      return generate7thCAGED(root);
    case 'm7':
      return generateMinor7thCAGED(root);
    case 'M7':
      return generateMajor7thCAGED(root);
    case 'm6':
      return generateMinor6thCAGED(root);
    case '6':
      return generateMajor6thCAGED(root);
    case 'mM7':
      return generateMinorMajor7thCAGED(root);
    case 'sus4':
      return generateSus4CAGED(root);
    default:
      return [];
  }
}

/**
 * CAGEDシステムでコードがサポートされているかチェック
 */
export function isCAGEDSupported(chordName: string): boolean {
  const parsed = parseChordForCAGED(chordName);
  if (!parsed) return false;

  const quality = normalizeQualityForCAGED(parsed.quality);
  const supportedQualities = ['', 'm', '7', 'm7', 'M7', 'm6', '6', 'mM7', 'sus4'];
  return supportedQualities.includes(quality);
}
