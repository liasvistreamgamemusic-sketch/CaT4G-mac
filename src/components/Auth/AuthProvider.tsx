/**
 * AuthProvider
 * Supabase認証コンテキストプロバイダー
 * Tauri版の場合は認証をスキップ
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  isSupabaseEnabled,
  getSupabaseClient,
  onAuthStateChange,
  getCurrentSession,
  signOut as supabaseSignOut,
} from '@/lib/supabase';

/**
 * 認証コンテキストの型定義
 */
export interface AuthContextType {
  /** 現在のユーザー */
  user: User | null;
  /** 現在のセッション */
  session: Session | null;
  /** ローディング状態 */
  loading: boolean;
  /** メールアドレスでログイン */
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  /** メールアドレスで新規登録 */
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  /** ログアウト */
  signOut: () => Promise<void>;
  /** 認証済みかどうか */
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証プロバイダーコンポーネント
 * Supabase認証状態を管理し、子コンポーネントに提供する
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Tauri版の場合は認証スキップ（常に認証済みとして扱う）
  const isTauriBackend = !isSupabaseEnabled();

  useEffect(() => {
    // Tauri版の場合は認証不要
    if (isTauriBackend) {
      setLoading(false);
      return;
    }

    // 初期セッションを取得
    const initSession = async () => {
      try {
        const currentSession = await getCurrentSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Failed to get initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 認証状態の変更を監視
    const unsubscribe = onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [isTauriBackend]);

  /**
   * メールアドレスでログイン
   */
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isTauriBackend) {
      console.warn('Supabase is not enabled. Email sign in will not be performed.');
      return { error: null };
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Email sign in error:', error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('Failed to sign in with email:', error);
      return { error: 'ログインに失敗しました。' };
    }
  }, [isTauriBackend]);

  /**
   * メールアドレスで新規登録
   */
  const signUpWithEmail = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isTauriBackend) {
      console.warn('Supabase is not enabled. Email sign up will not be performed.');
      return { error: null };
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Email sign up error:', error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('Failed to sign up with email:', error);
      return { error: '新規登録に失敗しました。' };
    }
  }, [isTauriBackend]);

  /**
   * ログアウト
   */
  const signOut = useCallback(async () => {
    if (isTauriBackend) {
      console.warn('Supabase is not enabled. Sign out will not be performed.');
      return;
    }

    try {
      await supabaseSignOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  }, [isTauriBackend]);

  // Tauri版は常に認証済み、Supabase版はセッションがあれば認証済み
  const isAuthenticated = isTauriBackend || !!session;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 認証コンテキストを使用するフック
 * @throws AuthProvider外で使用した場合
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
