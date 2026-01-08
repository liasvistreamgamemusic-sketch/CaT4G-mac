# CaT4G - 開発環境セットアップ

## 必要条件

| 項目 | バージョン |
|------|-----------|
| Node.js | 20+ |
| Rust | 1.70+ |
| npm/pnpm | 最新 |

### Windows 追加要件

- Visual Studio Build Tools
- WebView2 Runtime

### macOS 追加要件

- Xcode Command Line Tools

## インストール手順

### 1. リポジトリクローン

```bash
git clone <repository-url>
cd cat4g
```

### 2. Rust のインストール（未インストールの場合）

```bash
# Windows / macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 3. Node.js 依存関係インストール

```bash
npm install
```

### 4. Tauri CLI インストール

```bash
npm install -g @tauri-apps/cli
```

## ビルドコマンド

### 開発

```bash
# Vite のみ（フロントエンド）
npm run dev

# Tauri 完全起動（推奨）
npm run tauri dev
```

### 本番ビルド

```bash
# フロントエンドビルド
npm run build

# インストーラー生成
npm run tauri build
```

### コード品質

```bash
# ESLint チェック
npm run lint

# Prettier フォーマット
npm run format

# 型チェック
npm run type-check
```

## Docker 開発環境（オプション）

### イメージビルド

```bash
./scripts/docker-dev.sh build
```

### コンテナ起動

```bash
./scripts/docker-dev.sh up
```

### 開発サーバー起動（コンテナ内）

```bash
npm install
npm run tauri dev
```

**注意**: Docker で GUI を表示するには WSLg（Windows）または X11 転送（Linux）が必要

## プロジェクト構造

```
cat4g/
├── src/                          # React フロントエンド
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── src-tauri/                    # Rust バックエンド
│   ├── src/
│   │   ├── lib.rs
│   │   ├── main.rs
│   │   └── parsers/
│   ├── migrations/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── specs/                        # 仕様書
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 設定ファイル

### package.json

```json
{
  "name": "cat4g",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write src",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-sql": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "postcss": "^8.4.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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

## トラブルシューティング

### Tauri が起動しない

```bash
# Rust ツールチェーンの更新
rustup update

# Tauri CLI の再インストール
npm install -g @tauri-apps/cli@latest
```

### WebView2 エラー（Windows）

Microsoft Edge WebView2 Runtime をインストール:
https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### ビルドエラー（macOS）

```bash
# Xcode Command Line Tools の再インストール
xcode-select --install
```

### SQLite エラー

```bash
# データベースファイルの削除（開発時のみ）
rm -f ~/.local/share/com.cat4g.app/cat4g.db
```

## 開発フロー

1. `npm run tauri dev` で開発サーバー起動
2. `src/` 内のファイルを編集（ホットリロード対応）
3. `src-tauri/src/` 内の Rust コードを編集（自動再ビルド）
4. `npm run lint` でコード品質チェック
5. `npm run format` でフォーマット
6. `npm run tauri build` で本番ビルド

## 次のステップ

環境構築完了後 → [00_overview.md](./00_overview.md) の推奨実装順序に従って開発開始
