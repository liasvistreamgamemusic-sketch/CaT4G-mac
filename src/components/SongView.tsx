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

import { forwardRef, useMemo, useCallback, useState, useEffect, useRef, type SetStateAction } from 'react';
import type {
  SongWithDetails,
  TimeSignature,
  ExtendedChordPosition,
} from '@/types/database';
import { SongTopBar } from '@/components/SongTopBar';
import type { ViewMode, AppMode } from '@/components/SongTopBar';
import { useUndoRedo } from '@/hooks';

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
import { Repeat, Guitar, Timer } from 'lucide-react';

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
  /** サイドバーの幅（px） */
  sidebarWidth?: number;
  /** 移調量 */
  transpose: number;
  /** Capo位置 */
  capo: number;
  /** 再生速度 */
  playbackSpeed: number;
  /** 再生中かどうか（オートスクロール） */
  isPlaying: boolean;
  /** 基準線の位置（0.0〜1.0、コンテンツエリア上部からの割合）デフォルト: 0.25（25%） */
  baselinePosition?: number;
  /** 現在の繰り返し回数（1-based） */
  currentRepeatIteration?: number;
  /** 現在再生中のセクションインデックス（0-based） */
  currentSectionIndex?: number;
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
  /** セクションクリック時のコールバック */
  onSectionClick?: (sectionId: string) => void;
  /** 行クリック時のコールバック（再生中のジャンプ用） */
  onLineClick?: (lineId: string) => void;
  /** scrollToLine関数を親に渡すコールバック */
  onScrollToLine?: (scrollFn: (lineId: string) => void) => void;
  /** 特定行から再生するコールバック */
  onPlayFromLine?: (lineId: string) => void;
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

// Editor state snapshot for undo/redo
interface EditorSnapshot {
  metadata: EditableSongMetadata;
  sections: EditableSection[];
}

