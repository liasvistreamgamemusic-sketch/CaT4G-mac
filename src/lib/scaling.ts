/**
 * レスポンシブスケーリング定数と計算ロジック
 *
 * 画面幅に応じて全体を比例縮小することで、
 * 歌詞とコードの位置関係を100%維持しながらレスポンシブ対応を実現
 */

// 基準幅（この幅でscale=1.0）
export const BASE_WIDTH = 800;

// 最小スケール（これ以下には縮小しない - 可読性のため）
export const MIN_SCALE = 0.6;

// 最大スケール（大画面でも拡大しすぎない）
export const MAX_SCALE = 1.0;

// 基準値（scale=1.0のときの値）
export const BASE_CHAR_WIDTH = 22;
export const BASE_CHORD_WIDTH_DIAGRAM = 76;
export const BASE_CHORD_WIDTH_COMPACT = 52;
export const BASE_CHORD_WIDTH_DETAILED = 128; // 詳細モード用(広め)
export const BASE_FONT_SIZE = 14; // px (text-sm = 0.875rem)

/**
 * コンテナ幅からスケール係数を計算
 * @param containerWidth コンテナの幅（px）
 * @returns スケール係数（MIN_SCALE〜MAX_SCALE）
 */
export function calculateScale(containerWidth: number): number {
  if (containerWidth <= 0) return MAX_SCALE;
  const rawScale = containerWidth / BASE_WIDTH;
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawScale));
}

/**
 * スケーリングされた値を返すインターフェース
 */
export interface ScaledValues {
  scale: number;
  charWidth: number;
  chordWidthDiagram: number;
  chordWidthCompact: number;
  chordWidthDetailed: number;
  fontSize: number;
  minChordSpacing: number;
  minChordSpacingDetailed: number;
}

/**
 * スケール係数から各種スケーリング値を計算
 * @param scale スケール係数
 * @returns スケーリングされた値
 */
export function getScaledValues(scale: number): ScaledValues {
  const charWidth = BASE_CHAR_WIDTH * scale;
  const chordWidthDiagram = BASE_CHORD_WIDTH_DIAGRAM * scale;
  const chordWidthCompact = BASE_CHORD_WIDTH_COMPACT * scale;
  const chordWidthDetailed = BASE_CHORD_WIDTH_DETAILED * scale;
  const fontSize = BASE_FONT_SIZE * scale;
  // 最小コード間隔 = コード図幅 / 文字幅
  const minChordSpacing = chordWidthDiagram / charWidth;
  const minChordSpacingDetailed = chordWidthDetailed / charWidth;

  return {
    scale,
    charWidth,
    chordWidthDiagram,
    chordWidthCompact,
    chordWidthDetailed,
    fontSize,
    minChordSpacing,
    minChordSpacingDetailed,
  };
}

/**
 * コンテナ幅からスケーリング値を直接計算
 * @param containerWidth コンテナの幅（px）
 * @returns スケーリングされた値
 */
export function getScaledValuesFromWidth(containerWidth: number): ScaledValues {
  const scale = calculateScale(containerWidth);
  return getScaledValues(scale);
}
