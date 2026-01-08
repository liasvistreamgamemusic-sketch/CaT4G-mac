import type { PlaylistWithSongs } from '@/types/database';

interface PlaylistDetailProps {
  playlist: PlaylistWithSongs;
  currentPlayingSongId?: string | null;
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
  currentPlayingSongId,
  onSongSelect,
  onRemoveSong,
  onReorder,
  onAddSongs,
  onEdit,
  onDelete,
  onPlayAll,
}: PlaylistDetailProps) {
  const { playlist: playlistData, songs } = playlist;

  const handleDragStart = (e: React.DragEvent<HTMLElement>, songId: string) => {
    e.dataTransfer.setData('text/plain', songId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, targetIndex: number) => {
    e.preventDefault();
    const songId = e.dataTransfer.getData('text/plain');
    if (songId) {
      onReorder(songId, targetIndex);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-text-primary">{playlistData.name}</h2>
          <div className="flex items-center gap-2">
            {/* Edit button */}
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-background-surface text-text-muted hover:text-text-primary transition-colors"
              title="編集"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            {/* Delete button */}
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-background-surface text-text-muted hover:text-red-400 transition-colors"
              title="削除"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {playlistData.description && (
          <p className="text-text-secondary text-sm mt-2">{playlistData.description}</p>
        )}

        {/* Song count and action buttons */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-text-muted text-sm">{songs.length} 曲</span>
          <div className="flex-1" />
          <button
            onClick={onPlayAll}
            disabled={songs.length === 0}
            className="btn-primary px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            連続再生
          </button>
          <button
            onClick={onAddSongs}
            className="btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            曲を追加
          </button>
        </div>
      </div>

      {/* Song list */}
      <div className="flex-1 overflow-y-auto">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-sm">プレイリストに曲がありません</p>
            <button
              onClick={onAddSongs}
              className="text-accent-primary hover:underline mt-2 text-sm"
            >
              曲を追加する
            </button>
          </div>
        ) : (
          <ul>
            {songs.map((song, index) => (
              <li
                key={song.id}
                draggable
                onDragStart={(e) => handleDragStart(e, song.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-background-surface transition-colors ${
                  currentPlayingSongId === song.id ? 'bg-accent-primary/10' : ''
                }`}
              >
                {/* Drag handle */}
                <div className="cursor-grab text-text-muted hover:text-text-secondary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="9" cy="6" r="1.5" />
                    <circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" />
                    <circle cx="15" cy="18" r="1.5" />
                  </svg>
                </div>

                {/* Index number */}
                <span className="w-6 text-center text-text-muted text-sm">{index + 1}</span>

                {/* Song info */}
                <button
                  onClick={() => onSongSelect(song.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2">
                    {currentPlayingSongId === song.id && (
                      <svg className="w-4 h-4 text-accent-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                    <span
                      className={`font-medium truncate ${
                        currentPlayingSongId === song.id ? 'text-accent-primary' : 'text-text-primary'
                      }`}
                    >
                      {song.title}
                    </span>
                  </div>
                  {song.artistName && (
                    <div className="text-sm text-text-secondary truncate">{song.artistName}</div>
                  )}
                </button>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveSong(song.id)}
                  className="p-1 hover:bg-background-surface rounded text-text-muted hover:text-red-400 transition-colors"
                  title="プレイリストから削除"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
