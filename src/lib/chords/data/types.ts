/**
 * CaT4G - Chord Data Types
 * コードデータの型定義
 *
 * 全41種類/ルート:
 * - 31種類の基本品質
 * - 10種類の分数コードパターン（ベース音は相対的）
 */

// 難易度
export type Difficulty = 'easy' | 'medium' | 'hard';

// フィンガリング定義
export interface Fingering {
  id: string;
  // [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
  frets: (number | null)[];
  fingers: (number | null)[];
  barreAt?: number | null;
  barreStrings?: [number, number] | null;
  baseFret: number;
  muted: boolean[];
  difficulty: Difficulty;
  // 検証用: このフィンガリングで鳴る音（ルート基準のインターバル）
  intervals?: number[];
}

// 基本コード品質の定義（31種類）
export type ChordQuality =
  // 基本 (5種)
  | ''        // Major
  | 'm'       // Minor
  | '7'       // Dominant 7
  | 'm7'      // Minor 7
  | 'M7'      // Major 7
  // ハーフディミニッシュ系 (2種)
  | 'm7-5'    // Half Diminished (= m7b5)
  | 'm-5'     // Minor flat 5 (diminished triad variant)
  // ディミニッシュ/オーギュメント (3種)
  | 'dim'     // Diminished
  | 'dim7'    // Diminished 7
  | 'aug'     // Augmented
  // サスペンド系 (3種)
  | 'sus2'    // Suspended 2
  | 'sus4'    // Suspended 4
  | '7sus4'   // Dominant 7 sus4
  // シックス系 (2種)
  | '6'       // Major 6
  | 'm6'      // Minor 6
  // マイナーメジャー (1種)
  | 'mM7'     // Minor Major 7
  // ナインス系 (5種)
  | '9'       // Dominant 9
  | 'm9'      // Minor 9
  | 'M9'      // Major 9
  | '9sus4'   // Dominant 9 sus4
  | 'add9'    // Add 9
  // シックスナインス系 (2種)
  | '69'      // Major 6/9
  | 'm69'     // Minor 6/9
  // オルタード系 (6種)
  | '-5'      // Major flat 5
  | '7-5'     // Dominant 7 flat 5
  | '7+5'     // Dominant 7 sharp 5 (= aug7)
  | 'M7-5'    // Major 7 flat 5
  | 'm7+5'    // Minor 7 sharp 5
  | '7+9'     // Dominant 7 sharp 9
  // 特殊 (2種)
  | '4.4'     // Quartal chord (C-F-Bb)
  | 'blk'     // Blackadder chord
  // パワーコード (1種)
  | '5';      // Power chord (root + P5)

// 分数コードのベースインターバル定義
export type SlashChordPattern =
  // メジャー分数 (7種)
  | 'major/2'   // C/D - 2度ベース (interval 2)
  | 'major/4'   // C/E - 3度ベース (interval 4)
  | 'major/5'   // C/F - 4度ベース (interval 5)
  | 'major/5th' // C/G - 5度ベース (interval 7) ★追加
  | 'major/7'   // C/B - 長7度ベース (interval 11)
  | 'major/9'   // C/A - 6度ベース (interval 9)
  | 'major/10'  // C/Bb - 短7度ベース (interval 10)
  // マイナー分数 (2種)
  | 'minor/3'   // Cm/Eb - 短3度ベース (interval 3)
  | 'minor/7'   // Cm/G - 5度ベース (interval 7)
  // マイナー7分数 (2種)
  | 'minor7/5'  // Cm7/G - 5度ベース (interval 7)
  | 'minor7/10'; // Cm7/Bb - 短7度ベース (interval 10)

// ルート音の定義（12音全て）
export type RootNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// ルートごとのコードデータ（基本品質のみ）
export type RootChordData = Record<ChordQuality, Fingering[]>;

// 分数コードデータ
export type SlashChordData = Record<SlashChordPattern, Fingering[]>;

// ルートごとの完全コードデータ
export interface RootCompleteData {
  basic: RootChordData;
  slash: SlashChordData;
}

// 全コードデータの型
export type AllChordData = Record<RootNote, RootCompleteData>;

