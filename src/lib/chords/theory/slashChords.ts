/**
 * CaT4G - Music Theory: Slash Chords
 * 分数コードの理論ベース定義
 *
 * 分数コード = コード品質 + ベース音程
 * 例: C/E = Cメジャー + 長3度ベース (interval 4)
 *     Cm7/Bb = Cm7 + 短7度ベース (interval 10)
 */

import { getIntervalsFromRegistry, normalizeQualityFromRegistry } from './registry';
import { normalizeToOctave } from './intervals';

/**
 * 分数コードの定義
 */
export interface SlashChordDefinition {
  /** コード品質 ('', 'm', '7', 'm7', 'M7', etc.) */
  quality: string;
  /** ルートからベース音への半音数 */
  bassInterval: number;
  /** パターン名（識別用） */
  patternName: string;
}

/**
 * 分数コードパターンの完全定義
 * キー: "quality/interval" (例: "major/4", "m7/10")
 */
export const SLASH_CHORD_PATTERNS: Record<string, SlashChordDefinition> = {
  // === メジャー分数 (7種) ===
  'major/2': { quality: '', bassInterval: 2, patternName: 'C/D (2度ベース)' },
  'major/4': { quality: '', bassInterval: 4, patternName: 'C/E (3度ベース)' },
  'major/5': { quality: '', bassInterval: 5, patternName: 'C/F (4度ベース)' },
  'major/7': { quality: '', bassInterval: 7, patternName: 'C/G (5度ベース)' },
  'major/9': { quality: '', bassInterval: 9, patternName: 'C/A (6度ベース)' },
  'major/10': { quality: '', bassInterval: 10, patternName: 'C/Bb (短7度ベース)' },
  'major/11': { quality: '', bassInterval: 11, patternName: 'C/B (長7度ベース)' },

  // === マイナー分数 (4種) ===
  'minor/3': { quality: 'm', bassInterval: 3, patternName: 'Cm/Eb (短3度ベース)' },
  'minor/7': { quality: 'm', bassInterval: 7, patternName: 'Cm/G (5度ベース)' },
  'minor/9': { quality: 'm', bassInterval: 9, patternName: 'Cm/A (6度ベース)' },
  'minor/10': { quality: 'm', bassInterval: 10, patternName: 'Cm/Bb (短7度ベース)' },

  // === ドミナント7分数 (5種) ===
  '7/4': { quality: '7', bassInterval: 4, patternName: 'C7/E (3度ベース)' },
  '7/7': { quality: '7', bassInterval: 7, patternName: 'C7/G (5度ベース)' },
  '7/10': { quality: '7', bassInterval: 10, patternName: 'C7/Bb (短7度ベース)' },
  '7/3': { quality: '7', bassInterval: 3, patternName: 'C7/Eb (短3度ベース - ブルース)' },
  '7/5': { quality: '7', bassInterval: 5, patternName: 'C7/F (4度ベース)' },

  // === マイナー7分数 (4種) ===
  'm7/3': { quality: 'm7', bassInterval: 3, patternName: 'Cm7/Eb (短3度ベース)' },
  'm7/7': { quality: 'm7', bassInterval: 7, patternName: 'Cm7/G (5度ベース)' },
  'm7/10': { quality: 'm7', bassInterval: 10, patternName: 'Cm7/Bb (短7度ベース)' },
  'm7/5': { quality: 'm7', bassInterval: 5, patternName: 'Cm7/F (4度ベース)' },

  // === メジャー7分数 (4種) ===
  'M7/4': { quality: 'M7', bassInterval: 4, patternName: 'CM7/E (3度ベース)' },
  'M7/7': { quality: 'M7', bassInterval: 7, patternName: 'CM7/G (5度ベース)' },
  'M7/11': { quality: 'M7', bassInterval: 11, patternName: 'CM7/B (長7度ベース)' },
  'M7/5': { quality: 'M7', bassInterval: 5, patternName: 'CM7/F (4度ベース)' },

  // === ディミニッシュ分数 (3種) ===
  'dim/3': { quality: 'dim', bassInterval: 3, patternName: 'Cdim/Eb (短3度ベース)' },
  'dim/6': { quality: 'dim', bassInterval: 6, patternName: 'Cdim/Gb (減5度ベース)' },
  'dim/9': { quality: 'dim', bassInterval: 9, patternName: 'Cdim/A (減7度ベース)' },

  // === ディミニッシュ7分数 (4種) ===
  'dim7/3': { quality: 'dim7', bassInterval: 3, patternName: 'Cdim7/Eb (短3度ベース)' },
  'dim7/6': { quality: 'dim7', bassInterval: 6, patternName: 'Cdim7/Gb (減5度ベース)' },
  'dim7/9': { quality: 'dim7', bassInterval: 9, patternName: 'Cdim7/Bbb (減7度ベース)' },

  // === オーギュメント分数 (3種) ===
  'aug/4': { quality: 'aug', bassInterval: 4, patternName: 'Caug/E (3度ベース)' },
  'aug/8': { quality: 'aug', bassInterval: 8, patternName: 'Caug/G# (増5度ベース)' },

  // === ハーフディミニッシュ分数 (3種) ===
  'm7b5/3': { quality: 'm7b5', bassInterval: 3, patternName: 'Cm7b5/Eb (短3度ベース)' },
  'm7b5/6': { quality: 'm7b5', bassInterval: 6, patternName: 'Cm7b5/Gb (減5度ベース)' },
  'm7b5/10': { quality: 'm7b5', bassInterval: 10, patternName: 'Cm7b5/Bb (短7度ベース)' },

  // === 6thコード分数 (3種) ===
  '6/4': { quality: '6', bassInterval: 4, patternName: 'C6/E (3度ベース)' },
  '6/7': { quality: '6', bassInterval: 7, patternName: 'C6/G (5度ベース)' },
  '6/9': { quality: '6', bassInterval: 9, patternName: 'C6/A (6度ベース)' },

  // === マイナー6分数 (3種) ===
  'm6/3': { quality: 'm6', bassInterval: 3, patternName: 'Cm6/Eb (短3度ベース)' },
  'm6/7': { quality: 'm6', bassInterval: 7, patternName: 'Cm6/G (5度ベース)' },
  'm6/9': { quality: 'm6', bassInterval: 9, patternName: 'Cm6/A (6度ベース)' },

  // === sus4分数 (2種) ===
  'sus4/5': { quality: 'sus4', bassInterval: 5, patternName: 'Csus4/F (4度ベース)' },
  'sus4/7': { quality: 'sus4', bassInterval: 7, patternName: 'Csus4/G (5度ベース)' },

  // === 7sus4分数 (3種) ===
  '7sus4/5': { quality: '7sus4', bassInterval: 5, patternName: 'C7sus4/F (4度ベース)' },
  '7sus4/7': { quality: '7sus4', bassInterval: 7, patternName: 'C7sus4/G (5度ベース)' },
  '7sus4/10': { quality: '7sus4', bassInterval: 10, patternName: 'C7sus4/Bb (短7度ベース)' },

  // === add9分数 (3種) ===
  'add9/2': { quality: 'add9', bassInterval: 2, patternName: 'Cadd9/D (9度ベース)' },
  'add9/4': { quality: 'add9', bassInterval: 4, patternName: 'Cadd9/E (3度ベース)' },
  'add9/7': { quality: 'add9', bassInterval: 7, patternName: 'Cadd9/G (5度ベース)' },
};

