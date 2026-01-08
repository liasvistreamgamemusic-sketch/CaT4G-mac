# CaT4G - フロントエンド設計

## コンポーネント階層

```
App
├── useState: songs, playlists, selectedSongId, selectedSong, isAddModalOpen, isDbReady
├── useEffect: DB 初期化、曲一覧取得
│
├── Layout
│   ├── props: songs, selectedSong, onSongSelect, onAddClick, onSearch
│   ├── useState: isPlaying, scrollSpeed, metronomeEnabled, transpose
│   │
│   ├── Sidebar
│   │   ├── props: songs, selectedSongId, onSongSelect, onAddClick, onSearch
│   │   ├── useState: searchQuery, activeTab (songs/playlists)
│   │   ├── Logo + Animated glow
│   │   ├── Search input
│   │   ├── Tab navigation
│   │   ├── Song/Playlist list
│   │   └── Add button
│   │
│   ├── MainArea
│   │   ├── props: song, transpose
│   │   ├── Song header (title, artist, metadata badges)
│   │   ├── Section blocks
│   │   │   ├── Section header
│   │   │   └── Line items (chords + lyrics)
│   │   └── Empty state
│   │
│   └── ControlBar
│       ├── props: isPlaying, scrollSpeed, metronomeEnabled, transpose, callbacks
│       ├── Play/Pause button
│       ├── Speed slider (0.5x - 2.0x)
│       ├── BPM display
│       ├── Metronome toggle
│       └── Transpose controls (-12 to +12)
│
└── AddSongModal
    ├── props: isOpen, onClose, onSave
    ├── useState: activeTab, input, songDetails, parsedSong
    ├── Tab navigation (Paste/URL/Manual)
    ├── Input area (textarea/URL input)
    ├── Song details form
    └── Live preview
```

## 状態管理

### アプリケーション状態（App.tsx）

| 状態 | 型 | 初期値 | 説明 |
|------|------|--------|------|
| songs | SongListItem[] | [] | 曲一覧 |
| playlists | PlaylistWithCount[] | [] | プレイリスト一覧 |
| selectedSongId | string \| null | null | 選択中の曲 ID |
| selectedSong | SongWithDetails \| null | null | 選択中の曲詳細 |
| isAddModalOpen | boolean | false | モーダル表示状態 |
| isDbReady | boolean | false | DB 初期化完了フラグ |

### 再生状態（Layout.tsx）

| 状態 | 型 | 初期値 | 説明 |
|------|------|--------|------|
| isPlaying | boolean | false | 再生中フラグ |
| scrollSpeed | number | 1.0 | スクロール速度 (0.5-2.0) |
| metronomeEnabled | boolean | false | メトロノーム有効 |
| transpose | number | 0 | 転調量 (-12 to +12) |

## 型定義

### 基本型

```typescript
// src/types/database.ts

type UUID = string;
type ISODateTime = string;
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type TimeSignature = '4/4' | '3/4' | '6/8' | '2/4';
```

### コード関連型

```typescript
interface ChordPosition {
  chord: string;
  position: number;
}

interface ChordFingering {
  frets: (number | null)[];  // [e, B, G, D, A, E]
  fingers: (number | null)[];
  barreAt: number | null;
  baseFret: number;
}
```

### エンティティ型

```typescript
interface Artist {
  id: UUID;
  name: string;
  createdAt: ISODateTime;
}

interface Song {
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

interface Section {
  id: UUID;
  songId: UUID;
  name: string;
  orderIndex: number;
  repeatCount: number;
}

interface Line {
  id: UUID;
  sectionId: UUID;
  lyrics: string;
  chords: ChordPosition[];
  orderIndex: number;
}

interface Tag {
  id: UUID;
  name: string;
  color: string | null;
}

interface Playlist {
  id: UUID;
  name: string;
  description: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

### 複合型

```typescript
interface SongWithDetails {
  song: Song;
  artist: Artist | null;
  sections: SectionWithLines[];
  tags: Tag[];
}

interface SectionWithLines {
  section: Section;
  lines: Line[];
}

interface SongListItem {
  id: UUID;
  title: string;
  artistName: string | null;
  isFavorite: boolean;
}

interface PlaylistWithCount {
  playlist: Playlist;
  songCount: number;
}
```

## 実装タスク

### 1. 型定義ファイル作成

`src/types/database.ts` と `src/types/index.ts` を作成

### 2. App.tsx 実装

```typescript
// src/App.tsx
import { useState, useEffect } from 'react';
import { Layout, AddSongModal } from './components';
import { initDatabase, getSongs, getSongById } from './lib/database';
import type { SongListItem, SongWithDetails } from './types';

function App() {
  const [songs, setSongs] = useState<SongListItem[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongWithDetails | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initDatabase();
      setIsDbReady(true);
      const songList = await getSongs();
      setSongs(songList);
    }
    init();
  }, []);

  useEffect(() => {
    async function loadSong() {
      if (selectedSongId) {
        const song = await getSongById(selectedSongId);
        setSelectedSong(song);
      } else {
        setSelectedSong(null);
      }
    }
    loadSong();
  }, [selectedSongId]);

  // ... handlers and render
}
```

### 3. コンポーネント実装順序

1. **Layout.tsx** - 全体レイアウト
2. **Sidebar.tsx** - サイドバー（曲一覧、検索）
3. **MainArea.tsx** - メインコンテンツ（コード譜表示）
4. **ControlBar.tsx** - コントロールバー
5. **AddSongModal.tsx** - 曲追加モーダル

## 次のステップ

フロントエンド基盤完了後:
- [04_backend_scraping.md](./04_backend_scraping.md) で URL スクレイピング機能を実装
- [09_ui_design.md](./09_ui_design.md) で詳細な UI スタイルを適用
