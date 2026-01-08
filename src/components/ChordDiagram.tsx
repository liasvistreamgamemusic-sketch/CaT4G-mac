/**
 * ChordDiagram - コードダイアグラム表示コンポーネント
 * ギターのフレット図をSVGで描画
 */

import type { ChordFingering } from '@/lib/chords/types';

interface ChordDiagramProps {
  chord: string;
  fingering: ChordFingering;
  size?: 'sm' | 'md' | 'lg';
  showFingers?: boolean;
  showChordName?: boolean;
  onClick?: () => void;
}

// サイズ設定
const SIZES = {
  sm: { width: 60, height: 80, dotSize: 6, fontSize: 10 },
  md: { width: 80, height: 100, dotSize: 8, fontSize: 12 },
  lg: { width: 120, height: 150, dotSize: 12, fontSize: 16 },
};

export function ChordDiagram({
  chord,
  fingering,
  size = 'md',
  showFingers = true,
  showChordName = true,
  onClick,
}: ChordDiagramProps) {
  const { width, height, dotSize, fontSize } = SIZES[size];

  // グリッド計算
  const padding = { top: 20, left: 15, right: 10, bottom: 5 };
  const gridWidth = width - padding.left - padding.right;
  const gridHeight = height - padding.top - padding.bottom;
  const stringSpacing = gridWidth / 5; // 6弦
  const fretSpacing = gridHeight / 4; // 4フレット表示
  const nutHeight = 3;

  // 弦のX座標を取得（1弦=左、6弦=右）
  const getStringX = (stringIndex: number) =>
    padding.left + stringIndex * stringSpacing;

  // フレットのY座標を取得
  const getFretY = (fret: number) =>
    padding.top + (fret - fingering.baseFret) * fretSpacing + fretSpacing / 2;

  return (
    <div
      className={`inline-flex flex-col items-center ${onClick ? 'cursor-pointer hover:bg-background-surface/50 rounded-lg transition-colors' : ''}`}
      onClick={onClick}
    >
      {/* コード名 */}
      {showChordName && (
        <span
          className="font-mono font-bold text-accent-primary mb-1"
          style={{ fontSize: fontSize }}
        >
          {chord}
        </span>
      )}

      <svg
        width={width}
        height={height}
        className="bg-background-surface rounded"
      >
        {/* ナット（1フレットの場合）またはフレット番号 */}
        {fingering.baseFret === 1 ? (
          <rect
            x={padding.left - 2}
            y={padding.top - nutHeight}
            width={gridWidth + 4}
            height={nutHeight}
            fill="#e5e7eb"
            rx={1}
          />
        ) : (
          <text
            x={5}
            y={padding.top + fretSpacing / 2}
            fontSize={fontSize - 2}
            fill="#9ca3af"
            dominantBaseline="middle"
          >
            {fingering.baseFret}
          </text>
        )}

        {/* 弦（縦線） */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`string-${i}`}
            x1={getStringX(i)}
            y1={padding.top}
            x2={getStringX(i)}
            y2={height - padding.bottom}
            stroke="#4b5563"
            strokeWidth={i === 5 ? 1.5 : 1}
          />
        ))}

        {/* フレット（横線） */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`fret-${i}`}
            x1={padding.left - 2}
            y1={padding.top + i * fretSpacing}
            x2={padding.left + gridWidth + 2}
            y2={padding.top + i * fretSpacing}
            stroke="#4b5563"
            strokeWidth={i === 0 ? 1.5 : 1}
          />
        ))}

        {/* バレー */}
        {fingering.barreAt !== null && fingering.barreStrings !== null && (
          <rect
            x={getStringX(fingering.barreStrings[0]) - dotSize / 2}
            y={getFretY(fingering.barreAt) - dotSize / 2}
            width={
              (fingering.barreStrings[1] - fingering.barreStrings[0]) *
                stringSpacing +
              dotSize
            }
            height={dotSize}
            rx={dotSize / 2}
            fill="#a855f7"
          />
        )}

        {/* 押さえる位置（ドット） */}
        {fingering.frets.map((fret, stringIndex) => {
          // ミュート、開放弦、バレー位置はスキップ
          if (
            fret === null ||
            fret === 0 ||
            fingering.muted[stringIndex] === true
          )
            return null;

          // バレーの一部であればスキップ（バレーの開始・終了弦以外）
          if (
            fingering.barreAt !== null &&
            fingering.barreStrings !== null &&
            fret === fingering.barreAt &&
            stringIndex > fingering.barreStrings[0] &&
            stringIndex < fingering.barreStrings[1]
          ) {
            return null;
          }

          const x = getStringX(stringIndex);
          const y = getFretY(fret);

          return (
            <g key={`dot-${stringIndex}`}>
              <circle cx={x} cy={y} r={dotSize / 2} fill="#a855f7" />
              {showFingers && fingering.fingers[stringIndex] !== null && (
                <text
                  x={x}
                  y={y + 1}
                  fontSize={dotSize - 2}
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

        {/* 開放弦（○）・ミュート（×） */}
        {fingering.frets.map((fret, stringIndex) => {
          const x = getStringX(stringIndex);
          const y = padding.top - 10;

          if (fingering.muted[stringIndex]) {
            return (
              <text
                key={`mute-${stringIndex}`}
                x={x}
                y={y}
                fontSize={dotSize + 2}
                fill="#ef4444"
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
                r={dotSize / 2 - 1}
                fill="none"
                stroke="#22c55e"
                strokeWidth={1.5}
              />
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
}

export default ChordDiagram;
