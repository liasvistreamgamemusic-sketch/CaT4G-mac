# CaT4G - URL スクレイピング機能

**状態: 実装必須**

この機能により、URL からコード譜サイトのデータを自動取得してパースできるようになります。

## 対応サイト

| サイト | ドメイン | パース方法 |
|--------|----------|-----------|
| U-Fret | ufret.jp | CSS セレクタによる構造解析 |
| ChordWiki | chordwiki.org | テキストベース解析 |
| J-Total | j-total.net | CSS セレクタによる構造解析 |

## Tauri コマンド

### fetch_chord_sheet

**機能**: URL からコード譜を取得してパース

**シグネチャ**:

```rust
#[tauri::command]
async fn fetch_chord_sheet(url: String) -> Result<FetchedChordSheet, String>
```

**入力**:
- `url`: コード譜サイトの URL

**出力**:

```rust
#[derive(Debug, Serialize, Deserialize)]
struct FetchedChordSheet {
    title: Option<String>,
    artist: Option<String>,
    key: Option<String>,
    capo: Option<i32>,
    sections: Vec<FetchedSection>,
    source_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct FetchedSection {
    name: String,
    lines: Vec<FetchedLine>,
}

#[derive(Debug, Serialize, Deserialize)]
struct FetchedLine {
    lyrics: String,
    chords: Vec<FetchedChord>,
}

#[derive(Debug, Serialize, Deserialize)]
struct FetchedChord {
    chord: String,
    position: i32,
}
```

## パース処理フロー

```
URL 入力
    │
    ▼
サイト判定 (ドメインから)
    │
    ├─ ufret.jp → U-Fret パーサー
    ├─ chordwiki.org → ChordWiki パーサー
    ├─ j-total.net → J-Total パーサー
    └─ その他 → エラー
    │
    ▼
HTTP GET (User-Agent 偽装)
    │
    ▼
HTML パース (scraper クレート)
    │
    ▼
サイト固有のセレクタで要素抽出
    │
    ▼
構造化データに変換
    │
    ▼
FetchedChordSheet 返却
```

## サイト別パーサー実装

### U-Fret パーサー

**セレクタ**:
- タイトル: `.song_title`, `h1`
- アーティスト: `.artist_name`, `.artist`
- キー: `.key`
- カポ: `.capo`
- コード部分: `.chord_area`, `#chord_area`

**パースロジック**:

```rust
// src-tauri/src/parsers/ufret.rs

use scraper::{Html, Selector};

pub fn parse_ufret(html: &str) -> Result<FetchedChordSheet, String> {
    let document = Html::parse_document(html);

    // タイトル取得
    let title_selector = Selector::parse(".song_title, h1").unwrap();
    let title = document
        .select(&title_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // アーティスト取得
    let artist_selector = Selector::parse(".artist_name, .artist").unwrap();
    let artist = document
        .select(&artist_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // コード部分取得
    let chord_area_selector = Selector::parse(".chord_area, #chord_area").unwrap();
    let chord_area = document
        .select(&chord_area_selector)
        .next()
        .ok_or("Chord area not found")?;

    // セクション・行のパース
    let sections = parse_chord_area(chord_area)?;

    Ok(FetchedChordSheet {
        title,
        artist,
        key: None,
        capo: None,
        sections,
        source_url: String::new(),
    })
}

fn parse_chord_area(element: scraper::ElementRef) -> Result<Vec<FetchedSection>, String> {
    let text = element.text().collect::<String>();
    let lines: Vec<&str> = text.lines().collect();

    let mut sections = Vec::new();
    let mut current_section = FetchedSection {
        name: "Intro".to_string(),
        lines: Vec::new(),
    };

    for line in lines {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        // セクションマーカー検出
        if line.starts_with('[') && line.ends_with(']') {
            if !current_section.lines.is_empty() {
                sections.push(current_section);
            }
            current_section = FetchedSection {
                name: line[1..line.len()-1].to_string(),
                lines: Vec::new(),
            };
            continue;
        }

        // コード行か歌詞行かを判定
        if is_chord_line(line) {
            // コード行の処理
            let chords = parse_chord_line(line);
            current_section.lines.push(FetchedLine {
                lyrics: String::new(),
                chords,
            });
        } else {
            // 歌詞行の処理
            if let Some(last_line) = current_section.lines.last_mut() {
                if last_line.lyrics.is_empty() {
                    last_line.lyrics = line.to_string();
                } else {
                    current_section.lines.push(FetchedLine {
                        lyrics: line.to_string(),
                        chords: Vec::new(),
                    });
                }
            } else {
                current_section.lines.push(FetchedLine {
                    lyrics: line.to_string(),
                    chords: Vec::new(),
                });
            }
        }
    }

    if !current_section.lines.is_empty() {
        sections.push(current_section);
    }

    Ok(sections)
}

fn is_chord_line(line: &str) -> bool {
    let tokens: Vec<&str> = line.split_whitespace().collect();
    if tokens.is_empty() {
        return false;
    }
    let chord_count = tokens.iter().filter(|t| is_valid_chord(t)).count();
    (chord_count as f32 / tokens.len() as f32) > 0.5
}

fn is_valid_chord(token: &str) -> bool {
    let chord_pattern = regex::Regex::new(
        r"^[A-G][#b]?(m|M|dim|aug|sus[24]?|add[0-9]+|[0-9]+)?(/[A-G][#b]?)?$"
    ).unwrap();
    chord_pattern.is_match(token)
}

fn parse_chord_line(line: &str) -> Vec<FetchedChord> {
    let mut chords = Vec::new();
    let mut position = 0;

    for token in line.split_whitespace() {
        if is_valid_chord(token) {
            chords.push(FetchedChord {
                chord: token.to_string(),
                position: position as i32,
            });
        }
        position += token.len() + 1; // +1 for space
    }

    chords
}
```

