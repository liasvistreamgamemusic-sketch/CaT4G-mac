/**
 * CaT4G Database API Layer
 * Based on spec: specs/02_database.md
 */

import Database from '@tauri-apps/plugin-sql';
import type {
  UUID,
  Artist,
  Song,
  Section,
  Line,
  Tag,
  Playlist,
  SongWithDetails,
  SongListItem,
  SectionWithLines,
  PlaylistWithCount,
  PlaylistWithSongs,
  CreateSongInput,
  CreatePlaylistInput,
  ChordPosition,
  ArtistRow,
  SongRow,
  SectionRow,
  LineRow,
  TagRow,
  PlaylistRow,
  TimeSignature,
  Difficulty,
} from '@/types/database';

// ============================================
// Database Connection
// ============================================

let db: Database | null = null;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist_id TEXT REFERENCES artists(id) ON DELETE SET NULL,
    original_key TEXT,
    bpm INTEGER,
    time_signature TEXT DEFAULT '4/4',
    capo INTEGER DEFAULT 0,
    difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
    source_url TEXT,
    notes TEXT,
    is_favorite INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    repeat_count INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lines (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    lyrics TEXT NOT NULL,
    chords_json TEXT NOT NULL DEFAULT '[]',
    order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT
);

CREATE TABLE IF NOT EXISTS song_tags (
    song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, tag_id)
);

CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id TEXT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    PRIMARY KEY (playlist_id, song_id)
);

