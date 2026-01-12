import { ChevronDown, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PlaylistWithCount } from '@/types/database';

interface PlaylistSongItem {
  id: string;
  title: string;
  artistName: string | null;
}

interface PlaylistListProps {
  playlists: PlaylistWithCount[];
  expandedPlaylistId: string | null;
  expandedPlaylistSongs: PlaylistSongItem[];
  onPlaylistExpand: (id: string) => void;
  onSongSelect: (songId: string) => void;
  onRemoveSongFromPlaylist: (playlistId: string, songId: string) => void;
  onCreatePlaylist: () => void;
  isCollapsed?: boolean;
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlaylistList({
  playlists,
  expandedPlaylistId,
  expandedPlaylistSongs,
  onPlaylistExpand,
  onSongSelect,
  onRemoveSongFromPlaylist,
  onCreatePlaylist,
  isCollapsed = false,
}: PlaylistListProps) {
  const [menuOpenSongId, setMenuOpenSongId] = useState<string | null>(null);

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {playlists.length === 0 ? (
          <div className="p-4 text-center text-text-muted">
            プレイリストがありません
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {playlists.map((item) => {
              const isExpanded = expandedPlaylistId === item.playlist.id;
              return (
                <li key={item.playlist.id}>
                  {/* Playlist header */}
                  <button
                    onClick={() => onPlaylistExpand(item.playlist.id)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    )}
                    <span className="flex-1 text-left truncate">{item.playlist.name}</span>
                    <span className="text-xs text-text-muted">{item.songCount}曲</span>
                  </button>

                  {/* Expanded songs list */}
                  {isExpanded && (
                    <ul className="ml-6 mt-1 space-y-0.5">
                      {expandedPlaylistSongs.length > 0 ? (
                        expandedPlaylistSongs.map((song) => (
                          <li key={song.id} className="relative group">
                            <button
                              onClick={() => onSongSelect(song.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-[var(--btn-glass-hover)] hover:text-text-primary transition-colors"
                            >
                              <span className="flex-1 text-left truncate">{song.title}</span>
                            </button>

                            {/* 3-dot menu */}
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpenSongId(menuOpenSongId === song.id ? null : song.id);
                                }}
                                className="p-1 rounded-lg hover:bg-[var(--btn-glass-hover)]"
                              >
                                <MoreVertical className="w-4 h-4 text-text-muted" />
                              </button>

                              {menuOpenSongId === song.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMenuOpenSongId(null);
                                    }}
                                  />
                                  <div className="absolute right-0 top-full mt-1 glass-premium rounded-xl p-1 shadow-lg z-50 min-w-[140px]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveSongFromPlaylist(item.playlist.id, song.id);
                                        setMenuOpenSongId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      削除
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-text-muted">
                          曲がありません
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="p-2 border-t border-background-surface">
        <button
          onClick={onCreatePlaylist}
          className="w-full py-2 px-4 bg-accent-primary hover:bg-accent-primary/80 rounded-lg transition-colors flex items-center justify-center gap-2 text-text-primary"
        >
          <PlusIcon />
          <span>新規プレイリスト</span>
        </button>
      </div>
    </div>
  );
}
