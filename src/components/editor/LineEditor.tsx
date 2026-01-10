import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { ExtendedChordPosition } from '@/types/database';
import { ChordDiagramHorizontal } from '@/components/ChordDiagramHorizontal';
import { generateChordFingerings } from '@/lib/chords';
import type { ChordFingering } from '@/lib/chords/types';

// Editor state for a single line
interface EditableLine {
  id?: string;
  lyrics: string;
  chords: ExtendedChordPosition[];
}

// Drag state for chord position adjustment (mouse-based for smooth sliding)
interface ChordDragState {
  chordIndex: number;
  initialPosition: number;
  startX: number;
  startY: number;
  // Offset from click position to chord's left edge (for cursor tracking)
  clickOffset: number;
  isDragging: boolean;
  // Track vertical movement for cross-line dragging
  verticalDirection: 'up' | 'down' | null;
}

interface LineEditorProps {
  line: EditableLine;
  lineIndex: number;
  onLineChange: (updates: Partial<EditableLine>) => void;
  onDelete: () => void;
  onChordClick?: (chordIndex: number, chord: ExtendedChordPosition) => void;
  onAddChord?: (position: number) => void;
  // Move chord to adjacent line (up/down between lines)
  onMoveChordToLine?: (direction: 'up' | 'down', chordIndex: number, chord: ExtendedChordPosition) => void;
  // Whether moving up/down is possible (for disabling arrow key hints)
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  // Display toggle settings for chord components
  showDiagram?: boolean;        // 押さえ方の図
  showPlayingMethod?: boolean;  // 引き方 (ストローク/アルペジオパターン)
  showMemo?: boolean;           // メモ
}

/**
 * 行編集コンポーネント
 * 歌詞の入力とコードの配置・編集を行う
 * - コード追加: コード表示エリアの余白をダブルクリック
 * - コード編集: コードをダブルクリックで編集モーダルを開く
 * - コード位置調整: ドラッグまたは←→キー（コード同士は重ならない）
 * - コード削除: Del/Backspaceキー
 * - 押さえ方ダイアグラムを常に表示
 */
