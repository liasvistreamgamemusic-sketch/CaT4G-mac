-- ============================================================
-- CaT4G Row Level Security (RLS) Policies
-- マルチユーザー対応のためのRLSポリシー定義
-- ============================================================

-- ============================================================
-- RLS有効化
-- ============================================================

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chord_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- artists テーブル（user_idを持つ）
-- ユーザーは自分のデータのみアクセス可能
-- ============================================================

CREATE POLICY artists_select_policy ON artists
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY artists_insert_policy ON artists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY artists_update_policy ON artists
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY artists_delete_policy ON artists
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- songs テーブル（user_idを持つ）
-- ユーザーは自分のデータのみアクセス可能
-- ============================================================

CREATE POLICY songs_select_policy ON songs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY songs_insert_policy ON songs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY songs_update_policy ON songs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY songs_delete_policy ON songs
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- sections テーブル（階層データ：song_id経由でuser_idを参照）
-- 自分のデータかつ、親のsongも自分のものであることを確認
-- ============================================================

CREATE POLICY sections_select_policy ON sections
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY sections_insert_policy ON sections
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM songs
            WHERE songs.id = song_id
            AND songs.user_id = auth.uid()
        )
    );

CREATE POLICY sections_update_policy ON sections
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM songs
            WHERE songs.id = song_id
            AND songs.user_id = auth.uid()
        )
    );

CREATE POLICY sections_delete_policy ON sections
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- lines テーブル（階層データ：section_id経由でuser_idを参照）
-- 自分のデータかつ、親のsectionも自分のものであることを確認
-- ============================================================

CREATE POLICY lines_select_policy ON lines
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY lines_insert_policy ON lines
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM sections
            WHERE sections.id = section_id
            AND sections.user_id = auth.uid()
        )
    );

CREATE POLICY lines_update_policy ON lines
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM sections
            WHERE sections.id = section_id
            AND sections.user_id = auth.uid()
        )
    );

CREATE POLICY lines_delete_policy ON lines
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- tags テーブル（user_idを持つ）
-- ユーザーは自分のデータのみアクセス可能
-- ============================================================

CREATE POLICY tags_select_policy ON tags
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY tags_insert_policy ON tags
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY tags_update_policy ON tags
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY tags_delete_policy ON tags
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- song_tags テーブル（階層データ：song_id, tag_id経由でuser_idを参照）
-- 自分のデータかつ、関連するsongとtagも自分のものであることを確認
-- ============================================================

CREATE POLICY song_tags_select_policy ON song_tags
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY song_tags_insert_policy ON song_tags
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM songs
            WHERE songs.id = song_id
            AND songs.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM tags
            WHERE tags.id = tag_id
            AND tags.user_id = auth.uid()
        )
    );

CREATE POLICY song_tags_update_policy ON song_tags
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM songs
            WHERE songs.id = song_id
            AND songs.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM tags
            WHERE tags.id = tag_id
            AND tags.user_id = auth.uid()
        )
    );

CREATE POLICY song_tags_delete_policy ON song_tags
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- playlists テーブル（user_idを持つ）
-- ユーザーは自分のデータのみアクセス可能
-- ============================================================

CREATE POLICY playlists_select_policy ON playlists
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY playlists_insert_policy ON playlists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY playlists_update_policy ON playlists
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY playlists_delete_policy ON playlists
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- playlist_songs テーブル（階層データ：playlist_id, song_id経由でuser_idを参照）
-- 自分のデータかつ、関連するplaylistとsongも自分のものであることを確認
-- ============================================================

CREATE POLICY playlist_songs_select_policy ON playlist_songs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY playlist_songs_insert_policy ON playlist_songs
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM playlists
            WHERE playlists.id = playlist_id
            AND playlists.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM songs
            WHERE songs.id = song_id
            AND songs.user_id = auth.uid()
        )
    );

CREATE POLICY playlist_songs_update_policy ON playlist_songs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM playlists
            WHERE playlists.id = playlist_id
            AND playlists.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM songs
            WHERE songs.id = song_id
            AND songs.user_id = auth.uid()
        )
    );

CREATE POLICY playlist_songs_delete_policy ON playlist_songs
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- chord_preferences テーブル（user_idを持つ）
-- ユーザーは自分のデータのみアクセス可能
-- ============================================================

CREATE POLICY chord_preferences_select_policy ON chord_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY chord_preferences_insert_policy ON chord_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY chord_preferences_update_policy ON chord_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY chord_preferences_delete_policy ON chord_preferences
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- settings テーブル（グローバル設定）
-- 全ユーザーが読み取り可能、書き込みはservice_roleのみ
-- ============================================================

-- 全ユーザー（認証済み）がSELECT可能
CREATE POLICY settings_select_policy ON settings
    FOR SELECT
    USING (true);

-- INSERT/UPDATE/DELETEはservice_roleのみ（RLSをバイパス）
-- service_roleはデフォルトでRLSをバイパスするため、
-- 通常ユーザー向けのポリシーは作成しない（=アクセス拒否）

