# CaT4G - プロジェクト概要

## プロダクト名

**CaT4G** (Chords and Tabs for Guitar)

## 目的

ギターコード譜とタブ譜を管理・表示するためのデスクトップアプリケーション。日本の主要なコード譜サイト（U-Fret、ChordWiki、J-Total）からのインポート機能を備え、練習支援機能（オートスクロール、メトロノーム、転調）を提供する。

## ターゲットユーザー

- ギター練習者（初心者〜中級者）
- コード譜を整理・管理したい人
- オフライン環境でもコード譜を参照したい人

## プラットフォーム

- **主要**: Windows デスクトップ
- **将来対応**: iPad（Tauri 2.0 iOS サポート使用）

---

## 技術スタック

### フロントエンド

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| UI フレームワーク | React | 18.x | コンポーネントベース UI |
| 言語 | TypeScript | 5.7+ | 型安全な開発 |
| スタイリング | Tailwind CSS | 3.4+ | ユーティリティファースト CSS |
| ビルドツール | Vite | 6.x | 高速な開発サーバー |
| フォント | Outfit, JetBrains Mono | - | UI テキスト、コード表示 |

### バックエンド

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| フレームワーク | Tauri | 2.0 | デスクトップアプリ化 |
| 言語 | Rust | 2021 edition | ネイティブ機能 |
| データベース | SQLite | - | ローカルデータ永続化 |
| SQL プラグイン | tauri-plugin-sql | 2.x | DB 操作 API |
| HTTP クライアント | reqwest | - | URL フェッチ |
| HTML パーサー | scraper | - | コード譜抽出 |

### 開発ツール

| ツール | 用途 |
|--------|------|
| ESLint | コード品質チェック |
| Prettier | コードフォーマット |
| Docker | 開発環境コンテナ化 |

---

## 機能一覧と実装状況

| 機能 | 状態 | 仕様ファイル |
|------|------|-------------|
| プロジェクト基盤（アーキテクチャ） | 実装予定 | [01_architecture.md](./01_architecture.md) |
| データベース設計 | 実装予定 | [02_database.md](./02_database.md) |
| フロントエンド基盤 | 実装予定 | [03_frontend.md](./03_frontend.md) |
| URL スクレイピング | **実装必須** | [04_backend_scraping.md](./04_backend_scraping.md) |
| オートスクロール | **実装必須** | [05_autoscroll.md](./05_autoscroll.md) |
| メトロノーム | **実装必須** | [06_metronome.md](./06_metronome.md) |
| 転調・コード管理 | **実装必須** | [07_transpose.md](./07_transpose.md) |
| プレイリスト | **実装必須** | [08_playlist.md](./08_playlist.md) |
| UI/UX デザイン | 実装予定 | [09_ui_design.md](./09_ui_design.md) |
| 開発環境セットアップ | 参照用 | [10_dev_setup.md](./10_dev_setup.md) |

### 転調・コード管理機能の詳細

[07_transpose.md](./07_transpose.md) には以下の機能が含まれます:

- **全コードデータベース**: メジャー、マイナー、セブンス、分数コード等の全コード定義
- **複数の押さえ方**: 各コードに対して複数の押さえ方（フィンガリング）を提供
- **押さえ方の選択**: 弾き語り時に表示する押さえ方をユーザーが選択可能
- **カスタム押さえ方登録**: ユーザー独自の押さえ方を追加・保存
- **コードダイアグラム表示**: 押さえ方を視覚的に表示
- **転調機能**: -12〜+12半音の範囲でリアルタイム転調

---

## 推奨実装順序

1. **[01_architecture.md](./01_architecture.md)** - プロジェクト基盤構築
2. **[02_database.md](./02_database.md)** - データベーススキーマ作成
3. **[03_frontend.md](./03_frontend.md)** - フロントエンド基盤
4. **[09_ui_design.md](./09_ui_design.md)** - UI コンポーネント実装
5. **[04_backend_scraping.md](./04_backend_scraping.md)** - URL スクレイピング機能
6. **[08_playlist.md](./08_playlist.md)** - プレイリスト機能
7. **[07_transpose.md](./07_transpose.md)** - 転調機能
8. **[05_autoscroll.md](./05_autoscroll.md)** - オートスクロール機能
9. **[06_metronome.md](./06_metronome.md)** - メトロノーム機能
