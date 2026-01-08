import { useState, useCallback, useMemo } from 'react';
import { PlaylistWithSongs } from '@/types/database';

export interface UsePlaylistPlaybackOptions {
  playlist: PlaylistWithSongs | null;
  onSongChange: (songId: string) => void;
}

export interface UsePlaylistPlaybackReturn {
  currentIndex: number;
  currentSong: { id: string; title: string; artistName: string | null } | null;
  isPlaylistMode: boolean;
  next: () => void;
  previous: () => void;
  playFromIndex: (index: number) => void;
  playAll: () => void;
  stop: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function usePlaylistPlayback({
  playlist,
  onSongChange,
}: UsePlaylistPlaybackOptions): UsePlaylistPlaybackReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);

  const songs = playlist?.songs ?? [];

  const currentSong = useMemo(() => {
    if (!isPlaylistMode || songs.length === 0 || currentIndex >= songs.length) {
      return null;
    }
    const song = songs[currentIndex];
    return {
      id: song.id,
      title: song.title,
      artistName: song.artistName,
    };
  }, [isPlaylistMode, songs, currentIndex]);

  const hasNext = useMemo(() => {
    return isPlaylistMode && currentIndex < songs.length - 1;
  }, [isPlaylistMode, currentIndex, songs.length]);

  const hasPrevious = useMemo(() => {
    return isPlaylistMode && currentIndex > 0;
  }, [isPlaylistMode, currentIndex]);

  const next = useCallback(() => {
    if (!isPlaylistMode || songs.length === 0) return;

    if (currentIndex < songs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      onSongChange(songs[nextIndex].id);
    } else {
      // At end of playlist, stop playback
      setIsPlaylistMode(false);
    }
  }, [isPlaylistMode, currentIndex, songs, onSongChange]);

  const previous = useCallback(() => {
    if (!isPlaylistMode || songs.length === 0) return;

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      onSongChange(songs[prevIndex].id);
    }
  }, [isPlaylistMode, currentIndex, songs, onSongChange]);

  const playFromIndex = useCallback(
    (index: number) => {
      if (songs.length === 0 || index < 0 || index >= songs.length) return;

      setCurrentIndex(index);
      setIsPlaylistMode(true);
      onSongChange(songs[index].id);
    },
    [songs, onSongChange]
  );

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
    hasNext,
    hasPrevious,
  };
}
