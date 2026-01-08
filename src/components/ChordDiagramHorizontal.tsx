/**
 * ChordDiagramHorizontal - 横向きコードダイアグラム（モーダル用）
 * 弦が横方向、フレットが縦方向の大きめサイズ
 */

import type { ChordFingering } from '@/lib/chords/types';

interface ChordDiagramHorizontalProps {
  fingering: ChordFingering;
  size?: 'sm' | 'md' | 'lg';
  showFingers?: boolean;
}

// サイズ設定（横向き）
const SIZES = {
  sm: { width: 96, height: 64, dotSize: 8, fontSize: 8 },
  md: { width: 160, height: 100, dotSize: 12, fontSize: 10 },
  lg: { width: 240, height: 150, dotSize: 16, fontSize: 12 },
};

export function ChordDiagramHorizontal({
  fingering,
  size = 'md',
  showFingers = true,
}: ChordDiagramHorizontalProps) {
  const { width, height, dotSize, fontSize } = SIZES[size];

  const padding = { top: 12, left: 24, right: 12, bottom: 12 };
  const gridWidth = width - padding.left - padding.right;
  const gridHeight = height - padding.top - padding.bottom;
  const fretSpacing = gridWidth / 4; // 4フレット
  const stringSpacing = gridHeight / 5; // 6弦
  const nutWidth = 4;

  // 横向き: Y座標が弦（上が1弦、下が6弦）
  const getStringY = (stringIndex: number) =>
    padding.top + stringIndex * stringSpacing;

  // 横向き: X座標がフレット
  const getFretX = (fret: number) =>
    padding.left + (fret - fingering.baseFret) * fretSpacing + fretSpacing / 2;

  return (
    <svg
      width={width}
      height={height}
      className="bg-background-surface rounded-lg"
    >
      {/* ナット（1フレットの場合） */}
      {fingering.baseFret === 1 && (
        <rect
          x={padding.left - nutWidth}
          y={padding.top - 2}
          width={nutWidth}
          height={gridHeight + 4}
          fill="#e5e7eb"
          rx={2}
        />
      )}

      {/* フレット番号（左下、6弦の位置に表示。6弦ミュート時は5弦の位置にずらす） */}
      {fingering.baseFret > 1 && (
        <text
          x={padding.left - 6}
          y={fingering.muted[5] ? getStringY(4) : getStringY(5)}
          fontSize={fontSize + 2}
          fill="#6b7280"
          textAnchor="end"
          dominantBaseline="middle"
          fontWeight="bold"
        >
          {fingering.baseFret}
        </text>
      )}

      {/* 弦（横線）- 上が1弦、下が6弦 */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={`string-${i}`}
          x1={padding.left}
          y1={getStringY(i)}
          x2={width - padding.right}
          y2={getStringY(i)}
          stroke="#4b5563"
          strokeWidth={i === 5 ? 2 : 1}
        />
      ))}

      {/* フレット（縦線） */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`fret-${i}`}
          x1={padding.left + i * fretSpacing}
          y1={padding.top - 2}
          x2={padding.left + i * fretSpacing}
          y2={height - padding.bottom + 2}
          stroke="#4b5563"
          strokeWidth={i === 0 ? 2 : 1}
        />
      ))}

      {/* バレー */}
      {fingering.barreAt !== null && fingering.barreStrings !== null && (
        <rect
          x={getFretX(fingering.barreAt) - dotSize / 2}
          y={getStringY(fingering.barreStrings[0]) - dotSize / 2}
          width={dotSize}
          height={
            (fingering.barreStrings[1] - fingering.barreStrings[0]) *
              stringSpacing +
            dotSize
          }
          rx={dotSize / 2}
          fill="#a855f7"
        />
      )}

      {/* 押さえる位置（ドット） */}
      {fingering.frets.map((fret, stringIndex) => {
        if (
          fret === null ||
          fret === 0 ||
          fingering.muted[stringIndex] === true
        )
          return null;

        // バレーの一部はスキップ
        if (
          fingering.barreAt !== null &&
          fingering.barreStrings !== null &&
          fret === fingering.barreAt &&
          stringIndex > fingering.barreStrings[0] &&
          stringIndex < fingering.barreStrings[1]
        ) {
          return null;
        }

        const x = getFretX(fret);
        const y = getStringY(stringIndex);

        return (
          <g key={`dot-${stringIndex}`}>
            <circle cx={x} cy={y} r={dotSize / 2} fill="#a855f7" />
            {showFingers && fingering.fingers[stringIndex] !== null && (
              <text
                x={x}
                y={y + 1}
                fontSize={dotSize - 3}
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
              >
                {fingering.fingers[stringIndex]}
              </text>
            )}
          </g>
        );
      })}

      {/* 開放弦（○）・ミュート（×） - 左端に表示 */}
      {fingering.frets.map((fret, stringIndex) => {
        const x = padding.left - 14;
        const y = getStringY(stringIndex);

        if (fingering.muted[stringIndex]) {
          return (
            <text
              key={`mute-${stringIndex}`}
              x={x}
              y={y}
              fontSize={dotSize - 2}
              fill="#6b7280"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="normal"
            >
              ×
            </text>
          );
        }

        if (fret === 0) {
          return (
            <circle
              key={`open-${stringIndex}`}
              cx={x}
              cy={y}
              r={dotSize / 2 - 3}
              fill="none"
              stroke="#6b7280"
              strokeWidth={1.5}
            />
          );
        }

        return null;
      })}
    </svg>
  );
}

export default ChordDiagramHorizontal;
