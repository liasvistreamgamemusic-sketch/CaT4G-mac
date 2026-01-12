-- CaT4G Migration: Line Measures
-- Adds measures field to lines table for measure count per line

-- 行ごとの小節数を追加（デフォルト: 4小節）
ALTER TABLE lines ADD COLUMN measures INTEGER DEFAULT 4;
