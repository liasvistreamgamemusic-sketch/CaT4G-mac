# CaT4G - UI/UX デザイン仕様

## デザインシステム

### カラーパレット

```css
/* 背景 */
--bg-primary: #0a0a0f;     /* 最深部 */
--bg-secondary: #12121a;   /* セカンダリ */
--bg-tertiary: #1a1a25;    /* カード背景 */
--bg-elevated: #22222f;    /* 浮き上がり要素 */

/* テキスト */
--text-primary: #f8fafc;   /* 主要テキスト */
--text-secondary: #94a3b8; /* 補助テキスト */
--text-muted: #64748b;     /* 薄いテキスト */

/* アクセント */
--accent-primary: #a855f7;   /* パープル（メイン） */
--accent-secondary: #f59e0b; /* アンバー（強調） */
--accent-tertiary: #06b6d4;  /* シアン（補助） */

/* グラス効果 */
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-border: rgba(255, 255, 255, 0.08);
```

### Tailwind 設定

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          tertiary: '#1a1a25',
          elevated: '#22222f',
        },
        accent: {
          primary: '#a855f7',
          secondary: '#f59e0b',
          tertiary: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### タイポグラフィ

| 用途 | フォント | サイズ | ウェイト |
|------|----------|--------|----------|
| UI テキスト | Outfit | 14px | 400 |
| 見出し | Outfit | 20-24px | 600 |
| コード | JetBrains Mono | 14px | 500 |
| 歌詞 | Outfit | 16px | 400 |

### スペーシング

```
4px (xs) - 8px (sm) - 12px (md) - 16px (lg) - 24px (xl) - 32px (2xl)
```

## コンポーネントスタイル

### グラスモーフィズム

```css
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### ボタン

```typescript
// プライマリボタン
<button className="
  px-4 py-2
  bg-gradient-to-r from-purple-600 to-purple-700
  hover:from-purple-500 hover:to-purple-600
  text-white font-medium
  rounded-lg
  transition-all duration-200
  hover:shadow-lg hover:shadow-purple-500/25
  active:scale-95
">
  ボタン
</button>

// セカンダリボタン
<button className="
  px-4 py-2
  bg-gray-800 hover:bg-gray-700
  text-gray-200
  rounded-lg
  border border-gray-700
  transition-colors
">
  ボタン
</button>

// アイコンボタン
<button className="
  p-2
  rounded-lg
  hover:bg-gray-800
  text-gray-400 hover:text-white
  transition-colors
">
  <Icon className="w-5 h-5" />
</button>
```

### 入力フィールド

```typescript
<input
  className="
    w-full px-4 py-2
    bg-gray-800/50
    border border-gray-700
    rounded-lg
    text-white placeholder-gray-500
    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
    transition-colors
  "
  placeholder="入力してください"
/>
```

### カード

```typescript
<div className="
  p-4
  bg-gray-900/50
  backdrop-blur-sm
  border border-gray-800
  rounded-xl
  hover:border-gray-700
  transition-colors
">
  カードコンテンツ
</div>
```

### バッジ

```typescript
// メタデータバッジ
<span className="
  px-2 py-1
  text-xs font-medium
  bg-purple-500/20 text-purple-300
  rounded-full
">
  Key: C
</span>

// ステータスバッジ
<span className="
  px-2 py-1
  text-xs font-medium
  bg-green-500/20 text-green-300
  rounded-full
">
  お気に入り
</span>
```

## アニメーション

```css
/* フェードイン */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* スライドイン */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* グロー効果 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.animate-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* スケール */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}
```

## レイアウト仕様

### 全体構成

```
┌────────────────────────────────────────────────────────┐
│                      Window (1200 x 800)                │
├─────────────┬──────────────────────────────────────────┤
│             │                                          │
│   Sidebar   │              MainArea                    │
│  (288px)    │           (残り幅全て)                   │
│             │                                          │
│             │                                          │
│             │                                          │
│             │                                          │
├─────────────┴──────────────────────────────────────────┤
│                    ControlBar (64px)                   │
└────────────────────────────────────────────────────────┘
```

### Sidebar レイアウト

```
┌─────────────────────────────┐
│  [Logo]  CaT4G              │  64px
├─────────────────────────────┤
│  [Search Input]             │  48px
├─────────────────────────────┤
│  Songs | Playlists          │  40px (tabs)
├─────────────────────────────┤
│                             │
│  Song 1                     │
│  Song 2                     │  flex-1
│  Song 3                     │  (scrollable)
│  ...                        │
│                             │
├─────────────────────────────┤
│  [+ Add Song]               │  48px
└─────────────────────────────┘
```

### MainArea レイアウト

```
┌─────────────────────────────────────────┐
│  Title              Key BPM Capo Diff   │  Header
│  Artist                                 │  (120px)
├─────────────────────────────────────────┤
│                                         │
│  [Intro]                                │
│  C    G    Am   F                       │
│                                         │
│  [Verse]                                │  Content
│  C        Am                            │  (scrollable)
│  歌詞テキスト                            │
│  F        G                             │
│  続きの歌詞                              │
│                                         │
│  [Chorus]                               │
│  ...                                    │
│                                         │
└─────────────────────────────────────────┘
```

### ControlBar レイアウト

```
┌────────────────────────────────────────────────────────┐
│  [Play]  ━━━━●━━━━  Speed   │  BPM [Metro]  │  +/- T  │
│                              │               │  Trans  │
└────────────────────────────────────────────────────────┘
```

## グローバルスタイル

```css
/* src/index.css */

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Outfit', sans-serif;
  }

  body {
    @apply bg-bg-primary text-white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* カスタムスクロールバー */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-gray-700 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-600;
  }

  /* セレクション */
  ::selection {
    @apply bg-purple-500/30;
  }
}

@layer components {
  /* グラス効果 */
  .glass {
    @apply bg-white/[0.03] backdrop-blur-xl border border-white/[0.08];
  }

  /* グロー効果 */
  .glow {
    @apply shadow-lg shadow-purple-500/20;
  }

  /* ホバーカード */
  .hover-card {
    @apply transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-700;
  }

  /* アクティブ状態 */
  .active-item {
    @apply bg-purple-600/20 border-purple-500/50;
  }
}

@layer utilities {
  /* テキストグラデーション */
  .text-gradient {
    @apply bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent;
  }
}
```

## アイコン

SVG カスタムアイコンを使用:

```typescript
// src/components/icons/index.tsx

export const GuitarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 2L9 4M13 2L15 4M12 6V10M8 10C5.79 10 4 11.79 4 14V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V14C20 11.79 18.21 10 16 10H8Z" />
    <circle cx="12" cy="15" r="2" />
  </svg>
);

export const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const MusicIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const PlaylistIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M3 12h12M3 18h12M19 15l4 3-4 3" />
  </svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const StarIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const MetronomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L8 20h8L12 2z" />
    <path d="M12 8l4 10" />
    <circle cx="12" cy="18" r="2" />
  </svg>
);

export const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
```

## 実装タスク

1. [ ] `tailwind.config.js` - Tailwind 設定
2. [ ] `src/index.css` - グローバルスタイル
3. [ ] `src/components/icons/index.tsx` - SVG アイコン
4. [ ] 各コンポーネントにスタイル適用
5. [ ] アニメーション追加
6. [ ] レスポンシブ対応（将来）

## 次のステップ

UI 完了後 → [10_dev_setup.md](./10_dev_setup.md) で開発環境を確認
