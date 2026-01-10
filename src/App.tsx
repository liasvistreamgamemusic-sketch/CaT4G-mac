import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { ControlBar } from '@/components/ControlBar';
import { AddSongModal } from '@/components/AddSongModal';
import { ChordDiagramModal } from '@/components/ChordDiagramModal';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { SongView } from '@/components/SongView';
import type { ViewMode, AppMode } from '@/components/SongView';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAutoScroll, useKeyboardShortcuts, useMetronome } from '@/hooks';
import type { TimeSignature } from '@/hooks';
import {
  initDatabase,
  getSongs,
  getSongById,
  saveSong,
  deleteSong,
  updateSongFavorite,
  getPlaylists,
  createPlaylist,
} from '@/lib/database';
import type {
  SongListItem,
  SongWithDetails,
  CreateSongInput,
  PlaylistWithCount,
} from '@/types/database';

function App() {
  // Refs
  const mainAreaRef = useRef<HTMLElement>(null);

  // App mode state
  const [mode, setMode] = useState<AppMode>('play');
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [pendingModeChange, setPendingModeChange] = useState<AppMode | null>(null);

  // Song state
  const [songs, setSongs] = useState<SongListItem[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongWithDetails | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);
  const [transpose, setTranspose] = useState(0);
  const [capo, setCapo] = useState(0);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);

  // Playlist state
  const [playlists, setPlaylists] = useState<PlaylistWithCount[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [bpm, setBpm] = useState(120);

  // Metronome state
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [metronomeVolume, setMetronomeVolume] = useState(0.7);

  // Current BPM (prefer song's BPM if available)
  const currentBpm = selectedSong?.song.bpm ?? bpm;

  // Auto scroll hook
  const { scrollToTop } = useAutoScroll({
    isPlaying,
    scrollSpeed: playbackSpeed,
    bpm: currentBpm,
    bpmSync: false,
    containerRef: mainAreaRef,
    onReachEnd: () => setIsPlaying(false),
  });

  // Metronome hook
  const { currentBeat, toggle: toggleMetronome } = useMetronome({
    bpm: Math.round(currentBpm * playbackSpeed), // Apply playback speed to metronome
    timeSignature,
    volume: metronomeVolume,
    accentFirstBeat: true,
  });

  // Sync metronome state with hook
  useEffect(() => {
    if (metronomeEnabled) {
      toggleMetronome();
    }
  }, []); // Only run once on mount

  const handleMetronomeToggle = useCallback(() => {
    setMetronomeEnabled((prev) => !prev);
    toggleMetronome();
  }, [toggleMetronome]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: () => setIsPlaying((prev) => !prev),
    onSpeedUp: () => setPlaybackSpeed((prev) => Math.min(prev + 0.1, 3.0)),
    onSpeedDown: () => setPlaybackSpeed((prev) => Math.max(prev - 0.1, 0.1)),
    onScrollToTop: scrollToTop,
    onMetronomeToggle: handleMetronomeToggle,
  });

  // Initialize database and load songs + playlists
  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        setIsDbReady(true);
        const [songList, playlistList] = await Promise.all([
          getSongs(),
          getPlaylists(),
        ]);
        setSongs(songList);
        setPlaylists(playlistList);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }
    init();
  }, []);

  // Load selected song details
  useEffect(() => {
    async function loadSong() {
      if (selectedSongId) {
        const song = await getSongById(selectedSongId);
        setSelectedSong(song);
        // 曲に保存された設定を読み込む
        setTranspose(song?.song.transpose ?? 0);
        setCapo(song?.song.capo ?? 0);
        setPlaybackSpeed(song?.song.playbackSpeed ?? 1.0);
        if (song?.song.bpm) {
          setBpm(song.song.bpm);
        }
        setTimeSignature(song?.song.timeSignature ?? '4/4');
        setIsPlaying(false);
        // Reset mode to play when changing songs
        setMode('play');
      } else {
        setSelectedSong(null);
      }
    }
    loadSong();
  }, [selectedSongId]);

  // Mode change handler with unsaved changes check
  const handleModeChange = useCallback((newMode: AppMode) => {
    // For now, allow direct mode change
    // TODO: Add unsaved changes detection when edit mode is fully implemented
    setMode(newMode);
  }, []);

  // Confirm mode change (after unsaved changes dialog)
  const confirmModeChange = useCallback(() => {
    if (pendingModeChange) {
      setMode(pendingModeChange);
      setPendingModeChange(null);
    }
    setShowUnsavedChangesDialog(false);
  }, [pendingModeChange]);

  // Cancel mode change
  const cancelModeChange = useCallback(() => {
    setPendingModeChange(null);
    setShowUnsavedChangesDialog(false);
  }, []);

  // Song handlers
  const handleSongSelect = useCallback((id: string) => {
    setSelectedSongId(id);
  }, []);

  const handleAddClick = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleSaveSong = useCallback(async (input: CreateSongInput) => {
    const newId = await saveSong(input);
    const updatedSongs = await getSongs();
    setSongs(updatedSongs);
    setSelectedSongId(newId);
  }, []);

  const handleDeleteSong = useCallback(
    async (id: string) => {
      await deleteSong(id);
      const updatedSongs = await getSongs();
      setSongs(updatedSongs);
      if (selectedSongId === id) {
        setSelectedSongId(null);
      }
    },
    [selectedSongId]
  );

  const handleToggleFavorite = useCallback(
    async (id: string) => {
      const song = songs.find((s) => s.id === id);
      if (song) {
        await updateSongFavorite(id, !song.isFavorite);
        const updatedSongs = await getSongs();
        setSongs(updatedSongs);
        if (selectedSongId === id) {
          const updatedSong = await getSongById(id);
          setSelectedSong(updatedSong);
        }
      }
    },
    [songs, selectedSongId]
  );

  // Edit song handler (switch to edit mode)
  const handleEditSong = useCallback((id: string) => {
    setSelectedSongId(id);
    setMode('edit');
  }, []);

  // Song updated callback
  const handleSongUpdated = useCallback(async () => {
    const updatedSongs = await getSongs();
    setSongs(updatedSongs);
    if (selectedSongId) {
      const updatedSong = await getSongById(selectedSongId);
      setSelectedSong(updatedSong);
      // 編集後の設定を同期（保存された値を読み込む）
      if (updatedSong) {
        setCapo(updatedSong.song.capo);
        setTranspose(updatedSong.song.transpose ?? 0);
        setPlaybackSpeed(updatedSong.song.playbackSpeed ?? 1.0);
        if (updatedSong.song.bpm) {
          setBpm(updatedSong.song.bpm);
        }
        setTimeSignature(updatedSong.song.timeSignature);
      }
    }
  }, [selectedSongId]);

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

  const handleChordClick = useCallback((chord: string) => {
    setSelectedChord(chord);
  }, []);

  const handleChordModalClose = useCallback(() => {
    setSelectedChord(null);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);


  const handleBpmChange = useCallback((value: number) => {
    setBpm(value);
  }, []);

  const handleTimeSignatureChange = useCallback((value: TimeSignature) => {
    setTimeSignature(value);
  }, []);

  const handleMetronomeVolumeChange = useCallback((value: number) => {
    setMetronomeVolume(value);
  }, []);

  // Playlist handlers
  const handlePlaylistSelect = useCallback((id: string) => {
    setSelectedPlaylistId(id);
  }, []);

  const handleCreatePlaylistClick = useCallback(() => {
    setIsCreatePlaylistModalOpen(true);
  }, []);

  const handleCreatePlaylistModalClose = useCallback(() => {
    setIsCreatePlaylistModalOpen(false);
  }, []);

  const handleCreatePlaylistSave = useCallback(async (name: string, description?: string) => {
    await createPlaylist({ name, description });
    const updatedPlaylists = await getPlaylists();
    setPlaylists(updatedPlaylists);
    setIsCreatePlaylistModalOpen(false);
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
    <div className="flex-1 flex items-center justify-center bg-background-primary">
      <div className="text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50"
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
        <p className="text-text-muted mb-4">曲を選択してください</p>
        <button
          onClick={handleAddClick}
          className="btn-primary px-6 py-2 flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          曲を追加
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="flex h-screen">
        {/* Left side: Sidebar (play mode only, edit mode has SettingsPanel in SongView) */}
        {mode === 'play' && (
          <Sidebar
            songs={songs}
            selectedSongId={selectedSongId}
            onSongSelect={handleSongSelect}
            onAddClick={handleAddClick}
            onDeleteSong={handleDeleteSong}
            onToggleFavorite={handleToggleFavorite}
            onEditSong={handleEditSong}
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            onPlaylistSelect={handlePlaylistSelect}
            onCreatePlaylist={handleCreatePlaylistClick}
          />
        )}

        {/* Main content area - flex structure mirrors sidebar for alignment */}
        <div className="flex flex-1 flex-col min-w-0 h-full">
          {selectedSong ? (
            <>
              {/* Scrollable content area - takes remaining space */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <SongView
                  ref={mainAreaRef}
                  song={selectedSong}
                  mode={mode}
                  viewMode={viewMode}
                  transpose={transpose}
                  capo={capo}
                  playbackSpeed={playbackSpeed}
                  isPlaying={isPlaying}
                  onModeChange={handleModeChange}
                  onViewModeChange={setViewMode}
                  onChordClick={handleChordClick}
                  onSongUpdated={handleSongUpdated}
                  onTransposeChange={handleTransposeChange}
                  onCapoChange={handleCapoChange}
                  onPlaybackSpeedChange={handlePlaybackSpeedChange}
                />
              </div>

              {/* Control bar - fixed at bottom, aligns with sidebar button */}
              {mode === 'play' && (
                <div className="flex-shrink-0 border-t border-border">
                  <ControlBar
                    transpose={transpose}
                    onTransposeChange={handleTransposeChange}
                    capo={capo}
                    onCapoChange={handleCapoChange}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    playbackSpeed={playbackSpeed}
                    onPlaybackSpeedChange={handlePlaybackSpeedChange}
                    bpm={currentBpm}
                    onBpmChange={handleBpmChange}
                    metronomeEnabled={metronomeEnabled}
                    onMetronomeToggle={handleMetronomeToggle}
                    timeSignature={timeSignature}
                    onTimeSignatureChange={handleTimeSignatureChange}
                    metronomeVolume={metronomeVolume}
                    onMetronomeVolumeChange={handleMetronomeVolumeChange}
                    currentBeat={currentBeat}
                  />
                </div>
              )}
            </>
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
      />

      <ChordDiagramModal chord={selectedChord} onClose={handleChordModalClose} />

      <CreatePlaylistModal
        isOpen={isCreatePlaylistModalOpen}
        onClose={handleCreatePlaylistModalClose}
        onSave={handleCreatePlaylistSave}
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
    </Layout>
  );
}

export default App;
