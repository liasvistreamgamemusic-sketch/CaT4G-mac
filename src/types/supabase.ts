/**
 * Supabase Database 型定義
 * 001_initial_schema.sql に基づいて生成
 *
 * 注意: 本番環境では `supabase gen types typescript` コマンドで
 * 自動生成することを推奨します。
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * コード位置の型（chords_json カラム用）
 */
export interface ChordPositionJson {
  chord: string;
  position: number;
}

/**
 * コード押さえ方の型（fingering_json カラム用）
 */
export interface ChordFingeringJson {
  frets: (number | null)[];
  fingers: (number | null)[];
  barreAt: number | null;
  baseFret: number;
}

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'artists_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      songs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          artist_id: string | null;
          original_key: string | null;
          bpm: number | null;
          time_signature: string;
          capo: number;
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
          source_url: string | null;
          notes: string | null;
          is_favorite: boolean;
          play_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          artist_id?: string | null;
          original_key?: string | null;
          bpm?: number | null;
          time_signature?: string;
          capo?: number;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null;
          source_url?: string | null;
          notes?: string | null;
          is_favorite?: boolean;
          play_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          artist_id?: string | null;
          original_key?: string | null;
          bpm?: number | null;
          time_signature?: string;
          capo?: number;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null;
          source_url?: string | null;
          notes?: string | null;
          is_favorite?: boolean;
          play_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'songs_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'songs_artist_id_fkey';
            columns: ['artist_id'];
            referencedRelation: 'artists';
            referencedColumns: ['id'];
          }
        ];
      };
      sections: {
        Row: {
          id: string;
          user_id: string;
          song_id: string;
          name: string;
          order_index: number;
          repeat_count: number;
          transpose_override: number | null;
          bpm_override: number | null;
          playback_speed_override: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          song_id: string;
          name: string;
          order_index: number;
          repeat_count?: number;
          transpose_override?: number | null;
          bpm_override?: number | null;
          playback_speed_override?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          song_id?: string;
          name?: string;
          order_index?: number;
          repeat_count?: number;
          transpose_override?: number | null;
          bpm_override?: number | null;
          playback_speed_override?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sections_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sections_song_id_fkey';
            columns: ['song_id'];
            referencedRelation: 'songs';
            referencedColumns: ['id'];
          }
        ];
      };
      lines: {
        Row: {
          id: string;
          user_id: string;
          section_id: string;
          lyrics: string;
          chords_json: ChordPositionJson[];
          order_index: number;
          measures: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          section_id: string;
          lyrics: string;
          chords_json?: ChordPositionJson[];
          order_index: number;
          measures?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          section_id?: string;
          lyrics?: string;
          chords_json?: ChordPositionJson[];
          order_index?: number;
          measures?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'lines_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lines_section_id_fkey';
            columns: ['section_id'];
            referencedRelation: 'sections';
            referencedColumns: ['id'];
          }
        ];
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tags_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      song_tags: {
        Row: {
          song_id: string;
          tag_id: string;
          user_id: string;
        };
        Insert: {
          song_id: string;
          tag_id: string;
          user_id: string;
        };
        Update: {
          song_id?: string;
          tag_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'song_tags_song_id_fkey';
            columns: ['song_id'];
            referencedRelation: 'songs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'song_tags_tag_id_fkey';
            columns: ['tag_id'];
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'song_tags_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      playlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'playlists_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      playlist_songs: {
        Row: {
          playlist_id: string;
          song_id: string;
          user_id: string;
          order_index: number;
        };
        Insert: {
          playlist_id: string;
          song_id: string;
          user_id: string;
          order_index: number;
        };
        Update: {
          playlist_id?: string;
          song_id?: string;
          user_id?: string;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'playlist_songs_playlist_id_fkey';
            columns: ['playlist_id'];
            referencedRelation: 'playlists';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'playlist_songs_song_id_fkey';
            columns: ['song_id'];
            referencedRelation: 'songs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'playlist_songs_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      chord_preferences: {
        Row: {
          id: string;
          user_id: string;
          chord_name: string;
          fingering_json: ChordFingeringJson;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chord_name: string;
          fingering_json: ChordFingeringJson;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chord_name?: string;
          fingering_json?: ChordFingeringJson;
          is_default?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chord_preferences_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      settings: {
        Row: {
          key: string;
          value: string;
        };
        Insert: {
          key: string;
          value: string;
        };
        Update: {
          key?: string;
          value?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// 便利な型エイリアス
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// 各テーブルの Row 型をエクスポート
export type ArtistRow = Tables<'artists'>;
export type SongRow = Tables<'songs'>;
export type SectionRow = Tables<'sections'>;
export type LineRow = Tables<'lines'>;
export type TagRow = Tables<'tags'>;
export type SongTagRow = Tables<'song_tags'>;
export type PlaylistRow = Tables<'playlists'>;
export type PlaylistSongRow = Tables<'playlist_songs'>;
export type ChordPreferenceRow = Tables<'chord_preferences'>;
export type SettingRow = Tables<'settings'>;
