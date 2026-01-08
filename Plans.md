# CaT4G - 実装計画

**進捗**: 60/67 (90%) | **現在**: フェーズ9完了 | **仕様**: [specs/](specs/)

---

## フェーズ1: 基盤構築 ✅

- [x] Tauri 2.0 + React + TypeScript + Vite + Tailwind
- [x] Docker 開発環境
- [x] SQLite スキーマ（10テーブル）+ TypeScript型 + DB API
- [x] UI基盤（Layout, Sidebar, MainArea, ControlBar）

## フェーズ2: スクレイピング ✅ [04_backend_scraping.md](specs/04_backend_scraping.md)

- [x] error.rs - FetchError型定義（HTTP, Parse, UnsupportedSite）
- [x] http.rs - HTTPクライアント（User-Agent偽装, 30秒タイムアウト）
- [x] parsers/mod.rs - FetchedChordSheet構造体とモジュール定義
- [x] parsers/ufret.rs - U-Fretパーサー（セクション/行/コード位置）
- [x] parsers/chordwiki.rs - ChordWikiパーサー（ChordPro形式対応）
- [x] parsers/jtotal.rs - J-Totalパーサー
- [x] lib.rs - Tauriコマンド統合（fetch_chord_sheet, get_supported_sites）
- [x] scraper.ts - フロントエンドAPI（invoke ラッパー）
- [x] Cargo.toml - regex依存追加

## フェーズ3: 曲管理 ✅ [03_frontend.md](specs/03_frontend.md)

- [x] ChordLine - コード行表示（転調対応、クリックイベント）
- [x] ChordSheet - コード譜全体表示（セクション、メタデータバッジ）
- [x] AddSongModal - URL取得/手動入力（タブ切替、プレビュー）
- [x] Sidebar - 検索、お気に入りタブ、コンテキストメニュー
- [x] MainArea - ChordSheet統合、空状態表示
- [x] ControlBar - 転調コントロール、オートスクロール、メトロノームUI
- [x] App.tsx - 状態管理（曲選択、追加、削除、お気に入り）
- [x] components/index.ts - エクスポート更新

## フェーズ4: 転調・コード ✅ [07_transpose.md](specs/07_transpose.md)

- [x] lib/chords/types.ts - コード型定義（NoteRoot, ChordFingering, ChordDefinition）
- [x] lib/chords/transpose.ts - 転調ユーティリティ（transposeChord, parseChord, normalizeNote）
- [x] lib/chords/database.ts - コード押さえ方データベース（30+コード定義）
- [x] ChordDiagram.tsx - SVGダイアグラム（バレー、指番号、ミュート対応）
- [x] ChordDiagramModal.tsx - コードクリック時のモーダル表示
- [x] ChordLine更新 - ユーティリティ使用に移行
- [x] App.tsx統合 - コードクリック→ダイアグラム表示

## フェーズ5: オートスクロール ✅ [05_autoscroll.md](specs/05_autoscroll.md)

- [x] hooks/useAutoScroll.ts - 0.5x〜2.0x速度、BPM連動、onReachEnd自動停止
- [x] hooks/useKeyboardShortcuts.ts - Space再生/停止、↑↓速度調整、Home先頭移動
- [x] hooks/index.ts - バレルエクスポート
- [x] MainArea - forwardRefでスクロールコンテナ参照
- [x] App.tsx統合 - 状態管理（isPlaying, scrollSpeed, bpm）

## フェーズ6: メトロノーム ✅ [06_metronome.md](specs/06_metronome.md)

- [x] hooks/useMetronome.ts - Web Audio API（BPM 40-240、拍子4種、音量調整、アクセント拍）
- [x] components/MetronomeBeatIndicator.tsx - 拍子インジケーター（アンバー/パープル強調）
- [x] ControlBar.tsx更新 - 拍子選択、ビートインジケーター、音量スライダー統合
- [x] App.tsx統合 - 状態管理（metronomeEnabled, timeSignature, volume, currentBeat）
- [x] useKeyboardShortcuts.ts更新 - Mキーでメトロノームトグル

## フェーズ7: プレイリスト ✅ [08_playlist.md](specs/08_playlist.md)

- [x] hooks/useDragAndDrop.ts - ドラッグ&ドロップリオーダー（HTML5 DnD API、getDragProps/getDropZoneProps）
- [x] hooks/usePlaylistPlayback.ts - 連続再生（next/previous/playAll/stop、hasNext/hasPrevious）
- [x] components/PlaylistList.tsx - プレイリスト一覧（選択状態、曲数表示、新規作成ボタン）
- [x] components/PlaylistDetail.tsx - プレイリスト詳細（曲リスト、ドラッグ並び替え、連続再生ボタン）
- [x] components/CreatePlaylistModal.tsx - プレイリスト作成モーダル（名前、説明入力）
- [x] components/AddSongsToPlaylistModal.tsx - 曲追加モーダル（検索、複数選択、既存曲除外）
- [x] Sidebar.tsx - プレイリストタブ統合（3タブ構成：すべて/★/リスト）
- [x] App.tsx - プレイリスト状態管理統合（playlists, selectedPlaylistId, handlers）

## フェーズ8: UI仕上げ ✅ [09_ui_design.md](specs/09_ui_design.md)

- [x] tailwind.config.js - slideInアニメーション追加
- [x] src/index.css - グローバルスタイル強化（selection、input-field、badge、text-gradient）
- [x] src/components/icons/index.tsx - SVGアイコンライブラリ（20+アイコン）
- [x] components/SettingsModal.tsx - 設定モーダル（BPM、スクロール速度、メトロノーム設定）
- [x] components/Toast.tsx - トースト通知システム（success/error/info/warning）
- [x] hooks/useToast.ts - トースト状態管理フック

## フェーズ9: リリース ✅ [10_dev_setup.md](specs/10_dev_setup.md)

- [x] README.md - プロジェクト説明（機能、技術スタック、インストール、コマンド、ショートカット）
- [x] CHANGELOG.md - 変更履歴（v0.1.0 全機能記載）
- [x] eslint.config.js - ESLint 9対応設定
- [x] TypeScript/Lintチェック - エラーなし確認

---

## サマリー

| Phase | Tasks | Status |
|-------|-------|--------|
| 1. 基盤 | 12 | ✅ |
| 2. スクレイピング | 9 | ✅ |
| 3. 曲管理 | 8 | ✅ |
| 4. 転調 | 7 | ✅ |
| 5. スクロール | 5 | ✅ |
| 6. メトロノーム | 5 | ✅ |
| 7. プレイリスト | 8 | ✅ |
| 8. UI | 6 | ✅ |
| 9. リリース | 4 | ✅ |

## 完了

全フェーズ完了。

### 次のステップ（オプション）

- `npm run tauri:build` でインストーラー生成
- アプリケーションアイコンの作成・設定
- 追加のコードサイト対応
- エクスポート/インポート機能
