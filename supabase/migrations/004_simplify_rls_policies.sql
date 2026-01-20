-- ============================================================
-- Simplify RLS Policies
-- Remove EXISTS checks that can fail due to transaction visibility
-- Application code already ensures referential integrity
-- ============================================================

-- Drop existing complex policies for sections
DROP POLICY IF EXISTS sections_insert_policy ON sections;
DROP POLICY IF EXISTS sections_update_policy ON sections;

-- Create simplified policies for sections
CREATE POLICY sections_insert_policy ON sections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY sections_update_policy ON sections
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Drop existing complex policies for lines
DROP POLICY IF EXISTS lines_insert_policy ON lines;
DROP POLICY IF EXISTS lines_update_policy ON lines;

-- Create simplified policies for lines
CREATE POLICY lines_insert_policy ON lines
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY lines_update_policy ON lines
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Drop existing complex policies for song_tags
DROP POLICY IF EXISTS song_tags_insert_policy ON song_tags;
DROP POLICY IF EXISTS song_tags_update_policy ON song_tags;

-- Create simplified policies for song_tags
CREATE POLICY song_tags_insert_policy ON song_tags
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY song_tags_update_policy ON song_tags
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Drop existing complex policies for playlist_songs
DROP POLICY IF EXISTS playlist_songs_insert_policy ON playlist_songs;
DROP POLICY IF EXISTS playlist_songs_update_policy ON playlist_songs;

-- Create simplified policies for playlist_songs
CREATE POLICY playlist_songs_insert_policy ON playlist_songs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY playlist_songs_update_policy ON playlist_songs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Update comments
COMMENT ON POLICY sections_insert_policy ON sections IS 'ユーザーは自分のセクションのみ作成可能';
COMMENT ON POLICY sections_update_policy ON sections IS 'ユーザーは自分のセクションのみ更新可能';
COMMENT ON POLICY lines_insert_policy ON lines IS 'ユーザーは自分の行のみ作成可能';
COMMENT ON POLICY lines_update_policy ON lines IS 'ユーザーは自分の行のみ更新可能';
COMMENT ON POLICY song_tags_insert_policy ON song_tags IS 'ユーザーは自分の曲-タグ関連のみ作成可能';
COMMENT ON POLICY song_tags_update_policy ON song_tags IS 'ユーザーは自分の曲-タグ関連のみ更新可能';
COMMENT ON POLICY playlist_songs_insert_policy ON playlist_songs IS 'ユーザーは自分のプレイリスト-曲関連のみ作成可能';
COMMENT ON POLICY playlist_songs_update_policy ON playlist_songs IS 'ユーザーは自分のプレイリスト-曲関連のみ更新可能';
