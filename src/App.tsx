import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { MainArea } from '@/components/MainArea';
import { ControlBar } from '@/components/ControlBar';
import { AddSongModal } from '@/components/AddSongModal';
import { ChordDiagramModal } from '@/components/ChordDiagramModal';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
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

  // State
  const [songs, setSongs] = useState<SongListItem[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongWithDetails | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);
  const [transpose, setTranspose] = useState(0);
  const [capo, setCapo] = useState(0);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);

  // Playlist state
  const [playlists, setPlaylists] = useState<PlaylistWithCount[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);

  // Auto scroll state
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.0);
  const [bpm, setBpm] = useState(120);

  // Metronome state
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [metronomeVolume, setMetronomeVolume] = useState(0.7);

  // Chord display mode: 'text' = chord names only, 'diagram' = fingering diagrams
  type ChordDisplayMode = 'text' | 'diagram';
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>('text');

  // Current BPM (prefer song's BPM if available)
  const currentBpm = selectedSong?.song.bpm ?? bpm;

  // Auto scroll hook
  const { scrollToTop } = useAutoScroll({
    isPlaying,
    scrollSpeed,
    bpm: currentBpm,
    bpmSync: false, // Could add UI toggle for this
    containerRef: mainAreaRef,
    onReachEnd: () => setIsPlaying(false),
  });

  // Metronome hook
  const { currentBeat, toggle: toggleMetronome } = useMetronome({
    bpm: currentBpm,
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
    onSpeedUp: () => setScrollSpeed((prev) => Math.min(prev + 0.1, 2.0)),
    onSpeedDown: () => setScrollSpeed((prev) => Math.max(prev - 0.1, 0.5)),
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
        setTranspose(0); // Reset transpose when changing songs
        setCapo(song?.song.capo ?? 0); // Set capo from song data
        setIsPlaying(false); // Stop auto-scroll when changing songs
      } else {
        setSelectedSong(null);
      }
    }
    loadSong();
  }, [selectedSongId]);

  // Handlers
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
        // Refresh selected song if it's the one being toggled
        if (selectedSongId === id) {
          const updatedSong = await getSongById(id);
          setSelectedSong(updatedSong);
        }
      }
    },
    [songs, selectedSongId]
  );

  const handleTransposeChange = useCallback((value: number) => {
    setTranspose(value);
  }, []);

  const handleCapoChange = useCallback((value: number) => {
    setCapo(value);
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

  const handleScrollSpeedChange = useCallback((value: number) => {
    setScrollSpeed(value);
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

  const handleChordDisplayModeChange = useCallback((mode: 'text' | 'diagram') => {
    setChordDisplayMode(mode);
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

  return (
    <Layout>
      <div className="flex h-screen">
        <Sidebar
          songs={songs}
          selectedSongId={selectedSongId}
          onSongSelect={handleSongSelect}
          onAddClick={handleAddClick}
          onDeleteSong={handleDeleteSong}
          onToggleFavorite={handleToggleFavorite}
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onPlaylistSelect={handlePlaylistSelect}
          onCreatePlaylist={handleCreatePlaylistClick}
        />
        <div className="flex flex-1 flex-col">
          <MainArea
            ref={mainAreaRef}
            song={selectedSong}
            transpose={transpose - capo}
            onChordClick={handleChordClick}
            onAddClick={handleAddClick}
            chordDisplayMode={chordDisplayMode}
          />
          <ControlBar
            transpose={transpose}
            onTransposeChange={handleTransposeChange}
            capo={capo}
            onCapoChange={handleCapoChange}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            scrollSpeed={scrollSpeed}
            onScrollSpeedChange={handleScrollSpeedChange}
            bpm={currentBpm}
            onBpmChange={handleBpmChange}
            metronomeEnabled={metronomeEnabled}
            onMetronomeToggle={handleMetronomeToggle}
            timeSignature={timeSignature}
            onTimeSignatureChange={handleTimeSignatureChange}
            metronomeVolume={metronomeVolume}
            onMetronomeVolumeChange={handleMetronomeVolumeChange}
            currentBeat={currentBeat}
            chordDisplayMode={chordDisplayMode}
            onChordDisplayModeChange={handleChordDisplayModeChange}
          />
        </div>
      </div>

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
    </Layout>
  );
}

export default App;