/**
 * 分数コードの構成音を計算
 * @param rootMidi ルート音のMIDI番号 (0-11)
 * @param quality コード品質
 * @param bassInterval ベース音への半音数
 * @returns 構成音のMIDI番号配列（ベース音を先頭に）
 */
export function getSlashChordNotes(
  rootMidi: number,
  quality: string,
  bassInterval: number
): number[] {
  // コード品質からインターバルを取得
  const normalizedQuality = normalizeQualityFromRegistry(quality);
  let intervals = getIntervalsFromRegistry(normalizedQuality);

  if (!intervals) {
    intervals = getIntervalsFromRegistry(quality);
  }

  if (!intervals) {
    // フォールバック: メジャートライアド
    intervals = [0, 4, 7];
  }

  // ベース音を計算
  const bassMidi = normalizeToOctave(rootMidi + bassInterval);

  // コード構成音を計算
  const chordNotes = intervals.map((interval) => normalizeToOctave(rootMidi + interval));

  // ベース音が既にコード構成音に含まれているか確認
  const bassInChord = chordNotes.includes(bassMidi);

  // ベース音を先頭に、残りの構成音を続ける
  if (bassInChord) {
    // ベース音をコード構成音から除去して先頭に追加
    const withoutBass = chordNotes.filter((note) => note !== bassMidi);
    return [bassMidi, ...withoutBass];
  } else {
    // ベース音を先頭に追加（コード外の音）
    return [bassMidi, ...chordNotes];
  }
}

