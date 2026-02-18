/**
 * PlayableChordLine - 演奏モード用のコード行表示コンポーネント
 * LineEditor の表示部分を抽出した読み取り専用バージョン
 *
 * Features:
 * - LineEditor と同じコード配置システム（CHAR_WIDTH = 22px）
 * - 縦のガイドライン（コードと歌詞位置を接続）
 * - 歌詞位置のハイライト（アンダーライン）
 * - viewMode 対応（compact/standard/detailed）
 * - ドラッグ・編集機能なし
 */

import { useMemo } from 'react';
import type { ExtendedChordPosition } from '@/types/database';
import { ChordDiagramHorizontal } from '@/components/ChordDiagramHorizontal';
import { generateChordFingerings } from '@/lib/chords';
import { transposeChord } from '@/lib/chords';
import type { ChordFingering } from '@/lib/chords/types';
import { getScaledValues, MAX_SCALE } from '@/lib/scaling';
import { useChordPreferencesContextSafe } from '@/contexts/ChordPreferencesContext';

// ============================================
// 定数はスケーリングモジュール（src/lib/scaling.ts）で管理
// ============================================

// ============================================
// 型定義
// ============================================

export type ViewMode = 'compact' | 'standard' | 'detailed' | 'lyrics-only';

interface PlayableChordLineProps {
  /** 歌詞テキスト */
  lyrics: string;
  /** コード配列 */
  chords: ExtendedChordPosition[];
  /** 移調量 */
  transpose?: number;
  /** 表示モード */
  viewMode?: ViewMode;
  /** コードクリック時のコールバック（ダイアグラムモーダル表示用） */
  onChordClick?: (chord: string) => void;
  /** 行メモ */
  memo?: string;
  /** 特定行から再生するコールバック */
  onPlayFromLine?: () => void;
  /** スケール係数（0.6〜1.0、デフォルト1.0） */
  scale?: number;
}

/**
 * 演奏モード用コード行コンポーネント
 */