// コード品質ごとの期待インターバル（検証用）
export const EXPECTED_INTERVALS: Record<ChordQuality, number[]> = {
  // 基本
  '': [0, 4, 7],           // Major
  'm': [0, 3, 7],          // Minor
  '7': [0, 4, 7, 10],      // Dominant 7
  'm7': [0, 3, 7, 10],     // Minor 7
  'M7': [0, 4, 7, 11],     // Major 7
  // ハーフディミニッシュ系
  'm7-5': [0, 3, 6, 10],   // Half Diminished
  'm-5': [0, 3, 6],        // Minor flat 5 (dim triad)
  // ディミニッシュ/オーギュメント
  'dim': [0, 3, 6],        // Diminished
  'dim7': [0, 3, 6, 9],    // Diminished 7
  'aug': [0, 4, 8],        // Augmented
  // サスペンド系
  'sus2': [0, 2, 7],       // Suspended 2
  'sus4': [0, 5, 7],       // Suspended 4
  '7sus4': [0, 5, 7, 10],  // Dominant 7 sus4
  // シックス系
  '6': [0, 4, 7, 9],       // Major 6
  'm6': [0, 3, 7, 9],      // Minor 6
  // マイナーメジャー
  'mM7': [0, 3, 7, 11],    // Minor Major 7
  // ナインス系
  '9': [0, 4, 7, 10, 14],  // Dominant 9
  'm9': [0, 3, 7, 10, 14], // Minor 9
  'M9': [0, 4, 7, 11, 14], // Major 9
  '9sus4': [0, 5, 7, 10, 14], // Dominant 9 sus4
  'add9': [0, 4, 7, 14],   // Add 9
  // シックスナインス系
  '69': [0, 4, 7, 9, 14],  // Major 6/9
  'm69': [0, 3, 7, 9, 14], // Minor 6/9
  // オルタード系
  '-5': [0, 4, 6],         // Major flat 5
  '7-5': [0, 4, 6, 10],    // Dominant 7 flat 5
  '7+5': [0, 4, 8, 10],    // Dominant 7 sharp 5
  'M7-5': [0, 4, 6, 11],   // Major 7 flat 5
  'm7+5': [0, 3, 8, 10],   // Minor 7 sharp 5
  '7+9': [0, 4, 7, 10, 15], // Dominant 7 sharp 9
  // 特殊
  '4.4': [0, 5, 10],       // Quartal chord
  'blk': [0, 2, 6, 10],    // Blackadder chord
  // パワーコード
  '5': [0, 7],             // Power chord (root + P5)
};

// 全31品質のリスト（順序付き）
export const ALL_QUALITIES: ChordQuality[] = [
  // 基本
  '', 'm', '7', 'm7', 'M7',
  // ハーフディミニッシュ系
  'm7-5', 'm-5',
  // ディミニッシュ/オーギュメント
  'dim', 'dim7', 'aug',
  // サスペンド系
  'sus2', 'sus4', '7sus4',
  // シックス系
  '6', 'm6',
  // マイナーメジャー
  'mM7',
  // ナインス系
  '9', 'm9', 'M9', '9sus4', 'add9',
  // シックスナインス系
  '69', 'm69',
  // オルタード系
  '-5', '7-5', '7+5', 'M7-5', 'm7+5', '7+9',
  // 特殊
  '4.4', 'blk',
  // パワーコード
  '5',
];

// ルート音のMIDI番号（mod 12）
export const ROOT_TO_MIDI: Record<RootNote, number> = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
  'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11,
};

// MIDI番号からルート音へのマッピング
export const MIDI_TO_ROOT: RootNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 開放弦のMIDI番号（mod 12）
// [1弦(高E), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(低E)]
export const OPEN_STRINGS: number[] = [4, 11, 7, 2, 9, 4];

// 分数コードのベースインターバル（半音数）
// 注意: パターン名の数字は必ずしも半音数と一致しない
export const SLASH_INTERVALS = {
  // メジャー分数
  'major/2': 2,   // C/D - 全音上 (2nd)
  'major/4': 4,   // C/E - 長3度 (3rd)
  'major/5': 5,   // C/F - 完全4度 (4th)
  'major/5th': 7, // C/G - 完全5度 (5th) ★追加
  'major/7': 11,  // C/B - 長7度 (major 7th) ※7度音がベース
  'major/9': 9,   // C/A - 長6度 (6th)
  'major/10': 10, // C/Bb - 短7度 (minor 7th)
  // マイナー分数
  'minor/3': 3,   // Cm/Eb - 短3度 (minor 3rd)
  'minor/7': 7,   // Cm/G - 完全5度 (5th)
  // マイナー7分数
  'minor7/5': 7,  // Cm7/G - 完全5度 (5th) ※5度音がベース
  'minor7/10': 10, // Cm7/Bb - 短7度 (minor 7th)
} as const;
