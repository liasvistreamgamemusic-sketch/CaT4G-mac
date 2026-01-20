/**
 * CaT4G Supabase Realtime Utilities
 * Provides utilities for subscribing to real-time database changes
 */

import { getSupabaseClient, isSupabaseEnabled } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// Types
// ============================================

export type TableName = 'songs' | 'playlists' | 'tags' | 'artists' | 'sections' | 'lines' | 'playlist_songs' | 'song_tags';

export type ChangeEventType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface TableChangePayload {
  eventType: ChangeEventType;
  table: TableName;
  new: Record<string, unknown> | null;
  old: Record<string, unknown> | null;
}

export type TableChangeCallback = (payload: TableChangePayload) => void;

// ============================================
// Channel Creation
// ============================================

/**
 * Creates a new Realtime channel with the given name.
 * Returns null if Supabase is not enabled.
 *
 * @param channelName - Unique name for the channel
 * @returns RealtimeChannel or null
 */
export function createRealtimeChannel(channelName: string): RealtimeChannel | null {
  if (!isSupabaseEnabled()) {
    return null;
  }

  const supabase = getSupabaseClient();
  return supabase.channel(channelName);
}

// ============================================
// Table Subscription
// ============================================

/**
 * Subscribes to changes on a specific table.
 * Listens for INSERT, UPDATE, and DELETE events.
 *
 * @param channel - The Realtime channel to attach the subscription
 * @param table - The table name to monitor
 * @param callback - Function called when changes occur
 * @returns The channel with the subscription attached
 */
export function subscribeToTableChanges(
  channel: RealtimeChannel,
  table: TableName,
  callback: TableChangeCallback
): RealtimeChannel {
  return channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table,
    },
    (payload) => {
      callback({
        eventType: payload.eventType as ChangeEventType,
        table,
        new: payload.new as Record<string, unknown> | null,
        old: payload.old as Record<string, unknown> | null,
      });
    }
  );
}

/**
 * Subscribes to changes on multiple tables using a single channel.
 *
 * @param channel - The Realtime channel to attach subscriptions
 * @param subscriptions - Array of table names and their callbacks
 * @returns The channel with all subscriptions attached
 */
export function subscribeToMultipleTables(
  channel: RealtimeChannel,
  subscriptions: Array<{
    table: TableName;
    callback: TableChangeCallback;
  }>
): RealtimeChannel {
  let ch = channel;

  for (const { table, callback } of subscriptions) {
    ch = subscribeToTableChanges(ch, table, callback);
  }

  return ch;
}

// ============================================
// Channel Management
// ============================================

/**
 * Activates the channel subscription.
 * Must be called after setting up all listeners.
 *
 * @param channel - The channel to subscribe
 * @returns Promise that resolves when subscription is active
 */
export async function activateChannel(channel: RealtimeChannel): Promise<void> {
  return new Promise((resolve, reject) => {
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        resolve();
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        reject(new Error(`Failed to subscribe to channel: ${status}`));
      }
    });
  });
}

/**
 * Unsubscribes and removes the channel.
 *
 * @param channel - The channel to remove
 */
export async function removeChannel(channel: RealtimeChannel): Promise<void> {
  if (!isSupabaseEnabled()) {
    return;
  }

  const supabase = getSupabaseClient();
  await supabase.removeChannel(channel);
}

// ============================================
// Convenience Functions
// ============================================

/**
 * Creates a channel and subscribes to a single table in one call.
 * Useful for simple use cases where only one table needs monitoring.
 *
 * @param channelName - Unique name for the channel
 * @param table - The table to monitor
 * @param callback - Function called when changes occur
 * @returns The subscribed channel or null if Supabase is disabled
 */
export async function subscribeToTable(
  channelName: string,
  table: TableName,
  callback: TableChangeCallback
): Promise<RealtimeChannel | null> {
  const channel = createRealtimeChannel(channelName);

  if (!channel) {
    return null;
  }

  subscribeToTableChanges(channel, table, callback);
  await activateChannel(channel);

  return channel;
}

/**
 * Creates a channel that monitors all main data tables (songs, playlists, tags, artists).
 * This is the primary function used by the useRealtimeSync hook.
 *
 * @param channelName - Unique name for the channel
 * @param callbacks - Object containing callbacks for each table type
 * @returns The subscribed channel or null if Supabase is disabled
 */
export async function subscribeToAllDataChanges(
  channelName: string,
  callbacks: {
    onSongsChange?: TableChangeCallback;
    onPlaylistsChange?: TableChangeCallback;
    onTagsChange?: TableChangeCallback;
    onArtistsChange?: TableChangeCallback;
  }
): Promise<RealtimeChannel | null> {
  const channel = createRealtimeChannel(channelName);

  if (!channel) {
    return null;
  }

  const subscriptions: Array<{ table: TableName; callback: TableChangeCallback }> = [];

  if (callbacks.onSongsChange) {
    subscriptions.push({ table: 'songs', callback: callbacks.onSongsChange });
    // Also monitor related tables that affect song data
    subscriptions.push({ table: 'sections', callback: callbacks.onSongsChange });
    subscriptions.push({ table: 'lines', callback: callbacks.onSongsChange });
  }

  if (callbacks.onPlaylistsChange) {
    subscriptions.push({ table: 'playlists', callback: callbacks.onPlaylistsChange });
    subscriptions.push({ table: 'playlist_songs', callback: callbacks.onPlaylistsChange });
  }

  if (callbacks.onTagsChange) {
    subscriptions.push({ table: 'tags', callback: callbacks.onTagsChange });
    subscriptions.push({ table: 'song_tags', callback: callbacks.onTagsChange });
  }

  if (callbacks.onArtistsChange) {
    subscriptions.push({ table: 'artists', callback: callbacks.onArtistsChange });
  }

  if (subscriptions.length === 0) {
    return null;
  }

  subscribeToMultipleTables(channel, subscriptions);
  await activateChannel(channel);

  return channel;
}
