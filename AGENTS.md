# CaT4G - 開発ワークフロー

## プロジェクト概要

**CaT4G** (Chords and Tabs for Guitar) - ギターコード譜管理デスクトップアプリ

### 技術スタック
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Tauri 2.0 + Rust
- **Database**: SQLite
- **開発環境**: Docker

---

## ワークフロー（Solo モード）

```
[アイデア/要望]
     │
     ▼
[Plans.md でタスク計画]
     │
     ▼
[/work で実装]
     │
     ▼
[/review でセルフレビュー]
     │
     ▼
[/commit でコミット]
```

---

## クイックコマンド

| やりたいこと | コマンド |
|-------------|---------|
| タスク確認 | `/sync-status` |
| 実装開始 | `/work` |
| レビュー | `/review` |
| コミット | `/commit` |
| 計画作成 | `/plan-with-agent` |

---

## 開発コマンド

```bash
# Docker で開発サーバー起動（フロントエンドのみ）
docker compose up frontend

# Docker で全環境起動（Rust含む）
docker compose up dev

# ローカルで開発（Node.js + Rustが必要）
npm run dev           # フロントエンドのみ
npm run tauri:dev     # Tauri アプリ起動

# ビルド
docker compose run build
```

---

## ファイル構成

```
cat4g/
├── src/                    # React フロントエンド
│   ├── components/         # UI コンポーネント
│   ├── lib/               # ユーティリティ
│   └── types/             # TypeScript 型定義
├── src-tauri/             # Rust バックエンド
│   ├── src/               # Rust ソースコード
│   └── migrations/        # DB マイグレーション
├── specs/                 # 仕様書
├── docker/                # Docker 設定
├── Plans.md               # タスク管理
└── CLAUDE.md              # Claude Code 設定
```

---

## 仕様書リンク

- [00_overview.md](specs/00_overview.md) - プロジェクト概要
- [01_architecture.md](specs/01_architecture.md) - アーキテクチャ
- [02_database.md](specs/02_database.md) - データベース設計
- [03_frontend.md](specs/03_frontend.md) - フロントエンド
- [04_backend_scraping.md](specs/04_backend_scraping.md) - URLスクレイピング
- [05_autoscroll.md](specs/05_autoscroll.md) - オートスクロール
- [06_metronome.md](specs/06_metronome.md) - メトロノーム
- [07_transpose.md](specs/07_transpose.md) - 転調・コード管理
- [08_playlist.md](specs/08_playlist.md) - プレイリスト
- [09_ui_design.md](specs/09_ui_design.md) - UIデザイン
- [10_dev_setup.md](specs/10_dev_setup.md) - 開発環境セットアップ
