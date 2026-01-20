/**
 * CaT4G Supabase Database Implementation
 * PostgreSQL-based cloud database via Supabase
 */

import { getSupabaseClient, getCurrentUserId } from '@/lib/supabase';
import type {
  UUID,
  Artist,
  Tag,
  Annotation,
  SongWithDetails,
  SongListItem,
  SectionWithLines,
  PlaylistWithCount,
  PlaylistWithSongs,
  CreateSongInput,
  CreatePlaylistInput,
  UpdateSongInput,
  Section,
  Line,
  Playlist,
  Song,
  ChordPosition,
  TimeSignature,
  Difficulty,
  Tuning,
} from '@/types/database';
import type { DatabaseAPI } from '../types';

// ============================================
// Utility Functions
// ============================================

function generateUUID(): UUID {
  return crypto.randomUUID();
}

async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
}

// ============================================
// Songs - Read Operations
// ============================================

export async function getSongs(): Promise<SongListItem[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('songs')
    .select(`
      id,
      title,
      is_favorite,
      artists!songs_artist_id_fkey ( name )
    `)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    artistName: (row.artists as { name: string } | null)?.name ?? null,
    isFavorite: row.is_favorite,
  }));
}

export async function getSongById(id: UUID): Promise<SongWithDetails | null> {
  const supabase = getSupabaseClient();

  // Get song with artist
  const { data: songData, error: songError } = await supabase
    .from('songs')
    .select(`
      *,
      artists!songs_artist_id_fkey ( * )
    `)
    .eq('id', id)
    .single();

  if (songError) {
    if (songError.code === 'PGRST116') return null; // Not found
    throw new Error(songError.message);
  }

  if (!songData) return null;

  // Get sections
  const { data: sectionsData, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .eq('song_id', id)
    .order('order_index');

  if (sectionsError) throw new Error(sectionsError.message);

  // Get lines for each section
  const sections: SectionWithLines[] = [];
  for (const sectionRow of sectionsData ?? []) {
    const { data: linesData, error: linesError } = await supabase
      .from('lines')
      .select('*')
      .eq('section_id', sectionRow.id)
      .order('order_index');

    if (linesError) throw new Error(linesError.message);

    const section: Section = {
      id: sectionRow.id,
      songId: sectionRow.song_id,
      name: sectionRow.name,
      orderIndex: sectionRow.order_index,
      repeatCount: sectionRow.repeat_count,
      transposeOverride: sectionRow.transpose_override,
      bpmOverride: sectionRow.bpm_override,
      playbackSpeedOverride: sectionRow.playback_speed_override,
    };

    const lines: Line[] = (linesData ?? []).map((lineRow) => ({
      id: lineRow.id,
      sectionId: lineRow.section_id,
      lyrics: lineRow.lyrics,
      chords: lineRow.chords_json as ChordPosition[],
      orderIndex: lineRow.order_index,
      measures: lineRow.measures,
    }));

    sections.push({ section, lines });
  }

  // Get tags
  const { data: tagsData, error: tagsError } = await supabase
    .from('song_tags')
    .select(`
      tags!song_tags_tag_id_fkey ( * )
    `)
    .eq('song_id', id);

  if (tagsError) throw new Error(tagsError.message);

  const tags: Tag[] = (tagsData ?? [])
    .map((row) => row.tags as unknown as { id: string; name: string; color: string | null })
    .filter((t): t is { id: string; name: string; color: string | null } => t !== null)
    .map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    }));

  // Convert to Song type
  const artistRow = songData.artists as { id: string; name: string; created_at: string } | null;
  const artist: Artist | null = artistRow
    ? {
        id: artistRow.id,
        name: artistRow.name,
        createdAt: artistRow.created_at,
      }
    : null;

  const song: Song = {
    id: songData.id,
    title: songData.title,
    artistId: songData.artist_id,
    originalKey: songData.original_key,
    bpm: songData.bpm,
    timeSignature: songData.time_signature as TimeSignature,
    capo: songData.capo,
    transpose: 0, // TODO: Add to Supabase schema
    playbackSpeed: 1.0, // TODO: Add to Supabase schema
    tuning: 'standard' as Tuning, // TODO: Add to Supabase schema
    difficulty: songData.difficulty as Difficulty | null,
    sourceUrl: songData.source_url,
    notes: songData.notes,
    isFavorite: songData.is_favorite,
    playCount: songData.play_count,
    createdAt: songData.created_at,
    updatedAt: songData.updated_at,
  };

  return { song, artist, sections, tags };
}

