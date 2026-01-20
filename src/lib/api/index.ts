/**
 * CaT4G Unified API Layer
 * Automatically switches between Tauri (desktop) and Supabase (web) backends
 * based on VITE_BACKEND environment variable
 */

import { isSupabaseEnabled, BACKEND_TYPE } from '@/lib/supabase';
import type { DatabaseAPI, ScraperAPI, BackendType } from './types';

// Re-export types
export type { DatabaseAPI, ScraperAPI, BackendType, APIInitOptions } from './types';
export type {
  FetchedChordSheet,
  FetchedSection,
  FetchedLine,
  FetchedChord,
  SupportedSite,
} from './types';

// ============================================
// Lazy-loaded Backend Implementations
// ============================================

let _db: DatabaseAPI | null = null;
let _scraper: ScraperAPI | null = null;

/**
 * Get the database API instance
 * Lazy-loaded to avoid importing unused backend code
 */
async function getDatabaseAPI(): Promise<DatabaseAPI> {
  if (_db) return _db;

  if (isSupabaseEnabled()) {
    const { supabaseDatabase } = await import('./supabase/database');
    _db = supabaseDatabase;
  } else {
    const { tauriDatabase } = await import('./tauri/database');
    _db = tauriDatabase;
  }

  return _db;
}

/**
 * Get the scraper API instance
 * Lazy-loaded to avoid importing unused backend code
 */
async function getScraperAPI(): Promise<ScraperAPI> {
  if (_scraper) return _scraper;

  if (isSupabaseEnabled()) {
    const { supabaseScraper } = await import('./supabase/scraper');
    _scraper = supabaseScraper;
  } else {
    const { tauriScraper } = await import('./tauri/scraper');
    _scraper = tauriScraper;
  }

  return _scraper;
}

// ============================================
// Synchronous API Proxy (for backward compatibility)
// ============================================

/**
 * Database API proxy
 * Wraps async initialization in each method call
 */
export const db: DatabaseAPI = {
  // Songs
  getSongs: async () => (await getDatabaseAPI()).getSongs(),
  getSongById: async (id) => (await getDatabaseAPI()).getSongById(id),
  searchSongs: async (query) => (await getDatabaseAPI()).searchSongs(query),
  saveSong: async (input) => (await getDatabaseAPI()).saveSong(input),
  updateSong: async (id, input) => (await getDatabaseAPI()).updateSong(id, input),
  deleteSong: async (id) => (await getDatabaseAPI()).deleteSong(id),
  updateSongFavorite: async (id, isFavorite) =>
    (await getDatabaseAPI()).updateSongFavorite(id, isFavorite),
  incrementPlayCount: async (id) => (await getDatabaseAPI()).incrementPlayCount(id),

  // Playlists
  getPlaylists: async () => (await getDatabaseAPI()).getPlaylists(),
  getPlaylistById: async (id) => (await getDatabaseAPI()).getPlaylistById(id),
  createPlaylist: async (input) => (await getDatabaseAPI()).createPlaylist(input),
  updatePlaylist: async (id, updates) =>
    (await getDatabaseAPI()).updatePlaylist(id, updates),
  deletePlaylist: async (id) => (await getDatabaseAPI()).deletePlaylist(id),
  addSongToPlaylist: async (playlistId, songId) =>
    (await getDatabaseAPI()).addSongToPlaylist(playlistId, songId),
  removeSongFromPlaylist: async (playlistId, songId) =>
    (await getDatabaseAPI()).removeSongFromPlaylist(playlistId, songId),
  reorderPlaylistSong: async (playlistId, songId, newIndex) =>
    (await getDatabaseAPI()).reorderPlaylistSong(playlistId, songId, newIndex),

  // Tags
  getTags: async () => (await getDatabaseAPI()).getTags(),
  createTag: async (name, color) => (await getDatabaseAPI()).createTag(name, color),
  deleteTag: async (id) => (await getDatabaseAPI()).deleteTag(id),

  // Artists
  getArtists: async () => (await getDatabaseAPI()).getArtists(),
  getSongsByArtist: async (artistId) =>
    (await getDatabaseAPI()).getSongsByArtist(artistId),

  // Annotations
  getAnnotations: async (lineId) => (await getDatabaseAPI()).getAnnotations(lineId),
  createAnnotation: async (lineId, content, chordIndex) =>
    (await getDatabaseAPI()).createAnnotation(lineId, content, chordIndex),
  updateAnnotation: async (id, content) =>
    (await getDatabaseAPI()).updateAnnotation(id, content),
  deleteAnnotation: async (id) => (await getDatabaseAPI()).deleteAnnotation(id),
};

/**
 * Scraper API proxy
 * Wraps async initialization in each method call
 */
export const scraper: ScraperAPI = {
  fetchChordSheet: async (url) => (await getScraperAPI()).fetchChordSheet(url),
  parseChordSheetHtml: async (url, html) =>
    (await getScraperAPI()).parseChordSheetHtml(url, html),
  getSupportedSites: async () => (await getScraperAPI()).getSupportedSites(),
};

// ============================================
// Initialization
// ============================================

/**
 * Initialize the API layer
 * For Tauri: initializes the SQLite database
 * For Supabase: no-op (initialization handled by client)
 */
export async function initAPI(): Promise<void> {
  if (!isSupabaseEnabled()) {
    const { initDatabase } = await import('./tauri/database');
    await initDatabase();
  }
  // Supabase client is initialized on first use
}

/**
 * Get the current backend type
 */
export function getBackendType(): BackendType {
  return BACKEND_TYPE;
}

/**
 * Check if using Supabase backend
 */
export { isSupabaseEnabled } from '@/lib/supabase';

// ============================================
// Utility Re-exports
// ============================================

/**
 * Scraper utility functions
 * These are synchronous and don't depend on backend
 */
export function isSupportedUrl(url: string): boolean {
  const supportedDomains = ['ufret.jp', 'j-total.net', 'gakufu.gakki.me'];
  return supportedDomains.some((domain) => url.includes(domain));
}

export function requiresManualInput(url: string): boolean {
  return url.includes('chordwiki.org');
}

export function getSiteName(url: string): string {
  if (url.includes('ufret.jp')) return 'U-Fret';
  if (url.includes('chordwiki.org')) return 'ChordWiki';
  if (url.includes('j-total.net')) return 'J-Total';
  if (url.includes('gakufu.gakki.me')) return '楽器.me';
  return 'Unknown';
}