-- ============================================================
-- コメント（ポリシー説明）
-- ============================================================

COMMENT ON POLICY artists_select_policy ON artists IS 'ユーザーは自分のアーティストのみ参照可能';
COMMENT ON POLICY artists_insert_policy ON artists IS 'ユーザーは自分のアーティストのみ作成可能';
COMMENT ON POLICY artists_update_policy ON artists IS 'ユーザーは自分のアーティストのみ更新可能';
COMMENT ON POLICY artists_delete_policy ON artists IS 'ユーザーは自分のアーティストのみ削除可能';

COMMENT ON POLICY songs_select_policy ON songs IS 'ユーザーは自分の曲のみ参照可能';
COMMENT ON POLICY songs_insert_policy ON songs IS 'ユーザーは自分の曲のみ作成可能';
COMMENT ON POLICY songs_update_policy ON songs IS 'ユーザーは自分の曲のみ更新可能';
COMMENT ON POLICY songs_delete_policy ON songs IS 'ユーザーは自分の曲のみ削除可能';

COMMENT ON POLICY sections_select_policy ON sections IS 'ユーザーは自分のセクションのみ参照可能';
COMMENT ON POLICY sections_insert_policy ON sections IS 'ユーザーは自分の曲に紐づくセクションのみ作成可能';
COMMENT ON POLICY sections_update_policy ON sections IS 'ユーザーは自分のセクションのみ更新可能';
COMMENT ON POLICY sections_delete_policy ON sections IS 'ユーザーは自分のセクションのみ削除可能';

COMMENT ON POLICY lines_select_policy ON lines IS 'ユーザーは自分の行のみ参照可能';
COMMENT ON POLICY lines_insert_policy ON lines IS 'ユーザーは自分のセクションに紐づく行のみ作成可能';
COMMENT ON POLICY lines_update_policy ON lines IS 'ユーザーは自分の行のみ更新可能';
COMMENT ON POLICY lines_delete_policy ON lines IS 'ユーザーは自分の行のみ削除可能';

COMMENT ON POLICY tags_select_policy ON tags IS 'ユーザーは自分のタグのみ参照可能';
COMMENT ON POLICY tags_insert_policy ON tags IS 'ユーザーは自分のタグのみ作成可能';
COMMENT ON POLICY tags_update_policy ON tags IS 'ユーザーは自分のタグのみ更新可能';
COMMENT ON POLICY tags_delete_policy ON tags IS 'ユーザーは自分のタグのみ削除可能';

COMMENT ON POLICY song_tags_select_policy ON song_tags IS 'ユーザーは自分の曲-タグ関連のみ参照可能';
COMMENT ON POLICY song_tags_insert_policy ON song_tags IS 'ユーザーは自分の曲と自分のタグの関連のみ作成可能';
COMMENT ON POLICY song_tags_update_policy ON song_tags IS 'ユーザーは自分の曲-タグ関連のみ更新可能';
COMMENT ON POLICY song_tags_delete_policy ON song_tags IS 'ユーザーは自分の曲-タグ関連のみ削除可能';

COMMENT ON POLICY playlists_select_policy ON playlists IS 'ユーザーは自分のプレイリストのみ参照可能';
COMMENT ON POLICY playlists_insert_policy ON playlists IS 'ユーザーは自分のプレイリストのみ作成可能';
COMMENT ON POLICY playlists_update_policy ON playlists IS 'ユーザーは自分のプレイリストのみ更新可能';
COMMENT ON POLICY playlists_delete_policy ON playlists IS 'ユーザーは自分のプレイリストのみ削除可能';

COMMENT ON POLICY playlist_songs_select_policy ON playlist_songs IS 'ユーザーは自分のプレイリスト-曲関連のみ参照可能';
COMMENT ON POLICY playlist_songs_insert_policy ON playlist_songs IS 'ユーザーは自分のプレイリストと自分の曲の関連のみ作成可能';
COMMENT ON POLICY playlist_songs_update_policy ON playlist_songs IS 'ユーザーは自分のプレイリスト-曲関連のみ更新可能';
COMMENT ON POLICY playlist_songs_delete_policy ON playlist_songs IS 'ユーザーは自分のプレイリスト-曲関連のみ削除可能';

COMMENT ON POLICY chord_preferences_select_policy ON chord_preferences IS 'ユーザーは自分のコード設定のみ参照可能';
COMMENT ON POLICY chord_preferences_insert_policy ON chord_preferences IS 'ユーザーは自分のコード設定のみ作成可能';
COMMENT ON POLICY chord_preferences_update_policy ON chord_preferences IS 'ユーザーは自分のコード設定のみ更新可能';
COMMENT ON POLICY chord_preferences_delete_policy ON chord_preferences IS 'ユーザーは自分のコード設定のみ削除可能';

COMMENT ON POLICY settings_select_policy ON settings IS '全認証ユーザーがグローバル設定を参照可能（書き込みはservice_roleのみ）';
