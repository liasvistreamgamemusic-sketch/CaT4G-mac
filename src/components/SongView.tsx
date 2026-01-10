/**
 * SongView - 統合された曲表示コンポーネント
 * 演奏モードと編集モードの両方で使用可能
 *
 * Features:
 * - トップバー（メタデータ、モード切り替え）
 * - 演奏モード: PlayableChordLine を使用した読み取り専用表示
 * - 編集モード: SectionEditor/LineEditor を使用した編集可能表示
 * - スクロール可能なコンテンツエリア
 */

import { forwardRef, useMemo, useCallback, useState, useEffect } from 'react';
import type {
  SongWithDetails,
  TimeSignature,
  ExtendedChordPosition,
} from '@/types/database';
import { SongTopBar } from '@/components/SongTopBar';
import type { ViewMode, AppMode } from '@/components/SongTopBar';

// Re-export types for convenience
export type { ViewMode, AppMode };
import { PlayableChordLine } from '@/components/PlayableChordLine';
import { SectionEditor } from '@/components/editor/SectionEditor';
import type { EditableSection, EditableLine } from '@/components/editor/SectionEditor';
import { ChordEditor } from '@/components/editor/ChordEditor';
import { SettingsPanel } from '@/components/SettingsPanel';
import { getSongById, updateSong } from '@/lib/database';
import { transposeChord } from '@/lib/chords/transpose';
import type { UpdateSongInput, UpdateSectionInput, UpdateLineInput } from '@/types/database';

// ============================================
// 型定義
// ============================================

interface SongViewProps {
  /** 曲データ */
  song: SongWithDetails;
  /** アプリモード */
  mode: AppMode;
  /** 表示モード */
  viewMode: ViewMode;
  /** 移調量 */
  transpose: number;
  /** Capo位置 */
  capo: number;
  /** 再生速度 */
  playbackSpeed: number;
  /** 再生中かどうか */
  isPlaying: boolean;
  /** モード切り替えコールバック */
  onModeChange: (mode: AppMode) => void;
  /** ビューモード切り替えコールバック */
  onViewModeChange: (mode: ViewMode) => void;
  /** コードクリック時のコールバック */
  onChordClick?: (chord: string) => void;
  /** 曲更新時のコールバック */
  onSongUpdated?: () => void;
  /** 移調変更コールバック */
  onTransposeChange?: (value: number) => void;
  /** Capo変更コールバック */
  onCapoChange?: (value: number) => void;
  /** 再生速度変更コールバック */
  onPlaybackSpeedChange?: (value: number) => void;
}

// ============================================
// 編集用型定義
// ============================================

interface EditableSongMetadata {
  title: string;
  artistName: string;
  bpm: string;
  timeSignature: TimeSignature;
  capo: number;
  transpose: number;
  playbackSpeed: number;
  notes: string;
}

// コード編集用の状態
interface ChordEditState {
  sectionIndex: number;
  lineIndex: number;
  chordIndex: number;
  chord: ExtendedChordPosition;
}

// ============================================
// ヘルパー関数
// ============================================

function initializeEditState(song: SongWithDetails): {
  metadata: EditableSongMetadata;
  sections: EditableSection[];
} {
  const { song: songData, artist, sections } = song;

  const metadata: EditableSongMetadata = {
    title: songData.title,
    artistName: artist?.name || '',
    bpm: songData.bpm?.toString() || '',
    timeSignature: songData.timeSignature,
    capo: songData.capo,
    transpose: songData.transpose ?? 0,
    playbackSpeed: songData.playbackSpeed ?? 1.0,
    notes: songData.notes || '',
  };

  const editableSections: EditableSection[] = sections.map(({ section, lines }) => ({
    id: section.id,
    name: section.name,
    repeatCount: section.repeatCount,
    lines: lines.map((line) => ({
      id: line.id,
      lyrics: line.lyrics,
      chords: line.chords as ExtendedChordPosition[],
      memo: undefined,
    })),
  }));

  return { metadata, sections: editableSections };
}

