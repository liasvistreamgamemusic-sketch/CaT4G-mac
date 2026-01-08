import { forwardRef } from 'react';
import { ChordSheet } from './ChordSheet';
import type { SongWithDetails } from '@/types/database';

export type ChordDisplayMode = 'text' | 'diagram';

interface MainAreaProps {
  song: SongWithDetails | null;
  transpose?: number;
  onChordClick?: (chord: string) => void;
  onAddClick?: () => void;
  chordDisplayMode?: ChordDisplayMode;
}

export const MainArea = forwardRef<HTMLElement, MainAreaProps>(
  function MainArea({ song, transpose = 0, onChordClick, onAddClick, chordDisplayMode = 'text' }, ref) {
    // Empty state
    if (!song) {
      return (
        <main ref={ref} className="flex-1 overflow-y-auto p-6">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-background-surface flex items-center justify-center">
              <svg
                className="w-12 h-12 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">曲を選択してください</h2>
            <p className="text-text-secondary max-w-md">
              サイドバーから曲を選択するか、新しい曲を追加してください。
              <br />
              U-Fret、ChordWiki、J-Total の URL からインポートできます。
            </p>
            <button className="btn-primary mt-6" onClick={onAddClick}>
              + 曲を追加
            </button>
          </div>
        </main>
      );
    }

    // Chord sheet display
    return (
      <main ref={ref} className="flex-1 overflow-y-auto p-6">
        <ChordSheet
          song={song}
          transpose={transpose}
          onChordClick={onChordClick}
          chordDisplayMode={chordDisplayMode}
        />
      </main>
    );
  }
);

export default MainArea;