CREATE TABLE IF NOT EXISTS chord_preferences (
    id TEXT PRIMARY KEY,
    chord_name TEXT NOT NULL,
    fingering_json TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
`;

export async function initDatabase(): Promise<void> {
  db = await Database.load('sqlite:cat4g.db');

  // Run schema migration
  const statements = SCHEMA_SQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    await db.execute(statement);
  }
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    await initDatabase();
  }
  return db!;
}

// ============================================
// Utility Functions
// ============================================

function generateUUID(): UUID {
  return crypto.randomUUID();
}

function toSong(row: SongRow): Song {
  return {
    id: row.id,
    title: row.title,
    artistId: row.artist_id,
    originalKey: row.original_key,
    bpm: row.bpm,
    timeSignature: row.time_signature as TimeSignature,
    capo: row.capo,
    difficulty: row.difficulty as Difficulty | null,
    sourceUrl: row.source_url,
    notes: row.notes,
    isFavorite: row.is_favorite === 1,
    playCount: row.play_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toArtist(row: ArtistRow): Artist {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  };
}

function toSection(row: SectionRow): Section {
  return {
    id: row.id,
    songId: row.song_id,
    name: row.name,
    orderIndex: row.order_index,
    repeatCount: row.repeat_count,
  };
}

function toLine(row: LineRow): Line {
  return {
    id: row.id,
    sectionId: row.section_id,
    lyrics: row.lyrics,
    chords: JSON.parse(row.chords_json) as ChordPosition[],
    orderIndex: row.order_index,
  };
}

function toTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
  };
}

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
// Songs - Read Operations
// ============================================

export async function getSongs(): Promise<SongListItem[]> {
  const database = await getDatabase();
  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      artist_name: string | null;
      is_favorite: number;
    }>
  >(
    `SELECT s.id, s.title, a.name as artist_name, s.is_favorite
     FROM songs s
     LEFT JOIN artists a ON s.artist_id = a.id
     ORDER BY s.updated_at DESC`
  );

  return rows.map((row: { id: string; title: string; artist_name: string | null; is_favorite: number }) => ({
    id: row.id,
    title: row.title,
    artistName: row.artist_name,
    isFavorite: row.is_favorite === 1,
  }));
}

export async function getSongById(id: UUID): Promise<SongWithDetails | null> {
  const database = await getDatabase();

  // Get song
  const songRows = await database.select<SongRow[]>(
    'SELECT * FROM songs WHERE id = ?',
    [id]
  );
  if (songRows.length === 0) return null;
  const song = toSong(songRows[0]);

  // Get artist
  let artist: Artist | null = null;
  if (song.artistId) {
    const artistRows = await database.select<ArtistRow[]>(
      'SELECT * FROM artists WHERE id = ?',
      [song.artistId]
    );
    if (artistRows.length > 0) {
      artist = toArtist(artistRows[0]);
    }
  }

  // Get sections with lines
  const sectionRows = await database.select<SectionRow[]>(
    'SELECT * FROM sections WHERE song_id = ? ORDER BY order_index',
    [id]
  );

  const sections: SectionWithLines[] = [];
  for (const sectionRow of sectionRows) {
    const lineRows = await database.select<LineRow[]>(
      'SELECT * FROM lines WHERE section_id = ? ORDER BY order_index',
      [sectionRow.id]
    );
    sections.push({
      section: toSection(sectionRow),
      lines: lineRows.map(toLine),
    });
  }

  // Get tags
  const tagRows = await database.select<TagRow[]>(
    `SELECT t.* FROM tags t
     INNER JOIN song_tags st ON t.id = st.tag_id
     WHERE st.song_id = ?`,
    [id]
  );

  return {
    song,
    artist,
    sections,
    tags: tagRows.map(toTag),
  };
}

export async function searchSongs(query: string): Promise<SongListItem[]> {
  const database = await getDatabase();
  const searchTerm = `%${query}%`;

  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      artist_name: string | null;
      is_favorite: number;
    }>
  >(
    `SELECT s.id, s.title, a.name as artist_name, s.is_favorite
     FROM songs s
     LEFT JOIN artists a ON s.artist_id = a.id
     WHERE s.title LIKE ? OR a.name LIKE ?
     ORDER BY s.updated_at DESC`,
    [searchTerm, searchTerm]
  );

  return rows.map((row: { id: string; title: string; artist_name: string | null; is_favorite: number }) => ({
    id: row.id,
    title: row.title,
    artistName: row.artist_name,
    isFavorite: row.is_favorite === 1,
  }));
}

// ============================================
// Songs - Write Operations
// ============================================

export async function saveSong(input: CreateSongInput): Promise<UUID> {
  const database = await getDatabase();
  const songId = generateUUID();
  const now = new Date().toISOString();

  // Create or find artist
  let artistId: UUID | null = null;
  if (input.artistName) {
    const existingArtist = await database.select<ArtistRow[]>(
      'SELECT id FROM artists WHERE name = ?',
      [input.artistName]
    );

    if (existingArtist.length > 0) {
      artistId = existingArtist[0].id;
    } else {
      artistId = generateUUID();
      await database.execute(
        'INSERT INTO artists (id, name, created_at) VALUES (?, ?, ?)',
        [artistId, input.artistName, now]
      );
    }
  }

  // Insert song
  await database.execute(
    `INSERT INTO songs (id, title, artist_id, original_key, bpm, time_signature, capo, difficulty, source_url, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      songId,
      input.title,
      artistId,
      input.originalKey ?? null,
      input.bpm ?? null,
      input.timeSignature ?? '4/4',
      input.capo ?? 0,
      input.difficulty ?? null,
      input.sourceUrl ?? null,
      input.notes ?? null,
      now,
      now,
    ]
  );

  // Insert sections and lines
  for (let sIdx = 0; sIdx < input.sections.length; sIdx++) {
    const sectionInput = input.sections[sIdx];
    const sectionId = generateUUID();

    await database.execute(
      'INSERT INTO sections (id, song_id, name, order_index, repeat_count) VALUES (?, ?, ?, ?, ?)',
      [sectionId, songId, sectionInput.name, sIdx, sectionInput.repeatCount ?? 1]
    );

    for (let lIdx = 0; lIdx < sectionInput.lines.length; lIdx++) {
      const lineInput = sectionInput.lines[lIdx];
      const lineId = generateUUID();

      await database.execute(
        'INSERT INTO lines (id, section_id, lyrics, chords_json, order_index) VALUES (?, ?, ?, ?, ?)',
        [lineId, sectionId, lineInput.lyrics, JSON.stringify(lineInput.chords), lIdx]
      );
    }
  }

  // Add tags
  if (input.tagIds && input.tagIds.length > 0) {
    for (const tagId of input.tagIds) {
      await database.execute(
        'INSERT OR IGNORE INTO song_tags (song_id, tag_id) VALUES (?, ?)',
        [songId, tagId]
      );
    }
  }

  return songId;
}

export async function updateSongFavorite(id: UUID, isFavorite: boolean): Promise<void> {
  const database = await getDatabase();
  await database.execute(
    'UPDATE songs SET is_favorite = ?, updated_at = datetime("now") WHERE id = ?',
    [isFavorite ? 1 : 0, id]
  );
}

export async function incrementPlayCount(id: UUID): Promise<void> {
  const database = await getDatabase();
  await database.execute(
    'UPDATE songs SET play_count = play_count + 1, updated_at = datetime("now") WHERE id = ?',
    [id]
  );
}

export async function deleteSong(id: UUID): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM songs WHERE id = ?', [id]);
}

// ============================================
// Playlists - Read Operations
// ============================================

