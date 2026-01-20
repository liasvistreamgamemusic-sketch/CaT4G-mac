/**
 * CaT4G Database API Layer
 * Based on spec: specs/02_database.md
 *
 * DEPRECATED: This file is kept for backward compatibility.
 * Use @/lib/api instead for new code.
 *
 * This module re-exports the Tauri database implementation directly
 * to maintain compatibility with existing code that imports from here.
 */

// Re-export everything from the Tauri database implementation
export {
  // Initialization
  initDatabase,
  getDatabase,

  // Songs
  getSongs,
  getSongById,
  searchSongs,
  saveSong,
  updateSong,
  deleteSong,
  updateSongFavorite,
  incrementPlayCount,

  // Playlists
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSong,

  // Tags
  getTags,
  createTag,
  deleteTag,

  // Artists
  getArtists,
  getSongsByArtist,

  // Annotations
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from '@/lib/api/tauri/database';

// Type re-exports for compatibility
export type {
  UUID,
  Artist,
  Song,
  Section,
  Line,
  Tag,
  Playlist,
  Annotation,
  SongWithDetails,
  SongListItem,
  SectionWithLines,
  PlaylistWithCount,
  PlaylistWithSongs,
  CreateSongInput,
  CreatePlaylistInput,
  UpdateSongInput,
} from '@/types/database';
