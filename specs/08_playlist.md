# CaT4G - プレイリスト機能

**状態: 実装必須**

曲をグループ化して管理するプレイリスト機能。

## 機能仕様

### 基本機能

- プレイリスト作成、編集、削除
- 曲の追加、削除、並べ替え（ドラッグ&ドロップ）
- 連続再生モード（オートスクロールと連携）
- プレイリスト内検索

### UI 要素

| 要素 | 説明 |
|------|------|
| プレイリスト一覧 | サイドバーのタブ切り替えで表示 |
| プレイリスト詳細 | 曲一覧、曲数、作成日時 |
| 作成ボタン | 新規プレイリスト作成 |
| 編集メニュー | 名前変更、削除 |
| 曲追加ボタン | 既存の曲をプレイリストに追加 |
| 並べ替え | ドラッグ&ドロップで順序変更 |

## データ構造

```typescript
// src/types/playlist.ts

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistWithSongs {
  playlist: Playlist;
  songs: PlaylistSongItem[];
}

interface PlaylistSongItem {
  id: string;
  title: string;
  artistName: string | null;
  orderIndex: number;
}

interface PlaylistWithCount {
  playlist: Playlist;
  songCount: number;
}
```

## データベース操作

```typescript
// src/lib/database/playlists.ts

import Database from '@tauri-apps/plugin-sql';
import { Playlist, PlaylistWithSongs, PlaylistWithCount } from '../../types/playlist';

// プレイリスト一覧取得
export async function getPlaylists(db: Database): Promise<PlaylistWithCount[]> {
  const result = await db.select<any[]>(`
    SELECT
      p.*,
      COUNT(ps.song_id) as song_count
    FROM playlists p
    LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `);

  return result.map((row) => ({
    playlist: {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
    songCount: row.song_count,
  }));
}

// プレイリスト詳細取得
export async function getPlaylistById(
  db: Database,
  playlistId: string
): Promise<PlaylistWithSongs | null> {
  const playlistResult = await db.select<any[]>(
    'SELECT * FROM playlists WHERE id = ?',
    [playlistId]
  );

  if (playlistResult.length === 0) return null;

  const songsResult = await db.select<any[]>(`
    SELECT
      s.id,
      s.title,
      a.name as artist_name,
      ps.order_index
    FROM playlist_songs ps
    JOIN songs s ON ps.song_id = s.id
    LEFT JOIN artists a ON s.artist_id = a.id
    WHERE ps.playlist_id = ?
    ORDER BY ps.order_index
  `, [playlistId]);

  return {
    playlist: {
      id: playlistResult[0].id,
      name: playlistResult[0].name,
      description: playlistResult[0].description,
      createdAt: playlistResult[0].created_at,
      updatedAt: playlistResult[0].updated_at,
    },
    songs: songsResult.map((row) => ({
      id: row.id,
      title: row.title,
      artistName: row.artist_name,
      orderIndex: row.order_index,
    })),
  };
}

// プレイリスト作成
export async function createPlaylist(
  db: Database,
  name: string,
  description?: string
): Promise<string> {
  const id = crypto.randomUUID();
  await db.execute(
    `INSERT INTO playlists (id, name, description) VALUES (?, ?, ?)`,
    [id, name, description || null]
  );
  return id;
}

// プレイリスト更新
export async function updatePlaylist(
  db: Database,
  playlistId: string,
  updates: { name?: string; description?: string }
): Promise<void> {
  const sets: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    sets.push('name = ?');
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    sets.push('description = ?');
    values.push(updates.description);
  }

  if (sets.length === 0) return;

  sets.push("updated_at = datetime('now')");
  values.push(playlistId);

  await db.execute(
    `UPDATE playlists SET ${sets.join(', ')} WHERE id = ?`,
    values
  );
}

// プレイリスト削除
export async function deletePlaylist(
  db: Database,
  playlistId: string
): Promise<void> {
  await db.execute('DELETE FROM playlists WHERE id = ?', [playlistId]);
}

// 曲をプレイリストに追加
export async function addSongToPlaylist(
  db: Database,
  playlistId: string,
  songId: string
): Promise<void> {
  // 現在の最大 order_index を取得
  const result = await db.select<any[]>(
    'SELECT COALESCE(MAX(order_index), -1) as max_index FROM playlist_songs WHERE playlist_id = ?',
    [playlistId]
  );
  const nextIndex = result[0].max_index + 1;

  await db.execute(
    `INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, order_index) VALUES (?, ?, ?)`,
    [playlistId, songId, nextIndex]
  );

  // プレイリストの updated_at を更新
  await db.execute(
    "UPDATE playlists SET updated_at = datetime('now') WHERE id = ?",
    [playlistId]
  );
}

// 曲をプレイリストから削除
export async function removeSongFromPlaylist(
  db: Database,
  playlistId: string,
  songId: string
): Promise<void> {
  await db.execute(
    'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
    [playlistId, songId]
  );

  // order_index を再計算
  await reorderPlaylistSongs(db, playlistId);
}

// 曲の順序を変更
export async function reorderPlaylistSong(
  db: Database,
  playlistId: string,
  songId: string,
  newIndex: number
): Promise<void> {
  // 現在の位置を取得
  const currentResult = await db.select<any[]>(
    'SELECT order_index FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
    [playlistId, songId]
  );

  if (currentResult.length === 0) return;
  const currentIndex = currentResult[0].order_index;

  if (currentIndex === newIndex) return;

  // 他の曲の順序を調整
  if (newIndex < currentIndex) {
    // 上に移動
    await db.execute(
      `UPDATE playlist_songs
       SET order_index = order_index + 1
       WHERE playlist_id = ? AND order_index >= ? AND order_index < ?`,
      [playlistId, newIndex, currentIndex]
    );
  } else {
    // 下に移動
    await db.execute(
      `UPDATE playlist_songs
       SET order_index = order_index - 1
       WHERE playlist_id = ? AND order_index > ? AND order_index <= ?`,
      [playlistId, currentIndex, newIndex]
    );
  }

  // 対象の曲を新しい位置に
  await db.execute(
    'UPDATE playlist_songs SET order_index = ? WHERE playlist_id = ? AND song_id = ?',
    [newIndex, playlistId, songId]
  );
}

// order_index を再計算（連番に整理）
async function reorderPlaylistSongs(db: Database, playlistId: string): Promise<void> {
  const songs = await db.select<any[]>(
    'SELECT song_id FROM playlist_songs WHERE playlist_id = ? ORDER BY order_index',
    [playlistId]
  );

  for (let i = 0; i < songs.length; i++) {
    await db.execute(
      'UPDATE playlist_songs SET order_index = ? WHERE playlist_id = ? AND song_id = ?',
      [i, playlistId, songs[i].song_id]
    );
  }
}
```

