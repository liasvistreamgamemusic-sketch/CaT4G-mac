import { PlaylistWithCount } from '@/types/database';

interface PlaylistListProps {
  playlists: PlaylistWithCount[];
  selectedPlaylistId: string | null;
  onPlaylistSelect: (id: string) => void;
  onCreatePlaylist: () => void;
}

function PlaylistIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15V6" />
      <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 12H3" />
      <path d="M16 6H3" />
      <path d="M12 18H3" />
    </svg>
  );
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
  selectedPlaylistId,
  onPlaylistSelect,
  onCreatePlaylist,
}: PlaylistListProps) {
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
              const isSelected = item.playlist.id === selectedPlaylistId;
              return (
                <li key={item.playlist.id}>
                  <button
                    onClick={() => onPlaylistSelect(item.playlist.id)}
                    className={`
                      w-full p-3 rounded-lg cursor-pointer transition-colors
                      flex items-center gap-3 text-left
                      ${
                        isSelected
                          ? 'bg-accent-primary/20 border border-accent-primary/50'
                          : 'border border-transparent hover:bg-background-surface'
                      }
                    `}
                  >
                    <PlaylistIcon
                      className={
                        isSelected ? 'text-accent-primary' : 'text-text-muted'
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`truncate ${isSelected ? 'text-text-primary' : 'text-text-primary'}`}
                      >
                        {item.playlist.name}
                      </div>
                      <div className="text-sm text-text-muted">
                        {item.songCount}曲
                      </div>
                    </div>
                  </button>
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
