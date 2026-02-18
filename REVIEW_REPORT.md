# CaT4G 総合レビュー・検証レポート

**実施日**: 2026-02-08
**対象プロジェクト**: CaT4G (Chords and Tabs for Guitar)
**技術スタック**: Tauri 2.0 + React 18 + TypeScript + Rust + SQLite/Supabase

---

## エージェントチーム構成

| # | エージェント | 担当領域 | 評価 |
|---|---|---|---|
| 1 | Guitar Theory Reviewer | コード理論・フィンガリング検証 | 良好（バグ数件あり） |
| 2 | Infrastructure Reviewer | インフラ・セキュリティ・依存関係 | B+ |
| 3 | Senior Code Reviewer | コード品質・アーキテクチャ | C+ |
| 4 | Best Practices Reviewer | ベストプラクティス準拠度 | 62/100 |
| 5 | Manager (統括) | 結果統合・優先度付け | - |

---

## 総合評価サマリー

### スコアカード

| 観点 | 評価 | 備考 |
|---|---|---|
| **ギターコード理論** | B+ | 95%以上のコードをカバー。数件のフィンガリングバグあり |
| **インフラ・セキュリティ** | B+ | デュアルバックエンド設計は優秀。CSP無効化が最大リスク |
| **コード品質・アーキテクチャ** | C+ | God Componentパターンが最大のボトルネック |
| **ベストプラクティス準拠** | 62/100 | React 55, TS 72, Rust 68, 一般 56 |
| **テスト** | F | フロントエンドテスト完全不在（Rustパーサーのみ有） |

---

## Critical Issues（即時対応必須）

### CRIT-1: CSP (Content Security Policy) が無効化されている
- **検出**: Infrastructure Reviewer
- **ファイル**: `src-tauri/tauri.conf.json:25-26`
- **内容**: `"csp": null` でCSPが完全に無効化。スクレイピングで外部HTMLを取得するアプリでXSS攻撃のベクターとなる
- **修正案**:
```json
"csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://ufret.jp https://j-total.net https://gakufu.gakki.me https://chordwiki.org"
```

### CRIT-2: Supabase検索クエリのフィルタインジェクション
- **検出**: Infrastructure Reviewer, Senior Reviewer
- **ファイル**: `src/lib/api/supabase/database.ts:198`
- **内容**: `.or(\`title.ilike.%${query}%,...\`)` でユーザー入力が直接フィルタに補間される。PostgREST構文を操作可能
- **修正案**: 特殊文字のエスケープ、または個別の `.ilike()` チェーンに変更

### CRIT-3: God Component パターン（App.tsx: 931行）
- **検出**: Senior Reviewer, Best Practices Reviewer
- **ファイル**: `src/App.tsx:33-930`
- **内容**: `AppContent` に40個以上の `useState`。全状態がトップレベルに集約され、任意の変更で全子コンポーネントが再レンダリング
- **修正案**: Zustand等の状態管理ライブラリ導入 + ドメイン別カスタムフック分離
  - `useSongStore` (曲管理)
  - `usePlaybackStore` (再生制御)
  - `useUIStore` (モーダル・サイドバー)

### CRIT-4: ErrorBoundary / Suspense が一切ない
- **検出**: Best Practices Reviewer
- **ファイル**: `src/main.tsx`, `src/App.tsx`
- **内容**: 未処理エラーでアプリ全体がクラッシュ。デスクトップアプリとして致命的
- **修正案**: ルートおよび主要セクションにErrorBoundary設置

### CRIT-5: Regex毎回コンパイル（Rustパーサー）
- **検出**: Infrastructure Reviewer, Senior Reviewer, Best Practices Reviewer（全3エージェント一致）
- **ファイル**: `src-tauri/src/parsers/ufret.rs:518-523`, `src-tauri/src/parsers/jtotal.rs:127-132`
- **内容**: `is_valid_chord()` が呼び出し毎に `Regex::new()` を実行。1曲のパースで数百回以上のコンパイル
- **修正案**: `std::sync::LazyLock` or `once_cell::sync::Lazy` でstatic化

### CRIT-6: テスト完全不在（フロントエンド）
- **検出**: Senior Reviewer
- **内容**: ユニットテスト、統合テスト、E2Eテストが一切存在しない
- **修正案**: Vitest + React Testing Library 導入（後述のテスト戦略参照）

