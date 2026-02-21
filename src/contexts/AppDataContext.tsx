/**
 * AppDataContext - Shared application data state and handlers
 *
 * Extracted from App.tsx's AppContent to enable routing.
 * Contains:
 * - Song list, selected song, DB initialization
 * - Playlist management (CRUD, expand/collapse)
 * - Artist management (list, expand/collapse)
 * - Modal state (AddSong, CreatePlaylist, ChordSettings, ChordDiagram)
 * - Realtime sync
 *
 * Does NOT contain:
 * - Playback state (mode, viewMode, transpose, capo, isPlaying, etc.)
 * - Playback hooks (useMeasureScroll, useAutoScroll, useMetronome, etc.)
 * - UI refs (mainAreaRef, containerRef, scrollToLineRef)
 * - sidebarWidth
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { initAPI, db } from '@/lib/api';
import { useRealtimeSync } from '@/hooks';
import type {
  SongListItem,
  SongWithDetails,
  CreateSongInput,
  PlaylistWithCount,
  Artist,
} from '@/types/database';

// ============================================
// Types
// ============================================

interface PlaylistSongItem {
  id: string;
  title: string;
  artistName: string | null;
}

interface AppDataContextValue {
  // DB state
  isDbReady: boolean;

  // Song state
  songs: SongListItem[];
  selectedSongId: string | null;
  setSelectedSongId: (id: string | null) => void;
  selectedSong: SongWithDetails | null;
  setSelectedSong: (song: SongWithDetails | null) => void;

  // Song handlers
  handleSaveSong: (input: CreateSongInput) => Promise<string>;
  handleDeleteSong: (id: string) => Promise<void>;
  handleSongUpdated: (updatedSong?: SongWithDetails | null) => Promise<void>;

  // Modal state
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  handleAddClick: () => void;
  handleModalClose: () => void;

  isChordSettingsOpen: boolean;
  setIsChordSettingsOpen: (open: boolean) => void;

  selectedChord: string | null;
  handleChordClick: (chord: string) => void;
  handleChordModalClose: () => void;

  // Playlist state
  playlists: PlaylistWithCount[];
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  isCreatePlaylistModalOpen: boolean;

  // Playlist handlers
  handlePlaylistSelect: (id: string) => void;
  handleCreatePlaylistClick: () => void;
  handleCreatePlaylistSave: (name: string, description?: string) => Promise<void>;
  handleCreatePlaylistModalClose: () => void;
  handlePlaylistExpand: (playlistId: string) => Promise<void>;
  handleAddSongToPlaylist: (songId: string, playlistId: string) => Promise<void>;
  handleRemoveSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;

  // Expanded playlist state
  expandedPlaylistId: string | null;
  expandedPlaylistSongs: PlaylistSongItem[];

  // Artist state
  artists: Artist[];
  expandedArtistId: string | null;
  artistSongs: SongListItem[];
  handleArtistExpand: (artistId: string) => Promise<void>;

  // Refetch functions
  refetchSongs: () => Promise<void>;
  refetchPlaylists: () => Promise<void>;
  refetchArtists: () => Promise<void>;
}

// ============================================
// Context
// ============================================

const AppDataContext = createContext<AppDataContextValue | null>(null);

// ============================================
// Hook
// ============================================

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

// ============================================
// Provider
// ============================================

interface AppDataProviderProps {
  children: ReactNode;
}

export function AppDataProvider({ children }: AppDataProviderProps) {
  // DB state
  const [isDbReady, setIsDbReady] = useState(false);

  // Song state
  const [songs, setSongs] = useState<SongListItem[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongWithDetails | null>(null);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChordSettingsOpen, setIsChordSettingsOpen] = useState(false);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);

  // Playlist state
  const [playlists, setPlaylists] = useState<PlaylistWithCount[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);

  // Expanded playlist state
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);
  const [expandedPlaylistSongs, setExpandedPlaylistSongs] = useState<PlaylistSongItem[]>([]);

  // Artist state
  const [artists, setArtists] = useState<Artist[]>([]);
  const [expandedArtistId, setExpandedArtistId] = useState<string | null>(null);
  const [artistSongs, setArtistSongs] = useState<SongListItem[]>([]);

  // Initialize database and load songs + playlists
  useEffect(() => {
    async function init() {
      try {
        await initAPI();
        setIsDbReady(true);
        const [songList, playlistList] = await Promise.all([
          db.getSongs(),
          db.getPlaylists(),
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
        const song = await db.getSongById(selectedSongId);
        setSelectedSong(song);
      } else {
        setSelectedSong(null);
      }
    }
    loadSong();
  }, [selectedSongId]);

  // Load artists (including "その他" for songs without artist)
  const loadArtists = useCallback(async (currentSongs: SongListItem[]) => {
    const dbArtists = await db.getArtists();

    // Check if there are songs without an artist
    const songsWithoutArtist = currentSongs.filter(s => !s.artistName);

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
  }, []);

  // Load artists when songs count changes (add/delete)
  const prevSongsLengthRef = useRef(0);

  useEffect(() => {
    if (isDbReady && (songs.length !== prevSongsLengthRef.current || prevSongsLengthRef.current === 0)) {
      prevSongsLengthRef.current = songs.length;
      loadArtists(songs);
    }
  }, [isDbReady, songs.length, loadArtists]);

  // Refetch functions for realtime sync
  const refetchSongs = useCallback(async () => {
    try {
      const songList = await db.getSongs();
      setSongs(songList);
      // If current song was updated, reload it
      if (selectedSongId) {
        const updatedSong = await db.getSongById(selectedSongId);
        setSelectedSong(updatedSong);
      }
    } catch (error) {
      console.error('Failed to refetch songs:', error);
    }
  }, [selectedSongId]);

  const refetchPlaylists = useCallback(async () => {
    try {
      const playlistList = await db.getPlaylists();
      setPlaylists(playlistList);
      // Refresh expanded playlist if any
      if (expandedPlaylistId) {
        const playlistData = await db.getPlaylistById(expandedPlaylistId);
        if (playlistData) {
          setExpandedPlaylistSongs(playlistData.songs.map(s => ({
            id: s.id,
            title: s.title,
            artistName: s.artistName,
          })));
        }
      }
    } catch (error) {
      console.error('Failed to refetch playlists:', error);
    }
  }, [expandedPlaylistId]);

  const refetchArtists = useCallback(async () => {
    try {
      await loadArtists(songs);
    } catch (error) {
      console.error('Failed to refetch artists:', error);
    }
  }, [loadArtists, songs]);

  // Supabase Realtime sync - refetch data when changes occur on other devices
  useRealtimeSync({
    onSongsChange: refetchSongs,
    onPlaylistsChange: refetchPlaylists,
    onArtistsChange: refetchArtists,
    enabled: isDbReady,
  });

  // Song handlers
  const handleAddClick = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleSaveSong = useCallback(async (input: CreateSongInput): Promise<string> => {
    const newId = await db.saveSong(input);
    const updatedSongs = await db.getSongs();
    setSongs(updatedSongs);
    setSelectedSongId(newId);
    return newId;
  }, []);

  const handleDeleteSong = useCallback(
    async (id: string) => {
      await db.deleteSong(id);
      const updatedSongs = await db.getSongs();
      setSongs(updatedSongs);
      if (selectedSongId === id) {
        setSelectedSongId(null);
      }
    },
    [selectedSongId]
  );

  // Song updated callback
  const handleSongUpdated = useCallback(async (updatedSong?: SongWithDetails | null) => {
    const updatedSongs = await db.getSongs();
    setSongs(updatedSongs);
    if (updatedSong) {
      setSelectedSong(updatedSong);
    } else if (selectedSongId) {
      const song = await db.getSongById(selectedSongId);
      setSelectedSong(song);
    }
  }, [selectedSongId]);

  // Chord handlers
  const handleChordClick = useCallback((chord: string) => {
    setSelectedChord(chord);
  }, []);

  const handleChordModalClose = useCallback(() => {
    setSelectedChord(null);
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
    await db.createPlaylist({ name, description });
    const updatedPlaylists = await db.getPlaylists();
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
      const playlistData = await db.getPlaylistById(playlistId);
      if (playlistData) {
        setExpandedPlaylistSongs(playlistData.songs.map(s => ({
          id: s.id,
          title: s.title,
          artistName: s.artistName,
        })));
      }
    }
  }, [expandedPlaylistId]);

  // Handle add song to playlist
  const handleAddSongToPlaylist = useCallback(async (songId: string, playlistId: string) => {
    await db.addSongToPlaylist(playlistId, songId);
    // Refresh playlists to update song count
    const updatedPlaylists = await db.getPlaylists();
    setPlaylists(updatedPlaylists);
    // If this playlist is expanded, refresh its songs
    if (expandedPlaylistId === playlistId) {
      const playlistData = await db.getPlaylistById(playlistId);
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
    await db.removeSongFromPlaylist(playlistId, songId);
    // Refresh playlist songs
    const playlistData = await db.getPlaylistById(playlistId);
    if (playlistData) {
      setExpandedPlaylistSongs(playlistData.songs.map(s => ({
        id: s.id,
        title: s.title,
        artistName: s.artistName,
      })));
    }
    // Refresh playlists to update song count
    const updatedPlaylists = await db.getPlaylists();
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
        const songsByArtist = await db.getSongsByArtist(artistId);
        setArtistSongs(songsByArtist);
      }
    }
  }, [expandedArtistId, songs]);

  const value: AppDataContextValue = {
    // DB state
    isDbReady,

    // Song state
    songs,
    selectedSongId,
    setSelectedSongId,
    selectedSong,
    setSelectedSong,

    // Song handlers
    handleSaveSong,
    handleDeleteSong,
    handleSongUpdated,

    // Modal state
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddClick,
    handleModalClose,

    isChordSettingsOpen,
    setIsChordSettingsOpen,

    selectedChord,
    handleChordClick,
    handleChordModalClose,

    // Playlist state
    playlists,
    selectedPlaylistId,
    setSelectedPlaylistId,
    isCreatePlaylistModalOpen,

    // Playlist handlers
    handlePlaylistSelect,
    handleCreatePlaylistClick,
    handleCreatePlaylistSave,
    handleCreatePlaylistModalClose,
    handlePlaylistExpand,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,

    // Expanded playlist state
    expandedPlaylistId,
    expandedPlaylistSongs,

    // Artist state
    artists,
    expandedArtistId,
    artistSongs,
    handleArtistExpand,

    // Refetch functions
    refetchSongs,
    refetchPlaylists,
    refetchArtists,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
