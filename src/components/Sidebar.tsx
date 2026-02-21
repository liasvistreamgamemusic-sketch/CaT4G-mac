import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Music,
  ListMusic,
  Search,
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  Settings,
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
  /** スケール係数（0.6〜1.0、デフォルト1.0） */
  scale?: number;
  // Settings callback
  onOpenChordSettings?: () => void;
}

export function Sidebar({
  songs,
  selectedSongId,
  onSongSelect,
  onAddClick,
  onDeleteSong,
  onEditSong,
  playlists,
  selectedPlaylistId: _selectedPlaylistId,
  onPlaylistSelect: _onPlaylistSelect,
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
  scale = 1.0,
  onOpenChordSettings,
}: SidebarProps) {
  const navigate = useNavigate();

  // スケーリング値の計算
  const iconSizeLg = Math.round(20 * scale);
  const iconSizeMd = Math.round(16 * scale);
  const iconSizeSm = Math.round(12 * scale);
  const fontSize = {
    sm: 14 * scale,
    xs: 12 * scale,
  };
  const spacing = {
    xs: 4 * scale,
    sm: 8 * scale,
    md: 12 * scale,
    lg: 16 * scale,
  };
  const logoSize = Math.round(40 * scale);
  const buttonSize = Math.round(40 * scale);
  // サイドバーの横幅（スケーリング対応）
  const sidebarWidth = {
    expanded: Math.round(288 * scale), // 18rem = 288px
    collapsed: Math.round(64 * scale), // 4rem = 64px
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'songs' | 'playlists' | 'artists'>('songs');
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

    return matchesSearch;
  });

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      ref={sidebarRef}
      className="
        relative h-full glass-premium highlight-line flex flex-col
        border-r border-[var(--glass-premium-border)]
        rounded-r-[24px]
        overflow-visible z-10
      "
      style={{
        transition: 'width 350ms cubic-bezier(0.33, 1, 0.68, 1)',
        width: `${isCollapsed ? sidebarWidth.collapsed : sidebarWidth.expanded}px`,
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

      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div
          className={`border-b border-[var(--glass-premium-border)] flex items-center ${isCollapsed ? 'justify-center' : ''} cursor-pointer`}
          style={{ padding: `${spacing.lg}px`, gap: isCollapsed ? 0 : `${spacing.md}px` }}
          onClick={() => navigate('/home')}
        >
          <img
            src="/cat4g-icon-rounded.png"
            alt="CaT4G"
            className="object-contain flex-shrink-0 hover:opacity-80 transition-opacity"
            style={{ height: `${logoSize}px`, width: `${logoSize}px` }}
          />
        </div>

        {/* Expanded content */}
        {!isCollapsed && (
          <div className="flex flex-col flex-1 min-h-0" style={{ animation: 'fadeIn 200ms ease-out 100ms both' }}>
            {/* Search */}
            <div className="transition-all duration-300" style={{ padding: `${spacing.md}px` }}>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }}
                />
                <input
                  type="text"
                  placeholder="曲を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass w-full"
                  style={{
                    paddingLeft: `${36 * scale}px`,
                    paddingRight: `${spacing.md}px`,
                    paddingTop: `${spacing.sm}px`,
                    paddingBottom: `${spacing.sm}px`,
                    fontSize: `${fontSize.sm}px`,
                  }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--glass-premium-border)]">
              <button
                className={`
                  flex-1 font-medium transition-colors flex items-center justify-center
                  ${activeTab === 'songs'
                    ? 'text-accent-primary border-b-2 border-accent-primary'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
                style={{
                  padding: `${spacing.sm}px`,
                  fontSize: `${fontSize.sm}px`,
                  gap: `${spacing.sm}px`,
                }}
                onClick={() => setActiveTab('songs')}
                title="すべて"
              >
                <Music style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} />
                <span>すべて</span>
              </button>
              <button
                className={`
                  flex-1 font-medium transition-colors flex items-center justify-center
                  ${activeTab === 'playlists'
                    ? 'text-accent-primary border-b-2 border-accent-primary'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
                style={{
                  padding: `${spacing.sm}px`,
                  fontSize: `${fontSize.sm}px`,
                  gap: `${spacing.sm}px`,
                }}
                onClick={() => setActiveTab('playlists')}
                title="リスト"
              >
                <ListMusic style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} />
                <span>リスト</span>
              </button>
              <button
                className={`
                  flex-1 font-medium transition-colors flex items-center justify-center
                  ${activeTab === 'artists'
                    ? 'text-accent-primary border-b-2 border-accent-primary'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
                style={{
                  padding: `${spacing.sm}px`,
                  fontSize: `${fontSize.sm}px`,
                  gap: `${spacing.sm}px`,
                }}
                onClick={() => setActiveTab('artists')}
                title="アーティスト"
              >
                <svg style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>人</span>
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'playlists' ? (
              <PlaylistList
                playlists={playlists}
                expandedPlaylistId={expandedPlaylistId}
                expandedPlaylistSongs={expandedPlaylistSongs}
                onPlaylistExpand={onPlaylistExpand}
                onSongSelect={onSongSelect}
                onRemoveSongFromPlaylist={onRemoveSongFromPlaylist}
                onCreatePlaylist={onCreatePlaylist}
                scale={scale}
              />
            ) : activeTab === 'artists' ? (
              <div className="flex-1 overflow-y-auto space-y-1" style={{ padding: `${spacing.sm}px` }}>
                <ul style={{ gap: `${spacing.xs}px` }} className="flex flex-col">
                  {artists.map((artist) => {
                    const isExpanded = expandedArtistId === artist.id;
                    return (
                      <li key={artist.id}>
                        <button
                          onClick={() => onArtistExpand(artist.id)}
                          className="w-full flex items-center rounded-xl text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
                          style={{
                            gap: `${spacing.sm}px`,
                            padding: `${spacing.sm}px ${spacing.md}px`,
                            fontSize: `${fontSize.sm}px`,
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} className="text-text-muted" />
                          ) : (
                            <ChevronRight style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} className="text-text-muted" />
                          )}
                          <svg style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} className="text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="flex-1 text-left truncate">{artist.name}</span>
                        </button>
                        {isExpanded && (
                          <ul style={{ marginLeft: `${24 * scale}px`, marginTop: `${spacing.xs}px`, gap: `${spacing.xs / 2}px` }} className="flex flex-col">
                            {artistSongs.map((song) => (
                              <li key={song.id}>
                                <button
                                  onClick={() => onSongSelect(song.id)}
                                  className={`w-full flex items-center rounded-lg transition-colors ${
                                    selectedSongId === song.id
                                      ? 'bg-accent-primary/20 text-accent-primary'
                                      : 'text-text-secondary hover:bg-[var(--btn-glass-hover)] hover:text-text-primary'
                                  }`}
                                  style={{
                                    gap: `${spacing.sm}px`,
                                    padding: `${spacing.sm}px ${spacing.md}px`,
                                    fontSize: `${fontSize.xs}px`,
                                  }}
                                >
                                  <Music style={{ width: `${iconSizeSm}px`, height: `${iconSizeSm}px` }} />
                                  <span className="truncate">{song.title}</span>
                                </button>
                              </li>
                            ))}
                            {artistSongs.length === 0 && (
                              <li
                                className="text-text-muted"
                                style={{ padding: `${spacing.sm}px ${spacing.md}px`, fontSize: `${fontSize.xs}px` }}
                              >
                                曲がありません
                              </li>
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                  {artists.length === 0 && (
                    <li
                      className="text-center text-text-muted"
                      style={{ padding: `${spacing.md}px`, fontSize: `${fontSize.xs}px` }}
                    >
                      アーティストがいません
                    </li>
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
                          onEdit={() => onEditSong?.(song.id)}
                          playlists={playlists}
                          onAddToPlaylist={onAddSongToPlaylist}
                          scale={scale}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {/* Add Button */}
            <div
              className="border-t border-[var(--glass-premium-border)]"
              style={{ padding: `${spacing.md}px` }}
            >
              <button
                onClick={onAddClick}
                className="w-full btn-glass-primary flex items-center justify-center rounded-lg"
                style={{ padding: `${spacing.sm}px`, gap: `${spacing.sm}px` }}
              >
                <Plus style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} />
                曲を追加
              </button>
            </div>

            {/* Settings Button */}
            {onOpenChordSettings && (
              <div
                className="border-t border-[var(--glass-premium-border)]"
                style={{ padding: `${spacing.md}px` }}
              >
                <button
                  onClick={onOpenChordSettings}
                  className="w-full btn-glass flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary"
                  style={{ padding: `${spacing.sm}px`, gap: `${spacing.sm}px` }}
                >
                  <Settings style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} />
                  コード設定
                </button>
              </div>
            )}
          </div>
        )}

        {/* Collapsed content */}
        {isCollapsed && (
          <div className="flex flex-col flex-1" style={{ animation: 'fadeIn 150ms ease-out 150ms both' }}>
            <div className="flex-1" />

            {/* Add Button (icon only) */}
            <div
              className="border-t border-[var(--glass-premium-border)]"
              style={{ padding: `${spacing.md}px` }}
            >
              <button
                onClick={onAddClick}
                className="w-full btn-glass-primary rounded-lg flex items-center justify-center"
                style={{ height: `${buttonSize}px` }}
                title="曲を追加"
              >
                <Plus style={{ width: `${iconSizeLg}px`, height: `${iconSizeLg}px` }} />
              </button>
            </div>

            {/* Settings Button (icon only) */}
            {onOpenChordSettings && (
              <div
                className="border-t border-[var(--glass-premium-border)]"
                style={{ padding: `${spacing.md}px` }}
              >
                <button
                  onClick={onOpenChordSettings}
                  className="w-full btn-glass rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary"
                  style={{ height: `${buttonSize}px` }}
                  title="コードデフォルト設定"
                >
                  <Settings style={{ width: `${iconSizeLg}px`, height: `${iconSizeLg}px` }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

// Song item component
interface SongItemProps {
  song: SongListItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  playlists?: PlaylistWithCount[];
  onAddToPlaylist?: (songId: string, playlistId: string) => void;
  scale?: number;
}

function SongItem({
  song,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  playlists,
  onAddToPlaylist,
  scale = 1.0,
}: SongItemProps) {
  // スケーリング値
  const iconSizeMd = Math.round(16 * scale);
  const fontSize = {
    sm: 14 * scale,
    xs: 12 * scale,
  };
  const spacing = {
    sm: 8 * scale,
    md: 12 * scale,
  };

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
        className="w-full text-left"
        style={{ padding: `${spacing.md}px` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div
              className="font-medium truncate flex items-center"
              style={{ fontSize: `${fontSize.sm}px`, gap: `${spacing.sm}px` }}
            >
              {song.title}
            </div>
            {song.artistName && (
              <div
                className="text-text-secondary truncate"
                style={{ fontSize: `${fontSize.xs}px`, marginTop: `${spacing.sm / 2}px` }}
              >
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
        className="absolute top-1/2 -translate-y-1/2 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity"
        style={{ right: `${spacing.sm}px`, padding: `${spacing.sm / 2}px` }}
      >
        <MoreVertical style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} />
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
