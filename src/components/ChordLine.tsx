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
 */
export function ChordLine({
  lyrics,
  chords,
  transpose = 0,
  onChordClick,
  displayMode = 'text',
}: ChordLineProps) {
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

  // テキストモード（コード名のみ）
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
              className="absolute cursor-pointer hover:text-accent-hover transition-colors"
              style={{ left: `${chord.displayPosition}ch` }}
              onClick={() => onChordClick?.(chord.chord)}
              title={`${chord.chord}の押さえ方を表示`}
            >
              {chord.chord}
            </span>
          ))}
        </div>
        {/* 歌詞行 */}
        <div className="lyrics text-text-primary whitespace-pre">
          {lyrics || '\u00A0'}
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
              title={`${chord.chord}の詳細を表示`}
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
            </div>
          );
        })}
      </div>
      {/* 歌詞行 */}
      <div className="lyrics text-text-primary whitespace-pre mt-1">
        {lyrics || '\u00A0'}
      </div>
    </div>
  );
}
