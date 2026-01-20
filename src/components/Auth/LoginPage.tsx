/**
 * LoginPage
 * ログイン画面コンポーネント
 * ダークテーマ、glassmorphismスタイル
 * Email/Password認証対応
 */

import { useState } from 'react';
import { useAuth } from './AuthProvider';

type AuthMode = 'login' | 'signup';

/**
 * ログインページコンポーネント
 * Email/Passwordログインフォームを表示
 */
export function LoginPage() {
  const { signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // バリデーション
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('パスワードが一致しません。');
        return;
      }
      if (password.length < 6) {
        setError('パスワードは6文字以上で入力してください。');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          setError(result.error);
        }
      } else {
        const result = await signUpWithEmail(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccessMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。');
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      setError(mode === 'login' ? 'ログインに失敗しました。' : '新規登録に失敗しました。');
      console.error('Auth failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      {/* Background gradient effects */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 40%)',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-3xl p-8 backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(145deg, rgba(26, 26, 37, 0.9) 0%, rgba(26, 26, 37, 0.7) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          }}
        >
          {/* Logo / App title */}
          <div className="text-center mb-8">
            {/* Music icon with purple glow */}
            <div className="relative inline-block mb-6">
              <div
                className="absolute inset-0 blur-xl opacity-50"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
                  transform: 'scale(1.5)',
                }}
              />
              <svg
                className="w-16 h-16 mx-auto text-purple-500 relative"
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

            {/* App name */}
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              CaT4G
            </h1>
            <p className="text-slate-400 text-sm">
              Chords and Tabs for Guitar
            </p>
          </div>

          {/* Mode title */}
          <h2 className="text-xl font-semibold text-slate-100 text-center mb-6">
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </h2>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
              {successMessage}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="6文字以上"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                disabled={isSubmitting}
              />
            </div>

            {/* Confirm password input (signup only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  パスワード（確認）
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="パスワードを再入力"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-500 text-white mt-6"
              style={{
                boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.3)',
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'ログイン中...' : '登録中...'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'ログイン' : '新規登録'}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-4 text-xs text-slate-500">または</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Toggle mode button */}
          <button
            onClick={toggleMode}
            disabled={isSubmitting}
            className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
          >
            {mode === 'login' ? '新規登録はこちら' : 'すでにアカウントをお持ちの方'}
          </button>

          {/* Info text */}
          <p className="text-center text-xs text-slate-500 mt-6">
            ログインすると、クラウドにデータを保存し、<br />
            複数のデバイス間で同期できます。
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}
