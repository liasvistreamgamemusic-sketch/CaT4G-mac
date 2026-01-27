/**
 * CaT4G - Symmetric Chord Generator
 * 対称コード（dim/dim7/aug/aug7）の押さえ方を動的に生成
 *
 * 音楽理論:
 * - dim: 減3度[0,3,6] → 3フレット移動で同じ構成音（実質3グループ）
 * - dim7: 完全対称[0,3,6,9] → 3フレット移動で完全同一（実質3グループ）
 * - aug: 長3度[0,4,8] → 4フレット移動で同じ構成音（実質4グループ）
 */

import type { ChordFingering } from './types';

// ルート音からフレット位置へのマッピング
// 6弦でのフレット位置（E=0, F=1, F#=2, G=3, ...）
const ROOT_TO_FRET_6STRING: Record<string, number> = {
  E: 0, Fb: 0, F: 1, 'E#': 1, 'F#': 2, Gb: 2, G: 3, 'G#': 4, Ab: 4,
  A: 5, 'A#': 6, Bb: 6, B: 7, Cb: 7, C: 8, 'B#': 8, 'C#': 9, Db: 9,
  D: 10, 'D#': 11, Eb: 11,
};

// 5弦でのフレット位置（A=0, A#=1, B=2, C=3, ...）
const ROOT_TO_FRET_5STRING: Record<string, number> = {
  A: 0, 'A#': 1, Bb: 1, B: 2, Cb: 2, C: 3, 'B#': 3, 'C#': 4, Db: 4,
  D: 5, 'D#': 6, Eb: 6, E: 7, Fb: 7, F: 8, 'E#': 8, 'F#': 9, Gb: 9,
  G: 10, 'G#': 11, Ab: 11,
};

// 4弦でのフレット位置（D=0, D#=1, E=2, F=3, ...）
const ROOT_TO_FRET_4STRING: Record<string, number> = {
  D: 0, 'D#': 1, Eb: 1, E: 2, Fb: 2, F: 3, 'E#': 3, 'F#': 4, Gb: 4,
  G: 5, 'G#': 6, Ab: 6, A: 7, 'A#': 8, Bb: 8,
  B: 9, Cb: 9, C: 10, 'B#': 10, 'C#': 11, Db: 11,
};

/**
 * ディミニッシュ(dim)コードのフィンガリングを生成
 * dimは減3度[0,3,6]で構成、3フレット移動で同じ構成音
 */
