/**
 * CaT4G Tauri Database Implementation
 * SQLite-based local database via Tauri SQL plugin
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
  Annotation,
  SongWithDetails,
  SongListItem,
  SectionWithLines,
  PlaylistWithCount,
  PlaylistWithSongs,
  CreateSongInput,
  CreatePlaylistInput,
  ExtendedChordPosition,
  ArtistRow,
  SongRow,
  SectionRow,
  LineRow,
  TagRow,
  PlaylistRow,
  AnnotationRow,
  ChordPreferenceRow,
  TimeSignature,
  Difficulty,
  Tuning,
  UpdateSongInput,
  ChordPreference,
  ChordFingering,
} from '@/types/database';
import type { DatabaseAPI } from '../types';

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
    transpose INTEGER DEFAULT 0,
    playback_speed REAL DEFAULT 1.0,
    tuning TEXT DEFAULT 'standard',
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

CREATE TABLE IF NOT EXISTS annotations (
    id TEXT PRIMARY KEY,
    line_id TEXT NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
    chord_index INTEGER,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_annotations_line ON annotations(line_id);
`;

// Migration statements for adding new columns to existing databases
const MIGRATION_STATEMENTS = [
  'ALTER TABLE songs ADD COLUMN transpose INTEGER DEFAULT 0',
  'ALTER TABLE songs ADD COLUMN playback_speed REAL DEFAULT 1.0',
  "ALTER TABLE songs ADD COLUMN tuning TEXT DEFAULT 'standard'",
  // Section overrides (from 002_section_overrides.sql)
  'ALTER TABLE sections ADD COLUMN transpose_override INTEGER DEFAULT NULL',
  'ALTER TABLE sections ADD COLUMN bpm_override INTEGER DEFAULT NULL',
  'ALTER TABLE sections ADD COLUMN playback_speed_override REAL DEFAULT NULL',
  // Line measures (from 003_line_measures.sql)
  'ALTER TABLE lines ADD COLUMN measures INTEGER DEFAULT 4',
];

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

  // Run migration for new columns (ignore errors if columns already exist)
  for (const statement of MIGRATION_STATEMENTS) {
    try {
      await db.execute(statement);
    } catch {
      // Column already exists - ignore
    }
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
    transpose: row.transpose ?? 0,
    playbackSpeed: row.playback_speed ?? 1.0,
    tuning: (row.tuning as Tuning) ?? 'standard',
    difficulty: row.difficulty as Difficulty | null,
    sourceUrl: row.source_url,
    notes: row.notes,
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
    transposeOverride: row.transpose_override ?? null,
    bpmOverride: row.bpm_override ?? null,
    playbackSpeedOverride: row.playback_speed_override ?? null,
  };
}

function toLine(row: LineRow): Line {
  return {
    id: row.id,
    sectionId: row.section_id,
    lyrics: row.lyrics,
    chords: JSON.parse(row.chords_json) as ExtendedChordPosition[],
    orderIndex: row.order_index,
    measures: row.measures ?? 4,
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

function toAnnotation(row: AnnotationRow): Annotation {
  return {
    id: row.id,
    lineId: row.line_id,
    chordIndex: row.chord_index,
    content: row.content,
    createdAt: row.created_at,
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
    }>
  >(
    `SELECT s.id, s.title, a.name as artist_name
     FROM songs s
     LEFT JOIN artists a ON s.artist_id = a.id
     ORDER BY s.updated_at DESC`
  );

  return rows.map((row: { id: string; title: string; artist_name: string | null }) => ({
    id: row.id,
    title: row.title,
    artistName: row.artist_name,
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

  // Get sections with lines (single query to avoid N+1)
  const sectionRows = await database.select<SectionRow[]>(
    'SELECT * FROM sections WHERE song_id = ? ORDER BY order_index',
    [id]
  );

  const allLines = await database.select<LineRow[]>(
    `SELECT l.* FROM lines l
     INNER JOIN sections s ON l.section_id = s.id
     WHERE s.song_id = ?
     ORDER BY s.order_index, l.order_index`,
    [id]
  );

  const linesBySection = new Map<string, LineRow[]>();
  for (const line of allLines) {
    const existing = linesBySection.get(line.section_id) || [];
    existing.push(line);
    linesBySection.set(line.section_id, existing);
  }

  const sections: SectionWithLines[] = sectionRows.map((sectionRow) => ({
    section: toSection(sectionRow),
    lines: (linesBySection.get(sectionRow.id) || []).map(toLine),
  }));

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
    }>
  >(
    `SELECT s.id, s.title, a.name as artist_name
     FROM songs s
     LEFT JOIN artists a ON s.artist_id = a.id
     WHERE s.title LIKE ? OR a.name LIKE ?
     ORDER BY s.updated_at DESC`,
    [searchTerm, searchTerm]
  );

  return rows.map((row: { id: string; title: string; artist_name: string | null }) => ({
    id: row.id,
    title: row.title,
    artistName: row.artist_name,
  }));
}

// ============================================
// Songs - Write Operations
// ============================================

export async function saveSong(input: CreateSongInput): Promise<UUID> {
  const database = await getDatabase();
  const songId = generateUUID();
  const now = new Date().toISOString();

  await database.execute('BEGIN TRANSACTION');
  try {
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
        'INSERT INTO sections (id, song_id, name, order_index, repeat_count, transpose_override, bpm_override, playback_speed_override) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [sectionId, songId, sectionInput.name, sIdx, sectionInput.repeatCount ?? 1, null, null, null]
      );

      for (let lIdx = 0; lIdx < sectionInput.lines.length; lIdx++) {
        const lineInput = sectionInput.lines[lIdx];
        const lineId = generateUUID();

        await database.execute(
          'INSERT INTO lines (id, section_id, lyrics, chords_json, order_index, measures) VALUES (?, ?, ?, ?, ?, ?)',
          [lineId, sectionId, lineInput.lyrics, JSON.stringify(lineInput.chords), lIdx, 4]
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

    await database.execute('COMMIT');
  } catch (e) {
    await database.execute('ROLLBACK');
    throw e;
  }

  return songId;
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

export async function updateSong(id: UUID, input: UpdateSongInput): Promise<void> {
  const database = await getDatabase();
  const now = new Date().toISOString();

  await database.execute('BEGIN TRANSACTION');
  try {
    // 1. Handle artist update if artistName is provided
    let artistId: UUID | null = null;
    let artistIdUpdated = false;

    if (input.artistName !== undefined) {
      if (input.artistName === null || input.artistName === '') {
        // Remove artist association
        artistId = null;
        artistIdUpdated = true;
      } else {
        // Find existing artist or create new one
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
        artistIdUpdated = true;
      }
    }

    // 2. Build update query for songs table
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.title !== undefined) {
      fields.push('title = ?');
      values.push(input.title);
    }
    if (artistIdUpdated) {
      fields.push('artist_id = ?');
      values.push(artistId);
    }
    if (input.originalKey !== undefined) {
      fields.push('original_key = ?');
      values.push(input.originalKey);
    }
    if (input.bpm !== undefined) {
      fields.push('bpm = ?');
      values.push(input.bpm);
    }
    if (input.timeSignature !== undefined) {
      fields.push('time_signature = ?');
      values.push(input.timeSignature);
    }
    if (input.capo !== undefined) {
      fields.push('capo = ?');
      values.push(input.capo);
    }
    if (input.transpose !== undefined) {
      fields.push('transpose = ?');
      values.push(input.transpose);
    }
    if (input.playbackSpeed !== undefined) {
      fields.push('playback_speed = ?');
      values.push(input.playbackSpeed);
    }
    if (input.tuning !== undefined) {
      fields.push('tuning = ?');
      values.push(input.tuning);
    }
    if (input.difficulty !== undefined) {
      fields.push('difficulty = ?');
      values.push(input.difficulty);
    }
    if (input.notes !== undefined) {
      fields.push('notes = ?');
      values.push(input.notes);
    }

    // Always update updated_at when something changes
    if (fields.length > 0 || input.sections !== undefined) {
      fields.push('updated_at = ?');
      values.push(now);
      values.push(id);

      if (fields.length > 1) { // More than just updated_at
        await database.execute(
          `UPDATE songs SET ${fields.join(', ')} WHERE id = ?`,
          values
        );
      }
    }

    // 3. Update sections and lines if provided
    if (input.sections !== undefined) {
      // Delete existing sections (cascades to lines)
      await database.execute('DELETE FROM sections WHERE song_id = ?', [id]);

      // Insert new sections and lines
      for (let sIdx = 0; sIdx < input.sections.length; sIdx++) {
        const sectionInput = input.sections[sIdx];
        const sectionId = sectionInput.id ?? generateUUID();

        await database.execute(
          'INSERT INTO sections (id, song_id, name, order_index, repeat_count, transpose_override, bpm_override, playback_speed_override) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            sectionId,
            id,
            sectionInput.name,
            sIdx,
            sectionInput.repeatCount ?? 1,
            sectionInput.transposeOverride ?? null,
            sectionInput.bpmOverride ?? null,
            sectionInput.playbackSpeedOverride ?? null,
          ]
        );

        for (let lIdx = 0; lIdx < sectionInput.lines.length; lIdx++) {
          const lineInput = sectionInput.lines[lIdx];
          const lineId = lineInput.id ?? generateUUID();

          await database.execute(
            'INSERT INTO lines (id, section_id, lyrics, chords_json, order_index, measures) VALUES (?, ?, ?, ?, ?, ?)',
            [lineId, sectionId, lineInput.lyrics, JSON.stringify(lineInput.chords), lIdx, lineInput.measures ?? 4]
          );
        }
      }
    }

    await database.execute('COMMIT');
  } catch (e) {
    await database.execute('ROLLBACK');
    throw e;
  }
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
    }>
  >(
    `SELECT s.id, s.title, a.name as artist_name
     FROM songs s
     LEFT JOIN artists a ON s.artist_id = a.id
     INNER JOIN playlist_songs ps ON s.id = ps.song_id
     WHERE ps.playlist_id = ?
     ORDER BY ps.order_index`,
    [id]
  );

  return {
    playlist: toPlaylist(playlistRows[0]),
    songs: songRows.map((row: { id: string; title: string; artist_name: string | null }) => ({
      id: row.id,
      title: row.title,
      artistName: row.artist_name,
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

export async function getSongsByArtist(artistId: UUID): Promise<SongListItem[]> {
  const database = await getDatabase();
  const rows = await database.select<
    Array<{
      id: string;
      title: string;
      artist_name: string | null;
    }>
  >(
    `SELECT s.id, s.title, a.name as artist_name
     FROM songs s
     LEFT JOIN artists a ON s.artist_id = a.id
     WHERE s.artist_id = ?
     ORDER BY s.title`,
    [artistId]
  );
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    artistName: row.artist_name,
  }));
}

// ============================================
// Annotations
// ============================================

export async function getAnnotations(lineId: UUID): Promise<Annotation[]> {
  const database = await getDatabase();
  const rows = await database.select<AnnotationRow[]>(
    'SELECT * FROM annotations WHERE line_id = ? ORDER BY chord_index NULLS FIRST, created_at',
    [lineId]
  );
  return rows.map(toAnnotation);
}

export async function createAnnotation(
  lineId: UUID,
  content: string,
  chordIndex?: number
): Promise<UUID> {
  const database = await getDatabase();
  const id = generateUUID();
  const now = new Date().toISOString();

  await database.execute(
    'INSERT INTO annotations (id, line_id, chord_index, content, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, lineId, chordIndex ?? null, content, now]
  );

  return id;
}

export async function updateAnnotation(id: UUID, content: string): Promise<void> {
  const database = await getDatabase();
  await database.execute(
    'UPDATE annotations SET content = ? WHERE id = ?',
    [content, id]
  );
}

export async function deleteAnnotation(id: UUID): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM annotations WHERE id = ?', [id]);
}

// ============================================
// Chord Preferences
// ============================================

export async function getChordPreferences(): Promise<ChordPreference[]> {
  const database = await getDatabase();
  const rows = await database.select<ChordPreferenceRow[]>(
    'SELECT * FROM chord_preferences ORDER BY chord_name'
  );

  return rows.map((row) => ({
    id: row.id,
    chordName: row.chord_name,
    fingering: JSON.parse(row.fingering_json) as ChordFingering,
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
  }));
}

export async function getChordPreference(chordName: string): Promise<ChordPreference | null> {
  const database = await getDatabase();
  const rows = await database.select<ChordPreferenceRow[]>(
    'SELECT * FROM chord_preferences WHERE chord_name = ? AND is_default = 1',
    [chordName]
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    chordName: row.chord_name,
    fingering: JSON.parse(row.fingering_json) as ChordFingering,
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
  };
}

export async function setChordPreference(
  chordName: string,
  fingering: ChordFingering
): Promise<void> {
  const database = await getDatabase();
  const id = generateUUID();
  const now = new Date().toISOString();
  const fingeringJson = JSON.stringify(fingering);

  await database.execute(
    `INSERT INTO chord_preferences (id, chord_name, fingering_json, is_default, created_at)
     VALUES (?, ?, ?, 1, ?)
     ON CONFLICT(chord_name, is_default) DO UPDATE SET fingering_json = ?`,
    [id, chordName, fingeringJson, now, fingeringJson]
  );
}

export async function deleteChordPreference(chordName: string): Promise<void> {
  const database = await getDatabase();
  await database.execute('DELETE FROM chord_preferences WHERE chord_name = ?', [chordName]);
}

// ============================================
// Export as DatabaseAPI implementation
// ============================================

export const tauriDatabase: DatabaseAPI = {
  getSongs,
  getSongById,
  searchSongs,
  saveSong,
  updateSong,
  deleteSong,
  incrementPlayCount,
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSong,
  getTags,
  createTag,
  deleteTag,
  getArtists,
  getSongsByArtist,
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  getChordPreferences,
  getChordPreference,
  setChordPreference,
  deleteChordPreference,
};