export async function getPlaylists(): Promise<PlaylistWithCount[]> {
  const database = await getDatabase();
  const rows = await database.select<
    Array<PlaylistRow & { song_count: number }>
  >(
    `SELECT p.*, COUNT(ps.song_id) as song_count
     FROM playlists p
     LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
     GROUP BY p.id
     ORDER BY p.name`
  );

  return rows.map((row: PlaylistRow & { song_count: number }) => ({
    playlist: toPlaylist(row),
    songCount: row.song_count,
  }));
}

export async function getPlaylistById(id: UUID): Promise<PlaylistWithSongs | null> {
  const database = await getDatabase();

  const playlistRows = await database.select<PlaylistRow[]>(
    'SELECT * FROM playlists WHERE id = ?',
    [id]
  );
  if (playlistRows.length === 0) return null;

  const songRows = await database.select<
    Array<{
      id: string;
      title: string;
      artist_name: string | null;
      is_favorite: number;
    }>
  >(
    `SELECT s.id, s.title, a.name as artist_name, s.is_favorite
     FROM songs s
     LEFT JOIN artists a ON s.artist_id = a.id
     INNER JOIN playlist_songs ps ON s.id = ps.song_id
     WHERE ps.playlist_id = ?
     ORDER BY ps.order_index`,
    [id]
  );

  return {
    playlist: toPlaylist(playlistRows[0]),
    songs: songRows.map((row: { id: string; title: string; artist_name: string | null; is_favorite: number }) => ({
      id: row.id,
      title: row.title,
      artistName: row.artist_name,
      isFavorite: row.is_favorite === 1,
    })),
  };
}

// ============================================
// Playlists - Write Operations
// ============================================

export async function createPlaylist(input: CreatePlaylistInput): Promise<UUID> {
  const database = await getDatabase();
  const id = generateUUID();
  const now = new Date().toISOString();

  await database.execute(
    'INSERT INTO playlists (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [id, input.name, input.description ?? null, now, now]
  );

  return id;
}

export async function updatePlaylist(
  id: UUID,
  updates: Partial<CreatePlaylistInput>
): Promise<void> {
  const database = await getDatabase();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (fields.length > 0) {
    fields.push('updated_at = datetime("now")');
    values.push(id);
    await database.execute(
      `UPDATE playlists SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
}

export async function deletePlaylist(id: UUID): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM playlists WHERE id = ?', [id]);
}

export async function addSongToPlaylist(playlistId: UUID, songId: UUID): Promise<void> {
  const database = await getDatabase();

  const maxOrder = await database.select<Array<{ max_order: number | null }>>(
    'SELECT MAX(order_index) as max_order FROM playlist_songs WHERE playlist_id = ?',
    [playlistId]
  );

  const nextOrder = (maxOrder[0]?.max_order ?? -1) + 1;

  await database.execute(
    'INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, order_index) VALUES (?, ?, ?)',
    [playlistId, songId, nextOrder]
  );

  await database.execute(
    'UPDATE playlists SET updated_at = datetime("now") WHERE id = ?',
    [playlistId]
  );
}

export async function removeSongFromPlaylist(playlistId: UUID, songId: UUID): Promise<void> {
  const database = await getDatabase();
  await database.execute(
    'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
    [playlistId, songId]
  );
  await database.execute(
    'UPDATE playlists SET updated_at = datetime("now") WHERE id = ?',
    [playlistId]
  );
}

export async function reorderPlaylistSong(
  playlistId: UUID,
  songId: UUID,
  newIndex: number
): Promise<void> {
  const database = await getDatabase();
  await database.execute(
    'UPDATE playlist_songs SET order_index = ? WHERE playlist_id = ? AND song_id = ?',
    [newIndex, playlistId, songId]
  );
}

// ============================================
// Tags
// ============================================

export async function getTags(): Promise<Tag[]> {
  const database = await getDatabase();
  const rows = await database.select<TagRow[]>('SELECT * FROM tags ORDER BY name');
  return rows.map(toTag);
}

export async function createTag(name: string, color?: string): Promise<UUID> {
  const database = await getDatabase();
  const id = generateUUID();
  await database.execute(
    'INSERT INTO tags (id, name, color) VALUES (?, ?, ?)',
    [id, name, color ?? null]
  );
  return id;
}

export async function deleteTag(id: UUID): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM tags WHERE id = ?', [id]);
}

// ============================================
// Artists
// ============================================

export async function getArtists(): Promise<Artist[]> {
  const database = await getDatabase();
  const rows = await database.select<ArtistRow[]>(
    'SELECT * FROM artists ORDER BY name'
  );
  return rows.map(toArtist);
}
