import { useState, useEffect, useCallback, useMemo, type SetStateAction } from 'react';
import { getSongById, updateSong } from '@/lib/database';
import {
  SectionEditor,
  ChordEditor,
  EditorHeader,
  EditorSidebar,
} from '@/components/editor';
import { transposeChord } from '@/lib/chords/transpose';
import { useUndoRedo } from '@/hooks';
import type { EditableLine, EditableSection, ViewMode } from '@/components/editor';
import type {
  SongWithDetails,
  UpdateSongInput,
  UpdateSectionInput,
  UpdateLineInput,
  ExtendedChordPosition,
  TimeSignature,
} from '@/types/database';

interface SongEditorPageProps {
  songId: string;
  onClose: () => void;
  onSongUpdated?: () => void;
}

// Editor state for song metadata
interface EditableSongMetadata {
  title: string;
  artistName: string;
  bpm: string;
  timeSignature: TimeSignature;
  capo: number;
  transpose: number;  // -12 〜 +12
  notes: string;
}

// Editor state snapshot for undo/redo
interface EditorSnapshot {
  metadata: EditableSongMetadata;
  sections: EditableSection[];
}

// Initial state for editor
const INITIAL_EDITOR_STATE: EditorSnapshot = {
  metadata: {
    title: '',
    artistName: '',
    bpm: '',
    timeSignature: '4/4',
    capo: 0,
    transpose: 0,
    notes: '',
  },
  sections: [],
};

/**
 * 曲編集ページコンポーネント
 * フルページで曲のメタデータ、セクション、行を編集できる
 */
