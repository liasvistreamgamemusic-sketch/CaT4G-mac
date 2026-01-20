-- ============================================================
-- CaT4G PostgreSQL Schema for Supabase
-- Migrated from SQLite (Tauri desktop app)
-- ============================================================

-- UUID生成用の拡張機能を有効化（Supabaseではデフォルトで有効）
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- テーブル定義
-- ============================================================

-- アーティストテーブル
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- ユーザーごとにアーティスト名はユニーク
    UNIQUE(user_id, name)
);

-- 曲テーブル
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
    original_key TEXT,
    bpm INTEGER,
    time_signature TEXT DEFAULT '4/4',
    capo INTEGER DEFAULT 0,
    difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
    source_url TEXT,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- セクションテーブル
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    repeat_count INTEGER DEFAULT 1,
    -- Migration 002: セクションオーバーライド
    transpose_override INTEGER DEFAULT NULL,
    bpm_override INTEGER DEFAULT NULL,
    playback_speed_override REAL DEFAULT NULL
);

-- 行テーブル
CREATE TABLE lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    lyrics TEXT NOT NULL,
    chords_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    order_index INTEGER NOT NULL,
    -- Migration 003: 小節数
    measures INTEGER DEFAULT 4
);

-- タグテーブル
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    -- ユーザーごとにタグ名はユニーク
    UNIQUE(user_id, name)
);

-- 曲-タグ中間テーブル
CREATE TABLE song_tags (
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, tag_id)
);

-- プレイリストテーブル
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- プレイリスト-曲中間テーブル
CREATE TABLE playlist_songs (
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    PRIMARY KEY (playlist_id, song_id)
);

-- コード押さえ方カスタマイズテーブル
CREATE TABLE chord_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chord_name TEXT NOT NULL,
    fingering_json JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- ユーザーごとにコード名+デフォルトフラグの組み合わせを管理
    UNIQUE(user_id, chord_name, is_default)
);

-- アプリ設定テーブル（グローバル設定用、user_id不要）
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- ============================================================
-- インデックス
-- ============================================================

-- artists
CREATE INDEX idx_artists_user ON artists(user_id);
CREATE INDEX idx_artists_name ON artists(name);

-- songs
CREATE INDEX idx_songs_user ON songs(user_id);
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_songs_favorite ON songs(user_id, is_favorite);
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_created ON songs(user_id, created_at DESC);

-- sections
CREATE INDEX idx_sections_user ON sections(user_id);
CREATE INDEX idx_sections_song ON sections(song_id);
CREATE INDEX idx_sections_order ON sections(song_id, order_index);

-- lines
CREATE INDEX idx_lines_user ON lines(user_id);
CREATE INDEX idx_lines_section ON lines(section_id);
CREATE INDEX idx_lines_order ON lines(section_id, order_index);

-- tags
CREATE INDEX idx_tags_user ON tags(user_id);

-- song_tags
CREATE INDEX idx_song_tags_user ON song_tags(user_id);
CREATE INDEX idx_song_tags_song ON song_tags(song_id);
CREATE INDEX idx_song_tags_tag ON song_tags(tag_id);

-- playlists
CREATE INDEX idx_playlists_user ON playlists(user_id);

-- playlist_songs
CREATE INDEX idx_playlist_songs_user ON playlist_songs(user_id);
CREATE INDEX idx_playlist_songs_playlist ON playlist_songs(playlist_id);
CREATE INDEX idx_playlist_songs_order ON playlist_songs(playlist_id, order_index);

-- chord_preferences
CREATE INDEX idx_chord_preferences_user ON chord_preferences(user_id);
CREATE INDEX idx_chord_preferences_chord ON chord_preferences(user_id, chord_name);

-- ============================================================
-- updated_at自動更新トリガー
-- ============================================================

-- 汎用のupdated_at更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- songsテーブルのトリガー
CREATE TRIGGER songs_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- playlistsテーブルのトリガー
CREATE TRIGGER playlists_updated_at
    BEFORE UPDATE ON playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- コメント（テーブル説明）
-- ============================================================

COMMENT ON TABLE artists IS 'アーティスト情報';
COMMENT ON TABLE songs IS '曲のメタデータ';
COMMENT ON TABLE sections IS '曲のセクション（Intro, Verse, Chorus等）';
COMMENT ON TABLE lines IS 'セクション内の行（歌詞とコード位置）';
COMMENT ON TABLE tags IS 'ユーザー定義タグ';
COMMENT ON TABLE song_tags IS '曲とタグの関連付け';
COMMENT ON TABLE playlists IS 'プレイリスト';
COMMENT ON TABLE playlist_songs IS 'プレイリスト内の曲';
COMMENT ON TABLE chord_preferences IS 'コードの押さえ方カスタマイズ';
COMMENT ON TABLE settings IS 'アプリ全体の設定（グローバル）';
