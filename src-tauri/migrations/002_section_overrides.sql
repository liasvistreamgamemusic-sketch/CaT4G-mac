-- CaT4G Migration: Section Overrides
-- Adds per-section settings for transpose, BPM, and playback speed

-- セクションごとの転調オーバーライド（相対値、例: +2, -3）
ALTER TABLE sections ADD COLUMN transpose_override INTEGER DEFAULT NULL;

-- セクションごとのBPMオーバーライド（null = 曲のBPMを使用）
ALTER TABLE sections ADD COLUMN bpm_override INTEGER DEFAULT NULL;

-- セクションごとの再生速度オーバーライド（null = 曲の速度を使用）
ALTER TABLE sections ADD COLUMN playback_speed_override REAL DEFAULT NULL;
