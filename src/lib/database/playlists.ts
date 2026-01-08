/**
 * CaT4G Playlist Database API
 * Based on spec: specs/08_playlist.md
 */

import Database from '@tauri-apps/plugin-sql';
import type {
  Playlist,
  PlaylistWithCount,
  PlaylistWithSongs,
  SongListItem,
  PlaylistRow,
} from '@/types/database';

// ============================================
// Helper Functions
// ============================================

function toPlaylist(row: PlaylistRow): Playlist {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================
// Read Operations
// ============================================

/**
 * Get all playlists with song count
 */
export async function getPlaylists(db: Database): Promise<PlaylistWithCount[]> {
  const result = await db.select<Array<PlaylistRow & { song_count: number }>>(
    `SELECT
      p.*,
      COUNT(ps.song_id) as song_count
    FROM playlists p
    LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
    GROUP BY p.id
    ORDER BY p.updated_at DESC`
  );

  return result.map((row) => ({
    playlist: toPlaylist(row),
    songCount: row.song_count,
  }));
}

/**
 * Get playlist by ID with songs
 */
export async function getPlaylistById(
  db: Database,
  playlistId: string
): Promise<PlaylistWithSongs | null> {
  const playlistResult = await db.select<PlaylistRow[]>(
    'SELECT * FROM playlists WHERE id = ?',
    [playlistId]
  );

  if (playlistResult.length === 0) return null;

  const songsResult = await db.select<
    Array<{
      id: string;
      title: string;
      artist_name: string | null;
      is_favorite: number;
      order_index: number;
    }>
  >(
    `SELECT
      s.id,
      s.title,
      a.name as artist_name,
      s.is_favorite,
      ps.order_index
    FROM playlist_songs ps
    JOIN songs s ON ps.song_id = s.id
    LEFT JOIN artists a ON s.artist_id = a.id
    WHERE ps.playlist_id = ?
    ORDER BY ps.order_index`,
    [playlistId]
  );

  const songs: SongListItem[] = songsResult.map((row) => ({
    id: row.id,
    title: row.title,
    artistName: row.artist_name,
    isFavorite: row.is_favorite === 1,
  }));

  return {
    playlist: toPlaylist(playlistResult[0]),
    songs,
  };
}

// ============================================
// Write Operations
// ============================================

/**
 * Create a new playlist
 */
export async function createPlaylist(
  db: Database,
  name: string,
  description?: string
): Promise<string> {
  const id = crypto.randomUUID();

  await db.execute(
    `INSERT INTO playlists (id, name, description, created_at, updated_at)
     VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
    [id, name, description || null]
  );

  return id;
}

/**
 * Update playlist name and/or description
 */
export async function updatePlaylist(
  db: Database,
  playlistId: string,
  updates: { name?: string; description?: string }
): Promise<void> {
  const sets: string[] = [];
  const values: unknown[] = [];

  if (updates.name !== undefined) {
    sets.push('name = ?');
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    sets.push('description = ?');
    values.push(updates.description);
  }

  if (sets.length === 0) return;

  sets.push("updated_at = datetime('now')");
  values.push(playlistId);

  await db.execute(
    `UPDATE playlists SET ${sets.join(', ')} WHERE id = ?`,
    values
  );
}

/**
 * Delete a playlist
 */
export async function deletePlaylist(
  db: Database,
  playlistId: string
): Promise<void> {
  await db.execute('DELETE FROM playlists WHERE id = ?', [playlistId]);
}

// ============================================
// Playlist Song Operations
// ============================================

/**
 * Add a song to a playlist with auto-calculated order_index
 */
export async function addSongToPlaylist(
  db: Database,
  playlistId: string,
  songId: string
): Promise<void> {
  // Get current max order_index
  const result = await db.select<Array<{ max_index: number | null }>>(
    'SELECT COALESCE(MAX(order_index), -1) as max_index FROM playlist_songs WHERE playlist_id = ?',
    [playlistId]
  );
  const nextIndex = (result[0]?.max_index ?? -1) + 1;

  await db.execute(
    `INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, order_index) VALUES (?, ?, ?)`,
    [playlistId, songId, nextIndex]
  );

  // Update playlist's updated_at
  await db.execute(
    "UPDATE playlists SET updated_at = datetime('now') WHERE id = ?",
    [playlistId]
  );
}

/**
 * Remove a song from a playlist and reorder remaining songs
 */
export async function removeSongFromPlaylist(
  db: Database,
  playlistId: string,
  songId: string
): Promise<void> {
  await db.execute(
    'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
    [playlistId, songId]
  );

  // Reorder remaining songs to have consecutive indices
  await reorderPlaylistSongs(db, playlistId);

  // Update playlist's updated_at
  await db.execute(
    "UPDATE playlists SET updated_at = datetime('now') WHERE id = ?",
    [playlistId]
  );
}

/**
 * Change the order of a song within a playlist
 */
export async function reorderPlaylistSong(
  db: Database,
  playlistId: string,
  songId: string,
  newIndex: number
): Promise<void> {
  // Get current position
  const currentResult = await db.select<Array<{ order_index: number }>>(
    'SELECT order_index FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
    [playlistId, songId]
  );

  if (currentResult.length === 0) return;
  const currentIndex = currentResult[0].order_index;

  if (currentIndex === newIndex) return;

  // Adjust other songs' order
  if (newIndex < currentIndex) {
    // Moving up: shift songs between newIndex and currentIndex down
    await db.execute(
      `UPDATE playlist_songs
       SET order_index = order_index + 1
       WHERE playlist_id = ? AND order_index >= ? AND order_index < ?`,
      [playlistId, newIndex, currentIndex]
    );
  } else {
    // Moving down: shift songs between currentIndex and newIndex up
    await db.execute(
      `UPDATE playlist_songs
       SET order_index = order_index - 1
       WHERE playlist_id = ? AND order_index > ? AND order_index <= ?`,
      [playlistId, currentIndex, newIndex]
    );
  }

  // Set the target song to the new position
  await db.execute(
    'UPDATE playlist_songs SET order_index = ? WHERE playlist_id = ? AND song_id = ?',
    [newIndex, playlistId, songId]
  );

  // Update playlist's updated_at
  await db.execute(
    "UPDATE playlists SET updated_at = datetime('now') WHERE id = ?",
    [playlistId]
  );
}

// ============================================
// Internal Helper Functions
// ============================================

/**
 * Recalculate order_index values to be consecutive (0, 1, 2, ...)
 */
async function reorderPlaylistSongs(
  db: Database,
  playlistId: string
): Promise<void> {
  const songs = await db.select<Array<{ song_id: string }>>(
    'SELECT song_id FROM playlist_songs WHERE playlist_id = ? ORDER BY order_index',
    [playlistId]
  );

  for (let i = 0; i < songs.length; i++) {
    await db.execute(
      'UPDATE playlist_songs SET order_index = ? WHERE playlist_id = ? AND song_id = ?',
      [i, playlistId, songs[i].song_id]
    );
  }
}
