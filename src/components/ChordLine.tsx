import { useMemo } from 'react';
import type { ChordPosition } from '@/types/database';
import { transposeChord, getDefaultFingering, generateChordFingering } from '@/lib/chords';
import { ChordDiagramInline } from './ChordDiagramInline';
import type { ChordDisplayMode } from './MainArea';

interface ChordLineProps {
  lyrics: string;
  chords: ChordPosition[];
  transpose?: number;
  onChordClick?: (chord: string) => void;
  displayMode?: ChordDisplayMode;
}

/**
 * コード行コンポーネント
 * 歌詞の上にコードを配置して表示
 * コードの位置は歌詞の特定の文字に対応し、視覚的に明確に表示
 */
export function ChordLine({
  lyrics,
  chords,
  transpose = 0,
  onChordClick,
  displayMode = 'text',
}: ChordLineProps) {
  // Create a set of chord positions for quick lookup
  const chordPositions = useMemo(() => {
    const positions = new Map<number, string>();
    chords.forEach((chord) => {
      const pos = Math.floor(chord.position);
      positions.set(pos, transposeChord(chord.chord, transpose));
    });
    return positions;
  }, [chords, transpose]);

  // コードがない場合は歌詞のみ表示
  if (chords.length === 0) {
    return (
      <div className="chord-line py-1">
        <div className="lyrics text-text-primary">{lyrics || '\u00A0'}</div>
      </div>
    );
  }

  // コードを転調
  const transposedChords = chords.map((c) => ({
    ...c,
    chord: transposeChord(c.chord, transpose),
  }));

  // テキストモード（コード名のみ）- 位置マーカー付き
  if (displayMode === 'text') {
    // コード重なり防止: 各コードの表示位置を計算
    // 1. まずpositionでソート（左から右の順序を保証）
    const sortedChords = [...transposedChords].sort((a, b) => a.position - b.position);

    // 2. 重なり防止のため表示位置を調整
    const MIN_GAP = 1; // コード間の最小間隔（ch単位）
    let occupiedRight = 0;

    const chordsWithDisplayPos = sortedChords.map((chord) => {
      // 元の位置か、前のコードの右端+間隔の大きい方を使用
      const leftPos = Math.max(chord.position, occupiedRight);
      occupiedRight = leftPos + chord.chord.length + MIN_GAP;
      return { ...chord, displayPosition: leftPos };
    });

    return (
      <div className="chord-line py-1 font-mono">
        {/* コード行 */}
        <div className="chords text-accent-primary font-semibold text-sm h-6 relative">
          {chordsWithDisplayPos.map((chord, idx) => (
            <span
              key={idx}
              className="absolute cursor-pointer hover:text-accent-hover transition-colors flex flex-col items-start"
              style={{ left: `${chord.displayPosition}ch` }}
              onClick={() => onChordClick?.(chord.chord)}
              title={`${chord.chord}の押さえ方を表示`}
            >
              <span>{chord.chord}</span>
              {/* Small alignment guide line connecting to lyrics */}
              <span
                className="w-0.5 h-1 bg-accent-primary/30 mt-0.5"
                style={{ marginLeft: '0' }}
              />
            </span>
          ))}
        </div>
        {/* 歌詞行 - コード位置にハイライトマーカー付き */}
        <div className="lyrics text-text-primary whitespace-pre relative">
          {/* Character-by-character rendering with position markers */}
          <span className="relative">
            {lyrics.split('').map((char, index) => {
              const hasChord = chordPositions.has(index);
              return (
                <span
                  key={index}
                  className={`relative inline-block ${hasChord ? 'text-accent-primary font-semibold' : ''}`}
                  style={{
                    minWidth: char === ' ' ? '0.5ch' : undefined,
                  }}
                >
                  {/* Underline marker for chord positions */}
                  {hasChord && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary/40 rounded" />
                  )}
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
          {!lyrics && '\u00A0'}
        </div>
      </div>
    );
  }

  // ダイアグラムモード（押さえ方図）- flexで重ならないように配置
  return (
    <div className="chord-line py-2 font-mono">
      {/* ダイアグラム行 - 横並びflex、折り返しあり */}
      <div className="chord-diagrams flex flex-wrap gap-2 min-h-[48px]">
        {transposedChords.map((chord, idx) => {
          // まずデータベースから、なければ動的生成
          const fingering = getDefaultFingering(chord.chord) || generateChordFingering(chord.chord);

          return (
            <div
              key={idx}
              className="inline-flex flex-col items-center cursor-pointer hover:bg-background-surface/70 rounded p-1 transition-colors"
              onClick={() => onChordClick?.(chord.chord)}
              title={`${chord.chord}の詳細を表示（位置: ${chord.position}文字目）`}
            >
              <span className="text-[10px] text-accent-primary font-semibold leading-tight mb-0.5">
                {chord.chord}
              </span>
              {fingering ? (
                <ChordDiagramInline fingering={fingering} />
              ) : (
                <div className="w-12 h-8 flex items-center justify-center text-[8px] text-text-muted bg-background-surface/50 rounded">
                  ?
                </div>
              )}
              {/* Position indicator badge */}
              <span className="text-[8px] text-text-muted mt-0.5">
                @{chord.position}
              </span>
            </div>
          );
        })}
      </div>
      {/* 歌詞行 - コード位置にハイライトマーカー付き */}
      <div className="lyrics text-text-primary whitespace-pre mt-1 relative">
        {/* Character-by-character rendering with position markers */}
        <span className="relative">
          {lyrics.split('').map((char, index) => {
            const hasChord = chordPositions.has(index);
            return (
              <span
                key={index}
                className={`relative inline-block ${hasChord ? 'text-accent-primary font-semibold' : ''}`}
                style={{
                  minWidth: char === ' ' ? '0.5ch' : undefined,
                }}
              >
                {/* Underline marker for chord positions */}
                {hasChord && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary/40 rounded" />
                )}
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </span>
        {!lyrics && '\u00A0'}
      </div>
    </div>
  );
}