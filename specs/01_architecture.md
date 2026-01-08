# CaT4G - アーキテクチャ設計

## 全体構成図

```
┌─────────────────────────────────────────────────────────────┐
│                      Tauri Application                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌──────────────────────────┐   │
│  │   React Frontend     │    │     Rust Backend         │   │
│  │                      │    │                          │   │
│  │  ┌────────────────┐  │    │  ┌────────────────────┐  │   │
│  │  │  Components    │  │    │  │  Tauri Commands    │  │   │
│  │  │  - Layout      │  │◄──►│  │  - fetch_chord_    │  │   │
│  │  │  - Sidebar     │  │IPC │  │    sheet           │  │   │
│  │  │  - MainArea    │  │    │  │                    │  │   │
│  │  │  - ControlBar  │  │    │  └────────────────────┘  │   │
│  │  │  - AddSongModal│  │    │                          │   │
│  │  └────────────────┘  │    │  ┌────────────────────┐  │   │
│  │                      │    │  │  HTTP Client       │  │   │
│  │  ┌────────────────┐  │    │  │  - U-Fret parser   │  │   │
│  │  │  Services      │  │    │  │  - ChordWiki parser│  │   │
│  │  │  - database.ts │  │◄──►│  │  - J-Total parser  │  │   │
│  │  │  - parser.ts   │  │SQL │  └────────────────────┘  │   │
│  │  └────────────────┘  │    │                          │   │
│  └──────────────────────┘    └──────────────────────────┘   │
│                                        │                     │
│                                        ▼                     │
│                              ┌──────────────────┐            │
│                              │     SQLite       │            │
│                              │   (Local DB)     │            │
│                              └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## ディレクトリ構造

```
CaT4G/
├── src/                          # React フロントエンド
│   ├── App.tsx                   # メインコンポーネント
│   ├── main.tsx                  # エントリーポイント
│   ├── index.css                 # グローバルスタイル
│   ├── vite-env.d.ts             # Vite 型定義
│   ├── components/               # UI コンポーネント
│   │   ├── Layout.tsx            # レイアウトラッパー
│   │   ├── Sidebar.tsx           # サイドバー
│   │   ├── MainArea.tsx          # メインコンテンツ
│   │   ├── ControlBar.tsx        # コントロールバー
│   │   ├── AddSongModal.tsx      # 曲追加モーダル
│   │   └── index.ts              # エクスポート
│   ├── lib/                      # ユーティリティ
│   │   ├── database.ts           # DB 操作
│   │   └── parser.ts             # コード譜パーサー
│   └── types/                    # 型定義
│       ├── index.ts              # エクスポート
│       └── database.ts           # 全型定義
│
├── src-tauri/                    # Rust バックエンド
│   ├── src/
│   │   ├── lib.rs                # Tauri コマンド
│   │   └── main.rs               # エントリーポイント
│   ├── migrations/
│   │   └── 001_initial.sql       # DB スキーマ
│   ├── Cargo.toml                # Rust 依存関係
│   ├── tauri.conf.json           # Tauri 設定
│   └── capabilities/             # ACL 設定
│
├── docs/                         # ドキュメント
├── docker/                       # Docker 設定
├── index.html                    # HTML エントリー
├── package.json                  # Node 依存関係
├── tailwind.config.js            # Tailwind 設定
├── tsconfig.json                 # TypeScript 設定
└── vite.config.ts                # Vite 設定
```

## 実装タスク

### 1. プロジェクト初期化

```bash
# Tauri + React + TypeScript プロジェクト作成
npm create tauri-app@latest cat4g -- --template react-ts

# 依存関係追加
npm install tailwindcss postcss autoprefixer
npm install @tauri-apps/plugin-sql
```

### 2. Tauri 設定 (tauri.conf.json)

```json
{
  "productName": "CaT4G",
  "version": "0.1.0",
  "identifier": "com.cat4g.app",
  "build": {
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "CaT4G",
        "width": 1200,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ]
  },
  "plugins": {
    "sql": {
      "preload": ["sqlite:cat4g.db"]
    }
  }
}
```

### 3. Rust 依存関係 (Cargo.toml)

```toml
[dependencies]
tauri = { version = "2.0", features = [] }
tauri-plugin-sql = { version = "2.0", features = ["sqlite"] }
reqwest = { version = "0.12", features = ["json"] }
scraper = "0.20"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
thiserror = "2.0"
tokio = { version = "1", features = ["full"] }
```

### 4. フロントエンド依存関係 (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-sql": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

## データフロー

```
[ユーザー操作]
     │
     ▼
[イベントハンドラ]
     │
     ├─────────────────────────────────┐
     │                                 │
     ▼                                 ▼
[状態更新 (useState)]           [DB 操作 (database.ts)]
     │                                 │
     ▼                                 ▼
[React 再レンダリング]          [SQLite 更新]
     │                                 │
     ▼                                 │
[UI 更新]◄─────────────────────────────┘
```

## 次のステップ

1. プロジェクトの初期化完了後 → [02_database.md](./02_database.md) でデータベーススキーマを作成
2. DB 準備完了後 → [03_frontend.md](./03_frontend.md) でフロントエンド基盤を構築
