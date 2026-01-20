/**
 * CaT4G - Supabase Realtime Sync Hook
 *
 * Subscribes to real-time database changes via Supabase Realtime.
 * Automatically refreshes data when changes are detected from other devices/tabs.
 *
 * Features:
 * - Only active when using Supabase backend (VITE_BACKEND=supabase)
 * - Monitors songs, playlists, tags, and artists tables
 * - Debounces rapid changes to prevent excessive refetching
 * - Properly cleans up subscriptions on unmount
 * - Works correctly with multiple browser tabs
 */

import { useEffect, useCallback, useRef } from 'react';
import { isSupabaseEnabled } from '@/lib/supabase';
import {
  subscribeToAllDataChanges,
  removeChannel,
  type TableChangePayload,
} from '@/lib/api/supabase/realtime';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// Types
// ============================================

export interface UseRealtimeSyncOptions {
  /**
   * Callback when songs table changes (including sections and lines)
   */
  onSongsChange?: () => void;

  /**
   * Callback when playlists table changes (including playlist_songs)
   */
  onPlaylistsChange?: () => void;

  /**
   * Callback when tags table changes (including song_tags)
   */
  onTagsChange?: () => void;

  /**
   * Callback when artists table changes
   */
  onArtistsChange?: () => void;

  /**
   * Debounce delay in milliseconds for rapid changes
   * @default 500
   */
  debounceMs?: number;

  /**
   * Whether to enable the subscription
   * @default true
   */
  enabled?: boolean;
}

export interface UseRealtimeSyncReturn {
  /**
   * Whether the realtime subscription is currently active
   */
  isConnected: boolean;

  /**
   * Last error that occurred, if any
   */
  error: Error | null;
}

// ============================================
// Helper: Debounced callback
// ============================================

function useDebouncedCallback(
  callback: (() => void) | undefined,
  delayMs: number
): () => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current?.();
      timeoutRef.current = null;
    }, delayMs);
  }, [delayMs]);
}

// ============================================
// Hook Implementation
// ============================================

export function useRealtimeSync(options: UseRealtimeSyncOptions = {}): UseRealtimeSyncReturn {
  const {
    onSongsChange,
    onPlaylistsChange,
    onTagsChange,
    onArtistsChange,
    debounceMs = 500,
    enabled = true,
  } = options;

  // State refs to avoid re-subscription on callback changes
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isConnectedRef = useRef(false);
  const errorRef = useRef<Error | null>(null);

  // Debounced callbacks
  const debouncedSongsChange = useDebouncedCallback(onSongsChange, debounceMs);
  const debouncedPlaylistsChange = useDebouncedCallback(onPlaylistsChange, debounceMs);
  const debouncedTagsChange = useDebouncedCallback(onTagsChange, debounceMs);
  const debouncedArtistsChange = useDebouncedCallback(onArtistsChange, debounceMs);

  // Create change handlers that use debounced callbacks
  const handleSongsChange = useCallback(
    (_payload: TableChangePayload) => {
      debouncedSongsChange();
    },
    [debouncedSongsChange]
  );

  const handlePlaylistsChange = useCallback(
    (_payload: TableChangePayload) => {
      debouncedPlaylistsChange();
    },
    [debouncedPlaylistsChange]
  );

  const handleTagsChange = useCallback(
    (_payload: TableChangePayload) => {
      debouncedTagsChange();
    },
    [debouncedTagsChange]
  );

  const handleArtistsChange = useCallback(
    (_payload: TableChangePayload) => {
      debouncedArtistsChange();
    },
    [debouncedArtistsChange]
  );

  // Setup and teardown subscription
  useEffect(() => {
    // Skip if Supabase is not enabled or hook is disabled
    if (!isSupabaseEnabled() || !enabled) {
      isConnectedRef.current = false;
      return;
    }

    // Skip if no callbacks provided
    if (!onSongsChange && !onPlaylistsChange && !onTagsChange && !onArtistsChange) {
      return;
    }

    // Generate unique channel name for this tab/instance
    const channelName = `db-changes-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    let isSubscribing = true;

    async function subscribe() {
      try {
        const channel = await subscribeToAllDataChanges(channelName, {
          onSongsChange: onSongsChange ? handleSongsChange : undefined,
          onPlaylistsChange: onPlaylistsChange ? handlePlaylistsChange : undefined,
          onTagsChange: onTagsChange ? handleTagsChange : undefined,
          onArtistsChange: onArtistsChange ? handleArtistsChange : undefined,
        });

        // Check if we should still be subscribed (component didn't unmount)
        if (!isSubscribing) {
          if (channel) {
            await removeChannel(channel);
          }
          return;
        }

        channelRef.current = channel;
        isConnectedRef.current = channel !== null;
        errorRef.current = null;

        if (channel) {
          console.log('[Realtime] Subscribed to database changes');
        }
      } catch (err) {
        errorRef.current = err instanceof Error ? err : new Error(String(err));
        isConnectedRef.current = false;
        console.error('[Realtime] Failed to subscribe:', err);
      }
    }

    subscribe();

    // Cleanup function
    return () => {
      isSubscribing = false;

      if (channelRef.current) {
        const channel = channelRef.current;
        channelRef.current = null;
        isConnectedRef.current = false;

        removeChannel(channel)
          .then(() => {
            console.log('[Realtime] Unsubscribed from database changes');
          })
          .catch((err) => {
            console.error('[Realtime] Failed to unsubscribe:', err);
          });
      }
    };
  }, [
    enabled,
    // Only re-subscribe if the presence of callbacks changes, not their identity
    Boolean(onSongsChange),
    Boolean(onPlaylistsChange),
    Boolean(onTagsChange),
    Boolean(onArtistsChange),
    handleSongsChange,
    handlePlaylistsChange,
    handleTagsChange,
    handleArtistsChange,
  ]);

  return {
    isConnected: isConnectedRef.current,
    error: errorRef.current,
  };
}
