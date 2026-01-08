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
import { normalizeQuality } from './utils';

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
// Dフォームサポート用
const ROOT_TO_FRET_4STRING: Record<string, number> = {
  'D': 0, 'D#': 1, 'Eb': 1, 'E': 2, 'F': 3, 'F#': 4, 'Gb': 4,
  'G': 5, 'G#': 6, 'Ab': 6, 'A': 7, 'A#': 8, 'Bb': 8,
  'B': 9, 'C': 10, 'C#': 11, 'Db': 11,
};

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
 * メジャーコードのCフォームを生成（5弦ルート）
 * Cフォーム: 開放Cコードの形をフレット移動
 * 開放C: x32010 (6弦から1弦)
 */
export function generateMajorCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦Cコード（ルートがCの場合）
      fingerings.push({
        id: `${root}-C-open`,
        frets: [0, 1, 0, 2, 3, null],
        fingers: [null, 1, null, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // Cフォームバレー
      // Cフォームの基準：Cコードの5弦3フレットからのオフセット
      // fret5が示すフレットがルート位置
      const offset = fret5 - 3;
      // 開放Cコード: frets [0, 1, 0, 2, 3] に offset を加える
      // ただし、すべての弦をバレーで押さえる必要がある
      const baseFret = Math.max(1, fret5 - 2); // 最低フレット位置
      fingerings.push({
        id: `${root}-C-barre`,
        frets: [offset, 1 + offset, offset, 2 + offset, fret5, null],
        fingers: [1, 2, 1, 3, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 2] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: fret5 <= 7 ? 'hard' : 'hard', // Cフォームバレーは常に難しい
      });
    }
  }

  return fingerings;
}

/**
 * マイナーコードのCフォームを生成（5弦ルート）
 * Cmフォーム: 開放Cmコードの形をフレット移動
 * 開放Cm: x31010 (6弦から1弦) または x35543 バレー
 */
