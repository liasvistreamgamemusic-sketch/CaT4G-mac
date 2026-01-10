import { useState } from 'react';
import type { SongListItem, PlaylistWithCount } from '@/types/database';
import { PlaylistList } from './PlaylistList';

interface SidebarProps {
  songs: SongListItem[];
  selectedSongId: string | null;
  onSongSelect: (id: string) => void;
  onAddClick: () => void;
  onDeleteSong?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onEditSong?: (id: string) => void;
  // Playlist props
  playlists: PlaylistWithCount[];
  selectedPlaylistId: string | null;
  onPlaylistSelect: (id: string) => void;
  onCreatePlaylist: () => void;
}

export function Sidebar({
  songs,
  selectedSongId,
  onSongSelect,
  onAddClick,
  onDeleteSong,
  onToggleFavorite,
  onEditSong,
  playlists,
  selectedPlaylistId,
  onPlaylistSelect,
  onCreatePlaylist,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'songs' | 'favorites' | 'playlists'>('songs');

  // Filter songs
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      !searchQuery ||
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'songs' || (activeTab === 'favorites' && song.isFavorite);

    return matchesSearch && matchesTab;
  });

  return (
    <aside className="w-72 h-full glass border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <img
          src="/icon.png"
          alt="CaT4G"
          className="h-10 w-10 object-contain"
        />
        <img
          src="/logo.png"
          alt="CaT4G - Chords and Tabs for Guitar"
          className="h-10 w-auto"
        />
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="曲を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background-surface rounded-lg border border-border
                       focus:border-accent-primary focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'songs'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('songs')}
        >
          すべて
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('favorites')}
        >
          ★
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'playlists'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('playlists')}
        >
          リスト
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'playlists' ? (
        <PlaylistList
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onPlaylistSelect={onPlaylistSelect}
          onCreatePlaylist={onCreatePlaylist}
        />
      ) : (
        <>
          {/* Song List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSongs.length === 0 ? (
              <div className="text-text-muted text-sm p-6 text-center">
                {songs.length === 0 ? (
                  <>
                    曲がありません
                    <br />
                    <button
                      onClick={onAddClick}
                      className="text-accent-primary hover:underline mt-2 inline-block"
                    >
                      + 曲を追加
                    </button>
                  </>
                ) : (
                  '検索結果がありません'
                )}
              </div>
            ) : (
              <ul className="p-2 space-y-1">
                {filteredSongs.map((song) => (
                  <SongItem
                    key={song.id}
                    song={song}
                    isSelected={song.id === selectedSongId}
                    onSelect={() => onSongSelect(song.id)}
                    onDelete={() => onDeleteSong?.(song.id)}
                    onToggleFavorite={() => onToggleFavorite?.(song.id)}
                    onEdit={() => onEditSong?.(song.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Add Button */}
          <div className="p-3 border-t border-border">
            <button
              onClick={onAddClick}
              className="w-full btn-primary py-2 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              曲を追加
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

// Song item component
interface SongItemProps {
  song: SongListItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  onEdit?: () => void;
}

function SongItem({
  song,
  isSelected,
  onSelect,
  onDelete,
  onToggleFavorite,
  onEdit,
}: SongItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <li
      className={`group relative rounded-lg transition-colors cursor-pointer ${
        isSelected
          ? 'bg-accent-primary/20 border border-accent-primary/30'
          : 'hover:bg-background-surface border border-transparent'
      }`}
    >
      <button
        onClick={onSelect}
        className="w-full text-left p-3"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate flex items-center gap-2">
              {song.isFavorite && (
                <span className="text-yellow-400 text-sm">★</span>
              )}
              {song.title}
            </div>
            {song.artistName && (
              <div className="text-sm text-text-secondary truncate">
                {song.artistName}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Context menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      </button>

      {/* Context menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-background-surface border border-white/10 rounded-lg shadow-lg py-1 min-w-32">
            <button
              onClick={() => {
                onToggleFavorite?.();
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-white/10 flex items-center gap-2"
            >
              {song.isFavorite ? (
                <>
                  <span className="text-yellow-400">★</span> お気に入り解除
                </>
              ) : (
                <>
                  <span className="text-text-muted">☆</span> お気に入り
                </>
              )}
            </button>
            <button
              onClick={() => {
                onEdit?.();
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-white/10 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              編集
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                // Directly call delete - confirm dialog may not work in Tauri
                onDelete?.();
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-white/10 text-red-400 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              削除
            </button>
          </div>
        </>
      )}
    </li>
  );
}