## コンポーネント実装

### プレイリスト一覧

```typescript
// src/components/PlaylistList.tsx

interface PlaylistListProps {
  playlists: PlaylistWithCount[];
  selectedPlaylistId: string | null;
  onPlaylistSelect: (id: string) => void;
  onCreatePlaylist: () => void;
}

export function PlaylistList({
  playlists,
  selectedPlaylistId,
  onPlaylistSelect,
  onCreatePlaylist,
}: PlaylistListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {playlists.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            プレイリストがありません
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {playlists.map((item) => (
              <li
                key={item.playlist.id}
                onClick={() => onPlaylistSelect(item.playlist.id)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedPlaylistId === item.playlist.id
                    ? 'bg-purple-600/20 border border-purple-500/50'
                    : 'hover:bg-gray-800'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.playlist.name}</div>
                    <div className="text-sm text-gray-400">
                      {item.songCount} 曲
                    </div>
                  </div>
                  <PlaylistIcon className="w-5 h-5 text-gray-500" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onCreatePlaylist}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          新規プレイリスト
        </button>
      </div>
    </div>
  );
}
```

### プレイリスト詳細

```typescript
// src/components/PlaylistDetail.tsx

import { useDragAndDrop } from '../hooks/useDragAndDrop';

interface PlaylistDetailProps {
  playlist: PlaylistWithSongs;
  onSongSelect: (songId: string) => void;
  onRemoveSong: (songId: string) => void;
  onReorder: (songId: string, newIndex: number) => void;
  onAddSongs: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPlayAll: () => void;
}

export function PlaylistDetail({
  playlist,
  onSongSelect,
  onRemoveSong,
  onReorder,
  onAddSongs,
  onEdit,
  onDelete,
  onPlayAll,
}: PlaylistDetailProps) {
  const { draggedItem, handleDragStart, handleDragOver, handleDrop } = useDragAndDrop({
    onReorder: (songId, newIndex) => onReorder(songId, newIndex),
  });

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{playlist.playlist.name}</h2>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-2 hover:bg-gray-800 rounded">
              <EditIcon className="w-5 h-5" />
            </button>
            <button onClick={onDelete} className="p-2 hover:bg-gray-800 rounded text-red-400">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {playlist.playlist.description && (
          <p className="text-sm text-gray-400 mb-2">{playlist.playlist.description}</p>
        )}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{playlist.songs.length} 曲</span>
          <button
            onClick={onPlayAll}
            className="px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-sm flex items-center gap-2"
          >
            <PlayIcon className="w-4 h-4" />
            連続再生
          </button>
          <button
            onClick={onAddSongs}
            className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm"
          >
            曲を追加
          </button>
        </div>
      </div>

      {/* 曲一覧 */}
      <div className="flex-1 overflow-y-auto">
        {playlist.songs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">このプレイリストには曲がありません</p>
            <button
              onClick={onAddSongs}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            >
              曲を追加
            </button>
          </div>
        ) : (
          <ul>
            {playlist.songs.map((song, index) => (
              <li
                key={song.id}
                draggable
                onDragStart={(e) => handleDragStart(e, song.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e)}
                className={`
                  flex items-center gap-3 px-4 py-3 border-b border-gray-800
                  hover:bg-gray-800/50 cursor-pointer
                  ${draggedItem === song.id ? 'opacity-50' : ''}
                `}
              >
                {/* ドラッグハンドル */}
                <div className="cursor-grab text-gray-500 hover:text-gray-300">
                  <GripIcon className="w-4 h-4" />
                </div>

                {/* 番号 */}
                <span className="w-8 text-gray-500 text-sm">{index + 1}</span>

                {/* 曲情報 */}
                <div className="flex-1" onClick={() => onSongSelect(song.id)}>
                  <div className="font-medium">{song.title}</div>
                  {song.artistName && (
                    <div className="text-sm text-gray-400">{song.artistName}</div>
                  )}
                </div>

                {/* 削除ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSong(song.id);
                  }}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

### 曲追加モーダル

```typescript
// src/components/AddSongsToPlaylistModal.tsx

