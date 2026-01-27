/**
 * CaT4G - Music Theory: Slash Chord Fingering Generator
 * 分数コードのフィンガリングを理論ベースで生成
 *
 * アルゴリズム:
 * 1. コードの構成音を取得（theory/registry から）
 * 2. ベース音を決定（bassInterval から）
 * 3. ギターの物理制約内でフィンガリングを探索:
 *    - 6弦または5弦にベース音を配置
 *    - 残りの弦でコード構成音をカバー
 *    - ストレッチが4フレット以内に収まるものを選択
 * 4. 難易度を計算してソート
 */

import type { Difficulty, Fingering } from '../data/types';
import { getIntervalsFromRegistry, normalizeQualityFromRegistry } from './registry';
import { normalizeToOctave } from './intervals';

// ギターの定数
const OPEN_STRINGS_MIDI = [4, 11, 7, 2, 9, 4]; // [1弦E, 2弦B, 3弦G, 4弦D, 5弦A, 6弦E]
const MAX_FRET = 15;
const MAX_STRETCH = 4; // 指の最大ストレッチ（フレット数）

// 音名からMIDIへのマッピング
const NOTE_TO_MIDI: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

interface GeneratedFingering {
  frets: (number | null)[];
  bassString: number; // 0-indexed (0 = 1弦, 5 = 6弦)
  bassFret: number;
  intervals: number[];
  difficulty: Difficulty;
}

/**
 * 分数コードのフィンガリングを理論ベースで生成
 *
 * @param root ルート音 (例: "C", "F#")
 * @param quality コード品質 (例: "", "m7", "M7")
 * @param bassInterval ベース音への半音数
 * @returns 生成されたフィンガリング配列
 */
