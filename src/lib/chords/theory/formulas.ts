/**
 * CaT4G - Music Theory: Chord Formulas
 * コードの構造をベースタイプ＋修飾で定義
 *
 * このモジュールはコードを構成要素に分解し、
 * 任意のコードのインターバル配列を計算できるようにする。
 */

import { INTERVALS, EXTENDED_INTERVALS } from './intervals';

/**
 * コードのベースタイプ（トライアド）
 */
export type ChordBase =
  | 'major' // R, M3, P5 - メジャートライアド
  | 'minor' // R, m3, P5 - マイナートライアド
  | 'dim' // R, m3, d5 - ディミニッシュトライアド
  | 'aug' // R, M3, A5 - オーギュメントトライアド
  | 'sus2' // R, M2, P5 - サスペンデッド2
  | 'sus4' // R, P4, P5 - サスペンデッド4
  | 'power'; // R, P5 - パワーコード

/**
 * 7度の種類
 */
export type SeventhType =
  | 'dom7' // m7 - ドミナント7th（短7度）
  | 'maj7' // M7 - メジャー7th（長7度）
  | 'dim7'; // d7 - ディミニッシュ7th（減7度）

/**
 * テンションノート
 */
export type Extension =
  | 'b9'
  | '9'
  | '#9'
  | '11'
  | '#11'
  | 'b13'
  | '13'
  | 'add9'
  | 'add11';

/**
 * 変化音（オルタレーション）
 */
export type Alteration = 'b5' | '#5';

/**
 * コード公式のインターフェース
 */
export interface ChordFormula {
  /** ベースタイプ（トライアド） */
  base: ChordBase;
  /** 7度（オプション） */
  seventh?: SeventhType | null;
  /** テンション（オプション） */
  extensions?: Extension[];
  /** 変化音（オプション） */
  alterations?: Alteration[];
  /** 6度を含むか */
  hasSixth?: boolean;
  /** カスタムインターバル（特殊コード用：指定された場合は他の設定を無視） */
  customIntervals?: number[];
}

/**
 * ベースタイプからインターバル配列を取得
 */
function getBaseIntervals(base: ChordBase): number[] {
  switch (base) {
    case 'major':
      return [INTERVALS.R, INTERVALS.M3, INTERVALS.P5];
    case 'minor':
      return [INTERVALS.R, INTERVALS.m3, INTERVALS.P5];
    case 'dim':
      return [INTERVALS.R, INTERVALS.m3, INTERVALS.d5];
    case 'aug':
      return [INTERVALS.R, INTERVALS.M3, INTERVALS.A5];
    case 'sus2':
      return [INTERVALS.R, INTERVALS.M2, INTERVALS.P5];
    case 'sus4':
      return [INTERVALS.R, INTERVALS.P4, INTERVALS.P5];
    case 'power':
      return [INTERVALS.R, INTERVALS.P5];
  }
}

/**
 * 7度のインターバルを取得
 */
function getSeventhInterval(seventh: SeventhType): number {
  switch (seventh) {
    case 'dom7':
      return INTERVALS.m7;
    case 'maj7':
      return INTERVALS.M7;
    case 'dim7':
      return INTERVALS.d7;
  }
}

/**
 * テンションのインターバルを取得
 */
function getExtensionInterval(extension: Extension): number {
  switch (extension) {
    case 'b9':
      return EXTENDED_INTERVALS.b9;
    case '9':
    case 'add9':
      return EXTENDED_INTERVALS['9'];
    case '#9':
      return EXTENDED_INTERVALS['#9'];
    case '11':
    case 'add11':
      return EXTENDED_INTERVALS['11'];
    case '#11':
      return EXTENDED_INTERVALS['#11'];
    case 'b13':
      return EXTENDED_INTERVALS.b13;
    case '13':
      return EXTENDED_INTERVALS['13'];
  }
}

/**
 * コード公式からインターバル配列を生成
 */
