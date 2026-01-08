-- CaT4G Initial Schema
-- Based on spec: specs/02_database.md

-- アーティストテーブル
CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 曲テーブル
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

-- セクションテーブル
CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    repeat_count INTEGER DEFAULT 1
);

-- 行テーブル
CREATE TABLE IF NOT EXISTS lines (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    lyrics TEXT NOT NULL,
    chords_json TEXT NOT NULL DEFAULT '[]',
    order_index INTEGER NOT NULL
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT
);

-- 曲-タグ中間テーブル
CREATE TABLE IF NOT EXISTS song_tags (
    song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, tag_id)
);

-- プレイリストテーブル
CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- プレイリスト-曲中間テーブル
CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id TEXT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    PRIMARY KEY (playlist_id, song_id)
);

-- コード押さえ方カスタマイズテーブル（フェーズ4で使用）
CREATE TABLE IF NOT EXISTS chord_preferences (
    id TEXT PRIMARY KEY,
    chord_name TEXT NOT NULL,
    fingering_json TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- アプリ設定テーブル
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_favorite ON songs(is_favorite);
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_sections_song ON sections(song_id);
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections(song_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lines_section ON lines(section_id);
CREATE INDEX IF NOT EXISTS idx_lines_order ON lines(section_id, order_index);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_order ON playlist_songs(playlist_id, order_index);
CREATE INDEX IF NOT EXISTS idx_song_tags_song ON song_tags(song_id);
CREATE INDEX IF NOT EXISTS idx_song_tags_tag ON song_tags(tag_id);