export function generateSlashChordFingerings(
  root: string,
  quality: string,
  bassInterval: number
): Fingering[] {
  const rootMidi = NOTE_TO_MIDI[root];
  if (rootMidi === undefined) return [];

  // コード構成音を取得
  const normalizedQuality = normalizeQualityFromRegistry(quality);
  let chordIntervals = getIntervalsFromRegistry(normalizedQuality || quality);

  if (!chordIntervals) {
    // フォールバック: メジャートライアド
    chordIntervals = [0, 4, 7];
  }

  // ベース音のMIDI
  const bassMidi = normalizeToOctave(rootMidi + bassInterval);

  // コード構成音のMIDI（オクターブ正規化）
  const chordNotesMidi = chordIntervals.map((i) => normalizeToOctave(rootMidi + i));

  // フィンガリング候補を生成
  const candidates: GeneratedFingering[] = [];

  // ベース弦候補: 6弦と5弦
  const bassStrings = [5, 4]; // 0-indexed: 5=6弦, 4=5弦

  for (const bassString of bassStrings) {
    const bassStringMidi = OPEN_STRINGS_MIDI[bassString];

    // ベース音のフレット位置を計算
    let bassFret = normalizeToOctave(bassMidi - bassStringMidi);
    if (bassFret === 0) bassFret = 12; // 開放弦を避ける（分数コードでは明確にベース音を鳴らす）

    // フレット範囲を考慮
    if (bassFret > MAX_FRET) continue;

    // ベースフレットを基準にフィンガリングを探索
    const fingering = findBestFingering(
      bassString,
      bassFret,
      bassMidi,
      chordNotesMidi,
      rootMidi
    );

    if (fingering) {
      candidates.push(fingering);
    }
  }

  // 難易度でソート
  candidates.sort((a, b) => {
    const difficultyOrder: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  // Fingering形式に変換
  return candidates.slice(0, 3).map((c, index) => convertToFingering(c, root, quality, index));
}

/**
 * 最適なフィンガリングを探索
 */
function findBestFingering(
  bassString: number,
  bassFret: number,
  bassMidi: number,
  chordNotesMidi: number[],
  rootMidi: number
): GeneratedFingering | null {
  const frets: (number | null)[] = [null, null, null, null, null, null];
  frets[bassString] = bassFret;

  // 使用する弦（ベース弦以外）
  const availableStrings = [];
  for (let i = 0; i < 6; i++) {
    if (i !== bassString) {
      // ベース弦より高い弦（音程が高い方）のみ使用
      if (i < bassString) {
        availableStrings.push(i);
      }
    }
  }

  // フレット範囲を決定（ベースフレット周辺）
  const minFret = Math.max(1, bassFret - 2);
  const maxFret = Math.min(MAX_FRET, bassFret + MAX_STRETCH - 1);

  // ベース音を除いたコード構成音（重複除去）
  const targetNotes = chordNotesMidi.filter((n) => n !== bassMidi);
  const coveredNotes = new Set<number>();
  coveredNotes.add(bassMidi); // ベース音は既にカバー

  // 各弦で最適なフレットを探す
  for (const stringIdx of availableStrings) {
    const openMidi = OPEN_STRINGS_MIDI[stringIdx];
    let bestFret: number | null = null;
    let bestNote: number | null = null;

    // 開放弦をチェック
    const openNote = normalizeToOctave(openMidi);
    if (targetNotes.includes(openNote) && !coveredNotes.has(openNote)) {
      bestFret = 0;
      bestNote = openNote;
    }

    // フレット範囲内で最適な音を探す
    for (let fret = minFret; fret <= maxFret; fret++) {
      const note = normalizeToOctave(openMidi + fret);
      if (targetNotes.includes(note)) {
        if (bestFret === null || !coveredNotes.has(note)) {
          bestFret = fret;
          bestNote = note;
        }
      }
    }

    if (bestFret !== null && bestNote !== null) {
      frets[stringIdx] = bestFret;
      coveredNotes.add(bestNote);
    } else {
      // この弦はミュート
      frets[stringIdx] = null;
    }
  }

  // ベース弦より低い弦はミュート
  for (let i = bassString + 1; i < 6; i++) {
    frets[i] = null;
  }

  // カバー率をチェック（最低でもルート音とベース音が必要）
  const rootCovered = coveredNotes.has(rootMidi);
  if (!rootCovered && !chordNotesMidi.includes(bassMidi)) {
    // ルート音もベース音もカバーされていない場合は却下
    return null;
  }

  // インターバル配列を計算
  const intervals = calculateIntervals(frets, rootMidi);

  // 難易度を計算
  const difficulty = calculateDifficulty(frets, bassFret);

  return {
    frets,
    bassString,
    bassFret,
    intervals,
    difficulty,
  };
}

/**
 * フレット配列からインターバル配列を計算
 */
function calculateIntervals(frets: (number | null)[], rootMidi: number): number[] {
  const intervals: number[] = [];

  for (let i = 0; i < 6; i++) {
    const fret = frets[i];
    if (fret !== null) {
      const noteMidi = normalizeToOctave(OPEN_STRINGS_MIDI[i] + fret);
      const interval = normalizeToOctave(noteMidi - rootMidi);
      if (!intervals.includes(interval)) {
        intervals.push(interval);
      }
    }
  }

  return intervals.sort((a, b) => a - b);
}

/**
 * 難易度を計算
 */
function calculateDifficulty(frets: (number | null)[], baseFret: number): Difficulty {
  const usedFrets = frets.filter((f): f is number => f !== null && f > 0);

  if (usedFrets.length === 0) return 'easy';

  const minFret = Math.min(...usedFrets);
  const maxFret = Math.max(...usedFrets);
  const stretch = maxFret - minFret;

  // フレット数（高い位置ほど難しい）
  const positionDifficulty = baseFret > 7 ? 1 : 0;

  // ストレッチ
  const stretchDifficulty = stretch > 3 ? 2 : stretch > 2 ? 1 : 0;

  // 使用する弦の数
  const stringCount = usedFrets.length;
  const stringDifficulty = stringCount > 4 ? 1 : 0;

  const totalDifficulty = positionDifficulty + stretchDifficulty + stringDifficulty;

  if (totalDifficulty >= 3) return 'hard';
  if (totalDifficulty >= 1) return 'medium';
  return 'easy';
}

/**
 * GeneratedFingeringをFingering形式に変換
 */
function convertToFingering(
  generated: GeneratedFingering,
  root: string,
  quality: string,
  index: number
): Fingering {
  const { frets, bassFret, intervals, difficulty } = generated;

  // フィンガリング（指番号）を推定
  const fingers = estimateFingers(frets);

  // ミュート配列
  const muted = frets.map((f) => f === null);

  // バレーの検出
  const { barreAt, barreStrings } = detectBarre(frets, fingers);

  // baseFretはフィンガリング図の開始フレット（1以上）
  const usedFrets = frets.filter((f): f is number => f !== null && f > 0);
  const displayBaseFret = usedFrets.length > 0 ? Math.min(...usedFrets) : bassFret;

  return {
    id: `slash-${root}${quality}-${index}`,
    frets,
    fingers,
    barreAt,
    barreStrings,
    baseFret: Math.max(1, displayBaseFret),
    muted,
    difficulty,
    intervals,
  };
}

/**
 * フレット配列から指番号を推定
 */
function estimateFingers(frets: (number | null)[]): (number | null)[] {
  const fingers: (number | null)[] = [null, null, null, null, null, null];

  // 使用するフレットとその位置を収集
  const usedPositions: { string: number; fret: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const fret = frets[i];
    if (fret !== null && fret > 0) {
      usedPositions.push({ string: i, fret });
    }
  }

  if (usedPositions.length === 0) return fingers;

  // フレット番号でソート
  usedPositions.sort((a, b) => a.fret - b.fret);

  // 指を割り当て
  const fingerOrder = [1, 2, 3, 4]; // 人差し指、中指、薬指、小指
  let fingerIdx = 0;

  // 同じフレットの場合は同じ指（バレー）
  let lastFret = -1;
  let lastFinger = 0;

  for (const pos of usedPositions) {
    if (pos.fret === lastFret) {
      fingers[pos.string] = lastFinger;
    } else {
      if (fingerIdx < fingerOrder.length) {
        fingers[pos.string] = fingerOrder[fingerIdx];
        lastFinger = fingerOrder[fingerIdx];
        lastFret = pos.fret;
        fingerIdx++;
      }
    }
  }

  return fingers;
}

/**
 * バレーを検出
 */
function detectBarre(
  frets: (number | null)[],
  fingers: (number | null)[]
): { barreAt: number | null; barreStrings: [number, number] | null } {
  // 同じフレットで同じ指が複数の弦にある場合はバレー
  const fingerFretMap = new Map<number, { fret: number; strings: number[] }>();

  for (let i = 0; i < 6; i++) {
    const finger = fingers[i];
    const fret = frets[i];
    if (finger !== null && fret !== null && fret > 0) {
      if (!fingerFretMap.has(finger)) {
        fingerFretMap.set(finger, { fret, strings: [] });
      }
      const entry = fingerFretMap.get(finger)!;
      if (entry.fret === fret) {
        entry.strings.push(i);
      }
    }
  }

  // バレーを探す（人差し指優先）
  for (const [, entry] of fingerFretMap) {
    if (entry.strings.length >= 2) {
      const minString = Math.min(...entry.strings);
      const maxString = Math.max(...entry.strings);
      return {
        barreAt: entry.fret,
        barreStrings: [minString, maxString],
      };
    }
  }

  return { barreAt: null, barreStrings: null };
}

/**
 * 分数コード名からフィンガリングを生成
 */
export function generateFingeringFromSlashChordName(chordName: string): Fingering[] {
  // パース: "C/E" -> { root: "C", quality: "", bass: "E" }
  const match = chordName.match(/^([A-G][#b]?)([^/]*)?\/([A-G][#b]?)$/);
  if (!match) return [];

  const [, root, quality = '', bassNote] = match;

  const rootMidi = NOTE_TO_MIDI[root];
  const bassMidi = NOTE_TO_MIDI[bassNote];

  if (rootMidi === undefined || bassMidi === undefined) return [];

  const bassInterval = normalizeToOctave(bassMidi - rootMidi);

  return generateSlashChordFingerings(root, quality, bassInterval);
}