export function SongEditorPage({ songId, onClose, onSongUpdated }: SongEditorPageProps) {
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Original song data (for comparison to detect changes)
  const [originalSong, setOriginalSong] = useState<SongWithDetails | null>(null);

  // Editable state with undo/redo support
  const {
    state: editorState,
    setState: setEditorState,
    canUndo,
    canRedo,
    undo,
    redo,
    resetHistory,
  } = useUndoRedo<EditorSnapshot>(INITIAL_EDITOR_STATE, {
    maxHistory: 50,
    debounceMs: 300,
  });

  // Destructure for convenience
  const { metadata, sections } = editorState;

  // Wrapper setters for API compatibility with existing handlers
  const setMetadata = useCallback(
    (updater: SetStateAction<EditableSongMetadata>) => {
      setEditorState((prev) => ({
        ...prev,
        metadata: typeof updater === 'function' ? updater(prev.metadata) : updater,
      }));
    },
    [setEditorState]
  );

  const setSections = useCallback(
    (updater: SetStateAction<EditableSection[]>) => {
      setEditorState((prev) => ({
        ...prev,
        sections: typeof updater === 'function' ? updater(prev.sections) : updater,
      }));
    },
    [setEditorState]
  );

  // Collapse states
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  // ViewMode state (replaces individual showDiagram, showPlayingMethod, showMemo toggles)
  const [viewMode, setViewMode] = useState<ViewMode>('standard');

  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Capo change confirmation state
  const [capoChangeConfirm, setCapoChangeConfirm] = useState<{
    show: boolean;
    newCapo: number;
    delta: number;
  }>({ show: false, newCapo: 0, delta: 0 });

  // Derived display settings based on viewMode
  const showDiagram = viewMode !== 'compact';
  const showPlayingMethod = viewMode !== 'compact';
  const showMemo = viewMode === 'detailed';

  // Chord editor state
  // chordIndex: -1 means adding a new chord, >= 0 means editing existing
  const [editingChord, setEditingChord] = useState<{
    sectionIndex: number;
    lineIndex: number;
    chordIndex: number;  // -1 for new chord
    chord: ExtendedChordPosition;
  } | null>(null);

  // Unsaved changes confirmation dialog state
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Track if there are unsaved changes
  const hasChanges = useMemo(() => {
    if (!originalSong) return false;

    const song = originalSong.song;
    const artist = originalSong.artist;

    // Check metadata changes
    if (metadata.title !== song.title) return true;
    if (metadata.artistName !== (artist?.name ?? '')) return true;
    if (metadata.bpm !== (song.bpm?.toString() ?? '')) return true;
    if (metadata.timeSignature !== song.timeSignature) return true;
    if (metadata.capo !== song.capo) return true;
    if (metadata.transpose !== 0) return true;  // TODO: Compare with DB value when schema is updated
    if (metadata.notes !== (song.notes ?? '')) return true;

    // Check sections/lines changes (simplified comparison)
    if (sections.length !== originalSong.sections.length) return true;

    for (let i = 0; i < sections.length; i++) {
      const editSection = sections[i];
      const origSection = originalSong.sections[i];

      if (editSection.name !== origSection.section.name) return true;
      if (editSection.repeatCount !== origSection.section.repeatCount) return true;
      if (editSection.lines.length !== origSection.lines.length) return true;

      for (let j = 0; j < editSection.lines.length; j++) {
        const editLine = editSection.lines[j];
        const origLine = origSection.lines[j];

        if (editLine.lyrics !== origLine.lyrics) return true;
        if (JSON.stringify(editLine.chords) !== JSON.stringify(origLine.chords)) return true;
      }
    }

    return false;
  }, [originalSong, metadata, sections]);

  // Load song data
  useEffect(() => {
    async function loadSong() {
      setIsLoading(true);
      setError(null);

      try {
        const song = await getSongById(songId);
        if (!song) {
          setError('曲が見つかりませんでした');
          return;
        }

        setOriginalSong(song);

        // Initialize editor state and reset history
        const initialState: EditorSnapshot = {
          metadata: {
            title: song.song.title,
            artistName: song.artist?.name ?? '',
            bpm: song.song.bpm?.toString() ?? '',
            timeSignature: song.song.timeSignature,
            capo: song.song.capo,
            transpose: 0,  // TODO: Load from database when schema is updated
            notes: song.song.notes ?? '',
          },
          sections: song.sections.map((s) => ({
            id: s.section.id,
            name: s.section.name,
            repeatCount: s.section.repeatCount,
            lines: s.lines.map((l) => ({
              id: l.id,
              lyrics: l.lyrics,
              chords: l.chords as ExtendedChordPosition[],
            })),
          })),
        };
        resetHistory(initialState);
      } catch (err) {
        setError(err instanceof Error ? err.message : '読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    }

    loadSong();
  }, [songId, resetHistory]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!originalSong) return;

    setIsSaving(true);
    setError(null);

    try {
      const input: UpdateSongInput = {
        title: metadata.title,
        artistName: metadata.artistName || undefined,
        bpm: metadata.bpm ? parseInt(metadata.bpm, 10) : undefined,
        timeSignature: metadata.timeSignature,
        capo: metadata.capo,
        // TODO: Add transpose to UpdateSongInput when schema is updated
        notes: metadata.notes || undefined,
        sections: sections.map(
          (s): UpdateSectionInput => ({
            id: s.id,
            name: s.name,
            repeatCount: s.repeatCount,
            lines: s.lines.map(
              (l): UpdateLineInput => ({
                id: l.id,
                lyrics: l.lyrics,
                chords: l.chords,
              })
            ),
          })
        ),
      };

      await updateSong(songId, input);

      // Reload to get fresh data
      const updatedSong = await getSongById(songId);
      if (updatedSong) {
        setOriginalSong(updatedSong);
      }

      // Reset undo/redo history after successful save
      resetHistory();

      onSongUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  }, [songId, metadata, sections, originalSong, onSongUpdated, resetHistory]);

  // Handle close with unsaved changes confirmation
  const handleClose = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedDialog(true);
      return;
    }
    onClose();
  }, [hasChanges, onClose]);

  // Confirm discard and close
  const handleConfirmDiscard = useCallback(() => {
    setShowUnsavedDialog(false);
    onClose();
  }, [onClose]);

  // Cancel discard dialog
  const handleCancelDiscard = useCallback(() => {
    setShowUnsavedDialog(false);
  }, []);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+Z or Cmd+Z for undo, Ctrl+Shift+Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      // Ctrl+Y or Cmd+Y for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Section handlers
  const handleSectionChange = useCallback(
    (index: number, updates: Partial<EditableSection>) => {
      setSections((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], ...updates };
        return next;
      });
    },
    []
  );

  const handleAddSection = useCallback((insertAtIndex?: number) => {
    const newSection = { name: '新しいセクション', repeatCount: 1, lines: [] };
    setSections((prev) => {
      if (insertAtIndex !== undefined && insertAtIndex >= 0 && insertAtIndex <= prev.length) {
        const next = [...prev];
        next.splice(insertAtIndex, 0, newSection);
        return next;
      }
      return [...prev, newSection];
    });
  }, []);

  const handleDeleteSection = useCallback((index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleMoveSection = useCallback((index: number, direction: 'up' | 'down') => {
    setSections((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }, []);

  // Section collapse toggle handler
  const toggleSectionCollapse = useCallback((index: number) => {
    setCollapsedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  // Transpose all chords in all sections
  const transposeAllChords = useCallback((semitones: number) => {
    setSections((prev) => {
      return prev.map((section) => ({
        ...section,
        lines: section.lines.map((line) => ({
          ...line,
          chords: line.chords.map((chord) => ({
            ...chord,
            chord: transposeChord(chord.chord, semitones),
          })),
        })),
      }));
    });
  }, []);

  // Sidebar metadata change handler (for EditorSidebar)
  // Intercepts Capo changes to ask if chords should also be transposed
  const handleSidebarMetadataChange = useCallback((key: string, value: unknown) => {
    // Check if this is a Capo change and there are chords to transpose
    if (key === 'capo') {
      const newCapo = value as number;
      const delta = newCapo - metadata.capo;

      // Only show confirmation if there's a change and there are chords in the song
      const hasChords = sections.some((s) => s.lines.some((l) => l.chords.length > 0));

      if (delta !== 0 && hasChords) {
        setCapoChangeConfirm({ show: true, newCapo, delta });
        return; // Don't update yet - wait for confirmation
      }
    }

    setMetadata((prev) => ({
      ...prev,
      [key]: key === 'bpm' ? String(value ?? '') : value,
    }));
  }, [metadata.capo, sections]);

  // Handle Capo change with chord transpose
  const handleCapoChangeWithTranspose = useCallback(() => {
    const { newCapo, delta } = capoChangeConfirm;
    // Transpose chords in the OPPOSITE direction of capo change
    // Capo up = transpose down (to maintain same sounding pitch)
    transposeAllChords(-delta);
    setMetadata((prev) => ({ ...prev, capo: newCapo }));
    setCapoChangeConfirm({ show: false, newCapo: 0, delta: 0 });
  }, [capoChangeConfirm, transposeAllChords]);

  // Handle Capo change without chord transpose
  const handleCapoChangeOnly = useCallback(() => {
    const { newCapo } = capoChangeConfirm;
    setMetadata((prev) => ({ ...prev, capo: newCapo }));
    setCapoChangeConfirm({ show: false, newCapo: 0, delta: 0 });
  }, [capoChangeConfirm]);


  // Section click handler for sidebar navigation (scroll + expand)
  // Uses index-based IDs to handle both new (no id) and existing sections
  const handleSectionNavClick = useCallback((sectionId: string) => {
    const sectionIndex = parseInt(sectionId, 10);
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      // Expand if collapsed
      setCollapsedSections((prev) => ({ ...prev, [sectionIndex]: false }));
      // Scroll
      const element = document.getElementById(`section-${sectionIndex}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [sections.length]);

  const handleCopySection = useCallback((index: number) => {
    setSections((prev) => {
      const sectionToCopy = prev[index];
      // Deep copy the section with its lines and chords
      const copiedSection: EditableSection = {
        // Don't copy id - it's a new section
        name: sectionToCopy.name,
        repeatCount: sectionToCopy.repeatCount,
        lines: sectionToCopy.lines.map((line) => ({
          // Don't copy id - it's a new line
          lyrics: line.lyrics,
          chords: line.chords.map((chord) => ({ ...chord })),
        })),
      };
      // Insert the copy right after the original
      const next = [...prev];
      next.splice(index + 1, 0, copiedSection);
      return next;
    });
  }, []);

  // Line handlers
  const handleLineChange = useCallback(
    (sectionIndex: number, lineIndex: number, updates: Partial<EditableLine>) => {
      setSections((prev) => {
        const next = [...prev];
        const section = { ...next[sectionIndex] };
        const lines = [...section.lines];
        lines[lineIndex] = { ...lines[lineIndex], ...updates };
        section.lines = lines;
        next[sectionIndex] = section;
        return next;
      });
    },
    []
  );

  const handleAddLine = useCallback((sectionIndex: number, insertAtIndex?: number) => {
    setSections((prev) => {
      const next = [...prev];
      const section = { ...next[sectionIndex] };
      const newLine: EditableLine = { lyrics: '', chords: [] };

      if (insertAtIndex !== undefined && insertAtIndex >= 0) {
        // 指定位置に挿入
        const newLines = [...section.lines];
        newLines.splice(insertAtIndex, 0, newLine);
        section.lines = newLines;
      } else {
        // 末尾に追加（既存動作）
        section.lines = [...section.lines, newLine];
      }
      next[sectionIndex] = section;
      return next;
    });
  }, []);

  const handleDeleteLine = useCallback((sectionIndex: number, lineIndex: number) => {
    setSections((prev) => {
      const next = [...prev];
      const section = { ...next[sectionIndex] };
      section.lines = section.lines.filter((_, i) => i !== lineIndex);
      next[sectionIndex] = section;
      return next;
    });
  }, []);

  // Move chord between lines (within same section)
  // Spread overlapping chords to prevent visual overlap
  // Minimum spacing in character positions (matches LineEditor.MIN_CHORD_SPACING)
  // Reduced from 11 to 6 due to smaller chord components (80px) and wider char width (14px)
  const MIN_CHORD_SPACING = 6;

  const spreadOverlappingChords = useCallback((chords: ExtendedChordPosition[]): ExtendedChordPosition[] => {
    if (chords.length <= 1) return chords;

    // Sort by position first
    const sorted = [...chords].sort((a, b) => a.position - b.position);
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
        } else {
          result.push({ ...chord });
        }
      }
    }

    return result;
  }, []);

  const handleMoveChordBetweenLines = useCallback(
    (sectionIndex: number, _fromLineIndex: number, toLineIndex: number, chord: ExtendedChordPosition) => {
      setSections((prev) => {
        const next = [...prev];
        const section = { ...next[sectionIndex] };
        const lines = [...section.lines];

        // Remove chord from source line (already done by LineEditor)
        // Add chord to target line
        const targetLine = { ...lines[toLineIndex] };
        const newChords = [...targetLine.chords, chord];
        // Sort by position and spread to prevent overlap
        const spreadChords = spreadOverlappingChords(newChords);
        targetLine.chords = spreadChords;
        lines[toLineIndex] = targetLine;

        section.lines = lines;
        next[sectionIndex] = section;
        return next;
      });
    },
    [spreadOverlappingChords]
  );

  // Chord editor handlers
  const handleChordClick = useCallback(
    (sectionIndex: number, lineIndex: number, chordIndex: number, chord: ExtendedChordPosition) => {
      // Open the chord editor modal
      setEditingChord({ sectionIndex, lineIndex, chordIndex, chord });
    },
    []
  );

  // Handle adding a new chord (double-click on empty space)
  const handleAddChord = useCallback(
    (sectionIndex: number, lineIndex: number, position: number) => {
      // Create a new chord with default values
      const newChord: ExtendedChordPosition = {
        chord: 'C',  // Default chord name
        position: position,
      };
      // Use chordIndex: -1 to indicate this is a new chord
      setEditingChord({ sectionIndex, lineIndex, chordIndex: -1, chord: newChord });
    },
    []
  );

  const handleChordEditorClose = useCallback(() => {
    setEditingChord(null);
  }, []);

  const handleChordSave = useCallback((updatedChord: ExtendedChordPosition) => {
    if (!editingChord) return;

    const { sectionIndex, lineIndex, chordIndex } = editingChord;

    setSections((prev) => {
      const next = [...prev];
      const section = { ...next[sectionIndex] };
      const lines = [...section.lines];
      const line = { ...lines[lineIndex] };
      const chords = [...line.chords];

      if (chordIndex === -1) {
        // Adding a new chord
        chords.push(updatedChord);
      } else {
        // Updating existing chord
        chords[chordIndex] = updatedChord;
      }

      // Re-sort by position
      chords.sort((a, b) => a.position - b.position);
      line.chords = chords;
      lines[lineIndex] = line;
      section.lines = lines;
      next[sectionIndex] = section;
      return next;
    });

    setEditingChord(null);
  }, [editingChord]);

  const handleChordDelete = useCallback(() => {
    if (!editingChord) return;

    const { sectionIndex, lineIndex, chordIndex } = editingChord;

    // Cannot delete a chord that hasn't been added yet
    if (chordIndex === -1) {
      setEditingChord(null);
      return;
    }

    setSections((prev) => {
      const next = [...prev];
      const section = { ...next[sectionIndex] };
      const lines = [...section.lines];
      const line = { ...lines[lineIndex] };
      line.chords = line.chords.filter((_, idx) => idx !== chordIndex);
      lines[lineIndex] = line;
      section.lines = lines;
      next[sectionIndex] = section;
      return next;
    });

    setEditingChord(null);
  }, [editingChord]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">読み込み中...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !originalSong) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary/80"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background-primary">
      {/* Header */}
      <EditorHeader
        title={metadata.title}
        artistName={metadata.artistName || null}
        onTitleChange={(title) => setMetadata((prev) => ({ ...prev, title }))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hasChanges={hasChanges}
        onSave={handleSave}
        onBack={handleClose}
        isSaving={isSaving}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/50 px-6 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Content - Main area with right sidebar */}
      <div className="flex-1 flex min-h-0 min-w-0">
        {/* Main Content Area - Chord Sections */}
        <main className="flex-1 p-4 overflow-y-auto overflow-x-auto min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">セクション</h2>
            <button
              onClick={() => handleAddSection()}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              セクション追加
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="bg-background-surface rounded-xl p-8 border border-border text-center">
              <p className="text-text-secondary mb-4">セクションがありません</p>
              <button
                onClick={() => handleAddSection()}
                className="text-primary hover:underline"
              >
                最初のセクションを追加
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section, sectionIndex) => (
                <div key={section.id ?? `new-${sectionIndex}`}>
                  {/* Insert section button before first section */}
                  {sectionIndex === 0 && (
                    <button
                      type="button"
                      onClick={() => handleAddSection(0)}
                      className="w-full py-1.5 mb-2 opacity-0 hover:opacity-100 transition-opacity text-text-muted/50 hover:text-accent-primary text-xs group"
                      title="上にセクションを追加"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px flex-1 bg-white/10 group-hover:bg-accent-primary/30 transition-colors" />
                        <span className="px-2">+ セクションを挿入</span>
                        <div className="h-px flex-1 bg-white/10 group-hover:bg-accent-primary/30 transition-colors" />
                      </div>
                    </button>
                  )}

                  <div id={`section-${sectionIndex}`}>
                    <SectionEditor
                      section={section}
                      sectionIndex={sectionIndex}
                      isFirst={sectionIndex === 0}
                      isLast={sectionIndex === sections.length - 1}
                      isCollapsed={!!collapsedSections[sectionIndex]}
                      onToggleCollapse={() => toggleSectionCollapse(sectionIndex)}
                      onSectionChange={(updates) => handleSectionChange(sectionIndex, updates)}
                      onMoveUp={() => handleMoveSection(sectionIndex, 'up')}
                      onMoveDown={() => handleMoveSection(sectionIndex, 'down')}
                      onDelete={() => handleDeleteSection(sectionIndex)}
                      onCopy={() => handleCopySection(sectionIndex)}
                      onAddLine={(insertAtIndex) => handleAddLine(sectionIndex, insertAtIndex)}
                      onLineChange={(lineIndex, updates) =>
                        handleLineChange(sectionIndex, lineIndex, updates)
                      }
                      onDeleteLine={(lineIndex) => handleDeleteLine(sectionIndex, lineIndex)}
                      onChordClick={(lineIndex, chordIndex, chord) =>
                        handleChordClick(sectionIndex, lineIndex, chordIndex, chord)
                      }
                      onAddChord={(lineIndex, position) =>
                        handleAddChord(sectionIndex, lineIndex, position)
                      }
                      onMoveChordBetweenLines={(fromLineIndex, toLineIndex, chord) =>
                        handleMoveChordBetweenLines(sectionIndex, fromLineIndex, toLineIndex, chord)
                      }
                      showDiagram={showDiagram}
                      showPlayingMethod={showPlayingMethod}
                      showMemo={showMemo}
                    />
                  </div>

                  {/* Insert section button after each section */}
                  <button
                    type="button"
                    onClick={() => handleAddSection(sectionIndex + 1)}
                    className="w-full py-1.5 mt-2 opacity-0 hover:opacity-100 transition-opacity text-text-muted/50 hover:text-accent-primary text-xs group"
                    title="下にセクションを追加"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-px flex-1 bg-white/10 group-hover:bg-accent-primary/30 transition-colors" />
                      <span className="px-2">+ セクションを挿入</span>
                      <div className="h-px flex-1 bg-white/10 group-hover:bg-accent-primary/30 transition-colors" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <EditorSidebar
          artistName={metadata.artistName}
          bpm={metadata.bpm ? parseInt(metadata.bpm, 10) : null}
          timeSignature={metadata.timeSignature}
          capo={metadata.capo}
          transpose={metadata.transpose}
          notes={metadata.notes || null}
          onMetadataChange={handleSidebarMetadataChange}
          sections={sections.map((s, index) => ({
            id: String(index),  // インデックスを文字列IDとして使用（新規セクションにも対応）
            name: s.name,
            isCollapsed: !!collapsedSections[index],
          }))}
          onSectionClick={handleSectionNavClick}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Chord Editor Modal */}
      <ChordEditor
        chord={editingChord?.chord ?? null}
        chordIndex={editingChord?.chordIndex ?? null}
        onClose={handleChordEditorClose}
        onSave={handleChordSave}
        onDelete={handleChordDelete}
        timeSignature={metadata.timeSignature}
      />

      {/* Capo Change Confirmation Dialog */}
      {capoChangeConfirm.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCapoChangeConfirm({ show: false, newCapo: 0, delta: 0 })}
          />

          {/* Dialog */}
          <div className="relative bg-background-surface border border-white/10 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Capo変更
                </h3>
                <p className="text-sm text-text-secondary mb-1">
                  Capoを <span className="font-mono font-bold">{metadata.capo}</span> から <span className="font-mono font-bold">{capoChangeConfirm.newCapo}</span> に変更します。
                </p>
                <p className="text-sm text-text-secondary">
                  コードも一緒に移調しますか？
                </p>
                <p className="text-xs text-text-muted mt-2">
                  {capoChangeConfirm.delta > 0
                    ? `「移調する」を選ぶと、コードが${capoChangeConfirm.delta}半音下がり、実音は変わりません。`
                    : `「移調する」を選ぶと、コードが${Math.abs(capoChangeConfirm.delta)}半音上がり、実音は変わりません。`
                  }
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCapoChangeConfirm({ show: false, newCapo: 0, delta: 0 })}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleCapoChangeOnly}
                className="px-4 py-2 text-sm font-medium text-text-primary bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Capoのみ変更
              </button>
              <button
                type="button"
                onClick={handleCapoChangeWithTranspose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                移調する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Confirmation Dialog */}
      {showUnsavedDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancelDiscard}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md bg-background-surface rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold">未保存の変更</h2>
              <button
                onClick={handleCancelDiscard}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-text-secondary">
                保存されていない変更があります。変更を破棄してもよろしいですか？
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={handleCancelDiscard}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                変更を破棄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
