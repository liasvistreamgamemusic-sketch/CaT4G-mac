import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Music } from 'lucide-react';
import type { ExtendedChordPosition } from '@/types/database';
import { ChordDiagramHorizontal } from '@/components/ChordDiagramHorizontal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { generateChordFingerings } from '@/lib/chords';
import { transposeChord } from '@/lib/chords/transpose';
import type { ChordFingering } from '@/lib/chords/types';

// Editor state for a single line
interface EditableLine {
  id?: string;
  lyrics: string;
  chords: ExtendedChordPosition[];
  memo?: string;  // 行レベルのメモ/注釈
  measures?: number;  // 小節数（デフォルト: 4）
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
  // 移調量（表示用）
  transpose?: number;
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
  transpose = 0,
}: LineEditorProps) {
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null);
  const [dragState, setDragState] = useState<ChordDragState | null>(null);
  const [dragPreviewPosition, setDragPreviewPosition] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const chordAreaRef = useRef<HTMLDivElement>(null);
  const lyricsRef = useRef<HTMLInputElement>(null);
  const hasSpreadRef = useRef<string | null>(null); // Track if we've spread chords for this line

  // Character width for position calculations (monospace font with letter-spacing)
  // Must match the actual rendered width of characters in the lyrics input
  // Increased from 14 to 22 for better chord placement spacing
  const CHAR_WIDTH = 22;

  // Chord component width in pixels (varies by display mode)
  // xs diagram is 72x48, with small padding = 76px for diagram mode
  const CHORD_COMPONENT_WIDTH = showDiagram ? 76 : 52;

  // Maximum component width (diagram mode) - used for spacing calculations
  // This ensures chords positioned in compact mode won't overlap when switching to standard mode
  const MAX_CHORD_COMPONENT_WIDTH = 76;

  // Minimum chord spacing (in character positions) to prevent diagram overlap
  // Use exact ratio to allow adjacent placement (touching) with half-position snapping
  // 76px / 22px = 3.45 positions - allows chords at positions like 0 and 3.5 to touch
  const MIN_CHORD_SPACING = MAX_CHORD_COMPONENT_WIDTH / CHAR_WIDTH;

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
  // Use transposed chord name for correct fingering display
  const chordFingerings = useMemo(() => {
    const fingerings: Record<number, ChordFingering | null> = {};
    line.chords.forEach((chord, index) => {
      // Generate all fingerings for the transposed chord
      const transposedChordName = transpose !== 0 ? transposeChord(chord.chord, transpose) : chord.chord;
      const allFingerings = generateChordFingerings(transposedChordName);

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
  }, [line.chords, transpose]);

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
        case 'Backspace': {
          e.preventDefault();
          // Remove the chord
          const filteredChords = line.chords.filter((_, idx) => idx !== chordIndex);
          onLineChange({ chords: filteredChords });
          setSelectedChordIndex(null);
          return;
        }
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
  // NOTE: Don't call preventDefault here - it interferes with click/double-click detection
  const handleChordMouseDown = useCallback(
    (e: React.MouseEvent, chordIndex: number) => {
      const chord = line.chords[chordIndex];
      if (!chord) return;

      // Only left mouse button
      if (e.button !== 0) return;

      // テキスト選択を防止（ドラッグ開始時）
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';

      // Store initial click position - we use pure delta-based movement
      // so the chord stays where it is and moves based on mouse delta
      setDragState({
        chordIndex,
        initialPosition: chord.position,
        startX: e.clientX,
        startY: e.clientY,
        clickOffset: 0,
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

  /**
   * 方向認識型の最近接空き位置を探す
   * 他のコードは一切動かさず、ドラッグしているコードのみを配置
   *
   * ロジック:
   * - 衝突なし → そのまま配置
   * - 衝突あり、左側に配置しようとした → 左方向で空きを探す → 一番右の空き（右詰め）
   * - 衝突あり、右側に配置しようとした → 右方向で空きを探す → 一番左の空き（左詰め）
   * - 空きがない場合 → 歌詞の右端外に配置
   */
  const findNearestEmptyPosition = useCallback((
    chords: ExtendedChordPosition[],
    movedChordIndex: number,
    targetPosition: number,
    minSpacing: number,
    lyricsLength: number
  ): ExtendedChordPosition[] => {
    // 移動するコード以外のコードリスト
    const otherChords = chords.filter((_, idx) => idx !== movedChordIndex);

    // 位置が空いているかチェック（minSpacing分の幅を考慮）
    // 位置Pに配置すると[P, P+minSpacing)を占有
    // コードCは[C.position, C.position+minSpacing)を占有
    // 重なる条件: P < C.position + minSpacing AND P + minSpacing > C.position
    const isPositionFree = (pos: number): boolean => {
      return !otherChords.some(c =>
        pos < c.position + minSpacing && pos + minSpacing > c.position
      );
    };

    // 衝突しているコードを探す
    const findOverlappingChord = (): ExtendedChordPosition | null => {
      return otherChords.find(c =>
        targetPosition < c.position + minSpacing && targetPosition + minSpacing > c.position
      ) || null;
    };

    const overlappingChord = findOverlappingChord();

    let finalPosition: number = targetPosition;

    if (!overlappingChord) {
      // 衝突なし → そのまま配置
      finalPosition = targetPosition;
    } else {
      // 衝突あり → 方向に応じて空き位置を探す
      const isLeftOfOverlap = targetPosition < overlappingChord.position;

      // Use 0.5 step increments to support half-position snapping (0, 0.5, 1, 1.5, ...)
      const STEP = 0.5;

      if (isLeftOfOverlap) {
        // 左側に配置しようとした → 左方向優先で探す → 一番右の空き（右詰め）
        // targetPositionから0に向かって探索、最初に見つかった空きが「一番右」
        let found = false;
        const startLeft = Math.floor(targetPosition * 2) / 2; // Round down to nearest 0.5
        for (let pos = startLeft; pos >= 0; pos -= STEP) {
          if (isPositionFree(pos)) {
            finalPosition = pos;
            found = true;
            break;
          }
        }
        // 左になければ右を探す（フォールバック）
        if (!found) {
          const startRight = Math.ceil(targetPosition * 2) / 2 + STEP; // Round up to nearest 0.5, then +0.5
          for (let pos = startRight; pos <= lyricsLength + 50; pos += STEP) {
            if (isPositionFree(pos)) {
              finalPosition = pos;
              found = true;
              break;
            }
          }
        }
        // それでも見つからなければ歌詞の右端外
        if (!found) {
          finalPosition = lyricsLength + 1;
        }
      } else {
        // 右側に配置しようとした → 右方向で探す → 一番左の空き（左詰め）
        // 衝突コードの右端から右に向かって探索
        let found = false;
        // Calculate exact minimum position (adjacent placement)
        const exactMinPos = overlappingChord.position + minSpacing;
        // Round up to nearest 0.5 for snap position
        const startPos = Math.ceil(exactMinPos * 2) / 2;
        for (let pos = startPos; pos <= lyricsLength + 50; pos += STEP) {
          if (isPositionFree(pos)) {
            finalPosition = pos;
            found = true;
            break;
          }
        }
        // 見つからなければ歌詞の右端外
        if (!found) {
          finalPosition = lyricsLength + 1;
        }
      }
    }

    // 位置を0以上に制限
    finalPosition = Math.max(0, finalPosition);

    // 更新されたコード配列を返す（移動したコードのみ位置変更）
    const updatedChords = chords.map((chord, idx) =>
      idx === movedChordIndex ? { ...chord, position: finalPosition } : chord
    );

    // 位置でソート
    return updatedChords.sort((a, b) => a.position - b.position);
  }, []);

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
      // テキスト選択防止を解除
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';

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
            // Find the nearest empty position for the chord (other chords don't move)
            const updatedChords = findNearestEmptyPosition(line.chords, dragState.chordIndex, snappedPosition, MIN_CHORD_SPACING, line.lyrics.length);
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
  }, [dragState, line.chords, line.lyrics.length, onLineChange, calculateDragPosition, findNearestEmptyPosition, onMoveChordToLine, canMoveUp, canMoveDown, MIN_CHORD_SPACING]);

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

  // minWidth: based on content, no upper cap (scroll handles overflow)
  const minChars = Math.max(30, maxPosition + 5);

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
          style={{ minWidth: `${minChars}ch` }}
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
            // Use fixed pixel width for consistent spacing calculations
            const componentWidth = isMinimalMode ? 'auto' : `${CHORD_COMPONENT_WIDTH}px`;
            const componentMinHeight = isMinimalMode ? '28px' : (showDiagram ? '72px' : '36px');

            // Calculate position in pixels (for precise alignment with lyrics)
            const positionPx = chord.position * CHAR_WIDTH;
            const previewPositionPx = dragPreviewPosition !== null ? dragPreviewPosition * CHAR_WIDTH : positionPx;

            return (
              <div
                key={chordIndex}
                data-chord-element="true"
                className={`absolute top-0 flex flex-col cursor-grab select-none
                  border border-white/10 rounded bg-background-surface/50 p-1
                  hover:border-accent-primary/30 transition-colors
                  overflow-visible
                  ${isActuallyMoving ? 'cursor-grabbing opacity-70 border-accent-primary/50' : ''}
                  ${isSelected ? 'border-accent-primary/50 bg-accent-primary/5' : ''}
                  ${canMoveToDirection ? 'border-green-500 bg-green-500/20 opacity-90' : ''}
                  ${isMovingToAnotherLine && !canMoveToDirection ? 'border-red-500/50 opacity-50' : ''}`}
                style={{
                  left: `${isActuallyMoving ? previewPositionPx : positionPx}px`,
                  width: componentWidth,
                  minHeight: componentMinHeight,
                }}
                onMouseDown={(e) => handleChordMouseDown(e, chordIndex)}
                onClick={(e) => handleChordClick(e, chordIndex)}
                onDoubleClick={(e) => handleChordDoubleClick(e, chordIndex)}
                onKeyDown={(e) => handleChordKeyDown(e, chordIndex)}
                tabIndex={0}
                title={`${transpose !== 0 ? transposeChord(chord.chord, transpose) : chord.chord}${chord.annotation ? `\n${chord.annotation}` : ''} (ダブルクリックで編集)`}
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
                    {transpose !== 0 ? transposeChord(chord.chord, transpose) : chord.chord}
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
                  <div className="flex items-center justify-center flex-shrink-0" style={{ height: '56px' }}>
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

                {/* Vertical alignment guide line - connects chord box left edge to lyrics position */}
                <div
                  className="absolute w-0.5 bg-accent-primary/50 pointer-events-none rounded-full"
                  style={{
                    left: '0px',
                    top: '100%',
                    height: showDiagram ? '24px' : '12px',
                  }}
                />
                {/* Bottom anchor point indicator */}
                <div
                  className="absolute w-2 h-2 bg-accent-primary/60 rounded-full pointer-events-none"
                  style={{
                    left: '-3px',
                    top: `calc(100% + ${showDiagram ? '22px' : '10px'})`,
                  }}
                />
              </div>
            );
          })}

          {/* Drag position indicator line (shows target position) */}
          {dragState?.isDragging && dragPreviewPosition !== null && (
            <div
              className="absolute top-0 h-full w-0.5 bg-accent-primary/60 pointer-events-none z-10"
              style={{ left: `${dragPreviewPosition * CHAR_WIDTH}px` }}
            />
          )}

          {/* Empty state hint */}
          {line.chords.length === 0 && (
            <span className="text-text-muted/50 text-xs pointer-events-none">
              ダブルクリックでコードを追加
            </span>
          )}
        </div>

        {/* Lyrics Line - simplified, no overlapping text */}
        <div className="relative">
          {/* Lyrics input */}
          <div className="relative">
            {/* Underline markers for chord positions (overlay) */}
            <div
              className="absolute inset-0 pointer-events-none px-3 py-1.5"
              style={{ fontFamily: 'monospace', fontSize: '0.875rem', letterSpacing: '0.35em' }}
            >
              {line.chords.map((chord, chordIndex) => {
                const pos = chord.position;
                // Only show underline for positions within lyrics
                if (pos >= line.lyrics.length) return null;
                return (
                  <span
                    key={chordIndex}
                    className="absolute bottom-1 h-0.5 bg-accent-primary/60 rounded-full"
                    style={{
                      left: `calc(12px + ${pos * CHAR_WIDTH}px)`,
                      width: `${CHAR_WIDTH}px`,
                    }}
                  />
                );
              })}
            </div>
            <input
              ref={lyricsRef}
              type="text"
              value={line.lyrics}
              onChange={handleLyricsChange}
              className="w-full bg-[#1a1a25] border border-white/10 rounded-b px-3 py-1.5 text-sm font-mono text-white tracking-wider focus:outline-none focus:border-primary transition-colors"
              style={{ letterSpacing: '0.35em' }}
              placeholder="歌詞を入力..."
            />
          </div>

          {/* Position label during drag */}
          {dragState?.isDragging && dragPreviewPosition !== null && (
            <div className="absolute -top-6 right-0 text-xs text-white bg-accent-primary px-2 py-0.5 rounded shadow-lg z-20">
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

        {/* 行メモ + 小節数 - hover時のみ表示される追加ボタン、または入力済みの場合は常に表示 */}
        <div className="flex items-center gap-3 mt-1 min-h-[24px]">
          {/* 小節数入力 (コンパクト) */}
          <div className="flex items-center gap-1 shrink-0">
            <Music className="w-3 h-3 text-text-muted" />
            <button
              type="button"
              onClick={() => {
                const current = line.measures ?? 4;
                if (current > 1) onLineChange({ measures: current - 1 });
              }}
              disabled={(line.measures ?? 4) <= 1}
              className="w-5 h-5 flex items-center justify-center text-xs text-text-muted
                       hover:text-text-primary hover:bg-white/10 rounded
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="小節数を減らす"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-mono text-text-secondary" title="小節数">
              {line.measures ?? 4}
            </span>
            <button
              type="button"
              onClick={() => {
                const current = line.measures ?? 4;
                if (current < 16) onLineChange({ measures: current + 1 });
              }}
              disabled={(line.measures ?? 4) >= 16}
              className="w-5 h-5 flex items-center justify-center text-xs text-text-muted
                       hover:text-text-primary hover:bg-white/10 rounded
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="小節数を増やす"
            >
              +
            </button>
            <span className="text-[10px] text-text-muted">小節</span>
          </div>

          {/* 区切り */}
          <div className="w-px h-4 bg-white/10" />

          {/* メモ */}
          {line.memo !== undefined ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={line.memo}
                onChange={(e) => onLineChange({ memo: e.target.value })}
                className="flex-1 text-xs text-yellow-400 bg-yellow-500/10 rounded px-2 py-1
                         border border-yellow-500/20 focus:outline-none focus:border-yellow-500/50"
                placeholder="行のメモを入力..."
              />
              <button
                type="button"
                onClick={() => onLineChange({ memo: undefined })}
                className="text-xs text-red-400 hover:text-red-300 px-1"
                title="メモを削除"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onLineChange({ memo: '' })}
              className="text-xs text-text-muted hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              + メモを追加
            </button>
          )}
        </div>

      </div>

      {/* Delete Line Button */}
      <button
        type="button"
        onClick={() => setShowDeleteConfirm(true)}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="行を削除"
        message={line.lyrics ? `「${line.lyrics.substring(0, 20)}${line.lyrics.length > 20 ? '...' : ''}」を削除しますか？` : 'この行を削除しますか？'}
        confirmLabel="削除"
        cancelLabel="キャンセル"
        variant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

// Export types for use in other components
export type { EditableLine };