---

## High Issues（早期対応推奨）

### HIGH-1: A#m7 フィンガリングがFm7と同一（音が間違う）
- **検出**: Guitar Theory Reviewer
- **ファイル**: `src/lib/chords/database.ts:530-546`
- **内容**: A#m7のフレットが `[1,1,1,1,3,1]` = Fm7のパターン。正しくは `[6,6,6,6,8,6]`
- **影響**: 実際に間違った音が鳴る

### HIGH-2: Am6 開放フォームで6th音（F#）が欠落
- **検出**: Guitar Theory Reviewer
- **ファイル**: `src/lib/chords/cagedChords.ts:449`
- **内容**: `frets: [0,1,2,2,0,null]` にF#が含まれない。`[2,1,2,2,0,null]` が正しい
- **影響**: Am6コードとして不正確な音が鳴る

### HIGH-3: A6 barreStrings が不正
- **検出**: Guitar Theory Reviewer
- **ファイル**: `src/lib/chords/cagedChords.ts:538`
- **内容**: `barreStrings: [4, 4]` は範囲が1弦のみ。`[0, 3]` が正しい
- **影響**: コードダイアグラム表示のバグ

### HIGH-4: buildIntervalsFromQuality の演算子優先度バグ
- **検出**: Guitar Theory Reviewer
- **ファイル**: `src/lib/chords/generator.ts:162, 180`
- **内容**: `||` と `&&` の優先度により意図しない条件評価。括弧追加で修正
- **影響**: フォールバック関数のため影響は限定的

### HIGH-5: HTTP Clientが毎リクエスト新規作成
- **検出**: Infrastructure Reviewer
- **ファイル**: `src-tauri/src/http.rs:47-49`
- **内容**: コネクションプーリング無効。TLSセッション再利用不可
- **修正案**: LazyLock で static Client を共有

### HIGH-6: URL検証なしでHTTPリクエスト（SSRF リスク）
- **検出**: Infrastructure Reviewer
- **ファイル**: `src-tauri/src/lib.rs:28-39`
- **内容**: `fetch_chord_sheet` が任意URL文字列を受け付ける。file:// やイントラネットURLの可能性
- **修正案**: `url` クレートでURL解析、HTTPS + 許可ドメインのみ通過

### HIGH-7: Cargo.lock / package-lock.json が .gitignore に含まれる
- **検出**: Infrastructure Reviewer
- **ファイル**: `.gitignore:2, 50`
- **内容**: アプリケーションではロックファイルをコミットすべき。再現性のあるビルドが不可能
- **修正案**: .gitignore から除外してコミット

### HIGH-8: N+1 クエリ問題（getSongById）
- **検出**: Infrastructure Reviewer, Senior Reviewer
- **ファイル**: `src/lib/api/tauri/database.ts:329-338`, `src/lib/api/supabase/database.ts:105-112`
- **内容**: セクション毎にlinesを個別取得。10セクションで10+クエリ
- **修正案**: JOINで一括取得、クライアント側でグルーピング

### HIGH-9: TimeSignature型が4箇所に重複定義
- **検出**: Best Practices Reviewer
- **ファイル**: `src/types/database.ts:13`, `FloatingControlBar.tsx:6`, `ControlBar.tsx:3`, `useMetronome.ts:3`
- **修正案**: `@/types/database` からの単一インポートに統一

### HIGH-10: React.memo が一切使用されていない
- **検出**: Best Practices Reviewer
- **内容**: 40+ useState を持つ AppContent の子コンポーネントが全て非メモ化
- **修正案**: `PlayableChordLine`, `SongItem`, `ChordDiagramHorizontal` 等にReact.memo適用

### HIGH-11: SongView.tsx の責務過多（1165行）
- **検出**: Senior Reviewer, Best Practices Reviewer
- **ファイル**: `src/components/SongView.tsx`
- **内容**: 再生・編集・保存・ダイアログが混在
- **修正案**: `SongPlayView` + `SongEditView` + `useSongEditor` フックに分離

### HIGH-12: useRealtimeSync の Ref値がUI再レンダーをトリガーしない
- **検出**: Senior Reviewer
- **ファイル**: `src/hooks/useRealtimeSync.ts`
- **内容**: `isConnected`/`error` がuseRefで管理されUIに反映されない

---

## Medium Issues（計画的対応）

