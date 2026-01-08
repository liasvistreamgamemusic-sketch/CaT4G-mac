/**
 * ChordDiagramInline - 横向きインラインコードダイアグラム
 * コード名の下に表示する小型の横向きフレット図
 */

import type { ChordFingering } from '@/lib/chords/types';

interface ChordDiagramInlineProps {
  fingering: ChordFingering;
}

// 横向きサイズ（コンパクト）
const WIDTH = 48;  // 4フレット分
const HEIGHT = 32; // 6弦分

export function ChordDiagramInline({ fingering }: ChordDiagramInlineProps) {
  const padding = { top: 4, left: 8, right: 4, bottom: 4 };
  const gridWidth = WIDTH - padding.left - padding.right;
  const gridHeight = HEIGHT - padding.top - padding.bottom;
  const fretSpacing = gridWidth / 4;  // 4フレット
  const stringSpacing = gridHeight / 5; // 6弦
  const dotSize = 4;
  const nutWidth = 2;

  // 横向き: Y座標が弦（上が1弦、下が6弦）
  const getStringY = (stringIndex: number) =>
    padding.top + stringIndex * stringSpacing;

  // 横向き: X座標がフレット
  const getFretX = (fret: number) =>
    padding.left + (fret - fingering.baseFret) * fretSpacing + fretSpacing / 2;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      className="bg-background-surface/50 rounded"
    >
      {/* ナット（1フレットの場合） */}
      {fingering.baseFret === 1 && (
        <rect
          x={padding.left - nutWidth}
          y={padding.top - 1}
          width={nutWidth}
          height={gridHeight + 2}
          fill="#9ca3af"
          rx={1}
        />
      )}

      {/* フレット番号（左下、グリッドの外側に表示。6弦ミュート時は上にずらす） */}
      {fingering.baseFret > 1 && (
        <text
          x={padding.left - 2}
          y={fingering.muted[5] ? HEIGHT - stringSpacing - 2 : HEIGHT - 1}
          fontSize={5}
          fill="#6b7280"
          textAnchor="end"
          dominantBaseline="auto"
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
          x2={WIDTH - padding.right}
          y2={getStringY(i)}
          stroke="#4b5563"
          strokeWidth={i === 5 ? 1 : 0.5}
        />
      ))}

      {/* フレット（縦線） */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`fret-${i}`}
          x1={padding.left + i * fretSpacing}
          y1={padding.top - 1}
          x2={padding.left + i * fretSpacing}
          y2={HEIGHT - padding.bottom + 1}
          stroke="#4b5563"
          strokeWidth={i === 0 ? 1 : 0.5}
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
          <circle
            key={`dot-${stringIndex}`}
            cx={x}
            cy={y}
            r={dotSize / 2}
            fill="#a855f7"
          />
        );
      })}

      {/* 開放弦（○）・ミュート（×） - 左端に表示 */}
      {fingering.frets.map((fret, stringIndex) => {
        const x = padding.left - 5;
        const y = getStringY(stringIndex);

        if (fingering.muted[stringIndex]) {
          return (
            <text
              key={`mute-${stringIndex}`}
              x={x}
              y={y}
              fontSize={4}
              fill="#6b7280"
              textAnchor="middle"
              dominantBaseline="middle"
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
              r={1.5}
              fill="none"
              stroke="#6b7280"
              strokeWidth={0.8}
            />
          );
        }

        return null;
      })}
    </svg>
  );
}

export default ChordDiagramInline;