### ChordWiki パーサー

**セレクタ**:
- タイトル: `.song-title h1`
- アーティスト: `.song-artist`
- コード部分: `.chord-lyrics`, `pre`

**パースロジック**:

```rust
// src-tauri/src/parsers/chordwiki.rs

pub fn parse_chordwiki(html: &str) -> Result<FetchedChordSheet, String> {
    let document = Html::parse_document(html);

    // メタデータ行のパース ({title:}, {artist:}, {key:}, {capo:})
    let pre_selector = Selector::parse("pre, .chord-lyrics").unwrap();
    let content = document
        .select(&pre_selector)
        .next()
        .map(|el| el.text().collect::<String>())
        .unwrap_or_default();

    let mut title = None;
    let mut artist = None;
    let mut key = None;
    let mut capo = None;
    let mut sections = Vec::new();

    for line in content.lines() {
        if line.starts_with("{title:") {
            title = Some(line[7..line.len()-1].to_string());
        } else if line.starts_with("{artist:") {
            artist = Some(line[8..line.len()-1].to_string());
        } else if line.starts_with("{key:") {
            key = Some(line[5..line.len()-1].to_string());
        } else if line.starts_with("{capo:") {
            capo = line[6..line.len()-1].parse().ok();
        }
    }

    // インラインコード形式 [C]歌詞[G]歌詞 のパース
    sections = parse_inline_chords(&content)?;

    Ok(FetchedChordSheet {
        title,
        artist,
        key,
        capo,
        sections,
        source_url: String::new(),
    })
}

fn parse_inline_chords(content: &str) -> Result<Vec<FetchedSection>, String> {
    let mut sections = Vec::new();
    let mut current_section = FetchedSection {
        name: "Verse".to_string(),
        lines: Vec::new(),
    };

    let chord_regex = regex::Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();

    for line in content.lines() {
        let line = line.trim();

        // メタデータ行をスキップ
        if line.starts_with('{') && line.ends_with('}') {
            continue;
        }

        if line.is_empty() {
            continue;
        }

        // インラインコードを抽出
        let mut chords = Vec::new();
        let mut lyrics = String::new();
        let mut position = 0;
        let mut last_end = 0;

        for cap in chord_regex.captures_iter(line) {
            let m = cap.get(0).unwrap();
            let chord = cap.get(1).unwrap().as_str();

            // コード前の歌詞を追加
            lyrics.push_str(&line[last_end..m.start()]);
            position = lyrics.len();

            chords.push(FetchedChord {
                chord: chord.to_string(),
                position: position as i32,
            });

            last_end = m.end();
        }

        // 残りの歌詞を追加
        lyrics.push_str(&line[last_end..]);

        if !lyrics.is_empty() || !chords.is_empty() {
            current_section.lines.push(FetchedLine {
                lyrics,
                chords,
            });
        }
    }

    if !current_section.lines.is_empty() {
        sections.push(current_section);
    }

    Ok(sections)
}
```

