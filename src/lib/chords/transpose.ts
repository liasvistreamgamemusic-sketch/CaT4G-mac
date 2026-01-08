/**
 * CaT4G - Transpose Utilities
 * 転調ロジック
 */

import type { NoteRoot, ParsedChord } from './types';

// 全音階（シャープ系）
export const NOTES: NoteRoot[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

// 全音階（フラット系）
export const NOTES_FLAT: string[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

// 異名同音の正規化マップ
export const NOTE_ALIASES: Record<string, NoteRoot> = {
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
  Cb: 'B',
  'E#': 'F',
  'B#': 'C',
};

/**
 * 音名を正規化（シャープ系に統一）
 */
export function normalizeNote(note: string): NoteRoot {
  // Unicode記号を変換
  const normalized = note.replace('♯', '#').replace('♭', 'b');

  if (NOTE_ALIASES[normalized]) {
    return NOTE_ALIASES[normalized];
  }
  return normalized as NoteRoot;
}

/**
 * コード文字列をパース
 * @param chordStr コード文字列 (例: "Am7", "D/F#", "Cm7b5")
 * @returns パース結果、またはパース失敗時はnull
 */
export function parseChord(chordStr: string): ParsedChord | null {
  // 分数コードの処理
  const slashIndex = chordStr.indexOf('/');
  let mainPart = chordStr;
  let bass: NoteRoot | undefined;

  if (slashIndex !== -1) {
    mainPart = chordStr.substring(0, slashIndex);
    const bassStr = chordStr.substring(slashIndex + 1);
    const bassMatch = bassStr.match(/^[A-G][#♯b♭]?/);
    if (bassMatch) {
      bass = normalizeNote(bassMatch[0]);
    }
  }

  // ルート音の抽出
  const rootMatch = mainPart.match(/^[A-G][#♯b♭]?/);
  if (!rootMatch) return null;

  const root = normalizeNote(rootMatch[0]);
  const quality = mainPart.substring(rootMatch[0].length);

  return { root, quality, bass };
}

/**
 * 単一の音を転調
 * @param note 音名
 * @param semitones 半音数（正: 上げる, 負: 下げる）
 * @param preferFlat フラット系で出力するか
 */
export function transposeNote(
  note: string,
  semitones: number,
  preferFlat = false
): string {
  const normalized = normalizeNote(note);
  const index = NOTES.indexOf(normalized);
  if (index === -1) return note;

  const newIndex = (index + semitones + 120) % 12; // 120を足してマイナス対応
  return preferFlat ? NOTES_FLAT[newIndex] : NOTES[newIndex];
}

/**
 * コードを転調
 * @param chord コード文字列
 * @param semitones 半音数（正: 上げる, 負: 下げる）
 */
export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;

  const parsed = parseChord(chord);
  if (!parsed) return chord;

  const { root, quality, bass } = parsed;

  // 元のコードがフラット系かどうかを判定
  const isFlat = chord.includes('b') || chord.includes('♭');

  // ルート音を転調
  const newRoot = transposeNote(root, semitones, isFlat);

  // ベース音も転調（分数コードの場合）
  let newBass = '';
  if (bass) {
    newBass = '/' + transposeNote(bass, semitones, isFlat);
  }

  return newRoot + quality + newBass;
}

/**
 * 転調後の推奨カポ位置を計算
 * @param originalCapo 元のカポ位置
 * @param transpose 転調量
 * @returns 推奨カポ位置（0-12）
 */
export function getRecommendedCapo(
  originalCapo: number,
  transpose: number
): number {
  // カポで転調を相殺できる場合は提案
  const newCapo = originalCapo - transpose;
  if (newCapo >= 0 && newCapo <= 12) {
    return newCapo;
  }
  return originalCapo;
}

/**
 * キーを取得（コード進行から推測）
 * 単純化: 最初のメジャーコードをキーと仮定
 */
export function guessKeyFromChords(chords: string[]): string | null {
  for (const chord of chords) {
    const parsed = parseChord(chord);
    if (parsed && parsed.quality === '') {
      return parsed.root;
    }
  }
  return null;
}