/**
 * 分数コード名をパース
 * @param chordName 例: "C/E", "Am7/G", "Dm7b5/Ab"
 * @returns パース結果 or null
 */
export function parseSlashChord(chordName: string): {
  root: string;
  quality: string;
  bassNote: string;
} | null {
  // 分数コードのパターン: Root[Quality]/Bass
  const match = chordName.match(/^([A-G][#b]?)([^/]*)?\/([A-G][#b]?)$/);
  if (!match) return null;

  const [, root, quality = '', bassNote] = match;
  return { root, quality, bassNote };
}

/**
 * ベース音とルート音からベースインターバルを計算
 * @param rootNote ルート音 (例: "C")
 * @param bassNote ベース音 (例: "E")
 * @returns 半音数
 */
export function calculateBassInterval(rootNote: string, bassNote: string): number {
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

  const rootMidi = NOTE_TO_MIDI[rootNote];
  const bassMidi = NOTE_TO_MIDI[bassNote];

  if (rootMidi === undefined || bassMidi === undefined) {
    return 0;
  }

  // ベース音がルート音より低い場合も考慮
  return normalizeToOctave(bassMidi - rootMidi);
}

/**
 * 分数コードの完全な構成音情報を取得
 * @param chordName 例: "C/E", "Am7/G"
 * @returns 構成音情報 or null
 */
export function getSlashChordInfo(chordName: string): {
  root: string;
  quality: string;
  bassNote: string;
  bassInterval: number;
  intervals: number[];
  patternKey: string | null;
} | null {
  const parsed = parseSlashChord(chordName);
  if (!parsed) return null;

  const bassInterval = calculateBassInterval(parsed.root, parsed.bassNote);
  const normalizedQuality = normalizeQualityFromRegistry(parsed.quality);
  const qualityKey = normalizedQuality || parsed.quality || 'major';

  // パターンキーを探す
  const patternKey = findPatternKey(qualityKey, bassInterval);

  // インターバル配列を計算
  const intervals = getIntervalsFromRegistry(normalizedQuality || parsed.quality) || [0, 4, 7];

  return {
    root: parsed.root,
    quality: parsed.quality,
    bassNote: parsed.bassNote,
    bassInterval,
    intervals,
    patternKey,
  };
}

/**
 * 品質とベースインターバルからパターンキーを検索
 */
function findPatternKey(quality: string, bassInterval: number): string | null {
  // 品質名の正規化
  const qualityMap: Record<string, string> = {
    '': 'major',
    m: 'minor',
    min: 'minor',
    M7: 'M7',
    maj7: 'M7',
    m7: 'm7',
    min7: 'm7',
    '7': '7',
    dim: 'dim',
    dim7: 'dim7',
    aug: 'aug',
    m7b5: 'm7b5',
    '6': '6',
    m6: 'm6',
    sus4: 'sus4',
    '7sus4': '7sus4',
    add9: 'add9',
  };

  const normalizedQuality = qualityMap[quality] || quality;
  const key = `${normalizedQuality}/${bassInterval}`;

  return SLASH_CHORD_PATTERNS[key] ? key : null;
}

/**
 * 全てのサポートされている分数コードパターンを取得
 */
export function getAllSlashChordPatterns(): SlashChordDefinition[] {
  return Object.values(SLASH_CHORD_PATTERNS);
}

/**
 * 特定の品質に対するサポートされているベースインターバルを取得
 */
export function getSupportedBassIntervals(quality: string): number[] {
  const qualityMap: Record<string, string> = {
    '': 'major',
    m: 'minor',
    M7: 'M7',
    m7: 'm7',
    '7': '7',
    dim: 'dim',
    dim7: 'dim7',
    aug: 'aug',
    m7b5: 'm7b5',
    '6': '6',
    m6: 'm6',
    sus4: 'sus4',
    '7sus4': '7sus4',
    add9: 'add9',
  };

  const normalizedQuality = qualityMap[quality] || quality;
  const intervals: number[] = [];

  for (const [key, def] of Object.entries(SLASH_CHORD_PATTERNS)) {
    if (key.startsWith(`${normalizedQuality}/`)) {
      intervals.push(def.bassInterval);
    }
  }

  return intervals.sort((a, b) => a - b);
}