export async function searchSongs(query: string): Promise<SongListItem[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('songs')
    .select(`
      id,
      title,
      is_favorite,
      artists!songs_artist_id_fkey ( name )
    `)
    .or(`title.ilike.%${query}%,artists.name.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    artistName: (row.artists as { name: string } | null)?.name ?? null,
    isFavorite: row.is_favorite,
  }));
}

// ============================================
// Songs - Write Operations
// ============================================

export async function saveSong(input: CreateSongInput): Promise<UUID> {
  const supabase = getSupabaseClient();
  const userId = await requireUserId();
  const songId = generateUUID();
  const now = new Date().toISOString();

  // Create or find artist
  let artistId: UUID | null = null;
  if (input.artistName) {
    const { data: existingArtist } = await supabase
      .from('artists')
      .select('id')
      .eq('name', input.artistName)
      .eq('user_id', userId)
      .single();

    if (existingArtist) {
      artistId = existingArtist.id;
    } else {
      artistId = generateUUID();
      const { error } = await supabase.from('artists').insert({
        id: artistId,
        user_id: userId,
        name: input.artistName,
        created_at: now,
      });
      if (error) throw new Error(error.message);
    }
  }

  // Insert song
  const { error: songError } = await supabase.from('songs').insert({
    id: songId,
    user_id: userId,
    title: input.title,
    artist_id: artistId,
    original_key: input.originalKey ?? null,
    bpm: input.bpm ?? null,
    time_signature: input.timeSignature ?? '4/4',
    capo: input.capo ?? 0,
    difficulty: input.difficulty ?? null,
    source_url: input.sourceUrl ?? null,
    notes: input.notes ?? null,
    is_favorite: false,
    play_count: 0,
    created_at: now,
    updated_at: now,
  });
  if (songError) throw new Error(songError.message);

  // Insert sections and lines
  for (let sIdx = 0; sIdx < input.sections.length; sIdx++) {
    const sectionInput = input.sections[sIdx];
    const sectionId = generateUUID();

    const { error: sectionError } = await supabase.from('sections').insert({
      id: sectionId,
      user_id: userId,
      song_id: songId,
      name: sectionInput.name,
      order_index: sIdx,
      repeat_count: sectionInput.repeatCount ?? 1,
    });
    if (sectionError) throw new Error(sectionError.message);

    for (let lIdx = 0; lIdx < sectionInput.lines.length; lIdx++) {
      const lineInput = sectionInput.lines[lIdx];
      const lineId = generateUUID();

      const { error: lineError } = await supabase.from('lines').insert({
        id: lineId,
        user_id: userId,
        section_id: sectionId,
        lyrics: lineInput.lyrics,
        chords_json: lineInput.chords,
        order_index: lIdx,
        measures: 4,
      });
      if (lineError) throw new Error(lineError.message);
    }
  }

  // Add tags
  if (input.tagIds && input.tagIds.length > 0) {
    for (const tagId of input.tagIds) {
      const { error } = await supabase.from('song_tags').insert({
        song_id: songId,
        tag_id: tagId,
        user_id: userId,
      });
      if (error && !error.message.includes('duplicate')) throw new Error(error.message);
    }
  }

  return songId;
}

export async function updateSongFavorite(id: UUID, isFavorite: boolean): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('songs')
    .update({
      is_favorite: isFavorite,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function incrementPlayCount(id: UUID): Promise<void> {
  const supabase = getSupabaseClient();

  // Get current play count
  const { data, error: fetchError } = await supabase
    .from('songs')
    .select('play_count')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase
    .from('songs')
    .update({
      play_count: (data?.play_count ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteSong(id: UUID): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from('songs').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateSong(id: UUID, input: UpdateSongInput): Promise<void> {
  const supabase = getSupabaseClient();
  const userId = await requireUserId();
  const now = new Date().toISOString();

  // Handle artist update
  let artistId: UUID | null | undefined = undefined;

  if (input.artistName !== undefined) {
    if (input.artistName === null || input.artistName === '') {
      artistId = null;
    } else {
      const { data: existingArtist } = await supabase
        .from('artists')
        .select('id')
        .eq('name', input.artistName)
        .eq('user_id', userId)
        .single();

      if (existingArtist) {
        artistId = existingArtist.id;
      } else {
        artistId = generateUUID();
        const { error } = await supabase.from('artists').insert({
          id: artistId,
          user_id: userId,
          name: input.artistName,
          created_at: now,
        });
        if (error) throw new Error(error.message);
      }
    }
  }

  // Build update object
  const updates: Record<string, unknown> = {
    updated_at: now,
  };

  if (input.title !== undefined) updates.title = input.title;
  if (artistId !== undefined) updates.artist_id = artistId;
  if (input.originalKey !== undefined) updates.original_key = input.originalKey;
  if (input.bpm !== undefined) updates.bpm = input.bpm;
  if (input.timeSignature !== undefined) updates.time_signature = input.timeSignature;
  if (input.capo !== undefined) updates.capo = input.capo;
  if (input.difficulty !== undefined) updates.difficulty = input.difficulty;
  if (input.notes !== undefined) updates.notes = input.notes;

  // Update song
  const { error: songError } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', id);

  if (songError) throw new Error(songError.message);

  // Update sections and lines if provided
  if (input.sections !== undefined) {
    // Delete existing sections (cascades to lines)
    const { error: deleteError } = await supabase
      .from('sections')
      .delete()
      .eq('song_id', id);

    if (deleteError) throw new Error(deleteError.message);

    // Insert new sections and lines
    for (let sIdx = 0; sIdx < input.sections.length; sIdx++) {
      const sectionInput = input.sections[sIdx];
      const sectionId = sectionInput.id ?? generateUUID();

      const { error: sectionError } = await supabase.from('sections').insert({
        id: sectionId,
        user_id: userId,
        song_id: id,
        name: sectionInput.name,
        order_index: sIdx,
        repeat_count: sectionInput.repeatCount ?? 1,
        transpose_override: sectionInput.transposeOverride ?? null,
        bpm_override: sectionInput.bpmOverride ?? null,
        playback_speed_override: sectionInput.playbackSpeedOverride ?? null,
      });
      if (sectionError) throw new Error(sectionError.message);

      for (let lIdx = 0; lIdx < sectionInput.lines.length; lIdx++) {
        const lineInput = sectionInput.lines[lIdx];
        const lineId = lineInput.id ?? generateUUID();

        const { error: lineError } = await supabase.from('lines').insert({
          id: lineId,
          user_id: userId,
          section_id: sectionId,
          lyrics: lineInput.lyrics,
          chords_json: lineInput.chords,
          order_index: lIdx,
          measures: lineInput.measures ?? 4,
        });
        if (lineError) throw new Error(lineError.message);
      }
    }
  }
}

// ============================================
// Playlists - Read Operations
// ============================================

export async function getPlaylists(): Promise<PlaylistWithCount[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      playlist_songs ( count )
    `)
    .order('name');

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    playlist: {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    } as Playlist,
    songCount: Array.isArray(row.playlist_songs) ? row.playlist_songs.length : 0,
  }));
}

