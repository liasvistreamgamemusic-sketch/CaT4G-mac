interface MetronomeBeatIndicatorProps {
  beatsPerMeasure: number;
  currentBeat: number;
  isPlaying: boolean;
  /** スケール係数（0.6〜1.0、デフォルト1.0） */
  scale?: number;
}

export function MetronomeBeatIndicator({
  beatsPerMeasure,
  currentBeat,
  isPlaying,
  scale = 1.0,
}: MetronomeBeatIndicatorProps) {
  const dotSize = 12 * scale;

  return (
    <div className="flex items-center" style={{ gap: `${4 * scale}px` }}>
      {Array.from({ length: beatsPerMeasure }, (_, index) => {
        const isCurrentBeat = isPlaying && currentBeat === index;
        const isFirstBeat = index === 0;

        let colorClass = 'bg-gray-600';
        let scaleClass = '';

        if (isCurrentBeat) {
          if (isFirstBeat) {
            colorClass = 'bg-amber-500';
            scaleClass = 'scale-125';
          } else {
            colorClass = 'bg-orange-500';
            scaleClass = 'scale-110';
          }
        }

        return (
          <div
            key={index}
            className={`rounded-full transition-all duration-75 ${colorClass} ${scaleClass}`}
            style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
          />
        );
      })}
    </div>
  );
}
