import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
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
import type { SongListItem, PlaylistWithCount, Artist } from '@/types/database';
import { PlaylistList } from './PlaylistList';

const COLLAPSED_STORAGE_KEY = 'cat4g-sidebar-collapsed';

interface PlaylistSongItem {
  id: string;
  title: string;
  artistName: string | null;
}

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
  onAddSongToPlaylist?: (songId: string, playlistId: string) => void;
  // New expandable playlist props - make optional
  expandedPlaylistId?: string | null;
  expandedPlaylistSongs?: PlaylistSongItem[];
  onPlaylistExpand?: (id: string) => void;
  onRemoveSongFromPlaylist?: (playlistId: string, songId: string) => void;
  // Artist props - make optional
  artists?: Artist[];
  expandedArtistId?: string | null;
  artistSongs?: SongListItem[];
  onArtistExpand?: (id: string) => void;
  // Width change callback for responsive positioning
  onWidthChange?: (width: number) => void;
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
  onAddSongToPlaylist,
  expandedPlaylistId = null,
  expandedPlaylistSongs = [],
  onPlaylistExpand = () => {},
  onRemoveSongFromPlaylist = () => {},
  artists = [],
  expandedArtistId = null,
  artistSongs = [],
  onArtistExpand = () => {},
  onWidthChange,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'songs' | 'favorites' | 'playlists' | 'artists'>('songs');
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
    return stored === 'true';
  });

  // Sidebar ref for width observation
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  // Observe sidebar width changes and notify parent
  useEffect(() => {
    if (!sidebarRef.current || !onWidthChange) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onWidthChange(entry.contentRect.width);
      }
    });

    observer.observe(sidebarRef.current);

    // Notify initial width
    onWidthChange(sidebarRef.current.offsetWidth);

    return () => observer.disconnect();
  }, [onWidthChange]);

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
      ref={sidebarRef}
      className={`
        relative h-full glass-premium highlight-line flex flex-col
        border-r border-[var(--glass-premium-border)]
        rounded-r-[24px]
        transition-all duration-[350ms] cubic-bezier(0.34, 1.56, 0.64, 1)
        overflow-visible z-10
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
          absolute -right-3 top-1/2 -translate-y-1/2 z-20
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
        <button
          className={`
            ${isCollapsed ? 'py-3 px-0' : 'flex-1 py-2'}
            text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${activeTab === 'artists'
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
          onClick={() => setActiveTab('artists')}
          title="アーティスト"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {!isCollapsed && <span>人</span>}
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
            expandedPlaylistId={expandedPlaylistId}
            expandedPlaylistSongs={expandedPlaylistSongs}
            onPlaylistExpand={onPlaylistExpand}
            onSongSelect={onSongSelect}
            onRemoveSongFromPlaylist={onRemoveSongFromPlaylist}
            onCreatePlaylist={onCreatePlaylist}
          />
        )
      ) : activeTab === 'artists' ? (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <ul className="space-y-0.5">
            {artists.map((artist) => {
              const isExpanded = expandedArtistId === artist.id;
              return (
                <li key={artist.id}>
                  <button
                    onClick={() => onArtistExpand(artist.id)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    )}
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="flex-1 text-left truncate">{artist.name}</span>
                  </button>
                  {isExpanded && (
                    <ul className="ml-6 mt-1 space-y-0.5">
                      {artistSongs.map((song) => (
                        <li key={song.id}>
                          <button
                            onClick={() => onSongSelect(song.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedSongId === song.id
                                ? 'bg-accent-primary/20 text-accent-primary'
                                : 'text-text-secondary hover:bg-[var(--btn-glass-hover)] hover:text-text-primary'
                            }`}
                          >
                            <Music className="w-3 h-3" />
                            <span className="truncate">{song.title}</span>
                          </button>
                        </li>
                      ))}
                      {artistSongs.length === 0 && (
                        <li className="px-3 py-2 text-sm text-text-muted">曲がありません</li>
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
            {artists.length === 0 && (
              <li className="px-3 py-4 text-sm text-center text-text-muted">アーティストがいません</li>
            )}
          </ul>
        </div>
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
                    playlists={playlists}
                    onAddToPlaylist={onAddSongToPlaylist}
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
  playlists?: PlaylistWithCount[];
  onAddToPlaylist?: (songId: string, playlistId: string) => void;
}

function SongItem({
  song,
  isSelected,
  onSelect,
  onDelete,
  onToggleFavorite,
  onEdit,
  playlists,
  onAddToPlaylist,
}: SongItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Playlist submenu state
  const [playlistSubmenuOpen, setPlaylistSubmenuOpen] = useState(false);
  const [playlistSubmenuPosition, setPlaylistSubmenuPosition] = useState({ x: 0, y: 0 });
  const playlistButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        x: rect.right,
        y: rect.bottom + 4,
      });
    }
    setShowMenu(!showMenu);
  };

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
        ref={menuButtonRef}
        onClick={handleMenuClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Context menu - rendered via Portal */}
      {showMenu && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => {
              setShowMenu(false);
              setPlaylistSubmenuOpen(false);
            }}
          />
          <div
            className="fixed z-[9999] glass-premium-elevated rounded-lg shadow-premium-elevated py-1 min-w-[180px]"
            style={{
              left: menuPosition.x,
              top: menuPosition.y,
              transform: 'translateX(-100%)',
            }}
          >
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
            {/* プレイリストに追加 */}
            <button
              ref={playlistButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                if (playlistButtonRef.current) {
                  const rect = playlistButtonRef.current.getBoundingClientRect();
                  setPlaylistSubmenuPosition({
                    x: rect.right + 4,
                    y: rect.top,
                  });
                }
                setPlaylistSubmenuOpen(!playlistSubmenuOpen);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-[var(--btn-glass-hover)] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              プレイリストに追加
              <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
        </>,
        document.body
      )}

      {/* Playlist submenu - rendered via Portal */}
      {playlistSubmenuOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[10000]"
            onClick={() => {
              setPlaylistSubmenuOpen(false);
            }}
          />
          <div
            className="fixed z-[10001] min-w-[160px] glass-premium-elevated rounded-lg p-1 shadow-premium-elevated"
            style={{
              left: playlistSubmenuPosition.x,
              top: playlistSubmenuPosition.y,
            }}
          >
            {playlists && playlists.length > 0 ? (
              playlists.map((p) => (
                <button
                  key={p.playlist.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPlaylist?.(song.id, p.playlist.id);
                    setPlaylistSubmenuOpen(false);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-[var(--btn-glass-hover)] rounded-lg text-text-primary"
                >
                  {p.playlist.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-text-muted">
                プレイリストがありません
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </li>
  );
}