export function formulaToIntervals(formula: ChordFormula): number[] {
  // カスタムインターバルが指定されている場合はそれを返す
  if (formula.customIntervals) {
    return [...formula.customIntervals];
  }

  // ベースインターバルを取得
  const intervals = [...getBaseIntervals(formula.base)];

  // 変化音を適用
  if (formula.alterations) {
    for (const alt of formula.alterations) {
      switch (alt) {
        case 'b5': {
          // P5をd5に変更
          const p5Index = intervals.indexOf(INTERVALS.P5);
          if (p5Index !== -1) {
            intervals[p5Index] = INTERVALS.d5;
          }
          break;
        }
        case '#5': {
          // P5をA5に変更
          const p5Idx = intervals.indexOf(INTERVALS.P5);
          if (p5Idx !== -1) {
            intervals[p5Idx] = INTERVALS.A5;
          }
          break;
        }
      }
    }
  }

  // 6度を追加
  if (formula.hasSixth) {
    intervals.push(INTERVALS.M6);
  }

  // 7度を追加
  if (formula.seventh) {
    intervals.push(getSeventhInterval(formula.seventh));
  }

  // テンションを追加
  if (formula.extensions) {
    for (const ext of formula.extensions) {
      intervals.push(getExtensionInterval(ext));
    }
  }

  // ソートして返す
  return intervals.sort((a, b) => a - b);
}

/**
 * コード公式の文字列表現を生成（デバッグ用）
 */
export function formulaToString(formula: ChordFormula): string {
  let str = formula.base;
  if (formula.seventh) str += ` + ${formula.seventh}`;
  if (formula.hasSixth) str += ' + 6th';
  if (formula.alterations?.length) str += ` + ${formula.alterations.join(', ')}`;
  if (formula.extensions?.length) str += ` + ${formula.extensions.join(', ')}`;
  return str;
}

/**
 * よく使われるコード公式のプリセット
 */
export const COMMON_FORMULAS: Record<string, ChordFormula> = {
  // 基本
  major: { base: 'major' },
  minor: { base: 'minor' },
  dim: { base: 'dim' },
  aug: { base: 'aug' },
  sus2: { base: 'sus2' },
  sus4: { base: 'sus4' },
  power: { base: 'power' },

  // 7th
  '7': { base: 'major', seventh: 'dom7' },
  M7: { base: 'major', seventh: 'maj7' },
  m7: { base: 'minor', seventh: 'dom7' },
  mM7: { base: 'minor', seventh: 'maj7' },
  dim7: { base: 'dim', seventh: 'dim7' },
  m7b5: { base: 'dim', seventh: 'dom7' },

  // 6th
  '6': { base: 'major', hasSixth: true },
  m6: { base: 'minor', hasSixth: true },

  // 9th
  '9': { base: 'major', seventh: 'dom7', extensions: ['9'] },
  M9: { base: 'major', seventh: 'maj7', extensions: ['9'] },
  m9: { base: 'minor', seventh: 'dom7', extensions: ['9'] },
  add9: { base: 'major', extensions: ['add9'] },
  madd9: { base: 'minor', extensions: ['add9'] },

  // 11th
  '11': { base: 'major', seventh: 'dom7', extensions: ['9', '11'] },
  m11: { base: 'minor', seventh: 'dom7', extensions: ['9', '11'] },

  // 13th
  '13': { base: 'major', seventh: 'dom7', extensions: ['9', '13'] },
  M13: { base: 'major', seventh: 'maj7', extensions: ['9', '13'] },
  m13: { base: 'minor', seventh: 'dom7', extensions: ['9', '13'] },

  // オルタード
  '7b5': { base: 'major', seventh: 'dom7', alterations: ['b5'] },
  '7#5': { base: 'major', seventh: 'dom7', alterations: ['#5'] },

  // sus系7th
  '7sus4': { base: 'sus4', seventh: 'dom7' },
  '7sus2': { base: 'sus2', seventh: 'dom7' },
  '9sus4': { base: 'sus4', seventh: 'dom7', extensions: ['9'] },

  // 6/9
  '69': { base: 'major', hasSixth: true, extensions: ['add9'] },
  m69: { base: 'minor', hasSixth: true, extensions: ['add9'] },
};
