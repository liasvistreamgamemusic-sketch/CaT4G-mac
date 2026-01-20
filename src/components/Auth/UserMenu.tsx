/**
 * UserMenu
 * ユーザーメニューコンポーネント（ヘッダー用）
 * ユーザーアバター、名前、ログアウトボタンを表示
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { LogOut, ChevronDown, User } from 'lucide-react';

/**
 * ユーザーメニューコンポーネント
 * ドロップダウンでログアウト等のオプションを表示
 */
export function UserMenu() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // クリック外でメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  // 未認証の場合は何も表示しない
  if (!isAuthenticated || !user) {
    return null;
  }

  // ユーザー情報を取得
  const userEmail = user.email ?? '';
  const userName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? userEmail.split('@')[0];
  const userAvatar = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/5 border border-transparent hover:border-white/10"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-4 h-4 text-purple-400" />
          )}
        </div>

        {/* Name (hidden on small screens) */}
        <span className="hidden sm:block text-sm text-slate-200 max-w-[120px] truncate">
          {userName}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden z-50 animate-fade-in"
          style={{
            background: 'linear-gradient(145deg, rgba(26, 26, 37, 0.95) 0%, rgba(26, 26, 37, 0.85) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">
                  {userName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-300 hover:text-slate-100 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 text-slate-400" />
              )}
              <span>{isSigningOut ? 'ログアウト中...' : 'ログアウト'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