interface AddSongsToPlaylistModalProps {
  isOpen: boolean;
  playlistId: string;
  allSongs: SongListItem[];
  existingSongIds: string[];
  onClose: () => void;
  onAdd: (songIds: string[]) => void;
}

export function AddSongsToPlaylistModal({
  isOpen,
  playlistId,
  allSongs,
  existingSongIds,
  onClose,
  onAdd,
}: AddSongsToPlaylistModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const availableSongs = allSongs.filter(
    (song) => !existingSongIds.includes(song.id)
  );

  const filteredSongs = availableSongs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artistName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (songId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedIds(newSelected);
  };

  const handleAdd = () => {
    onAdd(Array.from(selectedIds));
    setSelectedIds(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">曲を追加</h3>
        </div>

        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="曲を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredSongs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              追加できる曲がありません
            </div>
          ) : (
            <ul>
              {filteredSongs.map((song) => (
                <li
                  key={song.id}
                  onClick={() => handleToggle(song.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 cursor-pointer
                    ${selectedIds.has(song.id) ? 'bg-purple-600/20' : 'hover:bg-gray-800'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(song.id)}
                    onChange={() => {}}
                    className="form-checkbox"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{song.title}</div>
                    {song.artistName && (
                      <div className="text-sm text-gray-400">{song.artistName}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            キャンセル
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
          >
            {selectedIds.size} 曲を追加
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 連続再生モード

```typescript
// src/hooks/usePlaylistPlayback.ts

interface UsePlaylistPlaybackOptions {
  playlist: PlaylistWithSongs | null;
  onSongChange: (songId: string) => void;
}

export function usePlaylistPlayback({
  playlist,
  onSongChange,
}: UsePlaylistPlaybackOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);

  const currentSong = playlist?.songs[currentIndex] || null;

  const next = useCallback(() => {
    if (!playlist) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < playlist.songs.length) {
      setCurrentIndex(nextIndex);
      onSongChange(playlist.songs[nextIndex].id);
    } else {
      // プレイリスト終了
      setIsPlaylistMode(false);
    }
  }, [playlist, currentIndex, onSongChange]);

  const previous = useCallback(() => {
    if (!playlist) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      onSongChange(playlist.songs[prevIndex].id);
    }
  }, [playlist, currentIndex, onSongChange]);

  const playFromIndex = useCallback((index: number) => {
    if (!playlist || index < 0 || index >= playlist.songs.length) return;
    setCurrentIndex(index);
    setIsPlaylistMode(true);
    onSongChange(playlist.songs[index].id);
  }, [playlist, onSongChange]);

  const playAll = useCallback(() => {
    playFromIndex(0);
  }, [playFromIndex]);

  const stop = useCallback(() => {
    setIsPlaylistMode(false);
  }, []);

  return {
    currentIndex,
    currentSong,
    isPlaylistMode,
    next,
    previous,
    playFromIndex,
    playAll,
    stop,
    hasNext: playlist ? currentIndex < playlist.songs.length - 1 : false,
    hasPrevious: currentIndex > 0,
  };
}
```

## 実装タスク

1. [ ] `src/types/playlist.ts` - プレイリスト型定義
2. [ ] `src/lib/database/playlists.ts` - プレイリスト DB 操作
3. [ ] `src/components/PlaylistList.tsx` - プレイリスト一覧
4. [ ] `src/components/PlaylistDetail.tsx` - プレイリスト詳細
5. [ ] `src/components/AddSongsToPlaylistModal.tsx` - 曲追加モーダル
6. [ ] `src/components/CreatePlaylistModal.tsx` - プレイリスト作成モーダル
7. [ ] `src/hooks/useDragAndDrop.ts` - ドラッグ&ドロップ
8. [ ] `src/hooks/usePlaylistPlayback.ts` - 連続再生
9. [ ] Sidebar にプレイリストタブ追加

## 次のステップ

プレイリスト完了後 → [09_ui_design.md](./09_ui_design.md) で UI デザインを適用
