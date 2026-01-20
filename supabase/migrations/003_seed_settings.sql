-- ============================================================
-- CaT4G Settings Seed Data
-- 機能フラグの初期データ
-- ============================================================

-- settingsテーブルに機能フラグを挿入
-- ON CONFLICT DO NOTHING で既存データがあればスキップ

-- スクレイピング機能フラグ
INSERT INTO settings (key, value) VALUES
    ('scraping_enabled', 'true'),           -- スクレイピング機能全体のオンオフ
    ('scraping_ufret_enabled', 'true'),     -- U-Fret対応
    ('scraping_jtotal_enabled', 'true'),    -- J-Total対応
    ('scraping_gakkime_enabled', 'true'),   -- 楽器.me対応
    ('scraping_chordwiki_enabled', 'false') -- ChordWiki対応（Cloudflare対策で初期無効）
ON CONFLICT (key) DO NOTHING;

-- アプリ設定
INSERT INTO settings (key, value) VALUES
    ('app_version', '2.0.0'),               -- Webアプリバージョン
    ('maintenance_mode', 'false')           -- メンテナンスモード
ON CONFLICT (key) DO NOTHING;
