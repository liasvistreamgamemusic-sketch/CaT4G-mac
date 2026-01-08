# CaT4G - Chords and Tabs for Guitar

ギターコード譜を管理するデスクトップアプリケーション。

## 機能

- **コード譜取得**: U-Fret、ChordWiki、J-Total からワンクリックで取得
- **転調**: 半音単位でキー変更、コードダイアグラム表示
- **オートスクロール**: BPM連動スクロール、速度調整（0.5x〜2.0x）
- **メトロノーム**: 4種の拍子対応、アクセント拍、音量調整
- **プレイリスト**: 曲の整理、ドラッグ&ドロップ並び替え、連続再生
- **お気に入り**: ワンクリックでお気に入り登録

## スクリーンショット

```
┌─────────────┬──────────────────────────────────────────┐
│   Sidebar   │              ChordSheet                  │
│  (曲一覧)    │            (コード譜表示)                 │
│             │                                          │
├─────────────┴──────────────────────────────────────────┤
│                    ControlBar                          │
│        (転調 / オートスクロール / メトロノーム)           │
└────────────────────────────────────────────────────────┘
```

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | [Tauri 2.0](https://tauri.app/) |
| フロントエンド | React 18 + TypeScript + Vite |
| バックエンド | Rust |
| データベース | SQLite |
| スタイリング | Tailwind CSS |

## 必要条件

- Node.js 20+
- Rust 1.70+
- npm または pnpm

### Windows 追加要件
- Visual Studio Build Tools
- WebView2 Runtime

### macOS 追加要件
- Xcode Command Line Tools (`xcode-select --install`)

## インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd cat4g

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run tauri:dev
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | Vite 開発サーバー起動 |
| `npm run tauri:dev` | Tauri アプリ起動（推奨） |
| `npm run build` | フロントエンドビルド |
| `npm run tauri:build` | インストーラー生成 |
| `npm run lint` | ESLint チェック |
| `npm run format` | Prettier フォーマット |

## キーボードショートカット

| キー | 機能 |
|------|------|
| `Space` | 再生/停止 |
| `↑` / `↓` | スクロール速度調整 |
| `Home` | 先頭に移動 |
| `M` | メトロノーム ON/OFF |

## プロジェクト構造

```
cat4g/
├── src/                    # React フロントエンド
│   ├── components/         # UIコンポーネント
│   ├── hooks/              # カスタムフック
│   ├── lib/                # ユーティリティ、DB API
│   └── types/              # TypeScript型定義
├── src-tauri/              # Rust バックエンド
│   ├── src/
│   │   ├── lib.rs          # Tauriエントリ
│   │   └── parsers/        # サイト別パーサー
│   └── migrations/         # SQLマイグレーション
├── specs/                  # 仕様書
└── Plans.md                # 実装計画
```

## ライセンス

MIT License

## 貢献

Issue や Pull Request を歓迎します。