export function generateDimFingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // Form A: 4弦ルート型 - コンパクトなdimフォーム
  // frets: [x, x, ルート, +3, +2, x] - 1-4弦のみ使用
  if (fret4 !== undefined && fret4 >= 1 && fret4 <= 10) {
    const baseFret = fret4;
    fingerings.push({
      id: `${root}dim-4str-root`,
      frets: [null, fret4 + 2, fret4, fret4 + 1, null, null],
      fingers: [null, 3, 1, 2, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret,
      muted: [true, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    });
  }

  // Form B: 5弦ルート型 - 標準dimフォーム
  // frets: [x, +2, ルート, +1, ルート, x]
  if (fret5 !== undefined && fret5 >= 1 && fret5 <= 9) {
    const baseFret = fret5;
    fingerings.push({
      id: `${root}dim-5str-root`,
      frets: [fret5 + 2, fret5, fret5 + 1, fret5 + 2, fret5, null],
      fingers: [3, 1, 2, 3, 1, null],
      barreAt: fret5,
      barreStrings: [1, 4],
      baseFret,
      muted: [false, false, false, false, false, true],
      isDefault: fingerings.length === 0,
      difficulty: 'medium',
    });
  }

  // Form C: 6弦ルートバレー型
  // frets: [ルート+2, ルート, ルート+1, ルート+2, ルート, ルート]
  if (fret6 !== undefined && fret6 >= 1 && fret6 <= 9) {
    const baseFret = fret6;
    fingerings.push({
      id: `${root}dim-6str-barre`,
      frets: [fret6 + 2, fret6, fret6 + 1, fret6 + 2, fret6, fret6],
      fingers: [3, 1, 2, 3, 1, 1],
      barreAt: fret6,
      barreStrings: [1, 5],
      baseFret,
      muted: [false, false, false, false, false, false],
      isDefault: fingerings.length === 0,
      difficulty: 'hard',
    });
  }

  // 開放弦フォームの特別ケース
  if (root === 'E' || root === 'D') {
    if (root === 'E') {
      // Edim開放型
      fingerings.unshift({
        id: `${root}dim-open`,
        frets: [null, 2, 0, 1, null, 0],
        fingers: [null, 2, null, 1, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [true, false, false, false, true, false],
        isDefault: true,
        difficulty: 'easy',
      });
    }
  }

  // isDefaultを再設定（最初のフォームのみtrue）
  fingerings.forEach((f, i) => {
    f.isDefault = i === 0;
  });

  return fingerings;
}

/**
 * ディミニッシュセブンス(dim7)コードのフィンガリングを生成
 * dim7は完全対称[0,3,6,9]で構成、3フレット移動で完全同一
 */
export function generateDim7Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret4 = ROOT_TO_FRET_4STRING[root];
  const fret5 = ROOT_TO_FRET_5STRING[root];

  // 低フレット型: 4弦ルート - コンパクトなdim7
  // frets: [+1, +2, ルート, +1, x, x]
  if (fret4 !== undefined && fret4 >= 1 && fret4 <= 10) {
    const baseFret = fret4;
    fingerings.push({
      id: `${root}dim7-low`,
      frets: [fret4 + 1, fret4 + 2, fret4, fret4 + 1, null, null],
      fingers: [1, 3, 1, 2, null, null],
      barreAt: fret4 + 1,
      barreStrings: [0, 3],
      baseFret,
      muted: [false, false, false, false, true, true],
      isDefault: true,
      difficulty: 'medium',
    });
  }

  // 中フレット型: 5弦ルート - フルdim7フォーム
  // frets: [+1, ルート, +1, +2, ルート, x]
  if (fret5 !== undefined && fret5 >= 1 && fret5 <= 9) {
    const baseFret = fret5;
    fingerings.push({
      id: `${root}dim7-mid`,
      frets: [fret5 + 1, fret5, fret5 + 1, fret5 + 2, fret5, null],
      fingers: [2, 1, 2, 3, 1, null],
      barreAt: fret5,
      barreStrings: [1, 4],
      baseFret,
      muted: [false, false, false, false, false, true],
      isDefault: fingerings.length === 0,
      difficulty: 'medium',
    });
  }

  // 開放型の特別ケース
  if (root === 'D' || root === 'E' || root === 'F' || root === 'G' || root === 'A' || root === 'B' || root === 'C') {
    // 特定のルートに対する開放弦を使ったdim7
    if (root === 'E') {
      fingerings.push({
        id: `${root}dim7-open`,
        frets: [0, 2, 0, 1, null, 0],
        fingers: [null, 3, null, 1, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, false],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    } else if (root === 'D') {
      fingerings.push({
        id: `${root}dim7-open`,
        frets: [1, 0, 1, 0, null, null],
        fingers: [2, null, 1, null, null, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, true, true],
        isDefault: fingerings.length === 0,
        difficulty: 'easy',
      });
    }
  }

  // isDefaultを再設定（最初のフォームのみtrue）
  fingerings.forEach((f, i) => {
    f.isDefault = i === 0;
  });

  return fingerings;
}

/**
 * オーギュメント(aug)コードのフィンガリングを生成
 * augは長3度[0,4,8]で構成、4フレット移動で同じ構成音
 */
export function generateAugFingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // Form 1: Eaug型（6弦ルート） - 標準aug
  // aug = [0, 4, 8] = root + M3 + #5
  // Eaug開放フォーム: 6弦=E(root), 5弦=C(#5/3フレット), 4弦=E(root/2フレット), 3弦=G#(M3/1フレット), 2弦=C(#5/1フレット), 1弦=E(root/0フレット)
  // frets: [0 or x, +1, +1, +2, +3, ルート]
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // 開放弦Eaug: x-0-3-1-1-0 または 0-0-3-1-1-0
      fingerings.push({
        id: `${root}aug-E-open`,
        frets: [0, 1, 1, 2, 3, 0],
        fingers: [null, 1, 1, 2, 3, null],
        barreAt: 1,
        barreStrings: [1, 2],
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret6 <= 9) {
      // Eaugフォームバレー: ルート+0, ルート+3, ルート+2, ルート+1, ルート+1, ルート
      // 6弦=root, 5弦=#5(+3), 4弦=root(+2), 3弦=M3(+1), 2弦=#5(+1), 1弦=root
      fingerings.push({
        id: `${root}aug-E-barre`,
        frets: [fret6, fret6 + 1, fret6 + 1, fret6 + 2, fret6 + 3, fret6],
        fingers: [1, 2, 2, 3, 4, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'medium',
      });
    }
  }

  // Form 2: Caug型（Cフォームベース） - コンパクト
  // frets: [+1, ルート+1, +2, ルート, x, x] (3弦でルート)
  // C型augは3弦ルートなので、3弦のフレット位置を計算
  const fret3 = (ROOT_TO_FRET_6STRING[root] ?? 0) + 4; // 3弦はGなので6弦+4フレット相当
  if (fret3 >= 1 && fret3 <= 8) {
    fingerings.push({
      id: `${root}aug-C-type`,
      frets: [fret3 + 1, fret3, fret3, fret3 + 1, null, null],
      fingers: [3, 1, 2, 4, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: fret3,
      muted: [false, false, false, false, true, true],
      isDefault: fingerings.length === 0,
      difficulty: 'medium',
    });
  }

  // Form 3: 5弦ルート型
  // frets: [ルート+1, ルート, ルート+1, x, ルート, x]
  if (fret5 !== undefined && fret5 >= 1 && fret5 <= 9) {
    fingerings.push({
      id: `${root}aug-5str-root`,
      frets: [fret5 + 1, fret5, fret5 + 1, null, fret5, null],
      fingers: [2, 1, 3, null, 1, null],
      barreAt: fret5,
      barreStrings: [1, 4],
      baseFret: fret5,
      muted: [false, false, false, true, false, true],
      isDefault: fingerings.length === 0,
      difficulty: 'medium',
    });
  }

  // Form 4: Daugコンパクト型（上位弦のみ）
  // frets: [+1, +2, ルート, x, x, x]
  const fret4 = ROOT_TO_FRET_4STRING[root];
  if (fret4 !== undefined && fret4 >= 1 && fret4 <= 10) {
    fingerings.push({
      id: `${root}aug-D-compact`,
      frets: [fret4 + 1, fret4 + 2, fret4, null, null, null],
      fingers: [1, 2, null, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: fret4,
      muted: [false, false, false, true, true, true],
      isDefault: fingerings.length === 0,
      difficulty: 'easy',
    });
  }

  // 特別な開放弦フォーム
  if (root === 'C') {
    fingerings.unshift({
      id: `${root}aug-open`,
      frets: [null, 1, 0, 1, 3, null],
      fingers: [null, 1, null, 2, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    });
  } else if (root === 'G') {
    fingerings.unshift({
      id: `${root}aug-open`,
      frets: [null, 0, 1, 0, 0, 3],
      fingers: [null, null, 1, null, null, 4],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [true, false, false, false, false, false],
      isDefault: true,
      difficulty: 'easy',
    });
  }

  // isDefaultを再設定（最初のフォームのみtrue）
  fingerings.forEach((f, i) => {
    f.isDefault = i === 0;
  });

  return fingerings;
}

/**
 * オーギュメントセブンス(aug7/+7)コードのフィンガリングを生成
 * aug7 = aug + m7
 */
export function generateAug7Fingerings(root: string): ChordFingering[] {
  const fingerings: ChordFingering[] = [];
  const fret5 = ROOT_TO_FRET_5STRING[root];
  const fret6 = ROOT_TO_FRET_6STRING[root];

  // Form 1: E+7型（6弦ルート）
  // frets: [x, +1, +1, 0, +2, ルート] → augに7thを追加
  if (fret6 !== undefined) {
    if (fret6 === 0) {
      // E+7 開放
      fingerings.push({
        id: `${root}aug7-E-open`,
        frets: [0, 1, 1, 0, 2, 0],
        fingers: [null, 2, 1, null, 3, null],
        barreAt: null,
        barreStrings: null,
        baseFret: 1,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'easy',
      });
    } else if (fret6 <= 8) {
      // E+7フォームバレー
      fingerings.push({
        id: `${root}aug7-E-barre`,
        frets: [fret6, fret6 + 1, fret6 + 1, fret6, fret6 + 2, fret6],
        fingers: [1, 2, 2, 1, 3, 1],
        barreAt: fret6,
        barreStrings: [0, 5],
        baseFret: fret6,
        muted: [false, false, false, false, false, false],
        isDefault: true,
        difficulty: 'hard',
      });
    }
  }

  // Form 2: C+7型（5弦ルート）
  // frets: [+1, ルート, +1, +2, ルート, x]
  if (fret5 !== undefined && fret5 >= 1 && fret5 <= 9) {
    fingerings.push({
      id: `${root}aug7-C-type`,
      frets: [fret5 + 1, fret5, fret5 + 1, fret5 + 2, fret5, null],
      fingers: [2, 1, 2, 3, 1, null],
      barreAt: fret5,
      barreStrings: [1, 4],
      baseFret: fret5,
      muted: [false, false, false, false, false, true],
      isDefault: fingerings.length === 0,
      difficulty: 'medium',
    });
  }

  // 特別な開放弦フォーム
  if (root === 'C') {
    fingerings.unshift({
      id: `${root}aug7-open`,
      frets: [0, 1, 0, 1, 3, null],
      fingers: [null, 1, null, 2, 4, null],
      barreAt: null,
      barreStrings: null,
      baseFret: 1,
      muted: [false, false, false, false, false, true],
      isDefault: true,
      difficulty: 'easy',
    });
  }

  // isDefaultを再設定（最初のフォームのみtrue）
  fingerings.forEach((f, i) => {
    f.isDefault = i === 0;
  });

  return fingerings;
}

/**
 * 対称コードかどうかを判定
 */
export function isSymmetricChord(quality: string): boolean {
  const normalizedQuality = quality.toLowerCase().replace(/[°+]/g, (m) => {
    if (m === '°') return 'dim';
    if (m === '+') return 'aug';
    return m;
  });

  return (
    normalizedQuality === 'dim' ||
    normalizedQuality === 'dim7' ||
    normalizedQuality === 'aug' ||
    normalizedQuality === '+' ||
    normalizedQuality === 'aug7' ||
    normalizedQuality === '+7'
  );
}

/**
 * コード名から対称コードのフィンガリングを取得
 * @param chordName - コード名（例: "Cdim", "F#aug7"）
 */
export function getSymmetricChordFingerings(chordName: string): ChordFingering[] {
  // コード名をルートと品質に分解
  const match = chordName.match(/^([A-G][#b]?)(dim7?|aug7?|\+7?)$/i);
  if (!match) {
    return [];
  }

  const root = match[1];
  const quality = match[2].toLowerCase();

  switch (quality) {
    case 'dim':
      return generateDimFingerings(root);
    case 'dim7':
      return generateDim7Fingerings(root);
    case 'aug':
    case '+':
      return generateAugFingerings(root);
    case 'aug7':
    case '+7':
      return generateAug7Fingerings(root);
    default:
      return [];
  }
}
