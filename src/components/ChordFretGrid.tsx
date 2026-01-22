/**
 * ChordFretGrid - Interactive fretboard for custom chord creation
 */

import { useState, useCallback } from 'react';

interface ChordFretGridProps {
  /** Initial fret values [E, A, D, G, B, e]. 0=open, null=muted, 1-5=fret */
  initialFrets?: (number | null)[];
  /** Number of frets to display (default: 5) */
  fretCount?: number;
  /** Base fret (for higher positions, default: 1) */
  baseFret?: number;
  /** Callback when frets change */
  onChange?: (frets: (number | null)[]) => void;
  /** Read-only mode */
  disabled?: boolean;
}

// String names from low to high
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];

type FretState = number | null; // null = muted, 0 = open, 1-5 = fret position

export function ChordFretGrid({
  initialFrets = [null, null, null, null, null, null],
  fretCount = 5,
  baseFret = 1,
  onChange,
  disabled = false,
}: ChordFretGridProps): JSX.Element {
  const [frets, setFrets] = useState<FretState[]>(initialFrets);

  const handleCellClick = useCallback(
    (stringIndex: number, fretIndex: number) => {
      if (disabled) return;

      setFrets((prev) => {
        const newFrets = [...prev];
        const currentValue = newFrets[stringIndex];

        if (fretIndex === 0) {
          // Open/mute column: toggle between open (0) and muted (null)
          newFrets[stringIndex] = currentValue === 0 ? null : 0;
        } else {
          // Fret column: set to this fret, or clear if already set
          const fretValue = fretIndex + baseFret - 1;
          newFrets[stringIndex] = currentValue === fretValue ? null : fretValue;
        }

        onChange?.(newFrets);
        return newFrets;
      });
    },
    [disabled, onChange, baseFret]
  );

  function getCellDisplay(
    stringIndex: number,
    fretIndex: number
  ): 'open' | 'muted' | 'pressed' | 'empty' {
    const value = frets[stringIndex];

    if (fretIndex === 0) {
      if (value === 0) return 'open';
      if (value === null) return 'muted';
      return 'empty';
    }

    const fretValue = fretIndex + baseFret - 1;
    if (value === fretValue) return 'pressed';
    return 'empty';
  }

  function renderOpenMuteCell(stringIndex: number): JSX.Element {
    const display = getCellDisplay(stringIndex, 0);
    const isActive = display === 'open' || display === 'muted';

    const baseClasses =
      'w-8 h-7 flex items-center justify-center rounded border transition-all';
    const stateClasses = isActive
      ? 'border-primary/50 bg-primary/10'
      : 'border-border/50 bg-background/50';
    const interactionClasses = disabled
      ? 'cursor-not-allowed opacity-50'
      : 'cursor-pointer hover:bg-primary/10';

    return (
      <button
        type="button"
        onClick={() => handleCellClick(stringIndex, 0)}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${interactionClasses}`}
      >
        {display === 'open' && <span className="text-accent-green text-lg">&#9675;</span>}
        {display === 'muted' && (
          <span className="text-accent-red text-sm font-bold">&times;</span>
        )}
      </button>
    );
  }

  function renderFretCell(stringIndex: number, fretIndex: number): JSX.Element {
    const display = getCellDisplay(stringIndex, fretIndex + 1);
    const isPressed = display === 'pressed';
    const isFirstFret = fretIndex === 0;

    const baseClasses =
      'w-8 h-7 flex items-center justify-center border-r border-border/30 transition-all';
    const firstFretClass = isFirstFret ? 'border-l-2 border-l-text-muted' : '';
    const pressedClass = isPressed ? 'bg-primary/30' : 'bg-background/30';
    const interactionClasses = disabled
      ? 'cursor-not-allowed opacity-50'
      : 'cursor-pointer hover:bg-primary/20';

    return (
      <button
        key={fretIndex}
        type="button"
        onClick={() => handleCellClick(stringIndex, fretIndex + 1)}
        disabled={disabled}
        className={`${baseClasses} ${firstFretClass} ${pressedClass} ${interactionClasses}`}
      >
        {isPressed && (
          <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
            ●
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="select-none">
      {/* Header row with fret numbers */}
      <div className="flex items-center gap-0.5 mb-1">
        <div className="w-8 text-center text-xs text-text-muted">弦</div>
        <div className="w-8 text-center text-xs text-text-muted">開/×</div>
        {Array.from({ length: fretCount }, (_, i) => (
          <div key={i} className="w-8 text-center text-xs text-text-muted">
            {i + baseFret}f
          </div>
        ))}
      </div>

      {/* String rows */}
      {STRING_NAMES.map((stringName, stringIndex) => (
        <div key={stringIndex} className="flex items-center gap-0.5 h-8">
          {/* String name */}
          <div className="w-8 text-center text-sm font-medium text-text-secondary">
            {stringName}
          </div>

          {/* Open/mute cell */}
          {renderOpenMuteCell(stringIndex)}

          {/* Fret cells */}
          {Array.from({ length: fretCount }, (_, fretIndex) =>
            renderFretCell(stringIndex, fretIndex)
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <span className="text-accent-green">&#9675;</span>
          <span>開放弦</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-accent-red font-bold">&times;</span>
          <span>ミュート</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          <span>押さえる</span>
        </div>
      </div>
    </div>
  );
}

export default ChordFretGrid;