// ============================================
// メインコンポーネント
// ============================================

export const SongView = forwardRef<HTMLElement, SongViewProps>(function SongView(
  {
    song,
    mode,
    viewMode,
    transpose,
    capo,
    playbackSpeed,
    isPlaying,
    onModeChange,
    onViewModeChange,
    onChordClick,
    onSongUpdated,
    // These will be used when edit mode is fully implemented
    onTransposeChange: _onTransposeChange,
    onCapoChange: _onCapoChange,
    onPlaybackSpeedChange: _onPlaybackSpeedChange,
  },
  ref
) {
  // Suppress unused variable warnings - these will be used in edit mode
  void _onTransposeChange;
  void _onCapoChange;
  void _onPlaybackSpeedChange;
  const { song: songData, sections } = song;

  // 編集モード用の状態
  const [editMetadata, setEditMetadata] = useState<EditableSongMetadata | null>(null);
  const [editSections, setEditSections] = useState<EditableSection[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // コード編集用の状態
  const [chordEditState, setChordEditState] = useState<ChordEditState | null>(null);

  // セクションの折りたたみ状態
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});


  // 編集モードの設定パネル折りたたみ状態
  const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(false);

  // 編集モードに入る時に状態を初期化
  useEffect(() => {
    if (mode === 'edit') {
      const { metadata, sections: editableSections } = initializeEditState(song);
      setEditMetadata(metadata);
      setEditSections(editableSections);
    }
  }, [mode, song]);

  // 変更検出
  const hasUnsavedChanges = useMemo(() => {
    if (mode !== 'edit' || !editMetadata || !editSections) return false;

    // メタデータ比較
    const metaChanged =
      editMetadata.title !== songData.title ||
      editMetadata.artistName !== (song.artist?.name || '') ||
      editMetadata.bpm !== (songData.bpm?.toString() || '') ||
      editMetadata.timeSignature !== songData.timeSignature ||
      editMetadata.capo !== songData.capo ||
      editMetadata.transpose !== (songData.transpose ?? 0) ||
      editMetadata.playbackSpeed !== (songData.playbackSpeed ?? 1.0) ||
      editMetadata.notes !== (songData.notes || '');

    if (metaChanged) return true;

    // セクション数比較
    if (editSections.length !== sections.length) return true;

    // 詳細比較
    for (let i = 0; i < editSections.length; i++) {
      const editSec = editSections[i];
      const origSec = sections[i];

      if (
        editSec.name !== origSec.section.name ||
        editSec.repeatCount !== origSec.section.repeatCount ||
        editSec.lines.length !== origSec.lines.length
      ) {
        return true;
      }

      for (let j = 0; j < editSec.lines.length; j++) {
        const editLine = editSec.lines[j];
        const origLine = origSec.lines[j];

        if (
          editLine.lyrics !== origLine.lyrics ||
          JSON.stringify(editLine.chords) !== JSON.stringify(origLine.chords)
        ) {
          return true;
        }
      }
    }

    return false;
  }, [mode, editMetadata, editSections, songData, song.artist, sections]);

  // 保存処理
  const handleSave = useCallback(async () => {
    if (!editMetadata || !editSections || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      const updateInput: UpdateSongInput = {
        title: editMetadata.title,
        artistName: editMetadata.artistName || undefined,
        bpm: editMetadata.bpm ? parseInt(editMetadata.bpm, 10) : undefined,
        timeSignature: editMetadata.timeSignature,
        capo: editMetadata.capo,
        transpose: editMetadata.transpose,
        playbackSpeed: editMetadata.playbackSpeed,
        notes: editMetadata.notes || undefined,
        sections: editSections.map((section): UpdateSectionInput => ({
          id: section.id,
          name: section.name,
          repeatCount: section.repeatCount,
          lines: section.lines.map((line): UpdateLineInput => ({
            id: line.id,
            lyrics: line.lyrics,
            chords: line.chords,
          })),
        })),
      };

      await updateSong(songData.id, updateInput);

      // 曲データを再読み込み
      const updatedSong = await getSongById(songData.id);
      if (updatedSong) {
        const { metadata, sections: newSections } = initializeEditState(updatedSong);
        setEditMetadata(metadata);
        setEditSections(newSections);
      }

      onSongUpdated?.();
    } catch (error) {
      console.error('Failed to save song:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editMetadata, editSections, hasUnsavedChanges, songData.id, onSongUpdated]);

  // セクション変更ハンドラー
  const handleSectionChange = useCallback((sectionIndex: number, updates: Partial<EditableSection>) => {
    setEditSections(prev => {
      if (!prev) return prev;
      const newSections = [...prev];
      newSections[sectionIndex] = { ...newSections[sectionIndex], ...updates };
      return newSections;
    });
  }, []);

  // セクション移動ハンドラー
  const handleMoveSection = useCallback((sectionIndex: number, direction: 'up' | 'down') => {
    setEditSections(prev => {
      if (!prev) return prev;
      const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newSections = [...prev];
      [newSections[sectionIndex], newSections[newIndex]] = [newSections[newIndex], newSections[sectionIndex]];
      return newSections;
    });
  }, []);

  // セクション削除ハンドラー
  const handleDeleteSection = useCallback((sectionIndex: number) => {
    setEditSections(prev => {
      if (!prev) return prev;
      return prev.filter((_, i) => i !== sectionIndex);
    });
  }, []);

  // セクションコピーハンドラー
  const handleCopySection = useCallback((sectionIndex: number) => {
    setEditSections(prev => {
      if (!prev) return prev;
      const sectionToCopy = prev[sectionIndex];
      const copiedSection: EditableSection = {
        ...sectionToCopy,
        id: undefined, // 新しいIDを割り当てる
        name: `${sectionToCopy.name} (コピー)`,
        lines: sectionToCopy.lines.map(line => ({
          ...line,
          id: undefined,
          chords: line.chords.map(chord => ({ ...chord })),
        })),
      };
      const newSections = [...prev];
      newSections.splice(sectionIndex + 1, 0, copiedSection);
      return newSections;
    });
  }, []);

  // セクション分割ハンドラー（指定行以降を新しいセクションに分割）
  const handleSplitSection = useCallback((sectionIndex: number, atLineIndex: number) => {
    setEditSections(prev => {
      if (!prev) return prev;
      const section = prev[sectionIndex];

      // 分割できない場合（行数が足りない）
      if (atLineIndex <= 0 || atLineIndex >= section.lines.length) return prev;

      // 元のセクションは分割点より前の行のみ
      const originalSection: EditableSection = {
        ...section,
        lines: section.lines.slice(0, atLineIndex),
      };

      // 新しいセクションは分割点以降の行
      const newSection: EditableSection = {
        id: undefined, // 新しいIDを割り当てる
        name: `${section.name} (続き)`,
        repeatCount: 1,
        lines: section.lines.slice(atLineIndex).map(line => ({
          ...line,
          id: undefined, // 新しいIDを割り当てる
          chords: line.chords.map(chord => ({ ...chord })),
        })),
      };

      const newSections = [...prev];
      // 元のセクションを更新して、新しいセクションを挿入
      newSections[sectionIndex] = originalSection;
      newSections.splice(sectionIndex + 1, 0, newSection);
      return newSections;
    });
  }, []);

  // 行追加ハンドラー
  const handleAddLine = useCallback((sectionIndex: number, insertAtIndex?: number) => {
    setEditSections(prev => {
      if (!prev) return prev;
      const newSections = [...prev];
      const section = { ...newSections[sectionIndex] };
      const newLine: EditableLine = {
        lyrics: '',
        chords: [],
      };
      if (insertAtIndex !== undefined) {
        section.lines = [...section.lines];
        section.lines.splice(insertAtIndex, 0, newLine);
      } else {
        section.lines = [...section.lines, newLine];
      }
      newSections[sectionIndex] = section;
      return newSections;
    });
  }, []);

  // 行変更ハンドラー
  const handleLineChange = useCallback((sectionIndex: number, lineIndex: number, updates: Partial<EditableLine>) => {
    setEditSections(prev => {
      if (!prev) return prev;
      const newSections = [...prev];
      const section = { ...newSections[sectionIndex] };
      section.lines = [...section.lines];
      section.lines[lineIndex] = { ...section.lines[lineIndex], ...updates };
      newSections[sectionIndex] = section;
      return newSections;
    });
  }, []);

  // 行削除ハンドラー
  const handleDeleteLine = useCallback((sectionIndex: number, lineIndex: number) => {
    setEditSections(prev => {
      if (!prev) return prev;
      const newSections = [...prev];
      const section = { ...newSections[sectionIndex] };
      section.lines = section.lines.filter((_, i) => i !== lineIndex);
      newSections[sectionIndex] = section;
      return newSections;
    });
  }, []);

  // コードクリックハンドラー（編集モード）
  const handleEditChordClick = useCallback((sectionIndex: number, lineIndex: number, chordIndex: number, chord: ExtendedChordPosition) => {
    setChordEditState({
      sectionIndex,
      lineIndex,
      chordIndex,
      chord,
    });
  }, []);

  // コード追加ハンドラー
  const handleAddChord = useCallback((sectionIndex: number, lineIndex: number, position: number) => {
    const newChord: ExtendedChordPosition = {
      chord: 'C',
      position,
    };
    setChordEditState({
      sectionIndex,
      lineIndex,
      chordIndex: -1, // -1 は新規追加を示す
      chord: newChord,
    });
  }, []);

  // コード保存ハンドラー
  const handleSaveChord = useCallback((updatedChord: ExtendedChordPosition) => {
    if (!chordEditState) return;
    const { sectionIndex, lineIndex, chordIndex } = chordEditState;

    setEditSections(prev => {
      if (!prev) return prev;
      const newSections = [...prev];
      const section = { ...newSections[sectionIndex] };
      section.lines = [...section.lines];
      const line = { ...section.lines[lineIndex] };
      line.chords = [...line.chords];

      if (chordIndex === -1) {
        // 新規追加
        line.chords.push(updatedChord);
        line.chords.sort((a, b) => a.position - b.position);
      } else {
        // 既存のコードを更新
        line.chords[chordIndex] = updatedChord;
      }

      section.lines[lineIndex] = line;
      newSections[sectionIndex] = section;
      return newSections;
    });

    setChordEditState(null);
  }, [chordEditState]);

  // コード削除ハンドラー
  const handleDeleteChord = useCallback(() => {
    if (!chordEditState || chordEditState.chordIndex === -1) return;
    const { sectionIndex, lineIndex, chordIndex } = chordEditState;

    setEditSections(prev => {
      if (!prev) return prev;
      const newSections = [...prev];
      const section = { ...newSections[sectionIndex] };
      section.lines = [...section.lines];
      const line = { ...section.lines[lineIndex] };
      line.chords = line.chords.filter((_, i) => i !== chordIndex);
      section.lines[lineIndex] = line;
      newSections[sectionIndex] = section;
      return newSections;
    });

    setChordEditState(null);
  }, [chordEditState]);

  // コード移動ハンドラー（行間）
  const handleMoveChordBetweenLines = useCallback((
    sectionIndex: number,
    _fromLineIndex: number,
    toLineIndex: number,
    chord: ExtendedChordPosition
  ) => {
    void _fromLineIndex; // Used by SectionEditor but not needed here
    setEditSections(prev => {
      if (!prev) return prev;
      const newSections = [...prev];
      const section = { ...newSections[sectionIndex] };
      section.lines = [...section.lines];

      // 移動先の行にコードを追加
      const toLine = { ...section.lines[toLineIndex] };
      toLine.chords = [...toLine.chords, chord];
      toLine.chords.sort((a, b) => a.position - b.position);
      section.lines[toLineIndex] = toLine;

      newSections[sectionIndex] = section;
      return newSections;
    });
  }, []);

  // セクション折りたたみトグル
  const handleToggleCollapse = useCallback((sectionIndex: number) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  }, []);

  // 全セクションの全コードを移調
  const transposeAllChords = useCallback((semitones: number) => {
    setEditSections((prev) => {
      if (!prev) return prev;
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

  // メタデータ変更ハンドラー（Capo変更時は常に移調）
  const handleMetadataChange = useCallback((key: string, value: unknown) => {
    // Capo変更時は常にコードを移調（実音を維持）
    if (key === 'capo' && editMetadata) {
      const newCapo = value as number;
      const delta = newCapo - editMetadata.capo;

      if (delta !== 0) {
        // Capoが上がったらコードを下げる（実音を維持）
        transposeAllChords(-delta);
      }

      setEditMetadata((prev) => prev ? { ...prev, capo: newCapo } : prev);
      return;
    }

    // 通常のメタデータ更新
    setEditMetadata((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: key === 'bpm' ? String(value ?? '') : value,
      };
    });
  }, [editMetadata, transposeAllChords]);

  // 表示用の有効な移調量（Capo を考慮）
  const effectiveTranspose = transpose - capo;

  // 現在の拍子
  const currentTimeSignature = editMetadata?.timeSignature ?? songData.timeSignature;

  // セクションナビゲーション用データ
  const sectionNavItems = (editSections ?? []).map((section, index) => ({
    id: String(index),
    name: section.name,
    isCollapsed: collapsedSections[index] ?? false,
  }));

  // セクションクリックハンドラー（スクロール + 展開）
  const handleSectionNavClick = useCallback((sectionId: string) => {
    const sectionIndex = parseInt(sectionId, 10);
    if (sectionIndex >= 0 && sectionIndex < (editSections?.length ?? 0)) {
      // 折りたたまれている場合は展開
      setCollapsedSections((prev) => ({ ...prev, [sectionIndex]: false }));
      // スクロール
      const element = document.getElementById(`section-${sectionIndex}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editSections?.length]);

  return (
    <div className="flex h-full">
      {/* 編集モード時の設定パネル */}
      {mode === 'edit' && editMetadata && (
        <SettingsPanel
          artistName={editMetadata.artistName || undefined}
          bpm={editMetadata.bpm ? parseInt(editMetadata.bpm, 10) : null}
          timeSignature={editMetadata.timeSignature}
          capo={editMetadata.capo}
          transpose={editMetadata.transpose}
          playbackSpeed={editMetadata.playbackSpeed}
          notes={editMetadata.notes || null}
          onMetadataChange={handleMetadataChange}
          sections={sectionNavItems}
          onSectionClick={handleSectionNavClick}
          isCollapsed={isSettingsPanelCollapsed}
          onToggleCollapse={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)}
        />
      )}

      {/* メインコンテンツエリア */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* トップバー */}
        <SongTopBar
          song={song}
          mode={mode}
          viewMode={viewMode}
          playbackSpeed={playbackSpeed}
          isPlaying={isPlaying}
          onModeChange={onModeChange}
          onViewModeChange={onViewModeChange}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSave}
          isSaving={isSaving}
        />

        {/* コンテンツエリア */}
        <main
          ref={ref}
          className="flex-1 overflow-y-auto overflow-x-auto bg-background-primary"
        >
        <div className="space-y-6 p-4">
          {mode === 'edit' && editSections ? (
            // 編集モード: SectionEditor を使用
            <>
              {editSections.map((section, sectionIndex) => (
                <div key={section.id ?? `new-section-${sectionIndex}`} id={`section-${sectionIndex}`}>
                <SectionEditor
                  section={section}
                  sectionIndex={sectionIndex}
                  isFirst={sectionIndex === 0}
                  isLast={sectionIndex === editSections.length - 1}
                  isCollapsed={collapsedSections[sectionIndex] ?? false}
                  onToggleCollapse={() => handleToggleCollapse(sectionIndex)}
                  onSectionChange={(updates) => handleSectionChange(sectionIndex, updates)}
                  onMoveUp={() => handleMoveSection(sectionIndex, 'up')}
                  onMoveDown={() => handleMoveSection(sectionIndex, 'down')}
                  onDelete={() => handleDeleteSection(sectionIndex)}
                  onCopy={() => handleCopySection(sectionIndex)}
                  onAddLine={(insertAtIndex) => handleAddLine(sectionIndex, insertAtIndex)}
                  onLineChange={(lineIndex, updates) => handleLineChange(sectionIndex, lineIndex, updates)}
                  onDeleteLine={(lineIndex) => handleDeleteLine(sectionIndex, lineIndex)}
                  onChordClick={(lineIndex, chordIndex, chord) =>
                    handleEditChordClick(sectionIndex, lineIndex, chordIndex, chord)
                  }
                  onAddChord={(lineIndex, position) => handleAddChord(sectionIndex, lineIndex, position)}
                  onMoveChordBetweenLines={(fromLineIndex, toLineIndex, chord) =>
                    handleMoveChordBetweenLines(sectionIndex, fromLineIndex, toLineIndex, chord)
                  }
                  onSplitSection={(atLineIndex) => handleSplitSection(sectionIndex, atLineIndex)}
                  showDiagram={viewMode !== 'compact'}
                  showPlayingMethod={viewMode !== 'compact'}
                  showMemo={viewMode === 'detailed'}
                  transpose={editMetadata?.transpose ?? 0}
                />
                </div>
              ))}

              {/* セクション追加ボタン */}
              <button
                type="button"
                onClick={() => {
                  setEditSections(prev => {
                    if (!prev) return prev;
                    const newSection: EditableSection = {
                      name: '新しいセクション',
                      repeatCount: 1,
                      lines: [{ lyrics: '', chords: [] }],
                    };
                    return [...prev, newSection];
                  });
                }}
                className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-text-muted hover:text-accent-primary hover:border-accent-primary/30 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                セクションを追加
              </button>
            </>
          ) : (
            // 演奏モード: PlayableChordLine を使用
            <>
              {sections.map(({ section, lines }) => (
                <section key={section.id} className="space-y-2">
                  {/* セクションヘッダー */}
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-text-primary">{section.name}</h2>
                    {section.repeatCount > 1 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-accent-primary/20 text-accent-primary">
                        ×{section.repeatCount}
                      </span>
                    )}
                  </div>

                  {/* ライン表示 */}
                  <div className="space-y-3 bg-background-surface rounded-lg p-3">
                    {lines.map((line) => (
                      <PlayableChordLine
                        key={line.id}
                        lyrics={line.lyrics}
                        chords={line.chords as ExtendedChordPosition[]}
                        transpose={effectiveTranspose}
                        viewMode={viewMode}
                        onChordClick={onChordClick}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}

          {/* 曲のメモ */}
          {songData.notes && (
            <div className="mt-8 p-4 bg-background-surface rounded-lg border-l-4 border-accent-primary">
              <h3 className="text-sm font-medium text-text-secondary mb-2">メモ</h3>
              <p className="text-sm text-text-primary whitespace-pre-wrap">{songData.notes}</p>
            </div>
          )}
        </div>
      </main>
      </div>
      {/* メインコンテンツエリア終了 */}

      {/* コード編集モーダル（編集モード時） */}
      {mode === 'edit' && chordEditState && (
        <ChordEditor
          chord={chordEditState.chord}
          chordIndex={chordEditState.chordIndex}
          onClose={() => setChordEditState(null)}
          onSave={handleSaveChord}
          onDelete={chordEditState.chordIndex !== -1 ? handleDeleteChord : undefined}
          timeSignature={currentTimeSignature}
        />
      )}

    </div>
  );
});

export default SongView;
