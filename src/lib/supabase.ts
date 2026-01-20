/**
 * CaT4G Supabase Client
 * Supabase バックエンド用のクライアント設定
 */

import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// 環境変数の型安全な取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// バックエンド種別
export type BackendType = 'supabase' | 'tauri';
export const BACKEND_TYPE: BackendType = (import.meta.env.VITE_BACKEND as BackendType) || 'tauri';

// Supabase クライアントインスタンス
let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Supabase が有効かどうかを判定
 */
export function isSupabaseEnabled(): boolean {
  return BACKEND_TYPE === 'supabase';
}

/**
 * Supabase クライアントを取得
 * @throws Supabase が無効な場合、または環境変数が設定されていない場合
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseEnabled()) {
    throw new Error('Supabase is not enabled. Set VITE_BACKEND=supabase to use Supabase.');
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase environment variables are not set. ' +
      'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
}

// ============================================
// 認証関連ユーティリティ
// ============================================

/**
 * 認証状態の変更を監視
 * @param callback 認証状態が変更された時に呼ばれるコールバック
 * @returns 監視を解除する関数
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  if (!isSupabaseEnabled()) {
    console.warn('Supabase is not enabled. Auth state change listener will not be set up.');
    return () => {};
  }

  const client = getSupabaseClient();
  const { data: { subscription } } = client.auth.onAuthStateChange(callback);

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * 現在のセッションを取得
 */
export async function getCurrentSession(): Promise<Session | null> {
  if (!isSupabaseEnabled()) {
    return null;
  }

  const client = getSupabaseClient();
  const { data: { session }, error } = await client.auth.getSession();

  if (error) {
    console.error('Failed to get current session:', error);
    return null;
  }

  return session;
}

/**
 * 現在のユーザー ID を取得
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.user?.id ?? null;
}

/**
 * サインアウト
 */
export async function signOut(): Promise<void> {
  if (!isSupabaseEnabled()) {
    console.warn('Supabase is not enabled. Sign out will not be performed.');
    return;
  }

  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}

// ============================================
// エラーハンドリングユーティリティ
// ============================================

/**
 * Supabase エラーを整形して返す
 */
export function formatSupabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Unknown error occurred';
}

/**
 * Supabase クエリ結果をハンドリング
 * @param result Supabase クエリ結果
 * @throws エラーがある場合
 */
export function handleSupabaseResult<T>(
  result: { data: T | null; error: { message: string } | null }
): T {
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.data === null) {
    throw new Error('No data returned');
  }
  return result.data;
}

// 型エクスポート
export type { Session, AuthChangeEvent };