export function PlayableChordLine({
  lyrics,
  chords,
  transpose = 0,
  viewMode = 'standard',
  onChordClick,
  memo,
  onPlayFromLine,
  scale = MAX_SCALE,
}: PlayableChordLineProps) {
  // ユーザーのコード設定を取得
  const chordPreferences = useChordPreferencesContextSafe();

  // 表示設定
  const isLyricsOnly = viewMode === 'lyrics-only';
  const showChords = !isLyricsOnly;
  const showDiagram = viewMode !== 'compact' && !isLyricsOnly;
  const showPlayingMethod = viewMode !== 'compact' && !isLyricsOnly;
  const showMemo = viewMode === 'detailed' && !isLyricsOnly;

  // スケーリングされた値を計算
  const scaledValues = useMemo(() => getScaledValues(scale), [scale]);
  const CHAR_WIDTH = scaledValues.charWidth;
  const CHORD_COMPONENT_WIDTH_DIAGRAM = scaledValues.chordWidthDiagram;
  const CHORD_COMPONENT_WIDTH_COMPACT = scaledValues.chordWidthCompact;
  const scaledFontSize = scaledValues.fontSize;

  // コードコンポーネントの幅
  const componentWidth = showDiagram ? CHORD_COMPONENT_WIDTH_DIAGRAM : CHORD_COMPONENT_WIDTH_COMPACT;

  // 最小コード間隔（文字位置単位）
  const MIN_CHORD_SPACING = scaledValues.minChordSpacing;

  // 移調済みコード名を計算し、重なりを防止
  const transposedChords = useMemo(() => {
    // まず移調を適用
    const transposed = chords.map((chord) => ({
      ...chord,
      chord: transposeChord(chord.chord, transpose),
    }));

    // 表示用に重なりを防止（コードが1つ以下なら調整不要）
    if (transposed.length <= 1) return transposed;

    // 位置でソート
    const sorted = [...transposed].sort((a, b) => a.position - b.position);
    const result: ExtendedChordPosition[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const chord = sorted[i];
      if (i === 0) {
        result.push({ ...chord });
      } else {
        const prevChord = result[i - 1];
        const minPosition = prevChord.position + MIN_CHORD_SPACING;

        if (chord.position < minPosition) {
          // 前のコードに近すぎる場合、右にずらす
          result.push({ ...chord, position: minPosition });
        } else {
          result.push({ ...chord });
        }
      }
    }

    return result;
  }, [chords, transpose, MIN_CHORD_SPACING]);

  // コードのフィンガリングを生成
  const chordFingerings = useMemo(() => {
    const fingerings: Record<number, ChordFingering | null> = {};
    transposedChords.forEach((chord, index) => {
      // ユーザー設定を先にチェック
      const userPref = chordPreferences?.getPreferred(chord.chord);
      if (userPref) {
        // データベースの ChordFingering を lib の ChordFingering に変換
        fingerings[index] = {
          ...userPref,
          id: userPref.id ?? `user-pref-${chord.chord}`,
          barreStrings: userPref.barreStrings ?? (userPref.barreAt ? [0, 5] : null),
          muted: userPref.muted ?? userPref.frets.map(f => f === null),
          isDefault: userPref.isDefault ?? true,
          difficulty: userPref.difficulty ?? 'medium',
        } as ChordFingering;
        return;
      }

      // voicingId またはデフォルトにフォールバック
      const allFingerings = generateChordFingerings(chord.chord);
      if (chord.voicingId) {
        const selected = allFingerings.find((f) => f.id === chord.voicingId);
        fingerings[index] = selected || allFingerings[0] || null;
      } else {
        fingerings[index] = allFingerings[0] || null;
      }
    });
    return fingerings;
  }, [transposedChords, chordPreferences]);

  // メソッドインジケーターを取得
  const getMethodIndicator = (chord: ExtendedChordPosition): string => {
    if (!chord.method) return '';
    if (chord.method === 'stroke') return 'St';
    if (chord.method === 'arpeggio') return 'Ar';
    return '';
  };

  // パターン表示文字列を取得
  const getPatternDisplay = (chord: ExtendedChordPosition): string => {
    if (!chord.method) return '';
    if (chord.method === 'stroke' && chord.strokePattern && chord.strokePattern.length > 0) {
      return chord.strokePattern
        .map((dir) => {
          switch (dir) {
            case 'down': return '↓';
            case 'up': return '↑';
            case 'mute': return '×';
            case 'rest': return '−';
            default: return '';
          }
        })
        .join('');
    }
    if (chord.method === 'arpeggio' && chord.arpeggioOrder && chord.arpeggioOrder.length > 0) {
      return chord.arpeggioOrder
        .map((el) => Array.isArray(el) ? `[${el.join('')}]` : String(el))
        .join('-');
    }
    return '';
  };

  // 最大位置を計算（幅の決定）
  const maxPosition = Math.max(
    lyrics.length,
    ...chords.map((c) => c.position + c.chord.length)
  );
  const minChars = Math.max(30, maxPosition + 5);

  return (
    <div className="space-y-0 group">
      {/* コード行（lyrics-onlyモードでは非表示） */}
      {showChords && (
      <div
        className={`relative font-mono px-1 py-0.5 ${
          chords.length > 0 ? (showDiagram ? 'min-h-[5rem] pb-12' : 'min-h-[2rem] pb-4') : 'min-h-[1.5rem]'
        }`}
        style={{ fontSize: `${scaledFontSize}px`, minWidth: `${minChars}ch` }}
      >
        {/* コード表示 */}
        {transposedChords.map((chord, chordIndex) => {
          const fingering = chordFingerings[chordIndex];
          const methodIndicator = showPlayingMethod ? getMethodIndicator(chord) : '';
          const patternDisplay = showPlayingMethod ? getPatternDisplay(chord) : '';
          const hasPattern = showPlayingMethod && patternDisplay.length > 0;
          const hasAnnotation = showMemo && chord.annotation && chord.annotation.trim().length > 0;

          // コンパクトモードかどうか
          const isMinimalMode = !showDiagram && !showPlayingMethod && !showMemo;
          const displayWidth = isMinimalMode ? 'auto' : `${componentWidth}px`;
          const displayHeight = isMinimalMode ? '28px' : (showDiagram ? '72px' : '36px');

          // 位置をピクセルに変換
          const positionPx = chord.position * CHAR_WIDTH;

          return (
            <div
              key={chordIndex}
              className={`absolute top-0 flex flex-col select-none
                p-0.5 transition-colors
                overflow-visible
                ${onChordClick ? 'cursor-pointer hover:bg-accent-primary/10 rounded' : ''}`}
              style={{
                left: `${positionPx}px`,
                width: displayWidth,
                minHeight: displayHeight,
              }}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={() => onChordClick?.(chord.chord)}
              title={`${chord.chord}${chord.annotation ? `\n${chord.annotation}` : ''}`}
            >
              {/* ヘッダー: コード名 + メソッドバッジ */}
              <div className="flex items-center justify-center w-full gap-1">
                <div
                  className="px-1 rounded transition-colors whitespace-nowrap font-semibold flex items-center text-accent-primary hover:bg-accent-primary/20"
                  style={{ fontSize: `${scaledFontSize}px` }}
                >
                  {chord.chord}
                </div>
                {methodIndicator && showPlayingMethod && (
                  <span
                    className={`px-1 py-0.5 rounded ${
                      chord.method === 'stroke'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                    style={{ fontSize: `${8 * scale}px` }}
                  >
                    {methodIndicator}
                  </span>
                )}
              </div>

              {/* コードダイアグラム */}
              {showDiagram && (
                <div className="flex items-center justify-center flex-shrink-0" style={{ height: `${56 * scale}px` }}>
                  {fingering && (
                    <ChordDiagramHorizontal
                      fingering={fingering}
                      size="xs"
                      showFingers={false}
                      scale={scale}
                    />
                  )}
                </div>
              )}

              {/* パターン表示 */}
              {hasPattern && (
                <div
                  className="text-center font-mono leading-tight truncate w-full px-0.5"
                  style={{ fontSize: `${9 * scale}px` }}
                  title={patternDisplay}
                >
                  <span className={chord.method === 'stroke' ? 'text-purple-300' : 'text-green-300'}>
                    {patternDisplay.length > 12 ? patternDisplay.slice(0, 12) + '...' : patternDisplay}
                  </span>
                </div>
              )}

              {/* アノテーション表示 */}
              {hasAnnotation && (
                <div
                  className="text-yellow-400 leading-tight truncate w-full px-0.5 mt-0.5"
                  style={{ fontSize: `${8 * scale}px` }}
                  title={chord.annotation}
                >
                  {chord.annotation!.length > 12 ? chord.annotation!.slice(0, 12) + '...' : chord.annotation}
                </div>
              )}

              {/* 縦のガイドライン */}
              <div
                className="absolute w-0.5 bg-accent-primary/50 pointer-events-none rounded-full"
                style={{
                  left: '0px',
                  top: '100%',
                  height: `${(showDiagram ? 16 : 8) * scale}px`,
                }}
              />
              {/* 下端のアンカーポイント */}
              <div
                className="absolute bg-accent-primary/60 rounded-full pointer-events-none"
                style={{
                  width: `${8 * scale}px`,
                  height: `${8 * scale}px`,
                  left: `${-3 * scale}px`,
                  top: `calc(100% + ${(showDiagram ? 14 : 6) * scale}px)`,
                }}
              />
            </div>
          );
        })}

        {/* コードがない場合 */}
        {chords.length === 0 && (
          <span className="text-text-muted/50 text-xs pointer-events-none">
            &nbsp;
          </span>
        )}
      </div>
      )}

      {/* 歌詞行を囲む flex コンテナ */}
      <div className="flex items-center gap-2">
        {/* 既存の歌詞表示 */}
        <div className="flex-1 relative">
          {/* アンダーラインマーカー（コード位置） - 歌詞のみモードでは非表示 */}
          {showChords && (
          <div
            className="absolute inset-0 pointer-events-none px-1 py-0.5"
            style={{ fontFamily: 'monospace', fontSize: `${scaledFontSize}px`, letterSpacing: '0.35em' }}
          >
            {chords.map((chord, chordIndex) => {
              const pos = chord.position;
              if (pos >= lyrics.length) return null;
              return (
                <span
                  key={chordIndex}
                  className="absolute bottom-1 h-0.5 bg-accent-primary/60 rounded-full"
                  style={{
                    left: `calc(4px + ${pos * CHAR_WIDTH}px)`,
                    width: `${CHAR_WIDTH}px`,
                  }}
                />
              );
            })}
          </div>
          )}

          {/* 歌詞テキスト */}
          <div
            className="w-full px-1 py-0.5 font-mono font-semibold text-text-primary"
            style={{ fontSize: `${scaledFontSize}px`, letterSpacing: '0.35em', minHeight: `${24 * scale}px` }}
          >
            {lyrics || <span className="text-text-muted/30">&nbsp;</span>}
          </div>
        </div>

        {/* 再生ボタン - onPlayFromLine が渡された場合のみ表示 */}
        {onPlayFromLine && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayFromLine();
            }}
            className="flex-shrink-0 p-1.5 rounded hover:bg-accent-primary/20 text-text-secondary hover:text-accent-primary transition-colors opacity-0 group-hover:opacity-100"
            title="この行から再生"
            aria-label="この行から再生"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>

      {/* 行メモ（detailed モードのみ） */}
      {showMemo && memo && (
        <div className="text-xs text-yellow-400 bg-yellow-500/10 rounded px-2 py-1 mt-1 border border-yellow-500/20">
          {memo}
        </div>
      )}
    </div>
  );
}

export default PlayableChordLine;
