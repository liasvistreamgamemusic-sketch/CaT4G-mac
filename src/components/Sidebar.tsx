import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Star,
  ListMusic,
  Search,
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
} from 'lucide-react';
import type { SongListItem, PlaylistWithCount } from '@/types/database';
import { PlaylistList } from './PlaylistList';

const COLLAPSED_STORAGE_KEY = 'cat4g-sidebar-collapsed';

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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
    return stored === 'true';
  });
  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

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

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`
        relative h-full glass-premium highlight-line flex flex-col
        border-r border-[var(--glass-premium-border)]
        rounded-r-[24px]
        transition-all duration-[350ms] cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isCollapsed ? 'w-16' : 'w-72'}
      `}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={handleToggleCollapse}
        className="
          absolute -right-3 top-1/2 -translate-y-1/2 z-10
          w-6 h-12 rounded-full
          bg-[var(--glass-premium-bg-solid)]
          border border-[var(--glass-premium-border)]
          shadow-premium
          flex items-center justify-center
          hover:bg-[var(--btn-glass-hover)]
          transition-all duration-200
        "
        title={isCollapsed ? '展開' : '折りたたむ'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-text-secondary" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-text-secondary" />
        )}
      </button>

      {/* Header */}
      <div className={`p-4 border-b border-[var(--glass-premium-border)] flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <img
          src="/icon.png"
          alt="CaT4G"
          className="h-10 w-10 object-contain flex-shrink-0"
        />
        {!isCollapsed && (
          <img
            src="/logo.png"
            alt="CaT4G - Chords and Tabs for Guitar"
            className="h-10 w-auto transition-opacity duration-300"
          />
        )}
      </div>

      {/* Search - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="p-3 transition-all duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="曲を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-glass w-full pl-9 pr-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={`flex border-b border-[var(--glass-premium-border)] ${isCollapsed ? 'flex-col' : ''}`}>
        <button
          className={`
            ${isCollapsed ? 'py-3 px-0' : 'flex-1 py-2'}
            text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${activeTab === 'songs'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
          onClick={() => setActiveTab('songs')}
          title="すべて"
        >
          <Music className="w-4 h-4" />
          {!isCollapsed && <span>すべて</span>}
        </button>
        <button
          className={`
            ${isCollapsed ? 'py-3 px-0' : 'flex-1 py-2'}
            text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${activeTab === 'favorites'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
          onClick={() => setActiveTab('favorites')}
          title="お気に入り"
        >
          <Star className="w-4 h-4" />
          {!isCollapsed && <span>★</span>}
        </button>
        <button
          className={`
            ${isCollapsed ? 'py-3 px-0' : 'flex-1 py-2'}
            text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${activeTab === 'playlists'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
          onClick={() => setActiveTab('playlists')}
          title="リスト"
        >
          <ListMusic className="w-4 h-4" />
          {!isCollapsed && <span>リスト</span>}
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'playlists' ? (
        isCollapsed ? (
          <div className="flex-1 flex flex-col items-center py-2 overflow-y-auto">
            {playlists.slice(0, 5).map((item, index) => (
              <button
                key={item.playlist.id}
                onClick={() => onPlaylistSelect(item.playlist.id)}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center my-1
                  transition-colors text-sm font-medium
                  ${item.playlist.id === selectedPlaylistId
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'hover:bg-[var(--btn-glass-hover)] text-text-secondary'
                  }
                `}
                title={item.playlist.name}
              >
                {index + 1}
              </button>
            ))}
          </div>
        ) : (
          <PlaylistList
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            onPlaylistSelect={onPlaylistSelect}
            onCreatePlaylist={onCreatePlaylist}
          />
        )
      ) : (
        <>
          {/* Song List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSongs.length === 0 ? (
              <div className="text-text-muted text-sm p-6 text-center">
                {songs.length === 0 ? (
                  isCollapsed ? (
                    <button
                      onClick={onAddClick}
                      className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto hover:bg-[var(--btn-glass-hover)] text-accent-primary"
                      title="曲を追加"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  ) : (
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
                  )
                ) : (
                  !isCollapsed && '検索結果がありません'
                )}
              </div>
            ) : isCollapsed ? (
              <ul className="p-2 space-y-1">
                {filteredSongs.map((song) => (
                  <li key={song.id}>
                    <button
                      onClick={() => onSongSelect(song.id)}
                      className={`
                        w-full h-10 rounded-lg flex items-center justify-center
                        transition-colors text-sm font-medium
                        ${song.id === selectedSongId
                          ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                          : 'hover:bg-[var(--btn-glass-hover)] text-text-secondary'
                        }
                      `}
                      title={`${song.title}${song.artistName ? ` - ${song.artistName}` : ''}`}
                    >
                      {song.isFavorite ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <span>{song.title.charAt(0).toUpperCase()}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
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
          <div className="p-3 border-t border-[var(--glass-premium-border)]">
            {isCollapsed ? (
              <button
                onClick={onAddClick}
                className="w-full h-10 btn-glass-primary rounded-lg flex items-center justify-center"
                title="曲を追加"
              >
                <Plus className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onAddClick}
                className="w-full btn-glass-primary py-2 flex items-center justify-center gap-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                曲を追加
              </button>
            )}
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
          : 'hover:bg-[var(--btn-glass-hover)] border border-transparent'
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
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
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
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Context menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 glass-premium-elevated rounded-lg shadow-premium-elevated py-1 min-w-32">
            <button
              onClick={() => {
                onToggleFavorite?.();
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-[var(--btn-glass-hover)] flex items-center gap-2"
            >
              {song.isFavorite ? (
                <>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> お気に入り解除
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 text-text-muted" /> お気に入り
                </>
              )}
            </button>
            <button
              onClick={() => {
                onEdit?.();
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-[var(--btn-glass-hover)] flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              編集
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onDelete?.();
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-[var(--btn-glass-hover)] text-red-400 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              削除
            </button>
          </div>
        </>
      )}
    </li>
  );
}
