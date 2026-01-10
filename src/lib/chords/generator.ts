/**
 * CaT4G - Dynamic Chord Generator
 * 任意のコード名から押さえ方を動的に生成
 *
 * 優先順位:
 * 1. データベース（database.ts） - 分数コード等の定義済みフィンガリング
 * 2. CAGEDシステム（cagedChords.ts） - バレーコードの動的生成
 * 3. 標準コードライブラリ（standardChords.ts） - 実用的で検証済みの押さえ方
 * 4. 動的生成 - 上記にない場合のフォールバック
 */

import type { ChordFingering } from './types';
import { getStandardChordFingerings } from './standardChords';
import { getCAGEDChordFingerings, isCAGEDSupported } from './cagedChords';
import { getChordDefinition } from './database';
import { normalizeQuality, isFingeringDisplayable } from './utils';

// 開放弦の音（標準チューニング）
// [1弦(E4), 2弦(B3), 3弦(G3), 4弦(D3), 5弦(A2), 6弦(E2)]
const OPEN_STRINGS: number[] = [4, 11, 7, 2, 9, 4]; // MIDIノート番号 mod 12

// 音名からMIDI番号（mod 12）へのマッピング
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

// コード構成音のインターバル定義
const CHORD_INTERVALS: Record<string, number[]> = {
  // メジャー系
  '': [0, 4, 7], // Major
  maj: [0, 4, 7],
  M: [0, 4, 7],
  '5': [0, 7], // Power chord
  '6': [0, 4, 7, 9], // Major 6th
  M6: [0, 4, 7, 9],
  maj6: [0, 4, 7, 9],
  add6: [0, 4, 7, 9],
  '7': [0, 4, 7, 10], // Dominant 7
  M7: [0, 4, 7, 11], // Major 7
  maj7: [0, 4, 7, 11],
  Maj7: [0, 4, 7, 11],
  'Δ': [0, 4, 7, 11],
  'Δ7': [0, 4, 7, 11],
  '9': [0, 4, 7, 10, 14],
  M9: [0, 4, 7, 11, 14],
  maj9: [0, 4, 7, 11, 14],
  add9: [0, 4, 7, 14],
  add2: [0, 2, 4, 7],
  '11': [0, 4, 7, 10, 14, 17],
  '13': [0, 4, 7, 10, 14, 21],
  '69': [0, 4, 7, 9, 14], // 6/9 chord

  // マイナー系
  m: [0, 3, 7],
  min: [0, 3, 7],
  mi: [0, 3, 7],
  '-': [0, 3, 7],
  m6: [0, 3, 7, 9], // Minor 6th
  min6: [0, 3, 7, 9],
  '-6': [0, 3, 7, 9],
  m7: [0, 3, 7, 10],
  min7: [0, 3, 7, 10],
  mi7: [0, 3, 7, 10],
  '-7': [0, 3, 7, 10],
  mM7: [0, 3, 7, 11], // Minor Major 7th
  'minMaj7': [0, 3, 7, 11],
  'mMaj7': [0, 3, 7, 11],
  'm(M7)': [0, 3, 7, 11],
  'm/M7': [0, 3, 7, 11],
  'mΔ7': [0, 3, 7, 11],
  '-Δ7': [0, 3, 7, 11],
  m9: [0, 3, 7, 10, 14],
  min9: [0, 3, 7, 10, 14],
  m11: [0, 3, 7, 10, 14, 17],
  madd9: [0, 3, 7, 14],
  m69: [0, 3, 7, 9, 14], // Minor 6/9

  // サスペンデッド
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  sus: [0, 5, 7],
  '7sus4': [0, 5, 7, 10],
  '7sus': [0, 5, 7, 10],
  '9sus4': [0, 5, 7, 10, 14],
  '9sus': [0, 5, 7, 10, 14],
  'add4': [0, 4, 5, 7],

  // ディミニッシュ/オーギュメント
  dim: [0, 3, 6],
  '°': [0, 3, 6],
  'o': [0, 3, 6],
  dim7: [0, 3, 6, 9],
  '°7': [0, 3, 6, 9],
  'o7': [0, 3, 6, 9],
  m7b5: [0, 3, 6, 10], // Half diminished
  'm7-5': [0, 3, 6, 10],
  'ø': [0, 3, 6, 10],
  'ø7': [0, 3, 6, 10],
  'Ø': [0, 3, 6, 10],
  'Ø7': [0, 3, 6, 10],
  '-7b5': [0, 3, 6, 10],
  aug: [0, 4, 8],
  '+': [0, 4, 8],
  aug7: [0, 4, 8, 10],
  '+7': [0, 4, 8, 10],
  'M7#5': [0, 4, 8, 11],
  'maj7#5': [0, 4, 8, 11],

  // アルタード
  '7#5': [0, 4, 8, 10],
  '7+5': [0, 4, 8, 10],
  '7b5': [0, 4, 6, 10],
  '7-5': [0, 4, 6, 10],
  '7#9': [0, 4, 7, 10, 15],
  '7b9': [0, 4, 7, 10, 13],
  '7#11': [0, 4, 7, 10, 18],
  '7b13': [0, 4, 7, 10, 20],
  'alt': [0, 4, 8, 10, 13], // Altered dominant (7#5b9)
  '7alt': [0, 4, 8, 10, 13],
};