export function generateMinorCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦Cmコード（ルートがCの場合）
      // Cm: x31010 または x35543 (よく使われるバレーフォーム)
      // 簡易版のx31010を使用
      fingerings.push({
        id: `${root}m-Cm-open`,
        frets: [0, 1, 0, 1, 3, null],
        fingers: [null, 1, null, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // Cmフォームバレー
      // マイナーはメジャーから3度を半音下げる
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}m-Cm-barre`,
        frets: [offset, 1 + offset, offset, 1 + offset, fret5, null],
        fingers: [1, 2, 1, 3, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 2] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: fret5 <= 7 ? 'hard' : 'hard', // Cmフォームバレーは常に難しい
      });
    }
  }

  return fingerings;
}

/**
 * セブンスコード(7)のCフォームを生成（5弦ルート）
 * C7フォーム: 開放C7コードの形をフレット移動
 * 開放C7: x32310 (6弦から1弦)
 */
export function generate7thCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦C7コード（ルートがCの場合）
      fingerings.push({
        id: `${root}7-C7-open`,
        frets: [0, 1, 3, 2, 3, null],
        fingers: [null, 1, 3, 2, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // C7フォームバレー
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}7-C7-barre`,
        frets: [offset, 1 + offset, fret5, 2 + offset, fret5, null],
        fingers: [1, 2, 4, 3, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 1] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーセブンスコード(m7)のCフォームを生成（5弦ルート）
 * Cm7フォーム: 開放Cm7コードの形をフレット移動
 * 開放Cm7: x31313 (6弦から1弦)
 */
export function generateMinor7thCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦Cm7コード（ルートがCの場合）
      fingerings.push({
        id: `${root}m7-Cm7-open`,
        frets: [3, 1, 3, 1, 3, null],
        fingers: [3, 1, 4, 2, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    } else {
      // Cm7フォームバレー
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}m7-Cm7-barre`,
        frets: [fret5, 1 + offset, fret5, 1 + offset, fret5, null],
        fingers: [3, 1, 4, 2, 4, null],
        barreAt: 1 + offset > 0 ? 1 + offset : null,
        barreStrings: 1 + offset > 0 ? [1, 3] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャーセブンスコード(M7)のCフォームを生成（5弦ルート）
 * CM7フォーム: 開放Cmaj7コードの形をフレット移動
 * 開放Cmaj7: x32000 (6弦から1弦)
 */
export function generateMajor7thCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦Cmaj7コード（ルートがCの場合）
      fingerings.push({
        id: `${root}M7-CM7-open`,
        frets: [0, 0, 0, 2, 3, null],
        fingers: [null, null, null, 2, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // CM7フォームバレー
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}M7-CM7-barre`,
        frets: [offset, offset, offset, 2 + offset, fret5, null],
        fingers: [1, 1, 1, 3, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 2] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーメジャーセブンスコード(mM7)のCフォームを生成（5弦ルート）
 * CmM7フォーム: 開放CmM7コードの形をフレット移動
 * 開放CmM7: x31003 (6弦から1弦)
 */
export function generateMinorMajor7thCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦CmM7コード（ルートがCの場合）
      fingerings.push({
        id: `${root}mM7-CmM7-open`,
        frets: [3, 0, 0, 1, 3, null],
        fingers: [3, null, null, 1, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // CmM7フォームバレー
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}mM7-CmM7-barre`,
        frets: [fret5, offset, offset, 1 + offset, fret5, null],
        fingers: [4, 1, 1, 2, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [1, 2] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャー6thコード(6)のCフォームを生成（5弦ルート）
 * C6フォーム: 開放C6コードの形をフレット移動
 * 開放C6: x32210 (6弦から1弦)
 */
export function generateMajor6thCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦C6コード（ルートがCの場合）
      fingerings.push({
        id: `${root}6-C6-open`,
        frets: [0, 1, 2, 2, 3, null],
        fingers: [null, 1, 2, 3, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // C6フォームバレー
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}6-C6-barre`,
        frets: [offset, 1 + offset, 2 + offset, 2 + offset, fret5, null],
        fingers: [1, 2, 3, 4, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 0] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナー6thコード(m6)のCフォームを生成（5弦ルート）
 * Cm6フォーム: 開放Cm6コードの形をフレット移動
 * 開放Cm6: x31210 (6弦から1弦)
 */
export function generateMinor6thCForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦Cm6コード（ルートがCの場合）
      fingerings.push({
        id: `${root}m6-Cm6-open`,
        frets: [0, 1, 2, 1, 3, null],
        fingers: [null, 1, 3, 2, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // Cm6フォームバレー
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}m6-Cm6-barre`,
        frets: [offset, 1 + offset, 2 + offset, 1 + offset, fret5, null],
        fingers: [1, 2, 4, 3, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 0] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * sus4コードのCフォームを生成（5弦ルート）
 * Csus4フォーム: 開放Csus4コードの形をフレット移動
 * 開放Csus4: x33010 (6弦から1弦)
 */
export function generateSus4CForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  if (fret5 !== undefined) {
    if (fret5 === 3) {
      // 開放弦Csus4コード（ルートがCの場合）
      fingerings.push({
        id: `${root}sus4-Csus4-open`,
        frets: [0, 1, 0, 3, 3, null],
        fingers: [null, 1, null, 3, 4, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // Csus4フォームバレー
      const offset = fret5 - 3;
      const baseFret = Math.max(1, fret5 - 2);
      fingerings.push({
        id: `${root}sus4-Csus4-barre`,
        frets: [offset, 1 + offset, offset, fret5, fret5, null],
        fingers: [1, 2, 1, 3, 4, null],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 2] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, true],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャーコードのGフォームを生成（6弦ルート）
 * Gフォーム: 開放Gコードの形をフレット移動
 * 開放G: 320003 (6弦から1弦) = [3, 0, 0, 0, 2, 3] (1弦から6弦の配列)
 * ルート: 6弦3フレット
 */
export function generateMajorGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦Gコード（ルートがGの場合）
      fingerings.push({
        id: `${root}-G-open`,
        frets: [3, 0, 0, 0, 2, 3],
        fingers: [3, null, null, null, 1, 2],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // Gフォームバレー
      // Gフォームの基準：Gコードの6弦3フレットからのオフセット
      const offset = fret6 - 3;
      // 開放Gコード: [3, 0, 0, 0, 2, 3] に offset を加える
      const baseFret = Math.max(1, fret6 - 2);
      fingerings.push({
        id: `${root}-G-barre`,
        frets: [3 + offset, offset, offset, offset, 2 + offset, fret6],
        fingers: [4, 1, 1, 1, 3, 2],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [1, 3] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard', // Gフォームバレーは常に難しい（指を大きく広げる）
      });
    }
  }

  return fingerings;
}

/**
 * マイナーコードのGフォームを生成（6弦ルート）
 * Gmフォーム: 開放Gmコードの形をフレット移動
 * 開放Gm: 310033 (6弦から1弦) = [3, 3, 0, 0, 1, 3] (1弦から6弦の配列)
 * または一般的なバレーフォーム: 355333
 * ルート: 6弦3フレット
 */
export function generateMinorGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦Gmコード（ルートがGの場合）
      // より実用的な355333フォームを使用
      fingerings.push({
        id: `${root}m-Gm-open`,
        frets: [3, 3, 3, 5, 5, 3],
        fingers: [1, 1, 1, 3, 4, 1],
        barreAt: 3,
        barreStrings: [0, 5],
        baseFret: 3,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // Gmフォームバレー
      // Gmフォームの基準：Gmコードの6弦3フレットからのオフセット
      const offset = fret6 - 3;
      // Gmバレーフォーム: [3, 3, 3, 5, 5, 3] に offset を加える
      const baseFret = fret6;
      fingerings.push({
        id: `${root}m-Gm-barre`,
        frets: [fret6, fret6, fret6, fret6 + 2, fret6 + 2, fret6],
        fingers: [1, 1, 1, 3, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: fret6 <= 5 ? 'hard' : 'hard', // Gフォームマイナーは常に難しい
      });
    }
  }

  return fingerings;
}

/**
 * セブンスコード(7)のGフォームを生成（6弦ルート）
 * G7フォーム: 開放G7コードの形をフレット移動
 * 開放G7: 320001 (6弦から1弦) = [1, 0, 0, 0, 2, 3] (1弦から6弦の配列)
 * ルート: 6弦3フレット
 */
export function generate7thGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦G7コード（ルートがGの場合）
      fingerings.push({
        id: `${root}7-G7-open`,
        frets: [1, 0, 0, 0, 2, 3],
        fingers: [1, null, null, null, 2, 3],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // G7フォームバレー
      const offset = fret6 - 3;
      const baseFret = Math.max(1, fret6 - 2);
      fingerings.push({
        id: `${root}7-G7-barre`,
        frets: [1 + offset, offset, offset, offset, 2 + offset, fret6],
        fingers: [2, 1, 1, 1, 3, 4],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [1, 3] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーセブンスコード(m7)のGフォームを生成（6弦ルート）
 * Gm7フォーム: 開放Gm7コードの形をフレット移動
 * 開放Gm7: 353333 (6弦から1弦) = [3, 3, 3, 5, 3, 3] (1弦から6弦の配列)
 * ルート: 6弦3フレット
 */
export function generateMinor7thGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦Gm7コード（ルートがGの場合）
      fingerings.push({
        id: `${root}m7-Gm7-open`,
        frets: [3, 3, 3, 5, 3, 3],
        fingers: [1, 1, 1, 3, 1, 1],
        barreAt: 3,
        barreStrings: [0, 5],
        baseFret: 3,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // Gm7フォームバレー
      const baseFret = fret6;
      fingerings.push({
        id: `${root}m7-Gm7-barre`,
        frets: [fret6, fret6, fret6, fret6 + 2, fret6, fret6],
        fingers: [1, 1, 1, 3, 1, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャーセブンスコード(M7)のGフォームを生成（6弦ルート）
 * GM7フォーム: 開放Gmaj7コードの形をフレット移動
 * 開放Gmaj7: 320002 (6弦から1弦) = [2, 0, 0, 0, 2, 3] (1弦から6弦の配列)
 * ルート: 6弦3フレット
 */
export function generateMajor7thGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦Gmaj7コード（ルートがGの場合）
      fingerings.push({
        id: `${root}M7-GM7-open`,
        frets: [2, 0, 0, 0, 2, 3],
        fingers: [1, null, null, null, 2, 3],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // GM7フォームバレー
      const offset = fret6 - 3;
      const baseFret = Math.max(1, fret6 - 2);
      fingerings.push({
        id: `${root}M7-GM7-barre`,
        frets: [2 + offset, offset, offset, offset, 2 + offset, fret6],
        fingers: [2, 1, 1, 1, 3, 4],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [1, 3] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーメジャーセブンスコード(mM7)のGフォームを生成（6弦ルート）
 * GmM7フォーム: 開放GmM7コードの形をフレット移動
 * 開放GmM7: 354333 (6弦から1弦) = [3, 3, 4, 5, 3, 3] (1弦から6弦の配列)
 * ルート: 6弦3フレット
 */
export function generateMinorMajor7thGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦GmM7コード（ルートがGの場合）
      fingerings.push({
        id: `${root}mM7-GmM7-open`,
        frets: [3, 3, 4, 5, 3, 3],
        fingers: [1, 1, 2, 3, 1, 1],
        barreAt: 3,
        barreStrings: [0, 5],
        baseFret: 3,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // GmM7フォームバレー
      const baseFret = fret6;
      fingerings.push({
        id: `${root}mM7-GmM7-barre`,
        frets: [fret6, fret6, fret6 + 1, fret6 + 2, fret6, fret6],
        fingers: [1, 1, 2, 3, 1, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャー6thコード(6)のGフォームを生成（6弦ルート）
 * G6フォーム: 開放G6コードの形をフレット移動
 * 開放G6: 320000 (6弦から1弦) = [0, 0, 0, 0, 2, 3] (1弦から6弦の配列)
 * ルート: 6弦3フレット
 */
export function generateMajor6thGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦G6コード（ルートがGの場合）
      fingerings.push({
        id: `${root}6-G6-open`,
        frets: [0, 0, 0, 0, 2, 3],
        fingers: [null, null, null, null, 1, 2],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // G6フォームバレー
      const offset = fret6 - 3;
      const baseFret = Math.max(1, fret6 - 2);
      fingerings.push({
        id: `${root}6-G6-barre`,
        frets: [offset, offset, offset, offset, 2 + offset, fret6],
        fingers: [1, 1, 1, 1, 3, 4],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [0, 3] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナー6thコード(m6)のGフォームを生成（6弦ルート）
 * Gm6フォーム: 開放Gm6コードの形をフレット移動
 * 開放Gm6: 350333 (6弦から1弦) = [3, 3, 0, 5, 3, 3] (1弦から6弦の配列)
 * または一般的なバレー: 353335
 * ルート: 6弦3フレット
 */
export function generateMinor6thGForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦Gm6コード（ルートがGの場合）
      fingerings.push({
        id: `${root}m6-Gm6-open`,
        frets: [5, 3, 3, 5, 3, 3],
        fingers: [3, 1, 1, 4, 1, 1],
        barreAt: 3,
        barreStrings: [1, 5],
        baseFret: 3,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // Gm6フォームバレー
      const baseFret = fret6;
      fingerings.push({
        id: `${root}m6-Gm6-barre`,
        frets: [fret6 + 2, fret6, fret6, fret6 + 2, fret6, fret6],
        fingers: [3, 1, 1, 4, 1, 1],
        barreAt: fret6,
        barreStrings: [1, 5],
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * sus4コードのGフォームを生成（6弦ルート）
 * Gsus4フォーム: 開放Gsus4コードの形をフレット移動
 * 開放Gsus4: 330013 (6弦から1弦) = [3, 1, 0, 0, 3, 3] (1弦から6弦の配列)
 * ルート: 6弦3フレット
 */
export function generateSus4GForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  if (fret6 !== undefined) {
    if (fret6 === 3) {
      // 開放弦Gsus4コード（ルートがGの場合）
      fingerings.push({
        id: `${root}sus4-Gsus4-open`,
        frets: [3, 1, 0, 0, 3, 3],
        fingers: [3, 1, null, null, 4, 4],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'medium',
      });
    } else {
      // Gsus4フォームバレー
      const offset = fret6 - 3;
      const baseFret = Math.max(1, fret6 - 2);
      fingerings.push({
        id: `${root}sus4-Gsus4-barre`,
        frets: [3 + offset, 1 + offset, offset, offset, fret6, fret6],
        fingers: [4, 2, 1, 1, 3, 3],
        barreAt: offset > 0 ? offset : null,
        barreStrings: offset > 0 ? [2, 3] : null,
        baseFret: baseFret,
        muted: [false, false, false, false, false, false],
        isDefault: false,
        difficulty: 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャーコードのDフォームを生成（4弦ルート）
 * Dフォーム: 開放Dコードの形をフレット移動
 * 開放D: xx0232 (6弦から1弦) = [2, 3, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateMajorDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦Dコード（ルートがDの場合）
      fingerings.push({
        id: `${root}-D-open`,
        frets: [2, 3, 2, 0, null, null],
        fingers: [2, 3, 1, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // Dフォームバレー
      // Dフォームの基準：Dコードの4弦0フレットからのオフセット
      const baseFret = fret4;
      fingerings.push({
        id: `${root}-D-barre`,
        frets: [fret4 + 2, fret4 + 3, fret4 + 2, fret4, null, null],
        fingers: [2, 4, 3, 1, null, null],
        barreAt: null, // Dフォームは通常バレーなし（各弦を個別に押さえる）
        barreStrings: null,
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'hard' : 'hard', // Dフォームバレーは常に難しい
      });
    }
  }

  return fingerings;
}

/**
 * マイナーコードのDフォームを生成（4弦ルート）
 * Dmフォーム: 開放Dmコードの形をフレット移動
 * 開放Dm: xx0231 (6弦から1弦) = [1, 3, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateMinorDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦Dmコード（ルートがDの場合）
      fingerings.push({
        id: `${root}m-Dm-open`,
        frets: [1, 3, 2, 0, null, null],
        fingers: [1, 3, 2, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // Dmフォームバレー
      // マイナーはメジャーから3度を半音下げる（1弦: fret4+2 → fret4+1）
      const baseFret = fret4;
      fingerings.push({
        id: `${root}m-Dm-barre`,
        frets: [fret4 + 1, fret4 + 3, fret4 + 2, fret4, null, null],
        fingers: [1, 4, 3, 1, null, null],
        barreAt: fret4, // 1弦と4弦でバレー可能
        barreStrings: [0, 3],
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'hard' : 'hard', // Dmフォームバレーは常に難しい
      });
    }
  }

  return fingerings;
}

/**
 * セブンスコード(7)のDフォームを生成（4弦ルート）
 * D7フォーム: 開放D7コードの形をフレット移動
 * 開放D7: xx0212 (6弦から1弦) = [2, 1, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generate7thDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦D7コード（ルートがDの場合）
      fingerings.push({
        id: `${root}7-D7-open`,
        frets: [2, 1, 2, 0, null, null],
        fingers: [2, 1, 3, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // D7フォームバレー
      // 7thはメジャーから7度を半音下げる（2弦: fret4+3 → fret4+1）
      const baseFret = fret4;
      fingerings.push({
        id: `${root}7-D7-barre`,
        frets: [fret4 + 2, fret4 + 1, fret4 + 2, fret4, null, null],
        fingers: [2, 1, 3, 1, null, null],
        barreAt: fret4, // 2弦と4弦でバレー可能
        barreStrings: [1, 3],
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーセブンスコード(m7)のDフォームを生成（4弦ルート）
 * Dm7フォーム: 開放Dm7コードの形をフレット移動
 * 開放Dm7: xx0211 (6弦から1弦) = [1, 1, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateMinor7thDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦Dm7コード（ルートがDの場合）
      fingerings.push({
        id: `${root}m7-Dm7-open`,
        frets: [1, 1, 2, 0, null, null],
        fingers: [1, 2, 3, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // Dm7フォームバレー
      // m7はマイナーから7度を半音下げる
      const baseFret = fret4;
      fingerings.push({
        id: `${root}m7-Dm7-barre`,
        frets: [fret4 + 1, fret4 + 1, fret4 + 2, fret4, null, null],
        fingers: [1, 1, 3, 1, null, null],
        barreAt: fret4, // 1-4弦でバレー
        barreStrings: [0, 3],
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャーセブンスコード(M7)のDフォームを生成（4弦ルート）
 * DM7フォーム: 開放DM7コードの形をフレット移動
 * 開放DM7: xx0222 (6弦から1弦) = [2, 2, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateMajor7thDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦DM7コード（ルートがDの場合）
      fingerings.push({
        id: `${root}M7-DM7-open`,
        frets: [2, 2, 2, 0, null, null],
        fingers: [1, 2, 3, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // DM7フォームバレー
      // M7はメジャーから7度を全音下げる（導音）
      const baseFret = fret4;
      fingerings.push({
        id: `${root}M7-DM7-barre`,
        frets: [fret4 + 2, fret4 + 2, fret4 + 2, fret4, null, null],
        fingers: [2, 3, 4, 1, null, null],
        barreAt: null, // 各弦を個別に押さえる
        barreStrings: null,
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'hard' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナーメジャーセブンスコード(mM7)のDフォームを生成（4弦ルート）
 * DmM7フォーム: 開放DmM7コードの形をフレット移動
 * 開放DmM7: xx0221 (6弦から1弦) = [1, 2, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateMinorMajor7thDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦DmM7コード（ルートがDの場合）
      fingerings.push({
        id: `${root}mM7-DmM7-open`,
        frets: [1, 2, 2, 0, null, null],
        fingers: [1, 2, 3, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // DmM7フォームバレー
      // mM7はマイナーにメジャー7度を加える
      const baseFret = fret4;
      fingerings.push({
        id: `${root}mM7-DmM7-barre`,
        frets: [fret4 + 1, fret4 + 2, fret4 + 2, fret4, null, null],
        fingers: [1, 2, 3, 1, null, null],
        barreAt: fret4, // 1弦と4弦でバレー
        barreStrings: [0, 3],
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'hard' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * メジャー6thコード(6)のDフォームを生成（4弦ルート）
 * D6フォーム: 開放D6コードの形をフレット移動
 * 開放D6: xx0202 (6弦から1弦) = [2, 0, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateMajor6thDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦D6コード（ルートがDの場合）
      fingerings.push({
        id: `${root}6-D6-open`,
        frets: [2, 0, 2, 0, null, null],
        fingers: [1, null, 2, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // D6フォームバレー
      // 6thはメジャー5度の上に長6度を加える
      const baseFret = fret4;
      fingerings.push({
        id: `${root}6-D6-barre`,
        frets: [fret4 + 2, fret4, fret4 + 2, fret4, null, null],
        fingers: [2, 1, 3, 1, null, null],
        barreAt: fret4, // 2弦と4弦でバレー
        barreStrings: [1, 3],
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * マイナー6thコード(m6)のDフォームを生成（4弦ルート）
 * Dm6フォーム: 開放Dm6コードの形をフレット移動
 * 開放Dm6: xx0201 (6弦から1弦) = [1, 0, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateMinor6thDForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦Dm6コード（ルートがDの場合）
      fingerings.push({
        id: `${root}m6-Dm6-open`,
        frets: [1, 0, 2, 0, null, null],
        fingers: [1, null, 2, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // Dm6フォームバレー
      // m6はマイナーに長6度を加える
      const baseFret = fret4;
      fingerings.push({
        id: `${root}m6-Dm6-barre`,
        frets: [fret4 + 1, fret4, fret4 + 2, fret4, null, null],
        fingers: [2, 1, 3, 1, null, null],
        barreAt: fret4, // 2弦と4弦でバレー
        barreStrings: [1, 3],
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'medium' : 'hard',
      });
    }
  }

  return fingerings;
}

/**
 * sus4コードのDフォームを生成（4弦ルート）
 * Dsus4フォーム: 開放Dsus4コードの形をフレット移動
 * 開放Dsus4: xx0233 (6弦から1弦) = [3, 3, 2, 0, null, null] (1弦から6弦の配列)
 * ルート: 4弦開放（D=0）
 * 4弦コードボイシング（1-4弦のみ使用、5-6弦はミュート）
 */
export function generateSus4DForm(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];

  if (fret4 !== undefined) {
    if (fret4 === 0) {
      // 開放弦Dsus4コード（ルートがDの場合）
      fingerings.push({
        id: `${root}sus4-Dsus4-open`,
        frets: [3, 3, 2, 0, null, null],
        fingers: [3, 4, 2, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: 'easy',
      });
    } else {
      // Dsus4フォームバレー
      // sus4は3度の代わりに4度を使う
      const baseFret = fret4;
      fingerings.push({
        id: `${root}sus4-Dsus4-barre`,
        frets: [fret4 + 3, fret4 + 3, fret4 + 2, fret4, null, null],
        fingers: [3, 4, 2, 1, null, null],
        barreAt: null, // 各弦を個別に押さえる
        barreStrings: null,
        baseFret: baseFret,
        muted: [false, false, false, false, true, true],
        isDefault: false,
        difficulty: fret4 <= 7 ? 'hard' : 'hard',
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
 * CAGEDシステムに基づいてコードのフィンガリングを取得
 */
export function getCAGEDChordFingerings(chordName: string): ChordFingering[] {
  const parsed = parseChordForCAGED(chordName);
  if (!parsed) return [];

  const { root } = parsed;
  const quality = normalizeQuality(parsed.quality);

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

  const quality = normalizeQuality(parsed.quality);
  const supportedQualities = ['', 'm', '7', 'm7', 'M7', 'm6', '6', 'mM7', 'sus4'];
  return supportedQualities.includes(quality);
}
