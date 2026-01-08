/**
 * CaT4G - Chord Type Definitions
 * コードの型定義
 */

// ルート音
export type NoteRoot =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

// コード品質（メジャー、マイナー等）
export type ChordQuality =
  | '' // メジャー
  | 'm' // マイナー
  | '7' // セブンス
  | 'M7' // メジャーセブンス
  | 'm7' // マイナーセブンス
  | 'mM7' // マイナーメジャーセブンス
  | 'dim' // ディミニッシュ
  | 'dim7' // ディミニッシュセブンス
  | 'aug' // オーギュメント
  | 'sus2' // サスツー
  | 'sus4' // サスフォー
  | '7sus4' // セブンサスフォー
  | 'add9' // アドナイン
  | '9' // ナインス
  | 'm9' // マイナーナインス
  | 'M9' // メジャーナインス
  | '11' // イレブンス
  | '13' // サーティーンス
  | '6' // シックス
  | 'm6' // マイナーシックス
  | '7#9' // セブンシャープナイン
  | '7b9'; // セブンフラットナイン

// 難易度
export type ChordDifficulty = 'easy' | 'medium' | 'hard';

// コードの押さえ方
export interface ChordFingering {
  id: string;
  frets: (number | null)[]; // 各弦のフレット位置 [1弦(e), 2弦(B), 3弦(G), 4弦(D), 5弦(A), 6弦(E)]
  fingers: (number | null)[]; // 指番号 (1=人差し指, 2=中指, 3=薬指, 4=小指)
  barreAt: number | null; // バレーの位置
  barreStrings: [number, number] | null; // バレーする弦の範囲 [開始, 終了]（0-indexed）
  baseFret: number; // 基準フレット（ダイアグラム表示用）
  muted: boolean[]; // ミュートする弦
  isDefault: boolean; // デフォルト押さえ方かどうか
  difficulty: ChordDifficulty;
  name?: string; // カスタム名（ユーザー登録用）
}

// コード定義
export interface ChordDefinition {
  root: NoteRoot;
  quality: string;
  bass?: NoteRoot; // 分数コードのベース音
  fingerings: ChordFingering[];
}

// パースしたコード
export interface ParsedChord {
  root: NoteRoot;
  quality: string;
  bass?: NoteRoot;
}

// ユーザーの押さえ方設定
export interface UserChordPreference {
  chordName: string;
  preferredFingeringId: string;
  customFingerings: ChordFingering[];
}
