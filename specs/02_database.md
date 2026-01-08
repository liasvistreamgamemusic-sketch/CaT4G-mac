# CaT4G - データベース設計

## ER 図

```
┌─────────────┐       ┌─────────────────────────────────────┐
│   artists   │       │              songs                   │
├─────────────┤       ├─────────────────────────────────────┤
│ id (PK)     │◄──┐   │ id (PK)                             │
│ name        │   └───│ artist_id (FK)                      │
│ created_at  │       │ title                               │
└─────────────┘       │ original_key                        │
                      │ bpm                                  │
                      │ time_signature                       │
                      │ capo                                 │
                      │ difficulty                           │
                      │ source_url                           │
                      │ notes                                │
                      │ is_favorite                          │
                      │ play_count                           │
                      │ created_at                           │
                      │ updated_at                           │
                      └───────────────┬─────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
┌─────────────────────┐   ┌─────────────────┐   ┌─────────────────────┐
│      sections       │   │    song_tags    │   │   playlist_songs    │
├─────────────────────┤   ├─────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ song_id (FK,PK) │   │ playlist_id (FK,PK) │
│ song_id (FK)        │   │ tag_id (FK,PK)  │   │ song_id (FK,PK)     │
│ name                │   └────────┬────────┘   │ order_index         │
│ order_index         │            │            └──────────┬──────────┘
│ repeat_count        │            ▼                       │
└─────────┬───────────┘   ┌─────────────────┐              │
          │               │      tags       │              │
          ▼               ├─────────────────┤              ▼
┌─────────────────────┐   │ id (PK)         │   ┌─────────────────────┐
│       lines         │   │ name (UNIQUE)   │   │     playlists       │
├─────────────────────┤   │ color           │   ├─────────────────────┤
│ id (PK)             │   └─────────────────┘   │ id (PK)             │
│ section_id (FK)     │                         │ name                │
│ lyrics              │                         │ description         │
│ chords_json         │                         │ created_at          │
│ order_index         │                         │ updated_at          │
└─────────────────────┘                         └─────────────────────┘
```

## テーブル定義

### artists（アーティスト）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| name | TEXT | NOT NULL, UNIQUE | アーティスト名 |
| created_at | TEXT | NOT NULL | 作成日時 (ISO 8601) |

### songs（曲）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| title | TEXT | NOT NULL | 曲タイトル |
| artist_id | TEXT | FOREIGN KEY | アーティスト参照 |
| original_key | TEXT | - | 原曲キー (C, C#, D, etc.) |
| bpm | INTEGER | - | テンポ |
| time_signature | TEXT | DEFAULT '4/4' | 拍子 |
| capo | INTEGER | DEFAULT 0 | カポ位置 |
| difficulty | TEXT | - | 難易度 (beginner/intermediate/advanced) |
| source_url | TEXT | - | インポート元 URL |
| notes | TEXT | - | メモ |
| is_favorite | INTEGER | DEFAULT 0 | お気に入りフラグ |
| play_count | INTEGER | DEFAULT 0 | 再生回数 |
| created_at | TEXT | NOT NULL | 作成日時 |
| updated_at | TEXT | NOT NULL | 更新日時 |

### sections（セクション）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| song_id | TEXT | FOREIGN KEY, CASCADE | 曲参照 |
| name | TEXT | NOT NULL | セクション名 (Intro, Verse, Chorus, etc.) |
| order_index | INTEGER | NOT NULL | 表示順序 |
| repeat_count | INTEGER | DEFAULT 1 | リピート回数 |

### lines（行）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| section_id | TEXT | FOREIGN KEY, CASCADE | セクション参照 |
| lyrics | TEXT | NOT NULL | 歌詞テキスト |
| chords_json | TEXT | NOT NULL | コード位置 JSON |
| order_index | INTEGER | NOT NULL | 表示順序 |

**chords_json フォーマット:**

```json
[
  { "chord": "C", "position": 0 },
  { "chord": "Am", "position": 8 },
  { "chord": "F", "position": 16 }
]
```

### tags（タグ）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| name | TEXT | NOT NULL, UNIQUE | タグ名 |
| color | TEXT | - | 表示色 (HEX) |

### song_tags（曲-タグ中間テーブル）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| song_id | TEXT | PRIMARY KEY, FOREIGN KEY | 曲参照 |
| tag_id | TEXT | PRIMARY KEY, FOREIGN KEY | タグ参照 |

### playlists（プレイリスト）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | TEXT | PRIMARY KEY | UUID |
| name | TEXT | NOT NULL | プレイリスト名 |
| description | TEXT | - | 説明 |
| created_at | TEXT | NOT NULL | 作成日時 |
| updated_at | TEXT | NOT NULL | 更新日時 |

### playlist_songs（プレイリスト-曲中間テーブル）

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| playlist_id | TEXT | PRIMARY KEY, FOREIGN KEY | プレイリスト参照 |
| song_id | TEXT | PRIMARY KEY, FOREIGN KEY | 曲参照 |
| order_index | INTEGER | NOT NULL | 表示順序 |

## マイグレーション SQL

### 001_initial.sql

```sql
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

-- インデックス
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_favorite ON songs(is_favorite);
CREATE INDEX IF NOT EXISTS idx_sections_song ON sections(song_id);
CREATE INDEX IF NOT EXISTS idx_lines_section ON lines(section_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_order ON playlist_songs(playlist_id, order_index);
```

## 実装タスク

### 1. マイグレーションファイル作成

`src-tauri/migrations/001_initial.sql` に上記 SQL を配置

### 2. database.ts の実装

```typescript
// src/lib/database.ts
import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export async function initDatabase(): Promise<void> {
  db = await Database.load('sqlite:cat4g.db');
  // マイグレーション実行
}

export async function getSongs(): Promise<SongListItem[]> {
  // 曲一覧取得
}

export async function getSongById(id: string): Promise<SongWithDetails | null> {
  // 曲詳細取得
}

export async function saveSong(song: CreateSongInput): Promise<string> {
  // 曲保存
}

export async function deleteSong(id: string): Promise<void> {
  // 曲削除
}
```

## 次のステップ

データベース準備完了後 → [03_frontend.md](./03_frontend.md) でフロントエンド基盤を構築
