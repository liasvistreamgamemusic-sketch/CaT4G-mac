/**
 * CaT4G API Layer Type Definitions
 * Unified interface for Tauri and Supabase backends
 */

import type {
  UUID,
  Artist,
  Tag,
  Annotation,
  SongWithDetails,
  SongListItem,
  PlaylistWithCount,
  PlaylistWithSongs,
  CreateSongInput,
  CreatePlaylistInput,
  UpdateSongInput,
  ChordPreference,
  ChordFingering,
} from '@/types/database';

// Re-export types from scraper for convenience
export type {
  FetchedChordSheet,
  FetchedSection,
  FetchedLine,
  FetchedChord,
  SupportedSite,
  UfretArtistResult,
  UfretSearchResponse,
  UfretSearchResult,
} from '@/lib/scraper';

// ============================================
// Database API Interface
// ============================================

/**
 * Unified Database API interface
 * Implementations: Tauri (SQLite), Supabase (PostgreSQL)
 */
export interface DatabaseAPI {
  // ----------------------------------------
  // Songs
  // ----------------------------------------

  /**
   * Get all songs (list view)
   */
  getSongs(): Promise<SongListItem[]>;

  /**
   * Get song by ID with full details
   */
  getSongById(id: UUID): Promise<SongWithDetails | null>;

  /**
   * Search songs by title or artist name
   */
  searchSongs(query: string): Promise<SongListItem[]>;

  /**
   * Create a new song
   * @returns Created song ID
   */
  saveSong(input: CreateSongInput): Promise<UUID>;

  /**
   * Update an existing song
   */
  updateSong(id: UUID, input: UpdateSongInput): Promise<void>;

  /**
   * Delete a song
   */
  deleteSong(id: UUID): Promise<void>;

  /**
   * Increment song play count
   */
  incrementPlayCount(id: UUID): Promise<void>;

  // ----------------------------------------
  // Playlists
  // ----------------------------------------

  /**
   * Get all playlists with song counts
   */
  getPlaylists(): Promise<PlaylistWithCount[]>;

  /**
   * Get playlist by ID with songs
   */
  getPlaylistById(id: UUID): Promise<PlaylistWithSongs | null>;

  /**
   * Create a new playlist
   * @returns Created playlist ID
   */
  createPlaylist(input: CreatePlaylistInput): Promise<UUID>;

  /**
   * Update an existing playlist
   */
  updatePlaylist(id: UUID, updates: Partial<CreatePlaylistInput>): Promise<void>;

  /**
   * Delete a playlist
   */
  deletePlaylist(id: UUID): Promise<void>;

  /**
   * Add a song to a playlist
   */
  addSongToPlaylist(playlistId: UUID, songId: UUID): Promise<void>;

  /**
   * Remove a song from a playlist
   */
  removeSongFromPlaylist(playlistId: UUID, songId: UUID): Promise<void>;

  /**
   * Reorder a song within a playlist
   */
  reorderPlaylistSong(playlistId: UUID, songId: UUID, newIndex: number): Promise<void>;

  // ----------------------------------------
  // Tags
  // ----------------------------------------

  /**
   * Get all tags
   */
  getTags(): Promise<Tag[]>;

  /**
   * Create a new tag
   * @returns Created tag ID
   */
  createTag(name: string, color?: string): Promise<UUID>;

  /**
   * Delete a tag
   */
  deleteTag(id: UUID): Promise<void>;

  // ----------------------------------------
  // Artists
  // ----------------------------------------

  /**
   * Get all artists
   */
  getArtists(): Promise<Artist[]>;

  /**
   * Get songs by artist ID
   */
  getSongsByArtist(artistId: UUID): Promise<SongListItem[]>;

  // ----------------------------------------
  // Annotations
  // ----------------------------------------

  /**
   * Get annotations for a line
   */
  getAnnotations(lineId: UUID): Promise<Annotation[]>;

  /**
   * Create an annotation
   * @returns Created annotation ID
   */
  createAnnotation(lineId: UUID, content: string, chordIndex?: number): Promise<UUID>;

  /**
   * Update an annotation
   */
  updateAnnotation(id: UUID, content: string): Promise<void>;

  /**
   * Delete an annotation
   */
  deleteAnnotation(id: UUID): Promise<void>;

  // ----------------------------------------
  // Chord Preferences
  // ----------------------------------------

  /**
   * Get all user's chord preferences
   */
  getChordPreferences(): Promise<ChordPreference[]>;

  /**
   * Get preference for a specific chord
   */
  getChordPreference(chordName: string): Promise<ChordPreference | null>;

  /**
   * Set/Update default fingering for a chord (upsert)
   */
  setChordPreference(chordName: string, fingering: ChordFingering): Promise<void>;

  /**
   * Delete preference (revert to system default)
   */
  deleteChordPreference(chordName: string): Promise<void>;
}

// ============================================
// Scraper API Interface
// ============================================

import type {
  FetchedChordSheet,
  SupportedSite,
  UfretSearchResponse,
  UfretSearchResult,
} from '@/lib/scraper';

/**
 * Unified Scraper API interface
 * Implementations: Tauri (Rust), Supabase (Edge Functions)
 */
export interface ScraperAPI {
  /**
   * Fetch and parse chord sheet from URL
   */
  fetchChordSheet(url: string): Promise<FetchedChordSheet>;

  /**
   * Parse HTML content into chord sheet
   * For manual HTML input (Cloudflare protected sites)
   */
  parseChordSheetHtml(url: string, html: string): Promise<FetchedChordSheet>;

  /**
   * Get list of supported chord sheet sites
   */
  getSupportedSites(): Promise<SupportedSite[]>;

  /**
   * Search songs on U-Fret
   * @param query - Search query (song title or artist name)
   * @param page - Page number (optional, defaults to 1)
   * @returns Search results with pagination info
   */
  searchUfret(query: string, page?: number): Promise<UfretSearchResponse>;

  /**
   * Fetch artist's song list from U-Fret
   * @param artistUrl - Artist page URL on U-Fret
   * @param artistName - Artist name for result enrichment
   * @returns Array of search results for the artist's songs
   */
  fetchArtistSongs(artistUrl: string, artistName: string): Promise<UfretSearchResult[]>;
}

// ============================================
// Utility Types
// ============================================

/**
 * Backend type identifier
 */
export type BackendType = 'tauri' | 'supabase';

/**
 * API initialization options
 */
export interface APIInitOptions {
  backend?: BackendType;
}