/**
 * コード名を正規化
 */
function normalizeChordName(name: string): string {
  return name.replace(/♯/g, '#').replace(/♭/g, 'b');
}

/**
 * コード名をパース
 */
function parseChordName(
  chordName: string
): { root: string; quality: string; bass?: string } | null {
  const normalized = normalizeChordName(chordName);

  // 分数コード（ベース音付き）のパターン
  const slashMatch = normalized.match(/^([A-G][#b]?)(.*)\/([A-G][#b]?)$/);
  if (slashMatch) {
    return {
      root: slashMatch[1],
      quality: slashMatch[2] || '',
      bass: slashMatch[3],
    };
  }

  // 通常のコード
  const match = normalized.match(/^([A-G][#b]?)(.*)$/);
  if (match) {
    return {
      root: match[1],
      quality: match[2] || '',
    };
  }

  return null;
}

/**
 * コードの構成音を取得
 */
function getChordNotes(root: string, quality: string): number[] {
  const rootMidi = NOTE_TO_MIDI[root];
  if (rootMidi === undefined) return [];

  // 品質に対応するインターバルを検索
  let intervals = CHORD_INTERVALS[quality];

  // 見つからない場合、正規化して再検索
  if (!intervals) {
    const normalizedQuality = normalizeQuality(quality);
    intervals = CHORD_INTERVALS[normalizedQuality];
  }

  // それでも見つからない場合、構成要素から構築
  if (!intervals) {
    intervals = buildIntervalsFromQuality(quality);
  }

  return intervals.map((interval) => (rootMidi + interval) % 12);
}


/**
 * 品質文字列から構成音インターバルを構築
 */
function buildIntervalsFromQuality(quality: string): number[] {
  // ベースのインターバル
  let base: number[] = [0, 4, 7]; // メジャートライアド
  let extensions: number[] = [];

  const q = quality.toLowerCase();

  // マイナー判定
  if (q.startsWith('m') && !q.startsWith('maj')) {
    base = [0, 3, 7]; // マイナートライアド
  }

  // dim判定
  if (q.includes('dim') || q.includes('°')) {
    base = [0, 3, 6];
  }

  // aug判定
  if (q.includes('aug') || q.includes('+')) {
    base = [0, 4, 8];
  }

  // sus判定
  if (q.includes('sus4')) {
    base = [0, 5, 7];
  } else if (q.includes('sus2')) {
    base = [0, 2, 7];
  }

  // 7th判定
  if (q.includes('m7') || q.includes('7') && !q.includes('maj7') && !q.includes('m7')) {
    // ドミナント7th または マイナー7th
    if (q.includes('dim7') || q.includes('°7')) {
      extensions.push(9); // dim7 = bb7
    } else if (q.includes('mm7') || q.includes('mM7') || q.includes('m/m7')) {
      // マイナーメジャー7th: マイナートライアド + メジャー7th
      base = [0, 3, 7];
      extensions.push(11);
    } else if (q.includes('m7b5') || q.includes('ø')) {
      // ハーフディミニッシュ
      base = [0, 3, 6];
      extensions.push(10);
    } else {
      extensions.push(10); // ドミナント7th
    }
  }

  // maj7判定
  if (q.includes('maj7') || q.includes('m7') && !q.includes('mm7')) {
    // major 7th
    if (!extensions.includes(11) && !extensions.includes(10)) {
      extensions.push(11);
    }
  }

  // mM7特殊処理
  if (q === 'mm7' || q === 'mM7' || q === 'm/m7') {
    base = [0, 3, 7];
    extensions = [11];
  }

  // 6th判定
  if (q.includes('6') && !q.includes('7')) {
    extensions.push(9);
  }

  // 9th判定
  if (q.includes('9') && !q.includes('b9') && !q.includes('#9')) {
    extensions.push(14); // 9th = 2 + 12
  }

  // add9判定
  if (q.includes('add9') || q.includes('add2')) {
    extensions.push(14);
  }

  // b5判定
  if (q.includes('b5') && !q.includes('m7b5')) {
    base[2] = 6; // 5thを♭5に
  }

  // #5判定
  if (q.includes('#5')) {
    base[2] = 8; // 5thを#5に
  }

  return [...base, ...extensions];
}

/**
 * 特定の弦・フレットで鳴る音を取得
 */
function getNoteAtFret(stringIndex: number, fret: number): number {
  return (OPEN_STRINGS[stringIndex] + fret) % 12;
}

/**
 * 動的にコードのフィンガリングを生成（デフォルト1つ）
 */
export function generateChordFingering(chordName: string): ChordFingering | null {
  const fingerings = generateChordFingerings(chordName);
  return fingerings.length > 0 ? fingerings[0] : null;
}

/**
 * 動的にコードの複数のフィンガリングを生成
 *
 * 優先順位:
 * 1. 開放弦フォーム（難易度: easy）を最優先
 * 2. CAGEDシステムによるバレーコード（Eフォーム、Aフォーム等）
 * 3. 標準コードライブラリから取得（特殊なボイシング）
 * 4. 動的生成でフォールバック（ライブラリにない場合）
 */
export function generateChordFingerings(chordName: string): ChordFingering[] {
  const allFingerings: ChordFingering[] = [];
  const seen = new Set<string>();

  // フレットパターンのキーを生成
  const getKey = (f: ChordFingering) => f.frets.join(',') + '|' + f.muted.join(',');

  // 重複チェック付きで追加
  const addIfUnique = (fingering: ChordFingering) => {
    const key = getKey(fingering);
    if (!seen.has(key)) {
      seen.add(key);
      allFingerings.push(fingering);
      return true;
    }
    return false;
  };

  // 1. データベースから定義を取得（分数コード等）
  const chordDef = getChordDefinition(chordName);
  if (chordDef) {
    for (const fingering of chordDef.fingerings) {
      addIfUnique(fingering);
    }
  }

  // 2. CAGEDシステムによるバレーコード
  if (isCAGEDSupported(chordName)) {
    const cagedFingerings = getCAGEDChordFingerings(chordName);
    for (const fingering of cagedFingerings) {
      addIfUnique(fingering);
    }
  }

  // 3. 標準コードライブラリから取得（特殊なボイシング用）
  const standardFingerings = getStandardChordFingerings(chordName);
  for (const fingering of standardFingerings) {
    addIfUnique(fingering);
  }

  // 4. 動的生成（まだ少ない場合に補完）
  if (allFingerings.length < 4) {
    const dynamicFingerings = generateDynamicFingerings(chordName);
    for (const fingering of dynamicFingerings) {
      if (allFingerings.length >= 6) break; // 最大6つまで
      addIfUnique(fingering);
    }
  }

  // Filter to only include displayable fingerings (all frets within baseFret+4)
  // User explicitly stated: "表示フレット以外を押さえるコードは必要ない"
  // So we return ONLY displayable fingerings, no fallback
  const displayableFingerings = allFingerings.filter(isFingeringDisplayable);

  // If no displayable fingerings, return empty array
  if (displayableFingerings.length === 0) {
    return [];
  }

  // ソート: CAGEDシステム/標準ライブラリを優先、動的生成は最後
  const sortedFingerings = displayableFingerings.sort((a, b) => {
    // 動的生成（generated-で始まるID）は最後に
    const aIsGenerated = a.id.startsWith('generated-');
    const bIsGenerated = b.id.startsWith('generated-');

    if (aIsGenerated && !bIsGenerated) return 1;
    if (!aIsGenerated && bIsGenerated) return -1;

    // 開放弦フォーム（バレーなし、baseFret=1）を優先
    const aIsOpen = a.barreAt === null && a.baseFret === 1;
    const bIsOpen = b.barreAt === null && b.baseFret === 1;

    if (aIsOpen && !bIsOpen) return -1;
    if (!aIsOpen && bIsOpen) return 1;

    // 難易度でソート
    const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
    const aDiff = difficultyOrder[a.difficulty] || 1;
    const bDiff = difficultyOrder[b.difficulty] || 1;
    if (aDiff !== bDiff) return aDiff - bDiff;

    // バレーコードは低いフレット順
    return (a.baseFret || 0) - (b.baseFret || 0);
  });

  // isDefault フラグを更新（最初のものだけがデフォルト）
  return sortedFingerings.map((fingering, index) => ({
    ...fingering,
    isDefault: index === 0,
  }));
}

/**
 * 動的にフィンガリングを生成（内部関数）
 */
function generateDynamicFingerings(chordName: string): ChordFingering[] {
  const parsed = parseChordName(chordName);
  if (!parsed) return [];

  const { root, quality, bass } = parsed;
  const chordNotes = getChordNotes(root, quality);
  if (chordNotes.length === 0) return [];

  const rootMidi = NOTE_TO_MIDI[root];
  const bassMidi = bass ? NOTE_TO_MIDI[bass] : rootMidi;

  // 複数のポジションを探索
  const results = findAllPositions(chordNotes, rootMidi, bassMidi, bass !== undefined);

  return results.map((result, index) => ({
    id: `generated-${chordName}-${index}`,
    frets: result.frets,
    fingers: result.fingers,
    barreAt: result.barreAt,
    barreStrings: result.barreStrings,
    baseFret: result.baseFret,
    muted: result.muted,
    isDefault: index === 0,
    difficulty: result.difficulty,
  }));
}

interface PositionResult {
  frets: (number | null)[];
  fingers: (number | null)[];
  barreAt: number | null;
  barreStrings: [number, number] | null;
  baseFret: number;
  muted: boolean[];
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * 複数のコードポジションを探索（スコア順でソート）
 */
function findAllPositions(
  chordNotes: number[],
  rootMidi: number,
  bassMidi: number,
  isSlashChord: boolean
): PositionResult[] {
  const results: (PositionResult & { score: number })[] = [];

  // 分数コードの場合
  if (isSlashChord) {
    // 1. 5弦ベース + 高音弦バレー（B/D#のような形）
    // B/D#: 6弦×, 5弦3f(D#), 4弦1f, 3弦1f, 2弦1f, 1弦×
    for (let fret = 0; fret <= 7; fret++) {
      const bassNote = getNoteAtFret(4, fret); // 5弦
      if (bassNote === bassMidi) {
        const result = tryFifthStringBassSlashChord(chordNotes, rootMidi, fret);
        if (result) {
          results.push(result);
        }
      }
    }

    // 2. 3弦ベースのシンプル形式（E/G#のような形）
    // E/G#: 6弦×, 5弦×, 4弦×, 3弦1f(G#), 2弦0f, 1弦0f
    const simpleResult = trySimpleSlashChord(chordNotes, rootMidi, bassMidi);
    if (simpleResult) {
      results.push(simpleResult);
    }

    // 3. 4弦ベースのパターン
    for (let fret = 0; fret <= 7; fret++) {
      const bassNote = getNoteAtFret(3, fret); // 4弦
      if (bassNote === bassMidi) {
        const result = tryHighStringSlashChord(chordNotes, rootMidi, bassMidi, fret, 3);
        if (result) {
          results.push(result);
        }
      }
    }

    // 4. 従来のバレーコード形式（6弦ベース）
    for (let fret = 0; fret <= 12; fret++) {
      const bassNote = getNoteAtFret(5, fret);
      if (bassNote === bassMidi) {
        const result = trySlashChordPosition(chordNotes, rootMidi, bassMidi, fret);
        if (result) {
          results.push(result);
        }
      }
    }

    // 5. 5弦ベースのバレー形式
    for (let fret = 0; fret <= 12; fret++) {
      const bassNote = getNoteAtFret(4, fret);
      if (bassNote === bassMidi) {
        const result = trySlashChordPosition(chordNotes, rootMidi, bassMidi, fret, 4);
        if (result) {
          results.push(result);
        }
      }
    }
  }

  // 通常の探索
  for (let baseFret = 0; baseFret <= 10; baseFret++) {
    const result = tryPosition(chordNotes, rootMidi, bassMidi, baseFret);
    if (result) {
      results.push(result);
    }
  }

  // スコアでソートし、重複を除去
  results.sort((a, b) => b.score - a.score);

  // フレットパターンが同じものを除去
  const uniqueResults: PositionResult[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    const key = result.frets.join(',') + '|' + result.muted.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push({
        frets: result.frets,
        fingers: result.fingers,
        barreAt: result.barreAt,
        barreStrings: result.barreStrings,
        baseFret: result.baseFret,
        muted: result.muted,
        difficulty: result.difficulty,
      });
    }
    if (uniqueResults.length >= 4) break; // 最大4つまで
  }

  return uniqueResults;
}

/**
 * 5弦ベース + 高音弦バレーの分数コード（B/D#のような形）
 * B/D#: 6弦×, 5弦3f(D#), 4弦1f, 3弦1f, 2弦1f, 1弦×
 */
function tryFifthStringBassSlashChord(
  chordNotes: number[],
  _rootMidi: number,
  bassFret: number
): (PositionResult & { score: number }) | null {
  const frets: (number | null)[] = [null, null, null, null, null, null];
  const muted: boolean[] = [false, false, false, false, false, false];

  // 6弦はミュート
  muted[5] = true;

  // 5弦にベース音を設定
  frets[4] = bassFret;

  // 4弦〜2弦でコード構成音を探す（バレー形式を優先）
  // まず、共通のバレーフレットを見つける
  let barreCandidate = -1;
  const possibleBarreFrets: number[] = [];

  for (let fret = 1; fret <= 5; fret++) {
    let matchCount = 0;
    for (let string = 1; string <= 3; string++) {
      const note = getNoteAtFret(string, fret);
      if (chordNotes.includes(note)) {
        matchCount++;
      }
    }
    if (matchCount >= 2) {
      possibleBarreFrets.push(fret);
    }
  }

  // bassFretより低いバレーフレットを優先
  for (const fret of possibleBarreFrets) {
    if (fret < bassFret) {
      barreCandidate = fret;
      break;
    }
  }
  if (barreCandidate < 0 && possibleBarreFrets.length > 0) {
    barreCandidate = possibleBarreFrets[0];
  }

  // バレーフレットが見つかった場合
  if (barreCandidate > 0) {
    // 4弦〜2弦をバレーフレットで押さえる
    for (let string = 1; string <= 3; string++) {
      const note = getNoteAtFret(string, barreCandidate);
      if (chordNotes.includes(note)) {
        frets[string] = barreCandidate;
      }
    }
  }

  // 1弦の処理
  let string1Found = false;
  for (let fret = 0; fret <= 5; fret++) {
    const note = getNoteAtFret(0, fret);
    if (chordNotes.includes(note)) {
      // バレーフレットと同じか、開放弦なら採用
      if (fret === 0 || fret === barreCandidate) {
        frets[0] = fret;
        string1Found = true;
        break;
      }
    }
  }
  // 1弦でコード構成音が見つからない、または押さえにくい場合はミュート
  if (!string1Found) {
    muted[0] = true;
  }

  // 有効な音の数をチェック
  let validNotes = 0;
  for (let s = 0; s < 6; s++) {
    if (frets[s] !== null && !muted[s]) {
      validNotes++;
    }
  }
  if (validNotes < 3) return null;

  // フレット範囲を計算
  const activeFrets = frets.filter((f, i) => f !== null && f > 0 && !muted[i]) as number[];
  const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 0;
  const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 0;
  const stretch = maxFret - minFret;

  if (stretch > 4) return null;

  // バレーの検出
  let barreAt: number | null = null;
  let barreStrings: [number, number] | null = null;
  const fretCounts: Record<number, number[]> = {};

  frets.forEach((f, i) => {
    if (f !== null && f > 0 && !muted[i]) {
      if (!fretCounts[f]) fretCounts[f] = [];
      fretCounts[f].push(i);
    }
  });

  for (const [fret, strings] of Object.entries(fretCounts)) {
    if (strings.length >= 3) {
      const minStr = Math.min(...strings);
      const maxStr = Math.max(...strings);
      barreAt = parseInt(fret);
      barreStrings = [minStr, maxStr];
      break;
    }
  }

  const fingers = assignFingers(frets, muted, barreAt, barreStrings);

  // スコア計算
  let score = 190; // 高優先度
  score -= stretch * 5;
  score -= minFret * 2;
  if (barreAt !== null) score += 10; // バレー形式はスコアアップ

  const difficulty: 'easy' | 'medium' | 'hard' = barreAt !== null ? 'medium' : 'easy';

  return {
    frets,
    fingers,
    barreAt,
    barreStrings,
    baseFret: Math.max(1, minFret),
    muted,
    difficulty,
    score,
  };
}

/**
 * シンプルな分数コード（E/G#のような高音弦中心の押さえ方）
 * E/G#: 6弦×, 5弦×, 4弦×, 3弦1f, 2弦0f, 1弦0f
 */
function trySimpleSlashChord(
  chordNotes: number[],
  rootMidi: number,
  bassMidi: number
): (PositionResult & { score: number }) | null {
  const frets: (number | null)[] = [null, null, null, null, null, null];
  const muted: boolean[] = [false, false, false, false, false, false];

  // ベース音が鳴る弦とフレットを探す（3弦で探す、0〜5フレット）
  let bassString = -1;
  let bassFret = -1;

  // 3弦でベース音を探す
  for (let fret = 0; fret <= 5; fret++) {
    if (getNoteAtFret(2, fret) === bassMidi) {
      bassString = 2;
      bassFret = fret;
      break;
    }
  }

  if (bassString < 0) return null;

  // ベース音を設定
  frets[bassString] = bassFret;

  // ベースより低音側（6弦側）はミュート
  for (let s = bassString + 1; s < 6; s++) {
    muted[s] = true;
  }

  // ベースより高音側でコード構成音を探す（開放弦優先）
  for (let string = bassString - 1; string >= 0; string--) {
    let bestFret: number | null = null;
    let bestPriority = -1;

    for (let fret = 0; fret <= 5; fret++) {
      const note = getNoteAtFret(string, fret);
      if (chordNotes.includes(note)) {
        let priority = 1;

        // 開放弦を強く優先
        if (fret === 0) priority += 15;

        // ルート、3度、5度を優先
        const interval = (note - rootMidi + 12) % 12;
        if (interval === 0) priority += 5;
        if (interval === 4 || interval === 3) priority += 3;
        if (interval === 7) priority += 2;

        if (priority > bestPriority) {
          bestPriority = priority;
          bestFret = fret;
        }
      }
    }

    if (bestFret !== null) {
      frets[string] = bestFret;
    } else {
      // コード構成音が見つからない場合はミュート
      muted[string] = true;
    }
  }

  // 有効な音の数をチェック
  let validNotes = 0;
  for (let s = 0; s < 6; s++) {
    if (frets[s] !== null && !muted[s]) {
      validNotes++;
    }
  }
  if (validNotes < 3) return null;

  // フレット範囲を計算
  const activeFrets = frets.filter((f, i) => f !== null && f > 0 && !muted[i]) as number[];
  const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 0;
  const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 0;
  const stretch = maxFret - minFret;

  if (stretch > 4) return null;

  const fingers = assignFingers(frets, muted, null, null);

  // スコア計算（シンプルな形式を高く評価）
  let score = 200; // 最高優先度
  const openCount = frets.filter((f, i) => f === 0 && !muted[i]).length;
  score += openCount * 15; // 開放弦が多いほど良い
  score -= stretch * 5;
  score -= minFret * 3; // 低いフレットを優先

  const difficulty: 'easy' | 'medium' | 'hard' = openCount >= 2 ? 'easy' : 'medium';

  return {
    frets,
    fingers,
    barreAt: null,
    barreStrings: null,
    baseFret: Math.max(1, minFret),
    muted,
    difficulty,
    score,
  };
}

/**
 * 高音弦側でコードを構成する分数コード（B/D#のような4弦ベース）
 */
function tryHighStringSlashChord(
  chordNotes: number[],
  rootMidi: number,
  _bassMidi: number,
  bassFret: number,
  bassString: number
): (PositionResult & { score: number }) | null {
  const frets: (number | null)[] = [null, null, null, null, null, null];
  const muted: boolean[] = [false, false, false, false, false, false];

  // ベース音を設定
  frets[bassString] = bassFret;

  // ベースより低音側はミュート
  for (let s = bassString + 1; s < 6; s++) {
    muted[s] = true;
  }

  // ベースより高音側でコード構成音を探す
  const maxStretch = 3;
  const searchStart = Math.max(0, bassFret - 1);
  const searchEnd = bassFret + maxStretch;

  for (let string = bassString - 1; string >= 0; string--) {
    let bestFret: number | null = null;
    let bestPriority = -1;

    for (let fret = 0; fret <= searchEnd; fret++) {
      const note = getNoteAtFret(string, fret);
      if (chordNotes.includes(note)) {
        let priority = 1;

        // 開放弦を優先
        if (fret === 0) priority += 8;

        // ベースフレット付近を優先
        if (fret >= searchStart && fret <= searchEnd) {
          priority += 3;
          if (fret === bassFret) priority += 2;
        }

        // ルート、3度、5度を優先
        const interval = (note - rootMidi + 12) % 12;
        if (interval === 0) priority += 4;
        if (interval === 4 || interval === 3) priority += 3;
        if (interval === 7) priority += 2;

        if (priority > bestPriority) {
          bestPriority = priority;
          bestFret = fret;
        }
      }
    }

    if (bestFret !== null) {
      frets[string] = bestFret;
    }
  }

  // 有効な音の数をチェック
  let validNotes = 0;
  for (let s = 0; s < 6; s++) {
    if (frets[s] !== null && !muted[s]) {
      validNotes++;
    }
  }
  if (validNotes < 3) return null;

  // フレット範囲を計算
  const activeFrets = frets.filter((f, i) => f !== null && f > 0 && !muted[i]) as number[];
  const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 0;
  const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 0;
  const stretch = maxFret - minFret;

  if (stretch > 4) return null;

  // バレーの検出
  let barreAt: number | null = null;
  let barreStrings: [number, number] | null = null;
  const fretCounts: Record<number, number[]> = {};

  frets.forEach((f, i) => {
    if (f !== null && f > 0 && !muted[i]) {
      if (!fretCounts[f]) fretCounts[f] = [];
      fretCounts[f].push(i);
    }
  });

  for (const [fret, strings] of Object.entries(fretCounts)) {
    if (strings.length >= 3 && parseInt(fret) === minFret) {
      const minStr = Math.min(...strings);
      const maxStr = Math.max(...strings);
      barreAt = parseInt(fret);
      barreStrings = [minStr, maxStr];
      break;
    }
  }

  const fingers = assignFingers(frets, muted, barreAt, barreStrings);

  // スコア計算
  let score = 180;
  const openCount = frets.filter((f, i) => f === 0 && !muted[i]).length;
  score += openCount * 10;
  score -= stretch * 5;
  score -= minFret * 2;

  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  if (openCount >= 2) difficulty = 'easy';
  if (stretch >= 3 || barreAt !== null) difficulty = 'medium';

  return {
    frets,
    fingers,
    barreAt,
    barreStrings,
    baseFret: Math.max(1, minFret),
    muted,
    difficulty,
    score,
  };
}

/**
 * 分数コード用のポジション探索（バレーコード形式）
 */
function trySlashChordPosition(
  chordNotes: number[],
  rootMidi: number,
  _bassMidi: number,
  bassFret: number,
  bassString: number = 5
): (PositionResult & { score: number }) | null {
  const frets: (number | null)[] = [null, null, null, null, null, null];
  const muted: boolean[] = [false, false, false, false, false, false];

  // ベース音を設定
  frets[bassString] = bassFret;

  // ベース弦より低い弦はミュート
  for (let s = bassString + 1; s < 6; s++) {
    muted[s] = true;
  }

  // バレーポジション（bassFret位置）でコードを構成
  const barrePosition = bassFret > 0 ? bassFret : 1;
  const maxStretch = 3;

  for (let string = bassString - 1; string >= 0; string--) {
    let bestFret: number | null = null;
    let bestPriority = -1;

    for (let fret = barrePosition; fret <= barrePosition + maxStretch; fret++) {
      const note = getNoteAtFret(string, fret);

      if (chordNotes.includes(note)) {
        let priority = 1;

        // ルート、3度、5度を優先
        const interval = (note - rootMidi + 12) % 12;
        if (interval === 0) priority += 5;
        if (interval === 4 || interval === 3) priority += 3;
        if (interval === 7) priority += 2;

        // バレー位置を優先
        if (fret === barrePosition) priority += 2;

        if (priority > bestPriority) {
          bestPriority = priority;
          bestFret = fret;
        }
      }
    }

    if (bestFret !== null) {
      frets[string] = bestFret;
    }
  }

  // 有効な音の数をチェック
  let validNotes = 0;
  for (let s = 0; s < 6; s++) {
    if (frets[s] !== null && !muted[s]) {
      validNotes++;
    }
  }
  if (validNotes < 3) return null;

  // フレット範囲を計算
  const activeFrets = frets.filter((f, i) => f !== null && f > 0 && !muted[i]) as number[];
  const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 1;
  const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 1;
  const stretch = maxFret - minFret;

  if (stretch > 4) return null;

  // バレーの検出
  let barreAt: number | null = null;
  let barreStrings: [number, number] | null = null;
  const fretCounts: Record<number, number[]> = {};

  frets.forEach((f, i) => {
    if (f !== null && f > 0 && !muted[i]) {
      if (!fretCounts[f]) fretCounts[f] = [];
      fretCounts[f].push(i);
    }
  });

  for (const [fret, strings] of Object.entries(fretCounts)) {
    if (strings.length >= 2 && parseInt(fret) === minFret) {
      const minStr = Math.min(...strings);
      const maxStr = Math.max(...strings);
      barreAt = parseInt(fret);
      barreStrings = [minStr, maxStr];
      break;
    }
  }

  const fingers = assignFingers(frets, muted, barreAt, barreStrings);

  // スコア計算（分数コードのバレー形式を高く評価）
  let score = 150; // ベーススコアを高く
  score -= stretch * 5;
  score -= Math.abs(bassFret - 4) * 2; // 4フレット付近を優先

  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  if (stretch >= 3 || minFret >= 7) difficulty = 'hard';

  return {
    frets,
    fingers,
    barreAt,
    barreStrings,
    baseFret: Math.max(1, minFret),
    muted,
    difficulty,
    score,
  };
}

interface TryPositionResult extends PositionResult {
  score: number;
  minFret: number;
}

/**
 * 特定のポジションでコードを構成できるか試行
 */
function tryPosition(
  chordNotes: number[],
  rootMidi: number,
  bassMidi: number,
  startFret: number
): TryPositionResult | null {
  const frets: (number | null)[] = [null, null, null, null, null, null];
  const muted: boolean[] = [false, false, false, false, false, false];
  const maxStretch = 4; // 最大ストレッチ幅

  // 開放弦も含めて探索（startFret=0の場合でも0から探索）
  const searchStart = Math.min(startFret, 0);
  const searchEnd = startFret + maxStretch;

  // 4音以上のコードかどうか（7th, 6thなど）
  const isExtendedChord = chordNotes.length >= 4;

  // 各弦について最適なフレットを探索
  for (let string = 5; string >= 0; string--) {
    let bestFret: number | null = null;
    let bestPriority = -1;

    for (let fret = searchStart; fret <= searchEnd; fret++) {
      if (fret < 0) continue;
      const note = getNoteAtFret(string, fret);

      // コード構成音かチェック
      if (chordNotes.includes(note)) {
        let priority = 1;

        // ベース弦（6,5弦）ではベース音を優先
        if (string >= 4) {
          if (note === bassMidi) priority = 10;
          else if (note === rootMidi) priority = 8;
        }

        // 開放弦を優先
        if (fret === 0) priority += 2;

        // ルート音、3度、5度を優先
        const interval = (note - rootMidi + 12) % 12;
        if (interval === 0) priority += 3; // ルート
        if (interval === 4 || interval === 3) priority += 2; // 3度
        if (interval === 7) priority += 1; // 5度

        // 拡張コードの場合、7th/6thの音を見つけたらボーナス
        if (isExtendedChord) {
          if (interval === 10 || interval === 11) priority += 4; // 7th (m7 or M7)
          if (interval === 9) priority += 4; // 6th
        }

        if (priority > bestPriority) {
          bestPriority = priority;
          bestFret = fret;
        }
      }
    }

    if (bestFret !== null) {
      frets[string] = bestFret;
    } else {
      // コード構成音が見つからない場合
      // 低音弦はミュート、高音弦は省略
      if (string >= 4) {
        muted[string] = true;
      }
    }
  }

  // 拡張コードの場合、全ての構成音が含まれているかチェック
  if (isExtendedChord) {
    const playedNotes = new Set<number>();
    for (let s = 0; s < 6; s++) {
      if (frets[s] !== null && !muted[s]) {
        playedNotes.add(getNoteAtFret(s, frets[s]!));
      }
    }
    // 全ての構成音が含まれていない場合は無効
    const missingNotes = chordNotes.filter(n => !playedNotes.has(n));
    if (missingNotes.length > 0) {
      // 不足している音を追加できるか試行
      for (const missingNote of missingNotes) {
        let added = false;
        // 空いている弦に追加
        for (let s = 0; s < 6; s++) {
          if (frets[s] === null && !muted[s]) {
            for (let f = searchStart; f <= searchEnd; f++) {
              if (f < 0) continue;
              if (getNoteAtFret(s, f) === missingNote) {
                frets[s] = f;
                added = true;
                break;
              }
            }
            if (added) break;
          }
        }
        // それでも追加できない場合、既存の音を置き換え（重複している音があれば）
        if (!added) {
          const noteCounts: Record<number, number[]> = {};
          for (let s = 0; s < 6; s++) {
            if (frets[s] !== null && !muted[s]) {
              const n = getNoteAtFret(s, frets[s]!);
              if (!noteCounts[n]) noteCounts[n] = [];
              noteCounts[n].push(s);
            }
          }
          // 重複している音を探す
          for (const [, strings] of Object.entries(noteCounts)) {
            if (strings.length >= 2) {
              // 重複のうち1つを置き換え
              const replaceString = strings[strings.length - 1];
              for (let f = searchStart; f <= searchEnd; f++) {
                if (f < 0) continue;
                if (getNoteAtFret(replaceString, f) === missingNote) {
                  frets[replaceString] = f;
                  added = true;
                  break;
                }
              }
              if (added) break;
            }
          }
        }
      }
    }
  }

  // ベース音が含まれているかチェック
  let hasBass = false;
  for (let s = 5; s >= 3; s--) {
    if (frets[s] !== null && !muted[s]) {
      const note = getNoteAtFret(s, frets[s]!);
      if (note === bassMidi) {
        hasBass = true;
        // 低音弦のベース音より低い弦はミュート
        for (let lower = 5; lower > s; lower--) {
          if (frets[lower] !== null) {
            const lowerNote = getNoteAtFret(lower, frets[lower]!);
            if (lowerNote !== bassMidi) {
              muted[lower] = true;
            }
          }
        }
        break;
      }
    }
  }

  // 有効な音が3つ以上あるかチェック
  let validNotes = 0;
  for (let s = 0; s < 6; s++) {
    if (frets[s] !== null && !muted[s]) {
      validNotes++;
    }
  }
  if (validNotes < 3) return null;

  // フレット範囲を計算
  const activeFrets = frets.filter(
    (f, i) => f !== null && f > 0 && !muted[i]
  ) as number[];
  if (activeFrets.length === 0) {
    // 全て開放弦
  }
  const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 0;
  const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 0;
  const stretch = maxFret - minFret;

  // ストレッチが大きすぎる場合は無効
  if (stretch > 4) return null;

  // バレーの検出
  let barreAt: number | null = null;
  let barreStrings: [number, number] | null = null;
  const fretCounts: Record<number, number[]> = {};

  frets.forEach((f, i) => {
    if (f !== null && f > 0 && !muted[i]) {
      if (!fretCounts[f]) fretCounts[f] = [];
      fretCounts[f].push(i);
    }
  });

  // 同じフレットを押さえる弦が複数ある場合、バレーの可能性
  for (const [fret, strings] of Object.entries(fretCounts)) {
    if (strings.length >= 2) {
      const minStr = Math.min(...strings);
      const maxStr = Math.max(...strings);
      // 連続した弦をカバーしているかチェック
      let isContinuous = true;
      for (let s = minStr; s <= maxStr; s++) {
        if (!muted[s] && frets[s] !== parseInt(fret) && frets[s] !== null && frets[s]! < parseInt(fret)) {
          isContinuous = false;
          break;
        }
      }
      if (isContinuous && parseInt(fret) === minFret) {
        barreAt = parseInt(fret);
        barreStrings = [minStr, maxStr];
      }
    }
  }

  // 指番号を割り当て
  const fingers = assignFingers(frets, muted, barreAt, barreStrings);

  // スコア計算
  let score = 100;
  score -= stretch * 10; // ストレッチが小さいほど良い
  score -= minFret * 2; // 開放ポジションに近いほど良い
  if (hasBass) score += 20;
  const openStrings = frets.filter((f, i) => f === 0 && !muted[i]).length;
  score += openStrings * 5; // 開放弦が多いほど良い

  // 難易度判定
  let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  if (barreAt !== null) difficulty = 'medium';
  if (stretch >= 3 || minFret >= 5) difficulty = 'hard';

  return {
    frets,
    fingers,
    barreAt,
    barreStrings,
    baseFret: Math.max(1, minFret),
    muted,
    difficulty,
    score,
    minFret,
  };
}

/**
 * 指番号を割り当て
 */
function assignFingers(
  frets: (number | null)[],
  muted: boolean[],
  barreAt: number | null,
  barreStrings: [number, number] | null
): (number | null)[] {
  const fingers: (number | null)[] = [null, null, null, null, null, null];
  let nextFinger = barreAt !== null ? 2 : 1;

  // バレーがある場合、人差し指を割り当て
  if (barreAt !== null && barreStrings !== null) {
    for (let s = barreStrings[0]; s <= barreStrings[1]; s++) {
      if (frets[s] === barreAt && !muted[s]) {
        fingers[s] = 1;
      }
    }
  }

  // フレット順にソート
  const positions: { string: number; fret: number }[] = [];
  frets.forEach((f, s) => {
    if (f !== null && f > 0 && !muted[s] && fingers[s] === null) {
      positions.push({ string: s, fret: f });
    }
  });
  positions.sort((a, b) => a.fret - b.fret || b.string - a.string);

  // 指を割り当て
  for (const pos of positions) {
    if (nextFinger <= 4) {
      fingers[pos.string] = nextFinger++;
    }
  }

  return fingers;
}

/**
 * コードのTAB譜表記を生成
 */
export function generateTabNotation(chordName: string): string[] | null {
  const fingering = generateChordFingering(chordName);
  if (!fingering) return null;

  // 6弦から1弦の順でTAB表記を生成
  const tabLines: string[] = [];
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];

  for (let i = 0; i < 6; i++) {
    const fret = fingering.frets[i];
    const isMuted = fingering.muted[i];
    let fretStr: string;

    if (isMuted) {
      fretStr = 'x';
    } else if (fret === null) {
      fretStr = 'x';
    } else {
      fretStr = fret.toString();
    }

    tabLines.push(`${stringNames[i]}|--${fretStr.padStart(2, '-')}--`);
  }

  return tabLines;
}
