import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSongById, updateSong } from '@/lib/database';
import { SongMetadataForm, SectionEditor, ChordEditor } from '@/components/editor';
import type { EditableLine, EditableSection } from '@/components/editor';
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
  originalKey: string;
  bpm: string;
  timeSignature: TimeSignature;
  capo: number;
  notes: string;
}

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

  // Editable state
  const [metadata, setMetadata] = useState<EditableSongMetadata>({
    title: '',
    artistName: '',
    originalKey: '',
    bpm: '',
    timeSignature: '4/4',
    capo: 0,
    notes: '',
  });

  // Collapse states
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});
  const [isSongInfoCollapsed, setIsSongInfoCollapsed] = useState(false);
  const [sections, setSections] = useState<EditableSection[]>([]);

  // Display toggle settings for chord components
  const [showDiagram, setShowDiagram] = useState(true);       // 押さえ方の図
  const [showPlayingMethod, setShowPlayingMethod] = useState(true); // 引き方 (ストローク/アルペジオパターン)
  const [showMemo, setShowMemo] = useState(true);             // メモ

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
    if (metadata.originalKey !== (song.originalKey ?? '')) return true;
    if (metadata.bpm !== (song.bpm?.toString() ?? '')) return true;
    if (metadata.timeSignature !== song.timeSignature) return true;
    if (metadata.capo !== song.capo) return true;
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

        // Initialize metadata
        setMetadata({
          title: song.song.title,
          artistName: song.artist?.name ?? '',
          originalKey: song.song.originalKey ?? '',
          bpm: song.song.bpm?.toString() ?? '',
          timeSignature: song.song.timeSignature,
          capo: song.song.capo,
          notes: song.song.notes ?? '',
        });

        // Initialize sections
        setSections(
          song.sections.map((s) => ({
            id: s.section.id,
            name: s.section.name,
            repeatCount: s.section.repeatCount,
            lines: s.lines.map((l) => ({
              id: l.id,
              lyrics: l.lyrics,
              chords: l.chords as ExtendedChordPosition[],
            })),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : '読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    }

    loadSong();
  }, [songId]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!originalSong) return;

    setIsSaving(true);
    setError(null);

    try {
      const input: UpdateSongInput = {
        title: metadata.title,
        artistName: metadata.artistName || undefined,
        originalKey: metadata.originalKey || undefined,
        bpm: metadata.bpm ? parseInt(metadata.bpm, 10) : undefined,
        timeSignature: metadata.timeSignature,
        capo: metadata.capo,
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

      onSongUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  }, [songId, metadata, sections, originalSong, onSongUpdated]);

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

  // Metadata handlers
  const handleMetadataChange = useCallback(
    <K extends keyof EditableSongMetadata>(key: K, value: EditableSongMetadata[K]) => {
      setMetadata((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

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

  const handleAddSection = useCallback(() => {
    setSections((prev) => [
      ...prev,
      { name: '新しいセクション', repeatCount: 1, lines: [] },
    ]);
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

  // Scroll to section handler
  const scrollToSection = useCallback((index: number) => {
    const sectionElement = document.getElementById(`section-${index}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Ensure section is expanded
      setCollapsedSections(prev => ({
        ...prev,
        [index]: false
      }));
    }
  }, []);

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

  const handleAddLine = useCallback((sectionIndex: number) => {
    setSections((prev) => {
      const next = [...prev];
      const section = { ...next[sectionIndex] };
      section.lines = [...section.lines, { lyrics: '', chords: [] }];
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
    (sectionIndex: number, fromLineIndex: number, toLineIndex: number, chord: ExtendedChordPosition) => {
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
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-background-surface">
        <div className="flex items-center gap-4">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="戻る"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold">曲を編集</h1>
            {hasChanges && (
              <span className="text-xs text-yellow-400">未保存の変更があります</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/50 px-6 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Content - Split layout: 1/4 left (song info), 3/4 right (chord sections) */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex w-full h-full">
          {/* Left Panel - Song Information (narrower for more lyrics space) */}
          <aside className="w-1/5 min-w-[240px] max-w-[300px] p-4 border-r border-white/10 overflow-y-auto bg-background-surface flex-shrink-0">
            {/* Collapsible Song Info Header */}
            <button
              onClick={() => setIsSongInfoCollapsed(!isSongInfoCollapsed)}
              className="w-full flex items-center justify-between mb-4 group"
            >
              <h2 className="text-lg font-semibold text-black">曲情報</h2>
              <svg
                className={`w-5 h-5 text-text-secondary transition-transform ${isSongInfoCollapsed ? '-rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible Song Info Content */}
            {!isSongInfoCollapsed && (
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    曲名 *
                  </label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    className="w-full bg-background-primary border border-white/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent-primary"
                    placeholder="曲名を入力"
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    アーティスト
                  </label>
                  <input
                    type="text"
                    value={metadata.artistName}
                    onChange={(e) => handleMetadataChange('artistName', e.target.value)}
                    className="w-full bg-background-primary border border-white/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent-primary"
                    placeholder="アーティスト名"
                  />
                </div>

                {/* Music metadata using SongMetadataForm */}
                <div className="pt-2 border-t border-white/5">
                  <SongMetadataForm
                    bpm={metadata.bpm ? parseInt(metadata.bpm, 10) : null}
                    onBpmChange={(value) => handleMetadataChange('bpm', value?.toString() ?? '')}
                    timeSignature={metadata.timeSignature}
                    onTimeSignatureChange={(value) => handleMetadataChange('timeSignature', value)}
                    capo={metadata.capo}
                    onCapoChange={(value) => handleMetadataChange('capo', value)}
                    originalKey={metadata.originalKey || null}
                    onKeyChange={(value) => handleMetadataChange('originalKey', value ?? '')}
                  />
                </div>

                {/* Notes */}
                <div className="pt-2 border-t border-white/5">
                  <label className="block text-sm font-medium text-black mb-1">
                    メモ
                  </label>
                  <textarea
                    value={metadata.notes}
                    onChange={(e) => handleMetadataChange('notes', e.target.value)}
                    rows={4}
                    className="w-full bg-background-primary border border-white/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-accent-primary resize-none"
                    placeholder="曲に関するメモ..."
                  />
                </div>
              </div>
            )}

            {/* Display Settings Toggle */}
            <div className={`${!isSongInfoCollapsed ? 'pt-4 mt-4 border-t border-white/5' : 'pt-2'}`}>
              <h3 className="text-sm font-medium text-black mb-2">コード表示設定</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDiagram}
                    onChange={(e) => setShowDiagram(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-background-primary text-accent-primary focus:ring-accent-primary focus:ring-offset-0"
                  />
                  <span className="text-sm text-text-secondary">押さえ方の図</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPlayingMethod}
                    onChange={(e) => setShowPlayingMethod(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-background-primary text-accent-primary focus:ring-accent-primary focus:ring-offset-0"
                  />
                  <span className="text-sm text-text-secondary">引き方</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMemo}
                    onChange={(e) => setShowMemo(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-background-primary text-accent-primary focus:ring-accent-primary focus:ring-offset-0"
                  />
                  <span className="text-sm text-text-secondary">メモ</span>
                </label>
              </div>
            </div>

            {/* Section Navigation Links */}
            {sections.length > 0 && (
              <div className="pt-4 mt-4 border-t border-white/5">
                <h3 className="text-sm font-medium text-black mb-2">セクション</h3>
                <div className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id ?? `nav-${index}`}
                      onClick={() => scrollToSection(index)}
                      className="w-full text-left px-2 py-1 text-sm text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded transition-colors truncate"
                    >
                      {section.name}
                      {section.repeatCount > 1 && (
                        <span className="ml-1 text-xs text-text-muted">×{section.repeatCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Panel - Chord Sections (maximum width for lyrics) */}
          <section className="flex-1 p-4 overflow-y-auto overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">セクション</h2>
              <button
                onClick={handleAddSection}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary/20 text-accent-primary rounded-lg hover:bg-accent-primary/30 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                セクション追加
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="bg-background-surface rounded-xl p-8 border border-white/5 text-center">
                <p className="text-text-secondary mb-4">セクションがありません</p>
                <button
                  onClick={handleAddSection}
                  className="text-accent-primary hover:underline"
                >
                  最初のセクションを追加
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <div key={section.id ?? `new-${sectionIndex}`} id={`section-${sectionIndex}`}>
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
                      onAddLine={() => handleAddLine(sectionIndex)}
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
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Chord Editor Modal */}
      <ChordEditor
        chord={editingChord?.chord ?? null}
        chordIndex={editingChord?.chordIndex ?? null}
        onClose={handleChordEditorClose}
        onSave={handleChordSave}
        onDelete={handleChordDelete}
        timeSignature={metadata.timeSignature}
      />

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
