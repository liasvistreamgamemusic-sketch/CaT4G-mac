interface MetronomeBeatIndicatorProps {
  beatsPerMeasure: number;
  currentBeat: number;
  isPlaying: boolean;
}

export function MetronomeBeatIndicator({
  beatsPerMeasure,
  currentBeat,
  isPlaying,
}: MetronomeBeatIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
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
            colorClass = 'bg-purple-500';
            scaleClass = 'scale-110';
          }
        }

        return (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-75 ${colorClass} ${scaleClass}`}
          />
        );
      })}
    </div>
  );
}