export async function getPlaylistById(id: UUID): Promise<PlaylistWithSongs | null> {
  const supabase = getSupabaseClient();

  const { data: playlistData, error: playlistError } = await supabase
    .from('playlists')
    .select('*')
    .eq('id', id)
    .single();

  if (playlistError) {
    if (playlistError.code === 'PGRST116') return null;
    throw new Error(playlistError.message);
  }

  if (!playlistData) return null;

  const { data: songsData, error: songsError } = await supabase
    .from('playlist_songs')
    .select(`
      order_index,
      songs!playlist_songs_song_id_fkey (
        id,
        title,
        is_favorite,
        artists!songs_artist_id_fkey ( name )
      )
    `)
    .eq('playlist_id', id)
    .order('order_index');

  if (songsError) throw new Error(songsError.message);

  const songs: SongListItem[] = (songsData ?? [])
    .filter((row) => row.songs !== null)
    .map((row) => {
      const song = row.songs as {
        id: string;
        title: string;
        is_favorite: boolean;
        artists: { name: string } | null;
      };
      return {
        id: song.id,
        title: song.title,
        artistName: song.artists?.name ?? null,
        isFavorite: song.is_favorite,
      };
    });

  return {
    playlist: {
      id: playlistData.id,
      name: playlistData.name,
      description: playlistData.description,
      createdAt: playlistData.created_at,
      updatedAt: playlistData.updated_at,
    },
    songs,
  };
}

