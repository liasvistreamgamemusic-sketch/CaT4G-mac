import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { FloatingControlBar } from '@/components/FloatingControlBar';
import { AddSongModal } from '@/components/AddSongModal';
import { ChordDiagramModal } from '@/components/ChordDiagramModal';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { SongView } from '@/components/SongView';
import { CountInOverlay } from '@/components/CountInOverlay';
import type { ViewMode, AppMode } from '@/components/SongView';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useMeasureScroll, useKeyboardShortcuts, useMetronome } from '@/hooks';
import type { MeasureSectionInfo } from '@/hooks';
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
  getPlaylistById,
  removeSongFromPlaylist,
  getArtists,
  getSongsByArtist,
} from '@/lib/database';
import type {
  SongListItem,
  SongWithDetails,
  CreateSongInput,
  PlaylistWithCount,
  Artist,
} from '@/types/database';

function App() {
  // Refs
  const mainAreaRef = useRef<HTMLElement>(null);
  const scrollToLineRef = useRef<((lineId: string) => void) | null>(null);

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

  // Expanded playlist state
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);
  const [expandedPlaylistSongs, setExpandedPlaylistSongs] = useState<{id: string; title: string; artistName: string | null}[]>([]);

  // Artist state
  const [artists, setArtists] = useState<Artist[]>([]);
  const [expandedArtistId, setExpandedArtistId] = useState<string | null>(null);
  const [artistSongs, setArtistSongs] = useState<SongListItem[]>([]);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [bpm, setBpm] = useState(120);

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
      playbackSpeedOverride: null, // Removed playback speed feature
    }));
  }, [selectedSong]);

  // Measure-based scroll hook
  const { reset: resetScroll, jumpToLine } = useMeasureScroll({
    containerRef: mainAreaRef,
    sections: measureScrollSections,
    songBpm: currentBpm,
    songTimeSignature: timeSignature,
    isPlaying,
    onLineChange: undefined,
    scrollToLine: (lineId) => scrollToLineRef.current?.(lineId),
  });

  // Scroll to top function for keyboard shortcuts
  const scrollToTop = useCallback(() => {
    resetScroll();
    if (mainAreaRef.current) {
      mainAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [resetScroll]);

  // Find the line nearest to the baseline position (25% from top)
  const findNearestLineToBaseline = useCallback((): string | null => {
    if (!mainAreaRef.current) return null;

    const container = mainAreaRef.current;
    const containerRect = container.getBoundingClientRect();
    // 基準線は画面の上から15%の位置
    const baselineY = containerRect.top + containerRect.height * 0.25;

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
  // メトロノームは常に動作し、音声は metronomeEnabled で制御（volume=0で無音）
  const {
    currentBeat,
    start: startMetronome,
    stop: stopMetronome,
  } = useMetronome({
    bpm: currentBpm,
    timeSignature,
    volume: metronomeEnabled ? metronomeVolume : 0, // 無効時は音量0
    accentFirstBeat: true,
  });

  // メトロノームのオン/オフ切り替え（UIトグルボタン用）
  // 音声のオン/オフのみを制御（ビジュアルは常に表示）
  const handleMetronomeToggle = useCallback(() => {
    setMetronomeEnabled((prev) => !prev);
  }, []);

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

  // Load artists (including "その他" for songs without artist)
  const loadArtists = useCallback(async () => {
    const dbArtists = await getArtists();

    // Check if there are songs without an artist
    const songsWithoutArtist = songs.filter(s => !s.artistName);

    // Add "その他" virtual artist if there are songs without artist
    const allArtists: Artist[] = [...dbArtists];
    if (songsWithoutArtist.length > 0) {
      allArtists.push({
        id: '__no_artist__',
        name: 'その他',
        createdAt: new Date().toISOString(),
      });
    }

    setArtists(allArtists);
  }, [songs]);

  // Load artists when songs change
  useEffect(() => {
    if (isDbReady && songs.length >= 0) {
      loadArtists();
    }
  }, [isDbReady, songs, loadArtists]);

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

  // Play/Pause handler with count-in support
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      // 停止時
      setIsPlaying(false);
      // メトロノームも停止（ビジュアルカウントのため常に停止）
      stopMetronome();
    } else {
      // playStartLineId がなければ基準線に最も近い行から開始
      if (!playStartLineId) {
        const nearestLineId = findNearestLineToBaseline();
        const startLineId = nearestLineId ?? measureScrollSections[0]?.lines[0]?.id;
        if (startLineId) {
          setPlayStartLineId(startLineId);
          playStartLineIdRef.current = startLineId;
          setCountInBpm(currentBpm);
        }
      }
      // 再生開始時はカウントインを開始
      setIsCountingIn(true);
    }
  }, [isPlaying, playStartLineId, measureScrollSections, currentBpm, stopMetronome, findNearestLineToBaseline]);

  // カウントイン完了時のハンドラー
  // 注意: playStartLineIdRef を使用して依存配列から playStartLineId を除外
  // これにより onComplete の変更によるカウントインのリセットを防ぐ
  const handleCountInComplete = useCallback(() => {
    setIsCountingIn(false);
    setIsPlaying(true);
    // メトロノームを開始（音声はmetronomeEnabledで制御、ビジュアルは常に表示）
    startMetronome();

    // 2フレーム待ってからスクロール（スペーサー配置を確実に待つ）
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const lineId = playStartLineIdRef.current;
        if (lineId) {
          jumpToLine(lineId);
          // Note: scrollToLineRef.current は jumpToLine 内で呼ばれるため不要
        }
        // resetScroll() は呼ばない - jumpToLine で既に位置設定済み

        // 再生後は playStartLineId をリセット（rAFコールバック内で実行）
        setPlayStartLineId(null);
        playStartLineIdRef.current = null;
      });
    });
  }, [startMetronome, jumpToLine]);

  // カウントインキャンセル時のハンドラー
  const handleCountInCancel = useCallback(() => {
    setIsCountingIn(false);
  }, []);

  // 特定行から再生するハンドラー
  const handlePlayFromLine = useCallback((lineId: string) => {
    // セクション固有のBPMを取得
    for (let si = 0; si < measureScrollSections.length; si++) {
      const li = measureScrollSections[si].lines.findIndex(l => l.id === lineId);
      if (li !== -1) {
        const effectiveBpm = measureScrollSections[si].bpmOverride ?? currentBpm;
        setCountInBpm(effectiveBpm);
        break;
      }
    }

    // state と ref の両方を更新
    setPlayStartLineId(lineId);
    playStartLineIdRef.current = lineId;
    setIsCountingIn(true);
  }, [measureScrollSections, currentBpm]);

  // 再生中の行クリック時のハンドラー（メトロノームを再スタート）
  const handleLineClick = useCallback((lineId: string) => {
    if (!isPlaying) return;

    stopMetronome();
    jumpToLine(lineId);
    // scrollToLineRef.current?.(lineId); ← 削除（jumpToLine内で呼ばれる）
    startMetronome();
  }, [isPlaying, stopMetronome, startMetronome, jumpToLine]);

  // 最初から再生するハンドラー
  const handlePlayFromBeginning = useCallback(() => {
    const firstLineId = measureScrollSections[0]?.lines[0]?.id;
    if (firstLineId) {
      setPlayStartLineId(firstLineId);
      playStartLineIdRef.current = firstLineId;
      setCountInBpm(currentBpm);
      setIsCountingIn(true);
    }
  }, [measureScrollSections, currentBpm]);

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

  // Handle playlist expand/collapse
  const handlePlaylistExpand = useCallback(async (playlistId: string) => {
    if (expandedPlaylistId === playlistId) {
      // Collapse
      setExpandedPlaylistId(null);
      setExpandedPlaylistSongs([]);
    } else {
      // Expand
      setExpandedPlaylistId(playlistId);
      const playlistData = await getPlaylistById(playlistId);
      if (playlistData) {
        setExpandedPlaylistSongs(playlistData.songs.map(s => ({
          id: s.id,
          title: s.title,
          artistName: s.artistName,
        })));
      }
    }
  }, [expandedPlaylistId]);

  // Handle remove song from playlist
  const handleRemoveSongFromPlaylist = useCallback(async (playlistId: string, songId: string) => {
    await removeSongFromPlaylist(playlistId, songId);
    // Refresh playlist songs
    const playlistData = await getPlaylistById(playlistId);
    if (playlistData) {
      setExpandedPlaylistSongs(playlistData.songs.map(s => ({
        id: s.id,
        title: s.title,
        artistName: s.artistName,
      })));
    }
    // Refresh playlists to update song count
    const updatedPlaylists = await getPlaylists();
    setPlaylists(updatedPlaylists);
  }, []);

  // Handle artist expand/collapse
  const handleArtistExpand = useCallback(async (artistId: string) => {
    if (expandedArtistId === artistId) {
      // Collapse
      setExpandedArtistId(null);
      setArtistSongs([]);
    } else {
      // Expand
      setExpandedArtistId(artistId);

      if (artistId === '__no_artist__') {
        // Special case: songs without artist
        const songsWithoutArtist = songs.filter(s => !s.artistName);
        setArtistSongs(songsWithoutArtist);
      } else {
        const songsByArtist = await getSongsByArtist(artistId);
        setArtistSongs(songsByArtist);
      }
    }
  }, [expandedArtistId, songs]);

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
      <div className="glass-premium highlight-line rounded-3xl p-12 text-center animate-fade-in max-w-md">
        {/* Music icon with purple glow */}
        <div className="relative inline-block mb-6">
          <div
            className="absolute inset-0 blur-xl opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
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

        {/* Add song button with glass-primary style */}
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
            expandedPlaylistId={expandedPlaylistId}
            expandedPlaylistSongs={expandedPlaylistSongs}
            onPlaylistExpand={handlePlaylistExpand}
            onRemoveSongFromPlaylist={handleRemoveSongFromPlaylist}
            artists={artists}
            expandedArtistId={expandedArtistId}
            artistSongs={artistSongs}
            onArtistExpand={handleArtistExpand}
          />
        )}

        {/* Main content area - flex structure mirrors sidebar for alignment */}
        <div className="flex flex-1 flex-col min-w-0 h-full">
          {selectedSong ? (
            <>
              {/* Scrollable content area - takes remaining space */}
              <div className="flex-1 min-h-0 overflow-hidden relative">
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
                  onLineClick={handleLineClick}
                  onScrollToLine={(fn) => { scrollToLineRef.current = fn; }}
                  onPlayFromLine={handlePlayFromLine}
                />

                {/* Floating control bar - positioned inside scrollable area */}
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
                  />
                )}
              </div>
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
    </Layout>
  );
}

export default App;
