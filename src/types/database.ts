/**
 * CaT4G Database Type Definitions
 * Based on spec: specs/02_database.md, specs/03_frontend.md
 */

// ============================================
// Basic Types
// ============================================

export type UUID = string;
export type ISODateTime = string;
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type TimeSignature = '4/4' | '3/4' | '6/8' | '2/4';
export type SourceType = 'u-fret' | 'chordwiki' | 'j-total' | 'manual';

// ============================================
// Chord Related Types
// ============================================

/** コードの位置情報（歌詞内での位置） */
export interface ChordPosition {
  chord: string;
  position: number;
}

/** コードの押さえ方（フレット・指・バレー情報） */
export interface ChordFingering {
  frets: (number | null)[]; // [E, A, D, G, B, e] - null = ミュート
  fingers: (number | null)[]; // 1=人差し指, 2=中指, 3=薬指, 4=小指
  barreAt: number | null; // バレーフレット位置
  baseFret: number; // 開始フレット（1 = オープンポジション）
}

// ============================================
// Entity Types (Database Tables)
// ============================================

/** アーティスト */
export interface Artist {
  id: UUID;
  name: string;
  createdAt: ISODateTime;
}

/** 曲 */
export interface Song {
  id: UUID;
  title: string;
  artistId: UUID | null;
  originalKey: string | null;
  bpm: number | null;
  timeSignature: TimeSignature;
  capo: number;
  difficulty: Difficulty | null;
  sourceUrl: string | null;
  notes: string | null;
  isFavorite: boolean;
  playCount: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** セクション（Intro, Verse, Chorus 等） */
export interface Section {
  id: UUID;
  songId: UUID;
  name: string;
  orderIndex: number;
  repeatCount: number;
}

/** 行（歌詞 + コード） */
export interface Line {
  id: UUID;
  sectionId: UUID;
  lyrics: string;
  chords: ChordPosition[];
  orderIndex: number;
}

/** タグ */
export interface Tag {
  id: UUID;
  name: string;
  color: string | null;
}

/** プレイリスト */
export interface Playlist {
  id: UUID;
  name: string;
  description: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** コード押さえ方のカスタマイズ */
export interface ChordPreference {
  id: UUID;
  chordName: string;
  fingering: ChordFingering;
  isDefault: boolean;
  createdAt: ISODateTime;
}

/** アプリ設定 */
export interface AppSettings {
  theme: 'dark' | 'light';
  defaultBpm: number;
  defaultScrollSpeed: number;
  metronomeVolume: number;
  metronomeSound: 'click' | 'beep' | 'wood';
}

// ============================================
// Composite Types (Frontend Use)
// ============================================

/** セクション + 行一覧 */
export interface SectionWithLines {
  section: Section;
  lines: Line[];
}

/** 曲の完全な詳細情報 */
export interface SongWithDetails {
  song: Song;
  artist: Artist | null;
  sections: SectionWithLines[];
  tags: Tag[];
}

/** 曲一覧表示用（軽量） */
export interface SongListItem {
  id: UUID;
  title: string;
  artistName: string | null;
  isFavorite: boolean;
}

/** プレイリスト + 曲数 */
export interface PlaylistWithCount {
  playlist: Playlist;
  songCount: number;
}

/** プレイリスト + 曲一覧 */
export interface PlaylistWithSongs {
  playlist: Playlist;
  songs: SongListItem[];
}

// ============================================
// Input Types (Create/Update)
// ============================================

/** 曲作成入力 */
export interface CreateSongInput {
  title: string;
  artistName?: string;
  originalKey?: string;
  bpm?: number;
  timeSignature?: TimeSignature;
  capo?: number;
  difficulty?: Difficulty;
  sourceUrl?: string;
  notes?: string;
  sections: CreateSectionInput[];
  tagIds?: UUID[];
}

/** セクション作成入力 */
export interface CreateSectionInput {
  name: string;
  repeatCount?: number;
  lines: CreateLineInput[];
}

/** 行作成入力 */
export interface CreateLineInput {
  lyrics: string;
  chords: ChordPosition[];
}

/** プレイリスト作成入力 */
export interface CreatePlaylistInput {
  name: string;
  description?: string;
}

// ============================================
// Scraper Types
// ============================================

/** スクレイピング結果のセクション */
export interface FetchedSection {
  name: string;
  lines: FetchedLine[];
}

/** スクレイピング結果の行 */
export interface FetchedLine {
  lyrics: string;
  chords: ChordPosition[];
}

/** スクレイピング結果 */
export interface FetchedChordSheet {
  title: string;
  artist: string;
  key?: string;
  bpm?: number;
  capo?: number;
  sections: FetchedSection[];
  sourceUrl: string;
  sourceType: SourceType;
}

/** Tauri コマンドの結果 */
export interface FetchResult {
  success: boolean;
  data: FetchedChordSheet | null;
  error: string | null;
}

// ============================================
// UI State Types
// ============================================

/** 再生状態 */
export interface PlaybackState {
  isPlaying: boolean;
  scrollSpeed: number;
  metronomeEnabled: boolean;
  transpose: number;
}

/** モーダル状態 */
export interface ModalState {
  isAddSongOpen: boolean;
  isEditSongOpen: boolean;
  isCreatePlaylistOpen: boolean;
  isSettingsOpen: boolean;
}

// ============================================
// Database Row Types (snake_case - for DB queries)
// ============================================

/** DB行: artists テーブル */
export interface ArtistRow {
  id: string;
  name: string;
  created_at: string;
}

/** DB行: songs テーブル */
export interface SongRow {
  id: string;
  title: string;
  artist_id: string | null;
  original_key: string | null;
  bpm: number | null;
  time_signature: string;
  capo: number;
  difficulty: string | null;
  source_url: string | null;
  notes: string | null;
  is_favorite: number;
  play_count: number;
  created_at: string;
  updated_at: string;
}

/** DB行: sections テーブル */
export interface SectionRow {
  id: string;
  song_id: string;
  name: string;
  order_index: number;
  repeat_count: number;
}

/** DB行: lines テーブル */
export interface LineRow {
  id: string;
  section_id: string;
  lyrics: string;
  chords_json: string;
  order_index: number;
}

/** DB行: tags テーブル */
export interface TagRow {
  id: string;
  name: string;
  color: string | null;
}

/** DB行: playlists テーブル */
export interface PlaylistRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/** DB行: chord_preferences テーブル */
export interface ChordPreferenceRow {
  id: string;
  chord_name: string;
  fingering_json: string;
  is_default: number;
  created_at: string;
}