export function LineEditor({
  line,
  lineIndex: _lineIndex,
  onLineChange,
  onDelete,
  onChordClick,
  onAddChord,
  onMoveChordToLine,
  canMoveUp = false,
  canMoveDown = false,
  showDiagram = true,
  showPlayingMethod = true,
  showMemo = true,
}: LineEditorProps) {
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null);
  const [dragState, setDragState] = useState<ChordDragState | null>(null);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<number | null>(null);
  const chordAreaRef = useRef<HTMLDivElement>(null);
  const lyricsRef = useRef<HTMLInputElement>(null);
  const hasSpreadRef = useRef<string | null>(null); // Track if we've spread chords for this line

  // Character width for position calculations (monospace font with letter-spacing)
  // Increased for better readability of Japanese text and to prevent chord overlap
  const CHAR_WIDTH = 14;

  // Minimum chord spacing (in character positions) to prevent diagram overlap
  // When diagram is shown: 80px component width. With CHAR_WIDTH = 14px, 80/14 ≈ 5.7 chars
  // When diagram is hidden (minimal mode): smaller spacing
  // Using 6 chars ensures chord frames don't overlap when diagram is shown
  const MIN_CHORD_SPACING = showDiagram ? 6 : 3;

  // Find the nearest snap position for a given continuous position within lyrics
  // Snap positions: 0, 0.5, 1, 1.5, ... (before/center of each character)
  // Returns rounded integer position if beyond lyrics (allow free movement)
  const findNearestSnapPosition = useCallback((position: number, lyricsLength: number): number => {
    // Beyond lyrics: allow free positioning (round to integer)
    if (position >= lyricsLength) {
      return Math.round(position);
    }

    // Within lyrics: snap to nearest before/center/after position
    // Snap positions are: 0, 0.5, 1, 1.5, 2, 2.5, ... (lyricsLength - 0.5), lyricsLength
    const nearestHalf = Math.round(position * 2) / 2;

    // Clamp to valid range (0 to lyricsLength)
    return Math.max(0, Math.min(lyricsLength, nearestHalf));
  }, []);

  /**
   * Spread out chords that are overlapping.
   * Ensures minimum spacing between adjacent chords.
   * Returns new chord array if changes were made, null if no changes needed.
   */
  const spreadOverlappingChords = useCallback((chords: ExtendedChordPosition[]): ExtendedChordPosition[] | null => {
    if (chords.length <= 1) return null;

    // Sort by position first
    const sorted = [...chords].sort((a, b) => a.position - b.position);
    let needsUpdate = false;
    const result: ExtendedChordPosition[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const chord = sorted[i];
      if (i === 0) {
        result.push({ ...chord });
      } else {
        const prevChord = result[i - 1];
        const minPosition = prevChord.position + MIN_CHORD_SPACING;

        if (chord.position < minPosition) {
          // This chord is too close to previous - push it right
          result.push({ ...chord, position: minPosition });
          needsUpdate = true;
        } else {
          result.push({ ...chord });
        }
      }
    }

    return needsUpdate ? result : null;
  }, [MIN_CHORD_SPACING]);

  // Generate chord fingerings for display (cached per chord)
  // Always use generateChordFingerings which can dynamically generate fingerings for any chord
  const chordFingerings = useMemo(() => {
    const fingerings: Record<number, ChordFingering | null> = {};
    line.chords.forEach((chord, index) => {
      // Generate all fingerings for this chord (handles any chord name)
      const allFingerings = generateChordFingerings(chord.chord);

      if (chord.voicingId) {
        // If voicingId is set, find that specific fingering
        const selected = allFingerings.find(f => f.id === chord.voicingId);
        fingerings[index] = selected || allFingerings[0] || null;
      } else {
        // Use the first (default) generated fingering
        fingerings[index] = allFingerings[0] || null;
      }
    });
    return fingerings;
  }, [line.chords]);

  // Reset states when line changes
  useEffect(() => {
    setSelectedChordIndex(null);
    setDragState(null);
    setDragPreviewPosition(null);
  }, [line.id]);

  // Auto-spread overlapping chords on initial load
  // This fixes the issue where imported songs have chords at overlapping positions
  useEffect(() => {
    // Use line.id as the key (stable identifier)
    const lineKey = line.id || 'new';

    // Only spread once per line (not on every chord change to avoid infinite loops)
    if (hasSpreadRef.current === lineKey) return;
    hasSpreadRef.current = lineKey;

    const spreadChords = spreadOverlappingChords(line.chords);
    if (spreadChords) {
      // Chords need to be spread out to prevent overlap
      onLineChange({ chords: spreadChords });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.id]); // Intentionally only depend on line.id to run once per line

  // Parse inline chord markers [ChordName] from lyrics
  // Returns { cleanLyrics: string, newChords: ExtendedChordPosition[] }
  const parseInlineChords = useCallback((lyrics: string, existingChords: ExtendedChordPosition[]) => {
    const chordMarkerRegex = /\[([A-Ga-g][#b♯♭]?(?:m|maj|min|aug|dim|sus|add|7|9|11|13|\/[A-Ga-g][#b♯♭]?)*)\]/g;
    const newChords: ExtendedChordPosition[] = [...existingChords];
    let cleanLyrics = '';
    let lastIndex = 0;
    let match;

    while ((match = chordMarkerRegex.exec(lyrics)) !== null) {
      // Add text before the match to cleanLyrics
      cleanLyrics += lyrics.slice(lastIndex, match.index);

      // The position is where the chord marker starts (in clean lyrics)
      const position = cleanLyrics.length;
      const chordName = match[1];

      // Check if a chord already exists at this position
      const existsAtPosition = newChords.some(c => c.position === position && c.chord === chordName);

      if (!existsAtPosition) {
        newChords.push({
          chord: chordName,
          position: position,
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    cleanLyrics += lyrics.slice(lastIndex);

    // Sort chords by position
    newChords.sort((a, b) => a.position - b.position);

    return { cleanLyrics, newChords };
  }, []);

  // Handle lyrics change with inline chord parsing
  const handleLyricsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLyrics = e.target.value;

    // Check if there are inline chord markers
    if (/\[[A-Ga-g][#b♯♭]?(?:m|maj|min|aug|dim|sus|add|7|9|11|13|\/[A-Ga-g][#b♯♭]?)*\]/.test(newLyrics)) {
      // Parse inline chords
      const { cleanLyrics, newChords } = parseInlineChords(newLyrics, line.chords);
      onLineChange({ lyrics: cleanLyrics, chords: newChords });
    } else {
      // No inline chords, just update lyrics
      onLineChange({ lyrics: newLyrics });
    }
  }, [line.chords, parseInlineChords, onLineChange]);

  // Handle click on chord area - deselect chord
  const handleChordAreaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!(e.target as HTMLElement).closest('button, input') && !dragState) {
        setSelectedChordIndex(null);
      }
    },
    [dragState]
  );

  // Handle double-click on empty space in chord area to add new chord
  const handleChordAreaDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only trigger if clicking on empty space (not on a chord element)
      const target = e.target as HTMLElement;
      if (target.closest('[data-chord-element]')) {
        return; // Clicked on a chord, not empty space
      }

      if (!chordAreaRef.current) return;

      // Calculate position from click coordinates
      const rect = chordAreaRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      // Account for padding (8px = px-2)
      const adjustedX = clickX - 8;
      const position = Math.max(0, Math.floor(adjustedX / CHAR_WIDTH));

      // Call onAddChord with the calculated position
      if (onAddChord) {
        onAddChord(position);
      }
    },
    [onAddChord, CHAR_WIDTH]
  );

  // Handle chord position adjustment via keyboard
  const handleChordKeyDown = useCallback(
    (e: React.KeyboardEvent, chordIndex: number) => {
      const chord = line.chords[chordIndex];
      if (!chord) return;

      let newPosition = chord.position;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newPosition = Math.max(0, chord.position - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newPosition = chord.position + 1;
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Move chord to previous line (if available)
          if (canMoveUp && onMoveChordToLine) {
            // Remove chord from current line
            const filteredChords = line.chords.filter((_, idx) => idx !== chordIndex);
            onLineChange({ chords: filteredChords });
            // Add chord to previous line
            onMoveChordToLine('up', chordIndex, chord);
            setSelectedChordIndex(null);
          }
          return;
        case 'ArrowDown':
          e.preventDefault();
          // Move chord to next line (if available)
          if (canMoveDown && onMoveChordToLine) {
            // Remove chord from current line
            const filteredChords = line.chords.filter((_, idx) => idx !== chordIndex);
            onLineChange({ chords: filteredChords });
            // Add chord to next line
            onMoveChordToLine('down', chordIndex, chord);
            setSelectedChordIndex(null);
          }
          return;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          // Remove the chord
          const filteredChords = line.chords.filter((_, idx) => idx !== chordIndex);
          onLineChange({ chords: filteredChords });
          setSelectedChordIndex(null);
          return;
        case 'Escape':
          e.preventDefault();
          setSelectedChordIndex(null);
          return;
        default:
          return;
      }

      if (newPosition !== chord.position) {
        const updatedChords = [...line.chords];
        updatedChords[chordIndex] = { ...chord, position: newPosition };
        // Re-sort by position
        updatedChords.sort((a, b) => a.position - b.position);
        onLineChange({ chords: updatedChords });
      }
    },
    [line.chords, onLineChange, canMoveUp, canMoveDown, onMoveChordToLine]
  );

  // Handle chord click for selection only (double-click opens editor)
  const handleChordClick = useCallback(
    (e: React.MouseEvent, chordIndex: number) => {
      e.stopPropagation();
      setSelectedChordIndex(chordIndex);
      // Single click only selects, doesn't open editor
    },
    []
  );

  // Handle chord double-click to open detailed editor
  const handleChordDoubleClick = useCallback(
    (e: React.MouseEvent, chordIndex: number) => {
      e.stopPropagation();
      e.preventDefault();
      setSelectedChordIndex(chordIndex);
      if (onChordClick) {
        onChordClick(chordIndex, line.chords[chordIndex]);
      }
    },
    [onChordClick, line.chords]
  );

  // Handle chord mouse down for smooth drag sliding
  // Uses the wrapper div as the draggable element (contains chord name + diagram)
  const handleChordMouseDown = useCallback(
    (e: React.MouseEvent, chordIndex: number) => {
      const chord = line.chords[chordIndex];
      if (!chord) return;

      e.preventDefault();
      e.stopPropagation();

      // Store initial click position - we use pure delta-based movement
      // so the chord stays where it is and moves based on mouse delta
      setDragState({
        chordIndex,
        initialPosition: chord.position,
        startX: e.clientX,
        startY: e.clientY,
        clickOffset: 0, // Not used in current implementation but kept for interface
        isDragging: true,
        verticalDirection: null,
      });
      // Don't set dragPreviewPosition yet - only set it when actual movement detected
      // This prevents the "left shift" bug on grab
    },
    [line.chords]
  );

  // Calculate position from cursor using delta-based movement for accurate tracking
  // Returns continuous (decimal) position for smooth movement preview
  const calculateDragPosition = useCallback((e: MouseEvent) => {
    if (!dragState) return null;

    // Calculate how many characters the mouse has moved since drag start (continuous)
    const deltaX = e.clientX - dragState.startX;
    const deltaChars = deltaX / CHAR_WIDTH;

    // New position is initial position + delta (ensuring non-negative)
    // Use continuous position for smooth preview during drag
    return Math.max(0, dragState.initialPosition + deltaChars);
  }, [dragState]);

  // Calculate snapped position from continuous position (used on drop)
  const calculateSnappedPosition = useCallback((continuousPosition: number): number => {
    const lyricsLength = line.lyrics.length;
    return findNearestSnapPosition(continuousPosition, lyricsLength);
  }, [line.lyrics.length, findNearestSnapPosition]);

  // Resolve chord overlap - chords should touch but not overlap
  // Uses MIN_CHORD_SPACING to account for chord diagram width
  const resolveChordOverlap = useCallback((
    chords: ExtendedChordPosition[],
    movedChordIndex: number,
    newPosition: number
  ): ExtendedChordPosition[] => {
    // Use MIN_CHORD_SPACING to determine chord width (diagram-based)
    const movedChordEnd = newPosition + MIN_CHORD_SPACING;

    // Check for overlapping chords and resolve - make them touch exactly
    const updatedChords = chords.map((chord, idx) => {
      if (idx === movedChordIndex) {
        return { ...chord, position: newPosition };
      }

      const chordEnd = chord.position + MIN_CHORD_SPACING;

      // Check if this chord's diagram would overlap with the moved chord's diagram
      const overlaps = (
        // This chord starts within the moved chord's diagram range
        (chord.position >= newPosition && chord.position < movedChordEnd) ||
        // This chord's diagram ends within the moved chord's diagram range
        (chordEnd > newPosition && chordEnd <= movedChordEnd) ||
        // This chord's diagram completely contains the moved chord's diagram
        (chord.position <= newPosition && chordEnd >= movedChordEnd)
      );

      if (overlaps) {
        // Move this chord to touch exactly (butt up against the moved chord)
        // Direction is based on where the new position is relative to the existing chord's center:
        // - If new position is LEFT of existing chord's center → push existing chord RIGHT
        // - If new position is RIGHT of existing chord's center → push existing chord LEFT
        const existingChordCenter = chord.position + MIN_CHORD_SPACING / 2;
        if (newPosition < existingChordCenter) {
          // New position is to the left of existing chord's center - push existing chord RIGHT
          return { ...chord, position: movedChordEnd };
        } else {
          // New position is to the right of existing chord's center - push existing chord LEFT
          const newOverlapPosition = Math.max(0, newPosition - MIN_CHORD_SPACING);
          return { ...chord, position: newOverlapPosition };
        }
      }

      return chord;
    });

    // Sort by position
    return updatedChords.sort((a, b) => a.position - b.position);
  }, [MIN_CHORD_SPACING]);

  // Minimum drag distance (in pixels) before we consider it a drag vs a click
  const DRAG_THRESHOLD = 3;
  // Vertical distance threshold for cross-line movement (in pixels)
  const VERTICAL_THRESHOLD = 60;

  // Handle mouse move for smooth chord sliding (uses document-level listener)
  useEffect(() => {
    if (!dragState?.isDragging) return;

    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      // Check horizontal movement
      const deltaX = Math.abs(e.clientX - dragState.startX);
      if (deltaX >= DRAG_THRESHOLD) {
        hasMoved = true;
        const newPosition = calculateDragPosition(e);
        if (newPosition !== null) {
          setDragPreviewPosition(newPosition);
        }
      }

      // Check vertical movement for cross-line dragging
      const deltaY = e.clientY - dragState.startY;
      if (Math.abs(deltaY) >= VERTICAL_THRESHOLD) {
        hasMoved = true;
        const direction = deltaY < 0 ? 'up' : 'down';
        if (dragState.verticalDirection !== direction) {
          setDragState(prev => prev ? { ...prev, verticalDirection: direction } : null);
        }
      } else if (dragState.verticalDirection !== null) {
        // Reset if back within threshold
        setDragState(prev => prev ? { ...prev, verticalDirection: null } : null);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!chordAreaRef.current || !dragState) {
        setDragState(null);
        setDragPreviewPosition(null);
        return;
      }

      const chord = line.chords[dragState.chordIndex];
      if (!chord) {
        setDragState(null);
        setDragPreviewPosition(null);
        return;
      }

      // Check for vertical cross-line movement first
      const deltaY = e.clientY - dragState.startY;
      if (Math.abs(deltaY) >= VERTICAL_THRESHOLD && onMoveChordToLine) {
        const direction = deltaY < 0 ? 'up' : 'down';
        const canMove = direction === 'up' ? canMoveUp : canMoveDown;

        if (canMove) {
          // Get horizontal position for the chord in the new line
          const newPosition = calculateDragPosition(e) ?? chord.position;
          const movedChord = { ...chord, position: newPosition };

          // Remove chord from current line
          const filteredChords = line.chords.filter((_, idx) => idx !== dragState.chordIndex);
          onLineChange({ chords: filteredChords });

          // Add chord to adjacent line
          onMoveChordToLine(direction, dragState.chordIndex, movedChord);

          setDragState(null);
          setDragPreviewPosition(null);
          return;
        }
      }

      // Only update position if mouse actually moved (dragged) horizontally
      const deltaX = Math.abs(e.clientX - dragState.startX);
      if (deltaX >= DRAG_THRESHOLD && hasMoved) {
        const continuousPosition = calculateDragPosition(e);

        if (continuousPosition !== null) {
          // Calculate snapped position (character-based within lyrics, free beyond)
          const snappedPosition = calculateSnappedPosition(continuousPosition);

          // Update chord position if changed
          if (snappedPosition !== chord.position) {
            // Resolve any overlapping chords
            const updatedChords = resolveChordOverlap(line.chords, dragState.chordIndex, snappedPosition);
            onLineChange({ chords: updatedChords });
          }
        }
      }
      // If not moved (just a click), don't change position - allows double-click to work

      setDragState(null);
      setDragPreviewPosition(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, line.chords, onLineChange, calculateDragPosition, resolveChordOverlap, onMoveChordToLine, canMoveUp, canMoveDown]);

  // Get method indicator for chord (short version for compact display)
  const getMethodIndicator = (chord: ExtendedChordPosition): string => {
    if (!chord.method) return '';
    if (chord.method === 'stroke') {
      return 'St';  // Short for Stroke
    }
    if (chord.method === 'arpeggio') {
      return 'Ar';  // Short for Arpeggio
    }
    return '';
  };

  // Get full pattern display string
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

  // Calculate max width based on lyrics length or max chord position
  const maxPosition = Math.max(
    line.lyrics.length,
    ...line.chords.map((c) => c.position + c.chord.length)
  );

  // Create a set of chord positions for quick lookup when rendering lyrics
  const chordPositions = useMemo(() => {
    const positions = new Map<number, ExtendedChordPosition>();
    line.chords.forEach((chord) => {
      const pos = Math.floor(chord.position);
      positions.set(pos, chord);
    });
    return positions;
  }, [line.chords]);

  return (
    <div className="flex items-start gap-2 group">
      <div className="flex-1 space-y-0">
        {/* Chord Line - with space for chord diagrams below (height adjusts based on display settings) */}
        <div
          ref={chordAreaRef}
          className={`relative font-mono text-sm cursor-crosshair bg-background-primary/30 rounded-t px-2 py-1 ${
            dragState?.isDragging ? 'bg-accent-primary/10' : ''
          } ${line.chords.length > 0 ? (showDiagram ? 'min-h-[6rem] pb-16' : 'min-h-[3rem] pb-8') : 'min-h-[2rem]'}`}
          onClick={handleChordAreaClick}
          onDoubleClick={handleChordAreaDoubleClick}
          style={{ minWidth: `${Math.max(20, maxPosition + 5)}ch` }}
          title="ダブルクリックでコードを追加"
        >
          {/* Existing chords - chord name, pattern, memo and diagram as single draggable unit */}
          {line.chords.map((chord, chordIndex) => {
            const isBeingDragged = dragState?.chordIndex === chordIndex;
            // Only show as "moving" when dragPreviewPosition is set (actual movement detected)
            const isActuallyMoving = isBeingDragged && dragPreviewPosition !== null;
            // Check if chord is being dragged to another line
            const isMovingToAnotherLine = isBeingDragged && dragState?.verticalDirection !== null;
            const canMoveToDirection = isMovingToAnotherLine &&
              ((dragState?.verticalDirection === 'up' && canMoveUp) ||
               (dragState?.verticalDirection === 'down' && canMoveDown));
            const fingering = chordFingerings[chordIndex];
            const methodIndicator = showPlayingMethod ? getMethodIndicator(chord) : '';
            const patternDisplay = showPlayingMethod ? getPatternDisplay(chord) : '';
            const isSelected = selectedChordIndex === chordIndex;
            // Check if there's additional content to show based on toggle settings
            const hasPattern = showPlayingMethod && patternDisplay.length > 0;
            const hasAnnotation = showMemo && chord.annotation && chord.annotation.trim().length > 0;

            // Calculate minimal mode: all toggles off = chord name only
            const isMinimalMode = !showDiagram && !showPlayingMethod && !showMemo;

            // Calculate component dimensions based on what's shown
            // Minimal: just chord name (~32px height, auto width)
            // With diagram: 80px width (reduced to prevent overlap), 80px min-height
            // Without diagram: smaller height
            const componentWidth = isMinimalMode ? 'auto' : '80px';
            const componentMinHeight = isMinimalMode ? '28px' : (showDiagram ? '80px' : '40px');

            return (
              <div
                key={chordIndex}
                data-chord-element="true"
                className={`absolute top-0 flex flex-col cursor-grab select-none
                  border border-white/10 rounded bg-background-surface/50 p-1
                  hover:border-accent-primary/30 transition-colors
                  overflow-hidden
                  ${isActuallyMoving ? 'cursor-grabbing opacity-70 border-accent-primary/50' : ''}
                  ${isSelected ? 'border-accent-primary/50 bg-accent-primary/5' : ''}
                  ${canMoveToDirection ? 'border-green-500 bg-green-500/20 opacity-90' : ''}
                  ${isMovingToAnotherLine && !canMoveToDirection ? 'border-red-500/50 opacity-50' : ''}`}
                style={{
                  left: `${isActuallyMoving ? dragPreviewPosition : chord.position}ch`,
                  width: componentWidth,
                  minHeight: componentMinHeight,
                }}
                onMouseDown={(e) => handleChordMouseDown(e, chordIndex)}
                onClick={(e) => handleChordClick(e, chordIndex)}
                onDoubleClick={(e) => handleChordDoubleClick(e, chordIndex)}
                onKeyDown={(e) => handleChordKeyDown(e, chordIndex)}
                tabIndex={0}
                title={`${chord.chord}${chord.annotation ? `\n${chord.annotation}` : ''} (ダブルクリックで編集)`}
              >
                {/* Header: Chord name + method badge */}
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`px-1 rounded transition-colors whitespace-nowrap text-sm font-semibold flex items-center ${
                      isSelected
                        ? 'bg-accent-primary/30 text-accent-hover ring-1 ring-accent-primary'
                        : 'hover:bg-accent-primary/20 text-accent-primary'
                    }`}
                  >
                    {chord.chord}
                  </div>
                  {methodIndicator && showPlayingMethod && (
                    <span className={`text-[8px] px-1 py-0.5 rounded ${
                      chord.method === 'stroke'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {methodIndicator}
                    </span>
                  )}
                </div>

                {/* Chord diagram - conditionally shown (compact size for inline display) */}
                {showDiagram && (
                  <div className="flex items-center justify-center flex-shrink-0" style={{ height: '40px' }}>
                    {fingering && (
                      <ChordDiagramHorizontal
                        fingering={fingering}
                        size="xs"
                        showFingers={false}
                      />
                    )}
                  </div>
                )}

                {/* Pattern display (stroke arrows or arpeggio order) - conditionally shown */}
                {hasPattern && (
                  <div className="text-[9px] text-center font-mono leading-tight truncate w-full px-0.5" title={patternDisplay}>
                    <span className={chord.method === 'stroke' ? 'text-purple-300' : 'text-green-300'}>
                      {patternDisplay.length > 12 ? patternDisplay.slice(0, 12) + '...' : patternDisplay}
                    </span>
                  </div>
                )}

                {/* Annotation/memo display - conditionally shown */}
                {hasAnnotation && (
                  <div className="text-[8px] text-yellow-400 leading-tight truncate w-full px-0.5 mt-0.5" title={chord.annotation}>
                    {chord.annotation!.length > 12 ? chord.annotation!.slice(0, 12) + '...' : chord.annotation}
                  </div>
                )}

                {/* Cross-line drag indicator arrow */}
                {canMoveToDirection && (
                  <div className={`absolute ${dragState?.verticalDirection === 'up' ? '-top-4' : '-bottom-4'} left-1/2 -translate-x-1/2 text-green-400 text-lg animate-bounce`}>
                    {dragState?.verticalDirection === 'up' ? '↑' : '↓'}
                  </div>
                )}

                {/* Vertical alignment guide line - connects chord box to lyrics position */}
                {!isActuallyMoving && (
                  <div
                    className="absolute w-0.5 bg-accent-primary/30 pointer-events-none"
                    style={{
                      left: '0px',
                      top: '100%',
                      height: showDiagram ? '32px' : '16px',
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* Drag position indicator line (shows target position) */}
          {dragState?.isDragging && dragPreviewPosition !== null && (
            <div
              className="absolute top-0 h-full w-0.5 bg-accent-primary/40 pointer-events-none z-10"
              style={{ left: `${dragPreviewPosition}ch` }}
            />
          )}

          {/* Empty state hint */}
          {line.chords.length === 0 && (
            <span className="text-text-muted/50 text-xs pointer-events-none">
              ダブルクリックでコードを追加
            </span>
          )}
        </div>

        {/* Lyrics Line with chord position markers */}
        <div className="relative">
          {/* Chord position markers overlay - shows small triangles above lyrics where chords are positioned */}
          {line.chords.length > 0 && !dragState?.isDragging && (
            <div
              className="absolute inset-0 pointer-events-none z-10 flex items-end px-3"
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            >
              {/* Render position markers for each chord */}
              {line.chords.map((chord, chordIndex) => {
                const pos = chord.position;
                return (
                  <div
                    key={chordIndex}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `calc(12px + ${pos * CHAR_WIDTH}px)`,
                      top: '-2px',
                    }}
                  >
                    {/* Small triangle marker pointing down to the character */}
                    <div
                      className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-accent-primary"
                      title={`${chord.chord} はここで弾く`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Drag position indicator - shows target position with underline */}
          {dragState?.isDragging && dragPreviewPosition !== null && (
            <div
              className="absolute inset-0 pointer-events-none z-10 flex items-center px-3"
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            >
              {/* Simple target position indicator */}
              <div className="flex relative">
                {line.lyrics.split('').map((char, index) => {
                  const snappedPos = calculateSnappedPosition(dragPreviewPosition);
                  const targetIndex = Math.floor(snappedPos);
                  const isTarget = index === targetIndex;

                  return (
                    <span
                      key={index}
                      className="relative"
                      style={{ width: `${CHAR_WIDTH}px`, textAlign: 'center' }}
                    >
                      {/* Highlight only target character with underline */}
                      {isTarget && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded" />
                      )}
                      {/* Character with clear styling */}
                      <span className={`relative z-10 ${isTarget ? 'text-accent-primary font-bold' : 'text-black'}`}>
                        {char}
                      </span>
                    </span>
                  );
                })}
                {/* Position beyond lyrics */}
                {dragPreviewPosition >= line.lyrics.length && (
                  <span
                    className="text-accent-primary font-bold ml-1"
                    style={{ marginLeft: `${Math.max(0, (dragPreviewPosition - line.lyrics.length) * CHAR_WIDTH)}px` }}
                  >
                    |
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Lyrics input with highlighted characters where chords are positioned */}
          <div className="relative">
            {/* Character-by-character lyrics display with chord position highlighting */}
            <div
              className="absolute inset-0 flex items-center px-3 pointer-events-none overflow-hidden"
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            >
              {line.lyrics.split('').map((char, index) => {
                const hasChord = chordPositions.has(index);
                return (
                  <span
                    key={index}
                    className={`relative inline-block ${hasChord ? 'text-accent-primary font-bold' : 'text-transparent'}`}
                    style={{ width: `${CHAR_WIDTH}px`, textAlign: 'center', letterSpacing: '0.1em' }}
                  >
                    {/* Underline marker for chord positions */}
                    {hasChord && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary/50 rounded" />
                    )}
                    {char}
                  </span>
                );
              })}
            </div>
            <input
              ref={lyricsRef}
              type="text"
              value={line.lyrics}
              onChange={handleLyricsChange}
              className="w-full bg-background-primary/50 border border-white/5 rounded-b px-3 py-1.5 text-sm font-mono text-black tracking-wider focus:outline-none focus:border-accent-primary transition-colors"
              style={{ letterSpacing: '0.1em' }}
              placeholder="歌詞を入力..."
            />
          </div>

          {/* Position label during drag */}
          {dragState?.isDragging && dragPreviewPosition !== null && (
            <div className="absolute -top-6 left-0 text-xs text-white bg-accent-primary px-2 py-0.5 rounded shadow-lg">
              {(() => {
                const snappedPos = calculateSnappedPosition(dragPreviewPosition);
                const isInLyrics = dragPreviewPosition < line.lyrics.length;

                if (isInLyrics) {
                  const charIndex = Math.floor(snappedPos);
                  const targetChar = line.lyrics[charIndex] || '';
                  return `位置: ${charIndex}「${targetChar}」`;
                } else {
                  return `位置: ${Math.round(snappedPos)}`;
                }
              })()}
            </div>
          )}
        </div>

      </div>

      {/* Delete Line Button */}
      <button
        type="button"
        onClick={onDelete}
        className="p-1 mt-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 rounded transition-opacity"
        title="行を削除"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

// Export types for use in other components
export type { EditableLine };