// ============================================
// Playlists - Write Operations
// ============================================

export async function createPlaylist(input: CreatePlaylistInput): Promise<UUID> {
  const supabase = getSupabaseClient();
  const userId = await requireUserId();
  const id = generateUUID();
  const now = new Date().toISOString();

  const { error } = await supabase.from('playlists').insert({
    id,
    user_id: userId,
    name: input.name,
    description: input.description ?? null,
    created_at: now,
    updated_at: now,
  });

  if (error) throw new Error(error.message);
  return id;
}

export async function updatePlaylist(
  id: UUID,
  updates: Partial<CreatePlaylistInput>
): Promise<void> {
  const supabase = getSupabaseClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;

  const { error } = await supabase
    .from('playlists')
    .update(updateData)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deletePlaylist(id: UUID): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from('playlists').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function addSongToPlaylist(playlistId: UUID, songId: UUID): Promise<void> {
  const supabase = getSupabaseClient();
  const userId = await requireUserId();

  // Get max order index
  const { data: maxData } = await supabase
    .from('playlist_songs')
    .select('order_index')
    .eq('playlist_id', playlistId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxData?.order_index ?? -1) + 1;

  const { error } = await supabase.from('playlist_songs').insert({
    playlist_id: playlistId,
    song_id: songId,
    user_id: userId,
    order_index: nextOrder,
  });

  if (error && !error.message.includes('duplicate')) throw new Error(error.message);

  // Update playlist timestamp
  await supabase
    .from('playlists')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', playlistId);
}

export async function removeSongFromPlaylist(playlistId: UUID, songId: UUID): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('song_id', songId);

  if (error) throw new Error(error.message);

  // Update playlist timestamp
  await supabase
    .from('playlists')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', playlistId);
}

export async function reorderPlaylistSong(
  playlistId: UUID,
  songId: UUID,
  newIndex: number
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('playlist_songs')
    .update({ order_index: newIndex })
    .eq('playlist_id', playlistId)
    .eq('song_id', songId);

  if (error) throw new Error(error.message);
}

// ============================================
// Tags
// ============================================

export async function getTags(): Promise<Tag[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    color: row.color,
  }));
}

export async function createTag(name: string, color?: string): Promise<UUID> {
  const supabase = getSupabaseClient();
  const userId = await requireUserId();
  const id = generateUUID();

  const { error } = await supabase.from('tags').insert({
    id,
    user_id: userId,
    name,
    color: color ?? null,
  });

  if (error) throw new Error(error.message);
  return id;
}

export async function deleteTag(id: UUID): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================
// Artists
// ============================================

export async function getArtists(): Promise<Artist[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  }));
}

export async function getSongsByArtist(artistId: UUID): Promise<SongListItem[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('songs')
    .select(`
      id,
      title,
      is_favorite,
      artists!songs_artist_id_fkey ( name )
    `)
    .eq('artist_id', artistId)
    .order('title');

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    artistName: (row.artists as { name: string } | null)?.name ?? null,
    isFavorite: row.is_favorite,
  }));
}

// ============================================
// Annotations
// ============================================

export async function getAnnotations(_lineId: UUID): Promise<Annotation[]> {
  // TODO: Add annotations table to Supabase schema
  // For now, return empty array
  console.warn('Annotations not yet implemented in Supabase');
  return [];
}

export async function createAnnotation(
  _lineId: UUID,
  _content: string,
  _chordIndex?: number
): Promise<UUID> {
  // TODO: Add annotations table to Supabase schema
  console.warn('Annotations not yet implemented in Supabase');
  return generateUUID();
}

export async function updateAnnotation(_id: UUID, _content: string): Promise<void> {
  // TODO: Add annotations table to Supabase schema
  console.warn('Annotations not yet implemented in Supabase');
}

export async function deleteAnnotation(_id: UUID): Promise<void> {
  // TODO: Add annotations table to Supabase schema
  console.warn('Annotations not yet implemented in Supabase');
}

// ============================================
// Export as DatabaseAPI implementation
// ============================================

export const supabaseDatabase: DatabaseAPI = {
  getSongs,
  getSongById,
  searchSongs,
  saveSong,
  updateSong,
  deleteSong,
  updateSongFavorite,
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
};
