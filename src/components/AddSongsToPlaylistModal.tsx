import { useState, useMemo } from 'react';
import { SongListItem } from '@/types/database';

interface AddSongsToPlaylistModalProps {
  isOpen: boolean;
  allSongs: SongListItem[];
  existingSongIds: string[];
  onClose: () => void;
  onAdd: (songIds: string[]) => void;
}

export function AddSongsToPlaylistModal({
  isOpen,
  allSongs,
  existingSongIds,
  onClose,
  onAdd,
}: AddSongsToPlaylistModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const availableSongs = useMemo(() => {
    const existingSet = new Set(existingSongIds);
    return allSongs.filter((song) => !existingSet.has(song.id));
  }, [allSongs, existingSongIds]);

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableSongs;
    }
    const query = searchQuery.toLowerCase();
    return availableSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        (song.artistName && song.artistName.toLowerCase().includes(query))
    );
  }, [availableSongs, searchQuery]);

  const toggleSelection = (songId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  };

  const handleAdd = () => {
    onAdd(Array.from(selectedIds));
    setSelectedIds(new Set());
    setSearchQuery('');
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleClose}
    >
      <div
        className="bg-bg-surface border border-border-primary rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-text-primary">曲を追加</h2>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border-primary">
          <input
            type="text"
            placeholder="曲名またはアーティスト名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-primary"
          />
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredSongs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-text-secondary">
              追加できる曲がありません
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredSongs.map((song) => {
                const isSelected = selectedIds.has(song.id);
                return (
                  <li
                    key={song.id}
                    onClick={() => toggleSelection(song.id)}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-accent-primary/20'
                        : 'hover:bg-bg-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(song.id)}
                      className="w-4 h-4 accent-accent-primary cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary truncate">
                        {song.title}
                      </div>
                      {song.artistName && (
                        <div className="text-sm text-text-secondary truncate">
                          {song.artistName}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-primary flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {selectedIds.size}曲を追加
          </button>
        </div>
      </div>
    </div>
  );
}