// Initial empty state for editor
const INITIAL_EDITOR_STATE: EditorSnapshot = {
  metadata: {
    title: '',
    artistName: '',
    bpm: '',
    timeSignature: '4/4',
    capo: 0,
    transpose: 0,
    playbackSpeed: 1.0,
    notes: '',
  },
  sections: [],
};

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
    capoOverride: section.transposeOverride ?? null,  // TODO: Update DB schema to use capoOverride
    bpmOverride: section.bpmOverride ?? null,
    lines: lines.map((line) => ({
      id: line.id,
      lyrics: line.lyrics,
      chords: line.chords as ExtendedChordPosition[],
      memo: undefined,
      measures: line.measures ?? 4,
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
    sidebarWidth,
    transpose,
    capo,
    playbackSpeed,
    isPlaying,
    baselinePosition = 0.25,
    currentRepeatIteration,
    currentSectionIndex,
    onModeChange,
    onViewModeChange,
    onChordClick,
    onSongUpdated,
    onSectionClick,
    onLineClick,
    onScrollToLine,
    onPlayFromLine,
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

  // コンテナ参照（スクロール操作用）
  const contentRef = useRef<HTMLElement>(null);

  // 基準線のY座標（ビューポート座標）
  const [baselineY, setBaselineY] = useState(0);
  // 基準線オフセット（コンテナ高さの25%）
  const [baselineOffset, setBaselineOffset] = useState(0);

  // コンテンツエリアのサイズ変更時に基準線位置を更新
  useEffect(() => {
    const updateBaselinePosition = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        // 基準線は画面の上から15%の位置
        const offset = rect.height * 0.25;
        setBaselineOffset(offset);
        setBaselineY(rect.top + offset);
      }
    };
    updateBaselinePosition();
    window.addEventListener('resize', updateBaselinePosition);
    const observer = new ResizeObserver(updateBaselinePosition);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateBaselinePosition);
      observer.disconnect();
    };
  }, []);

  // セクションへスムーズスクロール（ビューポート座標ベース）
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (element && contentRef.current) {
      const containerRect = contentRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // 基準線のビューポート位置（コンテナ高さの15%）
      const baselineViewportY = containerRect.top + containerRect.height * 0.25;

      // 必要なスクロール量 = 要素の現在位置 - 基準線位置
      const scrollDelta = elementRect.top - baselineViewportY;
      const newScrollTop = contentRef.current.scrollTop + scrollDelta;

      contentRef.current.scrollTo({
        top: Math.max(0, newScrollTop),
        behavior: 'smooth',
      });
    }
    onSectionClick?.(sectionId);
  }, [onSectionClick]);

  // 行へスムーズスクロール（ビューポート座標ベース）
  const scrollToLine = useCallback((lineId: string) => {
    const lineElement = contentRef.current?.querySelector(`[data-line-id="${lineId}"]`);
    if (!lineElement || !contentRef.current) return;

    const containerRect = contentRef.current.getBoundingClientRect();
    const elementRect = lineElement.getBoundingClientRect();

    // 基準線のビューポート位置（コンテナ高さの25%）
    const baselineViewportY = containerRect.top + containerRect.height * 0.25;

    // 必要なスクロール量 = 要素の現在位置 - 基準線位置
    const scrollDelta = elementRect.top - baselineViewportY;
    const newScrollTop = contentRef.current.scrollTop + scrollDelta;

    contentRef.current.scrollTo({
      top: Math.max(0, newScrollTop),
      behavior: 'smooth',
    });
  }, []); // No dependencies - uses getBoundingClientRect() for fresh values

  // scrollToLine を親に渡す
  useEffect(() => {
    onScrollToLine?.(scrollToLine);
  }, [scrollToLine, onScrollToLine]);

  // 編集モード用の状態 with undo/redo support
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

  // Destructure for convenience (null check for play mode)
  const editMetadata = editorState.metadata.title ? editorState.metadata : null;
  const editSections = editorState.sections.length > 0 ? editorState.sections : null;

  // Wrapper setters for API compatibility
  const setEditMetadata = useCallback(
    (updater: SetStateAction<EditableSongMetadata | null>) => {
      setEditorState((prev) => {
        const newMetadata = typeof updater === 'function'
          ? updater(prev.metadata.title ? prev.metadata : null)
          : updater;
        return {
          ...prev,
          metadata: newMetadata || INITIAL_EDITOR_STATE.metadata,
        };
      });
    },
    [setEditorState]
  );

  const setEditSections = useCallback(
    (updater: SetStateAction<EditableSection[] | null>) => {
      setEditorState((prev) => {
        const newSections = typeof updater === 'function'
          ? updater(prev.sections.length > 0 ? prev.sections : null)
          : updater;
        return {
          ...prev,
          sections: newSections || [],
        };
      });
    },
    [setEditorState]
  );

  const [isSaving, setIsSaving] = useState(false);

  // キャンセル確認ダイアログの状態
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // コード編集用の状態
  const [chordEditState, setChordEditState] = useState<ChordEditState | null>(null);

  // セクションの折りたたみ状態
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});


  // 編集モードの設定パネル折りたたみ状態
  const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(false);

  // Keyboard shortcuts for undo/redo (edit mode only)
  useEffect(() => {
    if (mode !== 'edit') return;

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
  }, [mode, undo, redo]);

  // 編集モードに入る時に状態を初期化
  useEffect(() => {
    if (mode === 'edit') {
      const { metadata, sections: editableSections } = initializeEditState(song);
      // Initialize editor state and reset history
      resetHistory({
        metadata,
        sections: editableSections,
      });
    }
  }, [mode, song, resetHistory]);

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

      // セクションレベルの比較（名前、リピート、カポ、BPM）
      if (
        editSec.name !== origSec.section.name ||
        editSec.repeatCount !== origSec.section.repeatCount ||
        editSec.capoOverride !== (origSec.section.transposeOverride ?? null) ||
        editSec.bpmOverride !== (origSec.section.bpmOverride ?? null) ||
        editSec.lines.length !== origSec.lines.length
      ) {
        return true;
      }

      // 行レベルの比較（歌詞、コード、小節数）
      for (let j = 0; j < editSec.lines.length; j++) {
        const editLine = editSec.lines[j];
        const origLine = origSec.lines[j];

        if (
          editLine.lyrics !== origLine.lyrics ||
          JSON.stringify(editLine.chords) !== JSON.stringify(origLine.chords) ||
          (editLine.measures ?? 4) !== (origLine.measures ?? 4)
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
          transposeOverride: section.capoOverride ?? undefined,  // TODO: Update DB schema to use capoOverride
          bpmOverride: section.bpmOverride ?? undefined,
          lines: section.lines.map((line): UpdateLineInput => ({
            id: line.id,
            lyrics: line.lyrics,
            chords: line.chords,
            measures: line.measures ?? 4,
          })),
        })),
      };

      await updateSong(songData.id, updateInput);

      // 曲データを再読み込み
      const updatedSong = await getSongById(songData.id);
      if (updatedSong) {
        const { metadata, sections: newSections } = initializeEditState(updatedSong);
        // Reset history after successful save
        resetHistory({
          metadata,
          sections: newSections,
        });
      }

      onSongUpdated?.();
    } catch (error) {
      console.error('Failed to save song:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editMetadata, editSections, hasUnsavedChanges, songData.id, onSongUpdated, resetHistory]);

  // キャンセルボタン押下時の処理
  const handleCancelClick = useCallback(() => {
    if (hasUnsavedChanges) {
      // 未保存の変更がある場合は確認ダイアログを表示
      setShowCancelConfirm(true);
    } else {
      // 変更がない場合はそのまま戻る
      onModeChange('play');
    }
  }, [hasUnsavedChanges, onModeChange]);

  // キャンセル確認後の処理（変更を破棄して戻る）
  const handleConfirmCancel = useCallback(() => {
    setShowCancelConfirm(false);
    // 編集状態をリセットして元のデータに戻す
    const { metadata, sections: editableSections } = initializeEditState(song);
    resetHistory({
      metadata,
      sections: editableSections,
    });
    // 再生モードに戻る
    onModeChange('play');
  }, [song, resetHistory, onModeChange]);

  // キャンセル確認ダイアログを閉じる
  const handleDismissCancelConfirm = useCallback(() => {
    setShowCancelConfirm(false);
  }, []);

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
        capoOverride: null,
        bpmOverride: null,
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

  // メタデータ変更ハンドラー
  const handleMetadataChange = useCallback((key: string, value: unknown) => {
    // Capo変更時はメタデータのみ変更（表示移調はeffectiveTransposeで行う）
    if (key === 'capo') {
      setEditMetadata((prev) => prev ? { ...prev, capo: value as number } : prev);
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
  }, []);

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
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onCancel={handleCancelClick}
        />

        {/* オートスクロール時の基準線 */}
        {isPlaying && mode === 'play' && (
          <div
            className="fixed pointer-events-none z-50"
            style={{ top: `${baselineY}px`, left: `${sidebarWidth ?? 280}px`, right: 0 }}
          >
            <div className="h-0.5 bg-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            {/* 基準線ラベル（右端に配置） */}
            <div className="absolute right-4 -top-3 flex items-center gap-1 text-[10px] text-cyan-400">
              <span>▶</span>
              <span>再生位置</span>
            </div>
          </div>
        )}

        {/* コンテンツエリア */}
        <main
          ref={(node) => {
            // 内部refを設定
            (contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
            // 外部refも設定
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLElement | null>).current = node;
            }
          }}
          className="flex-1 overflow-y-auto overflow-x-auto bg-background-primary select-none"
        >
        <div className="space-y-6 p-4">
          {mode === 'edit' && editSections ? (
            // 編集モード: SectionEditor を使用
            <>
              {editSections.map((section, sectionIndex) => (
                <div
                  key={section.id ?? `new-section-${sectionIndex}`}
                  id={`section-${sectionIndex}`}
                  data-section-id={section.id ?? `new-section-${sectionIndex}`}
                >
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
                  transpose={(editMetadata?.transpose ?? 0) - (editMetadata?.capo ?? 0)}
                  songBpm={editMetadata?.bpm ? parseInt(editMetadata.bpm, 10) : song.song.bpm}
                  songCapo={editMetadata?.capo ?? song.song.capo ?? 0}
                  onSectionSettingsChange={(settings) => {
                    setEditSections(prev => {
                      if (!prev) return prev;
                      const newSections = [...prev];
                      const currentSection = newSections[sectionIndex];
                      const songCapoValue = editMetadata?.capo ?? song.song.capo ?? 0;

                      // カポ変更時にコードを移調する処理
                      let updatedLines = currentSection.lines;
                      if (settings.transposeChords) {
                        // 古いカポ値と新しいカポ値の差分を計算
                        const oldCapo = currentSection.capoOverride ?? songCapoValue;
                        const newCapo = settings.capoOverride ?? songCapoValue;
                        const semitones = oldCapo - newCapo; // カポが上がると音が下がるので符号逆

                        if (semitones !== 0) {
                          // 全行のコードを移調
                          updatedLines = currentSection.lines.map(line => ({
                            ...line,
                            chords: line.chords.map(chord => ({
                              ...chord,
                              chord: transposeChord(chord.chord, semitones),
                            })),
                          }));
                        }
                      }

                      newSections[sectionIndex] = {
                        ...currentSection,
                        capoOverride: settings.capoOverride,
                        bpmOverride: settings.bpmOverride,
                        lines: updatedLines,
                      };
                      return newSections;
                    });
                  }}
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
                      capoOverride: null,
                      bpmOverride: null,
                      lines: [{ lyrics: '', chords: [] }],
                    };
                    return [...prev, newSection];
                  });
                }}
                className="w-full py-3 border-2 border-dashed border-[var(--color-border-default)] rounded-xl text-text-muted hover:text-accent-primary hover:border-accent-primary/30 transition-colors flex items-center justify-center gap-2"
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
              {/* 上部スペーサー: 常に表示（1行目の上辺が基準線位置になるよう押し下げ） */}
              <div style={{ height: `${baselineOffset}px` }} aria-hidden="true" />

              {sections.map(({ section, lines }, sectionIndex) => (
                <section
                  key={section.id}
                  className="space-y-2"
                  data-section-id={section.id}
                >
                  {/* セクションヘッダー（クリックでジャンプ） */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection(String(section.id))}
                      className="text-lg font-bold text-text-primary hover:text-accent-primary transition-colors cursor-pointer text-left"
                    >
                      {section.name}
                    </button>
                    {/* Section badges */}
                    <div className="flex items-center gap-1.5">
                      {section.repeatCount > 1 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-accent-primary/20 text-accent-primary">
                          <Repeat className="w-3 h-3" />
                          ×{section.repeatCount}
                          {isPlaying && currentSectionIndex === sectionIndex && currentRepeatIteration !== undefined && (
                            <span className="ml-1 text-accent-primary/80">
                              ({currentRepeatIteration}/{section.repeatCount})
                            </span>
                          )}
                        </span>
                      )}
                      {section.transposeOverride !== null && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400">
                          <Guitar className="w-3 h-3" />
                          Capo {section.transposeOverride}
                        </span>
                      )}
                      {section.bpmOverride !== null && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
                          <Timer className="w-3 h-3" />
                          {section.bpmOverride}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ライン表示（クリックでジャンプ） */}
                  <div className="space-y-3 bg-background-surface rounded-lg p-3">
                    {lines.map((line) => (
                      <div
                        key={line.id}
                        data-line-id={line.id}
                        onClick={() => {
                          if (isPlaying) {
                            // 再生中: handleLineClick で処理
                            onLineClick?.(String(line.id));
                          } else {
                            // 停止中: スクロールのみ
                            scrollToLine(String(line.id));
                          }
                        }}
                        className="cursor-pointer hover:bg-[var(--btn-glass-hover)] rounded transition-colors -mx-2 px-2 py-1"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (isPlaying) {
                              // 再生中: handleLineClick で処理
                              onLineClick?.(String(line.id));
                            } else {
                              // 停止中: スクロールのみ
                              scrollToLine(String(line.id));
                            }
                          }
                        }}
                      >
                        <PlayableChordLine
                          lyrics={line.lyrics}
                          chords={line.chords as ExtendedChordPosition[]}
                          transpose={effectiveTranspose}
                          viewMode={viewMode}
                          onChordClick={onChordClick}
                          onPlayFromLine={!isPlaying && onPlayFromLine ? () => onPlayFromLine(String(line.id)) : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {/* 下部スペーサー: 再生中のみ表示（最後の行がベースライン位置までスクロールできるように） */}
              {isPlaying && (
                <div style={{ height: `${(1 - baselinePosition) * 100}vh` }} aria-hidden="true" />
              )}
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

      {/* キャンセル確認ダイアログ */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--backdrop-bg)] backdrop-blur-sm">
          <div className="bg-background-surface border border-border rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              変更を破棄しますか？
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              保存されていない変更があります。編集を終了すると、変更内容は失われます。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleDismissCancelConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors"
              >
                編集を続ける
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                変更を破棄
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});

export default SongView;
