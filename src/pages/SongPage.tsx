/**
 * SongPage - Song playback/edit page
 *
 * Contains all playback-related state and hooks extracted from AppContent.
 * Gets shared data from AppDataContext.
 *
 * Route: /songs?id=<songId>      -> play mode
 * Route: /songs/edit?id=<songId> -> edit mode
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { FloatingControlBar } from '@/components/FloatingControlBar';
import { SongView } from '@/components/SongView';
import { AddSongModal } from '@/components/AddSongModal';
import { ChordDiagramModal } from '@/components/ChordDiagramModal';
import { LyricsFullViewModal } from '@/components/LyricsFullViewModal';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { ChordDefaultsSettings } from '@/components/ChordDefaultsSettings';
import { CountInOverlay } from '@/components/CountInOverlay';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { ViewMode, AppMode } from '@/components/SongView';
import {
  useMeasureScroll,
  useKeyboardShortcuts,
  useMetronome,
  useTheme,
  useContainerScale,
  useAutoScroll,
} from '@/hooks';
import type { MeasureSectionInfo, TimeSignature } from '@/hooks';
import { Sun, Moon } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

export function SongPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const songId = searchParams.get('id');

  // Determine mode from URL path
  const isEditMode = location.pathname.endsWith('/edit');

  // Get shared data from context
  const {
    isDbReady,
    songs,
    selectedSongId,
    setSelectedSongId,
    selectedSong,
    handleSaveSong,
    handleDeleteSong,
    handleSongUpdated: contextHandleSongUpdated,
    isAddModalOpen,
    handleAddClick,
    handleModalClose,
    isChordSettingsOpen,
    setIsChordSettingsOpen,
    selectedChord,
    handleChordClick,
    handleChordModalClose,
    playlists,
    selectedPlaylistId,
    handlePlaylistSelect,
    handleCreatePlaylistClick,
    handleCreatePlaylistSave,
    handleCreatePlaylistModalClose,
    isCreatePlaylistModalOpen,
    handlePlaylistExpand,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
    expandedPlaylistId,
    expandedPlaylistSongs,
    artists,
    expandedArtistId,
    artistSongs,
    handleArtistExpand,
  } = useAppData();

  // Theme
  const { toggleTheme, isDark } = useTheme();

  // Refs
  const mainAreaRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Container scale for responsive sizing
  const { scale } = useContainerScale(containerRef);
  const scrollToLineRef = useRef<((lineId: string) => void) | null>(null);

  // App mode state - derived from URL
  const [mode, setMode] = useState<AppMode>(isEditMode ? 'edit' : 'play');
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [pendingModeChange, setPendingModeChange] = useState<AppMode | null>(null);

  // Playback state
  const [transpose, setTranspose] = useState(0);
  const [capo, setCapo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [bpm, setBpm] = useState(120);

  // Simple scroll state
  const [isSimpleScrolling, setIsSimpleScrolling] = useState(false);
  const [simpleScrollSpeed, setSimpleScrollSpeed] = useState(1.0);

  // Metronome state
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [metronomeVolume, setMetronomeVolume] = useState(0.35);

  // Count-in state
  const [isCountingIn, setIsCountingIn] = useState(false);

  // Play from specific line state
  const [playStartLineId, setPlayStartLineId] = useState<string | null>(null);
  const playStartLineIdRef = useRef<string | null>(null);
  const [countInBpm, setCountInBpm] = useState(120);

  // Lyrics modal
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false);

  // Sidebar width
  const [sidebarWidth, setSidebarWidth] = useState(288);

  // Sync URL song ID to context
  useEffect(() => {
    if (songId && songId !== selectedSongId) {
      setSelectedSongId(songId);
    } else if (!songId && selectedSongId) {
      // No song ID in URL, clear selection
      setSelectedSongId(null);
    }
  }, [songId, selectedSongId, setSelectedSongId]);

  // Sync mode from URL
  useEffect(() => {
    const urlMode: AppMode = isEditMode ? 'edit' : 'play';
    if (mode !== urlMode) {
      setMode(urlMode);
    }
  }, [isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load song settings when selected song changes
  useEffect(() => {
    if (selectedSong) {
      setTranspose(selectedSong.song.transpose ?? 0);
      setCapo(selectedSong.song.capo ?? 0);
      setPlaybackSpeed(selectedSong.song.playbackSpeed ?? 1.0);
      setBpm(selectedSong.song.bpm ?? 120);
      setTimeSignature(selectedSong.song.timeSignature ?? '4/4');
      setIsPlaying(false);
    }
  }, [selectedSong?.song.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Current BPM (prefer song's BPM if available)
  const currentBpm = selectedSong?.song.bpm ?? bpm;

  // Prepare sections data for measure-based scrolling
  const measureScrollSections: MeasureSectionInfo[] = useMemo(() => {
    if (!selectedSong) return [];
    return selectedSong.sections.map(({ section, lines }) => ({
      id: section.id,
      lines: lines.map(line => ({
        id: line.id,
        measures: line.measures ?? 4,
      })),
      bpmOverride: section.bpmOverride ?? null,
      playbackSpeedOverride: null,
      repeatCount: section.repeatCount,
    }));
  }, [selectedSong]);

  // Measure-based scroll hook
  const { reset: resetScroll, jumpToLine, currentRepeatIteration, currentSectionIndex } = useMeasureScroll({
    containerRef: mainAreaRef,
    sections: measureScrollSections,
    songBpm: currentBpm,
    songTimeSignature: timeSignature,
    isPlaying,
    onLineChange: undefined,
    scrollToLine: (lineId) => scrollToLineRef.current?.(lineId),
  });

  // Simple autoscroll hook
  useAutoScroll({
    isPlaying: isSimpleScrolling,
    scrollSpeed: simpleScrollSpeed,
    bpm: undefined,
    bpmSync: false,
    containerRef: mainAreaRef,
    onReachEnd: () => setIsSimpleScrolling(false),
  });

  // Scroll to top function for keyboard shortcuts
  const scrollToTop = useCallback(() => {
    resetScroll();
    if (mainAreaRef.current) {
      mainAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [resetScroll]);

  // Find the line nearest to the baseline position
  const findNearestLineToBaseline = useCallback((): string | null => {
    if (!mainAreaRef.current) return null;

    const container = mainAreaRef.current;
    const containerRect = container.getBoundingClientRect();
    const baselineY = containerRect.top + containerRect.height * 0.35;

    const lineElements = container.querySelectorAll('[data-line-id]');
    if (lineElements.length === 0) return null;

    let nearestLineId: string | null = null;
    let minDistance = Infinity;

    lineElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const lineTop = rect.top;
      const distance = Math.abs(lineTop - baselineY);

      if (distance < minDistance) {
        minDistance = distance;
        nearestLineId = element.getAttribute('data-line-id');
      }
    });

    return nearestLineId;
  }, []);

  // Metronome hook
  const {
    currentBeat,
    start: startMetronome,
    stop: stopMetronome,
  } = useMetronome({
    bpm: currentBpm,
    timeSignature,
    volume: metronomeEnabled ? metronomeVolume : 0,
    accentFirstBeat: true,
  });

  const handleMetronomeToggle = useCallback(() => {
    setMetronomeEnabled((prev) => !prev);
  }, []);

  // Mode change handler - uses navigate
  const handleModeChange = useCallback((newMode: AppMode) => {
    if (songId) {
      if (newMode === 'edit') {
        navigate(`/songs/edit?id=${songId}`);
      } else {
        navigate(`/songs?id=${songId}`);
      }
    }
  }, [songId, navigate]);

  // Confirm mode change (after unsaved changes dialog)
  const confirmModeChange = useCallback(() => {
    if (pendingModeChange) {
      handleModeChange(pendingModeChange);
      setPendingModeChange(null);
    }
    setShowUnsavedChangesDialog(false);
  }, [pendingModeChange, handleModeChange]);

  // Cancel mode change
  const cancelModeChange = useCallback(() => {
    setPendingModeChange(null);
    setShowUnsavedChangesDialog(false);
  }, []);

  // Song select handler - navigates to song
  const handleSongSelect = useCallback((id: string) => {
    navigate(`/songs?id=${id}`);
  }, [navigate]);

  // Edit song handler - navigates to edit mode
  const handleEditSong = useCallback((id: string) => {
    navigate(`/songs/edit?id=${id}`);
  }, [navigate]);

  // Song updated callback (wraps context + syncs local state)
  const handleSongUpdated = useCallback(async () => {
    await contextHandleSongUpdated();
    // Re-sync local playback settings from updated song
    if (selectedSongId) {
      // The context will update selectedSong, and the useEffect above will sync settings
    }
  }, [contextHandleSongUpdated, selectedSongId]);

  // Control handlers
  const handleTransposeChange = useCallback((value: number) => {
    setTranspose(value);
  }, []);

  const handleCapoChange = useCallback((value: number) => {
    setCapo(value);
  }, []);

  const handlePlaybackSpeedChange = useCallback((value: number) => {
    setPlaybackSpeed(value);
  }, []);

  // Lyrics modal handlers
  const handleOpenLyricsModal = useCallback(() => {
    setIsLyricsModalOpen(true);
  }, []);

  const handleCloseLyricsModal = useCallback(() => {
    setIsLyricsModalOpen(false);
  }, []);

  // Play/Pause handler with count-in support
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      stopMetronome();
    } else {
      if (isSimpleScrolling) {
        setIsSimpleScrolling(false);
      }
      if (!playStartLineId) {
        const nearestLineId = findNearestLineToBaseline();
        const startLineId = nearestLineId ?? measureScrollSections[0]?.lines[0]?.id;
        if (startLineId) {
          setPlayStartLineId(startLineId);
          playStartLineIdRef.current = startLineId;
          setCountInBpm(currentBpm);
        }
      }
      setIsCountingIn(true);
    }
  }, [isPlaying, isSimpleScrolling, playStartLineId, measureScrollSections, currentBpm, stopMetronome, findNearestLineToBaseline]);

  // Count-in complete handler
  const handleCountInComplete = useCallback(() => {
    setIsCountingIn(false);
    setIsPlaying(true);
    startMetronome();

    // SongTopBarの折りたたみアニメーション(300ms)完了後にスクロール
    // アニメーション中にscrollToLineを呼ぶとレイアウトシフトでズレる
    setTimeout(() => {
      const lineId = playStartLineIdRef.current;
      if (lineId) {
        jumpToLine(lineId);
      }

      setPlayStartLineId(null);
      playStartLineIdRef.current = null;
    }, 350);
  }, [startMetronome, jumpToLine]);

  // Count-in cancel handler
  const handleCountInCancel = useCallback(() => {
    setIsCountingIn(false);
  }, []);

  // Play from specific line handler
  const handlePlayFromLine = useCallback((lineId: string) => {
    for (let si = 0; si < measureScrollSections.length; si++) {
      const li = measureScrollSections[si].lines.findIndex(l => l.id === lineId);
      if (li !== -1) {
        const effectiveBpm = measureScrollSections[si].bpmOverride ?? currentBpm;
        setCountInBpm(effectiveBpm);
        break;
      }
    }

    setPlayStartLineId(lineId);
    playStartLineIdRef.current = lineId;
    setIsCountingIn(true);
  }, [measureScrollSections, currentBpm]);

  // Line click handler during playback
  const handleLineClick = useCallback((lineId: string) => {
    if (!isPlaying) return;

    stopMetronome();
    jumpToLine(lineId);
    startMetronome();
  }, [isPlaying, stopMetronome, startMetronome, jumpToLine]);

  // Play from beginning handler
  const handlePlayFromBeginning = useCallback(() => {
    const firstLineId = measureScrollSections[0]?.lines[0]?.id;
    if (firstLineId) {
      setPlayStartLineId(firstLineId);
      playStartLineIdRef.current = firstLineId;
      setCountInBpm(currentBpm);
      setIsCountingIn(true);
    }
  }, [measureScrollSections, currentBpm]);

  // Simple scroll toggle handler
  const handleSimpleScrollToggle = useCallback(() => {
    if (isSimpleScrolling) {
      setIsSimpleScrolling(false);
    } else {
      if (isPlaying) {
        setIsPlaying(false);
        stopMetronome();
      }
      setIsSimpleScrolling(true);
    }
  }, [isSimpleScrolling, isPlaying, stopMetronome]);

  // Simple scroll speed change handler
  const handleSimpleScrollSpeedChange = useCallback((value: number) => {
    setSimpleScrollSpeed(value);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onSpeedUp: () => setPlaybackSpeed((prev) => Math.min(prev + 0.1, 3.0)),
    onSpeedDown: () => setPlaybackSpeed((prev) => Math.max(prev - 0.1, 0.1)),
    onScrollToTop: scrollToTop,
    onMetronomeToggle: handleMetronomeToggle,
  });

  const handleBpmChange = useCallback((value: number) => {
    setBpm(value);
  }, []);

  const handleTimeSignatureChange = useCallback((value: TimeSignature) => {
    setTimeSignature(value);
  }, []);

  const handleMetronomeVolumeChange = useCallback((value: number) => {
    setMetronomeVolume(value);
  }, []);

  // Loading state
  if (!isDbReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Empty state (no song selected)
  const emptyState = (
    <div className="flex-1 flex items-center justify-center bg-background-primary relative">
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
        title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <div className="glass-premium highlight-line rounded-3xl p-12 text-center animate-fade-in max-w-md">
        {/* Music icon with orange glow */}
        <div className="relative inline-block mb-6">
          <div
            className="absolute inset-0 blur-xl opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.6) 0%, transparent 70%)',
              transform: 'scale(1.5)'
            }}
          />
          <svg
            className="w-20 h-20 mx-auto text-accent-primary relative animate-fade-in"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>

        {/* Text content */}
        <h2 className="text-xl font-semibold text-text-primary mb-2">曲を選択してください</h2>
        <p className="text-text-secondary mb-6">サイドバーから曲を選択するか、新しい曲を追加してください</p>

        {/* Add song button */}
        <button
          onClick={handleAddClick}
          className="btn-glass-primary px-6 py-3 flex items-center gap-2 mx-auto rounded-xl font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          曲を追加
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex h-screen overflow-visible">
        {/* Left side: Sidebar (play mode only, edit mode has SettingsPanel in SongView) */}
        {mode === 'play' && (
          <Sidebar
            songs={songs}
            selectedSongId={selectedSongId}
            onSongSelect={handleSongSelect}
            onAddClick={handleAddClick}
            onDeleteSong={handleDeleteSong}
            onEditSong={handleEditSong}
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            onPlaylistSelect={handlePlaylistSelect}
            onCreatePlaylist={handleCreatePlaylistClick}
            onAddSongToPlaylist={handleAddSongToPlaylist}
            expandedPlaylistId={expandedPlaylistId}
            expandedPlaylistSongs={expandedPlaylistSongs}
            onPlaylistExpand={handlePlaylistExpand}
            onRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
            artists={artists}
            expandedArtistId={expandedArtistId}
            artistSongs={artistSongs}
            onArtistExpand={handleArtistExpand}
            onWidthChange={setSidebarWidth}
            scale={scale}
            onOpenChordSettings={() => setIsChordSettingsOpen(true)}
          />
        )}

        {/* Main content area */}
        <div ref={containerRef} className="flex flex-1 flex-col min-w-0 h-full">
          {selectedSong ? (
            <>
              {/* Scrollable content area */}
              <div className="flex-1 min-h-0 overflow-hidden relative">
                <SongView
                  ref={mainAreaRef}
                  song={selectedSong}
                  sidebarWidth={sidebarWidth}
                  mode={mode}
                  viewMode={viewMode}
                  transpose={transpose}
                  capo={capo}
                  playbackSpeed={playbackSpeed}
                  isPlaying={isPlaying}
                  isSimpleScrolling={isSimpleScrolling}
                  onModeChange={handleModeChange}
                  onViewModeChange={setViewMode}
                  onChordClick={handleChordClick}
                  onSongUpdated={handleSongUpdated}
                  onTransposeChange={handleTransposeChange}
                  onCapoChange={handleCapoChange}
                  onPlaybackSpeedChange={handlePlaybackSpeedChange}
                  onLineClick={handleLineClick}
                  onScrollToLine={(fn) => { scrollToLineRef.current = fn; }}
                  onPlayFromLine={handlePlayFromLine}
                  currentRepeatIteration={currentRepeatIteration}
                  currentSectionIndex={currentSectionIndex}
                  onOpenLyricsModal={handleOpenLyricsModal}
                />

                {/* Floating control bar */}
                {mode === 'play' && (
                  <FloatingControlBar
                    transpose={transpose}
                    onTransposeChange={handleTransposeChange}
                    capo={capo}
                    onCapoChange={handleCapoChange}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onPlayFromBeginning={handlePlayFromBeginning}
                    bpm={currentBpm}
                    onBpmChange={handleBpmChange}
                    metronomeEnabled={metronomeEnabled}
                    onMetronomeToggle={handleMetronomeToggle}
                    timeSignature={timeSignature}
                    onTimeSignatureChange={handleTimeSignatureChange}
                    metronomeVolume={metronomeVolume}
                    onMetronomeVolumeChange={handleMetronomeVolumeChange}
                    currentBeat={currentBeat}
                    containerRef={mainAreaRef}
                    scale={scale}
                    isSimpleScrolling={isSimpleScrolling}
                    onSimpleScrollToggle={handleSimpleScrollToggle}
                    simpleScrollSpeed={simpleScrollSpeed}
                    onSimpleScrollSpeedChange={handleSimpleScrollSpeedChange}
                    headerVisible={!((isPlaying || isSimpleScrolling) && mode === 'play')}
                  />
                )}
              </div>
            </>
          ) : songId ? (
            // Song is loading from URL - show spinner instead of empty state
            <div className="flex-1 flex items-center justify-center bg-background-primary">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">読み込み中...</p>
              </div>
            </div>
          ) : (
            emptyState
          )}
        </div>
      </div>

      {/* Modals */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveSong}
        onSaveAndEdit={(songId) => {
          navigate(`/songs/edit?id=${songId}`);
        }}
      />

      <ChordDiagramModal chord={selectedChord} onClose={handleChordModalClose} />

      {/* Lyrics full view modal */}
      {isLyricsModalOpen && (
        <LyricsFullViewModal
          song={selectedSong}
          onClose={handleCloseLyricsModal}
        />
      )}

      <CreatePlaylistModal
        isOpen={isCreatePlaylistModalOpen}
        onClose={handleCreatePlaylistModalClose}
        onSave={handleCreatePlaylistSave}
      />

      {/* Chord defaults settings modal */}
      <ChordDefaultsSettings
        isOpen={isChordSettingsOpen}
        onClose={() => setIsChordSettingsOpen(false)}
      />

      {/* Unsaved changes confirmation dialog */}
      <ConfirmDialog
        isOpen={showUnsavedChangesDialog}
        title="未保存の変更があります"
        message="変更を保存せずに終了しますか？"
        confirmLabel="破棄して終了"
        cancelLabel="キャンセル"
        variant="danger"
        onConfirm={confirmModeChange}
        onCancel={cancelModeChange}
      />

      {/* Count-in overlay */}
      <CountInOverlay
        isActive={isCountingIn}
        bpm={countInBpm}
        timeSignature={timeSignature}
        playAudio={metronomeEnabled}
        volume={metronomeVolume}
        onComplete={handleCountInComplete}
        onCancel={handleCountInCancel}
      />
    </>
  );
}