| # | 内容 | ファイル | 検出元 |
|---|---|---|---|
| M-1 | スキーマ定義の二重管理（migration vs inline SQL） | `database.ts` vs `migrations/` | Infra |
| M-2 | Supabase Annotations が未実装スタブ | `supabase/database.ts:740-765` | Infra, Senior |
| M-3 | incrementPlayCount のレースコンディション | `supabase/database.ts:310-331` | Infra, Senior |
| M-4 | tokio "full" feature が過剰 | `Cargo.toml:23` | Infra |
| M-5 | reqwest 依存の重複 | `Cargo.toml:20,25` | Infra |
| M-6 | FloatingControlBar のインラインスタイル操作 | `FloatingControlBar.tsx` | Senior, BP |
| M-7 | Sidebar 内部に SongItem 定義（200行超） | `Sidebar.tsx:524-728` | Senior, BP |
| M-8 | メトロノームBPM変更時のビートギャップ | `useMetronome.ts` | Senior |
| M-9 | eslint-disable 抑制（5箇所） | 各hooks | Senior, BP |
| M-10 | handlersオブジェクトの参照不安定 | `useKeyboardShortcuts.ts` | Senior |
| M-11 | 型定義（database.ts + supabase.ts）の重複 | `src/types/` | Senior |
| M-12 | マジックナンバー散在 | 複数ファイル | Senior, BP |
| M-13 | Gadd9 指番号の非標準 | `database.ts:735` | Guitar |
| M-14 | 転調 isFlat 判定がコード品質名の b にも反応 | `transpose.ts:129` | Guitar |
| M-15 | normalizeQuality の aug→+ 変換の不整合 | `utils.ts:92` | Guitar |
| M-16 | AddSongModal.tsx 過大（802行） | `AddSongModal.tsx` | BP |
| M-17 | `as TimeSignature` 型アサーションが未検証 | 5箇所 | BP |
| M-18 | 非推奨 database.ts のre-export残存 | `src/lib/database.ts` | Senior |
| M-19 | 分数コードパターン名の不整合 | `data/types.ts`, `theory/slashChords.ts` | Guitar |

---

## Low Issues（リファクタリング時に対応）

| # | 内容 | 検出元 |
|---|---|---|
| L-1 | Docker Build が root ユーザー | Infra |
| L-2 | Vite sourcemap が本番で無効 | Infra |
| L-3 | ESLint設定ファイル未検出 | Infra |
| L-4 | Docker npm install が毎起動実行 | Infra |
| L-5 | guessKeyFromChords が単純すぎる | Guitar |
| L-6 | ROOT_TO_FRET_4STRING の一部エントリ欠落 | Guitar |
| L-7 | i18n 未対応（日本語ハードコード） | Senior |
| L-8 | JSON.stringify による比較 | Senior |
| L-9 | console.log が本番コードに残存 | BP |
| L-10 | ControlBar.tsx が FloatingControlBar の旧版？ | BP |
| L-11 | ローディング状態の欠如 | BP |

---

## 良い実践例（プロジェクトの強み）

### アーキテクチャ
- **API抽象化層** (`src/lib/api/`): Tauri/Supabase のデュアルバックエンド切替が環境変数一つで可能。遅延読み込みにより不要なコードがバンドルされない
- **コードライブラリ設計** (`src/lib/chords/`): CAGED → Standard → Database → Generator の階層的フォールバックは優秀

### TypeScript
- **strict: true** 全有効、`noUnusedLocals`, `noUnusedParameters` も設定済み
- **包括的な型定義**: エンティティ型・入力型・行型の体系的定義

### Rust
- **thiserror によるエラー型定義**: 適切なカスタムエラー列挙型
- **パーサーのテストカバレッジ**: 各パーサーに `#[cfg(test)]` モジュールあり
- **リリースプロファイル**: `lto = true`, `codegen-units = 1`, `strip = true` で最適化済み

### React
- **useUndoRedo フック**: Ref ベースのスタックによる洗練された Undo/Redo 実装
- **スケーリングシステム**: `scaling.ts` + `useContainerScale.ts` の純関数設計
- **forwardRef の適切な使用**: SongView でのスクロール制御

---

## 改善アクションプラン