### J-Total パーサー

**セレクタ**:
- タイトル: `.title`, `h2`
- アーティスト: `.artist`
- コード部分: `.chord-text`, `pre`

```rust
// src-tauri/src/parsers/jtotal.rs

pub fn parse_jtotal(html: &str) -> Result<FetchedChordSheet, String> {
    // U-Fret と類似の構造
    // 実装は U-Fret パーサーをベースに調整
}
```

## エラーハンドリング

```rust
// src-tauri/src/error.rs

#[derive(Debug, thiserror::Error)]
pub enum FetchError {
    #[error("HTTP request failed: {0}")]
    HttpError(#[from] reqwest::Error),

    #[error("Unsupported site: {0}")]
    UnsupportedSite(String),

    #[error("Parse error: {0}")]
    ParseError(String),

    #[error("Element not found: {0}")]
    ElementNotFound(String),
}
```

## HTTP クライアント設定

```rust
// src-tauri/src/http.rs

use reqwest::Client;

pub fn create_client() -> Client {
    Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .expect("Failed to create HTTP client")
}

pub async fn fetch_page(url: &str) -> Result<String, FetchError> {
    let client = create_client();
    let response = client.get(url).send().await?;
    let html = response.text().await?;
    Ok(html)
}
```

## メインコマンド実装

```rust
// src-tauri/src/lib.rs

mod parsers;
mod http;
mod error;

use parsers::{ufret, chordwiki, jtotal};

#[tauri::command]
async fn fetch_chord_sheet(url: String) -> Result<FetchedChordSheet, String> {
    // サイト判定
    let parser = if url.contains("ufret.jp") {
        ufret::parse_ufret
    } else if url.contains("chordwiki.org") {
        chordwiki::parse_chordwiki
    } else if url.contains("j-total.net") {
        jtotal::parse_jtotal
    } else {
        return Err(format!("Unsupported site: {}", url));
    };

    // HTML 取得
    let html = http::fetch_page(&url).await
        .map_err(|e| e.to_string())?;

    // パース
    let mut result = parser(&html).map_err(|e| e.to_string())?;
    result.source_url = url;

    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .invoke_handler(tauri::generate_handler![fetch_chord_sheet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## フロントエンド連携

```typescript
// src/lib/scraper.ts
import { invoke } from '@tauri-apps/api/core';

interface FetchedChordSheet {
  title: string | null;
  artist: string | null;
  key: string | null;
  capo: number | null;
  sections: FetchedSection[];
  source_url: string;
}

interface FetchedSection {
  name: string;
  lines: FetchedLine[];
}

interface FetchedLine {
  lyrics: string;
  chords: FetchedChord[];
}

interface FetchedChord {
  chord: string;
  position: number;
}

export async function fetchChordSheet(url: string): Promise<FetchedChordSheet> {
  return await invoke<FetchedChordSheet>('fetch_chord_sheet', { url });
}
```

## 実装タスク

1. [ ] `src-tauri/src/error.rs` - エラー型定義
2. [ ] `src-tauri/src/http.rs` - HTTP クライアント
3. [ ] `src-tauri/src/parsers/mod.rs` - パーサーモジュール
4. [ ] `src-tauri/src/parsers/ufret.rs` - U-Fret パーサー
5. [ ] `src-tauri/src/parsers/chordwiki.rs` - ChordWiki パーサー
6. [ ] `src-tauri/src/parsers/jtotal.rs` - J-Total パーサー
7. [ ] `src-tauri/src/lib.rs` - Tauri コマンド登録
8. [ ] `src/lib/scraper.ts` - フロントエンド API

## 依存クレート追加

```toml
# Cargo.toml に追加
[dependencies]
reqwest = { version = "0.12", features = ["json"] }
scraper = "0.20"
regex = "1.10"
thiserror = "2.0"
```

## 次のステップ

スクレイピング機能完了後 → [08_playlist.md](./08_playlist.md) でプレイリスト機能を実装