### Phase 1: 緊急対応（即時）
| 優先度 | アクション | 工数 |
|---|---|---|
| P0 | CSP設定を有効化 | S |
| P0 | Rust Regex を LazyLock で static 化 | S |
| P0 | 共通パーサーユーティリティ抽出 (`parsers/common.rs`) | S |
| P0 | ErrorBoundary をアプリルートに追加 | S |
| P0 | A#m7 フィンガリング修正 | S |
| P0 | Am6 開放フォーム修正（6th音追加） | S |
| P0 | Supabase検索のフィルタインジェクション対策 | S |

### Phase 2: アーキテクチャ改善（短期）
| 優先度 | アクション | 工数 |
|---|---|---|
| P1 | App.tsx をドメイン別フック/コンテキストに分解 | L |
| P1 | 状態管理ライブラリ（Zustand推奨）導入 | M |
| P1 | TimeSignature 型を単一ソースに統合 | S |
| P1 | React.memo を主要コンポーネントに適用 | S |
| P1 | SongView を Play/Edit に分離 | M |
| P1 | Cargo.lock / package-lock.json をコミット | S |
| P1 | HTTP Client の static 化 | S |
| P1 | URL 検証追加（SSRF対策） | S |

### Phase 3: コード品質改善（中期）
| 優先度 | アクション | 工数 |
|---|---|---|
| P2 | Vitest + React Testing Library 環境構築 | M |
| P2 | 転調・コード生成のユニットテスト作成 | M |
| P2 | N+1クエリ解消（getSongById） | M |
| P2 | AddSongModal / Sidebar のコンポーネント分割 | M |
| P2 | 型定義重複の解消 | S |
| P2 | eslint-disable の理由文書化 or 修正 | M |
| P2 | 非推奨 database.ts 削除 | S |
| P2 | incrementPlayCount アトミック化 | S |

### Phase 4: 長期改善
| 優先度 | アクション | 工数 |
|---|---|---|
| P3 | ローディング状態・エラーフィードバックUI | M |
| P3 | マジックナンバーの定数化 | S |
| P3 | デッドコード削除 | S |
| P3 | Suspense boundaries の追加 | S |
| P3 | Supabase Annotations の実装 or 削除 | M |

**工数目安**: S = 1時間未満, M = 1-4時間, L = 4時間以上

---

## Web版移行に向けた提案

### 現状の強み
- デュアルバックエンドAPI層が既に構築済み
- Supabase実装がほぼ完成（RLS対応含む）
- 環境変数1つでバックエンド切替可能

### 残作業
1. Supabase Annotations 実装
2. PostgreSQL マイグレーション整備
3. Edge Functions によるサーバーサイドスクレイピング（CORS対策）
4. 認証UI構築
5. PWA対応（Service Worker + Web App Manifest）

### 推奨デプロイ構成
- **フロントエンド**: Vercel（Vite SPA）
- **バックエンド**: Supabase（PostgreSQL + Auth + Edge Functions）
- **スクレイピング**: Supabase Edge Functions or Cloudflare Workers

---

## テスト戦略提案

### Phase 1: 基盤（最優先）
- Vitest + React Testing Library 導入
- `vitest.config.ts` 作成
- CI/CD にテスト実行追加

### Phase 2: ユニットテスト（高優先）
1. `transpose.ts` - 純関数、テスト容易
2. `generator.ts` - エッジケース多数
3. `supabase/database.ts` - モック必要
4. `parsers/*.rs` - `cargo test`（既存テスト拡充）
5. `useUndoRedo.ts` - ロジック集約

### Phase 3: 統合テスト（中優先）
- バックエンド切替テスト
- コード表示→転調→更新フロー

### Phase 4: E2Eテスト（低優先）
- Playwright + Tauri Driver
- 基本操作フロー

---

## 問題件数サマリー

| 重要度 | 件数 | 主な内容 |
|---|---|---|
| **Critical** | 6 | CSP無効、SQLインジェクション、God Component、ErrorBoundary不在、Regex再コンパイル、テスト不在 |
| **High** | 12 | コードフィンガリングバグ、SSRF、N+1クエリ、ロックファイル、型重複、React.memo不在 |
| **Medium** | 19 | スキーマ二重管理、スタブ実装、レースコンディション、コンポーネント過大 |
| **Low** | 11 | Docker設定、i18n、デッドコード |
| **合計** | **48** | |

---

*本レポートは5エージェントによる並列レビューの統合結果です。各エージェントの詳細な分析結果はチームメッセージログに保存されています。*
