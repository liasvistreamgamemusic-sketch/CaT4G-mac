use crate::error::FetchError;
use crate::parsers::{FetchedChord, FetchedChordSheet, FetchedLine, FetchedSection};
use scraper::{ElementRef, Html, Selector};

pub fn parse(html: &str) -> Result<FetchedChordSheet, FetchError> {
    let document = Html::parse_document(html);
    let mut sheet = FetchedChordSheet::new(String::new());

    // Title: h1.title
    let title_selector = Selector::parse("h1.title")
        .map_err(|_| FetchError::ParseError("Invalid title selector".to_string()))?;
    sheet.title = document.select(&title_selector).next().map(|el| {
        el.text()
            .collect::<String>()
            .trim()
            .to_string()
    });

    // Artist: h2.subtitle - extract from "歌：アーティスト名　作詞・作曲：..."
    let subtitle_selector = Selector::parse("h2.subtitle")
        .map_err(|_| FetchError::ParseError("Invalid subtitle selector".to_string()))?;
    sheet.artist = document
        .select(&subtitle_selector)
        .next()
        .map(|el| extract_artist(&el.text().collect::<String>()));

    // Key: p.key - extract from "Key: Eb" format
    let key_selector = Selector::parse("p.key")
        .map_err(|_| FetchError::ParseError("Invalid key selector".to_string()))?;
    sheet.key = document.select(&key_selector).next().and_then(|el| {
        let text = el.text().collect::<String>();
        text.strip_prefix("Key:")
            .or_else(|| text.strip_prefix("Key："))
            .map(|s| s.trim().to_string())
    });

    // Parse main content
    let main_selector = Selector::parse("div.main")
        .map_err(|_| FetchError::ParseError("Invalid main selector".to_string()))?;

    let main_div = document
        .select(&main_selector)
        .next()
        .ok_or_else(|| FetchError::ElementNotFound("div.main not found".to_string()))?;

    // Parse all p.line elements
    let line_selector = Selector::parse("p.line")
        .map_err(|_| FetchError::ParseError("Invalid line selector".to_string()))?;

    let mut sections: Vec<FetchedSection> = Vec::new();
    let mut current_section = FetchedSection::new("Intro");

    for line_el in main_div.select(&line_selector) {
        let classes: Vec<&str> = line_el.value().classes().collect();

        if classes.contains(&"comment") {
            // Comment line - could be a section marker
            let text = extract_comment_text(&line_el);
            if !text.is_empty() {
                // Save current section if it has lines
                if !current_section.lines.is_empty() {
                    sections.push(current_section);
                }
                current_section = FetchedSection::new(&text);
            }
        } else {
            // Regular chord/lyrics line
            let (lyrics, chords) = parse_line_content(&line_el);
            if !lyrics.is_empty() || !chords.is_empty() {
                current_section.lines.push(FetchedLine::with_chords(&lyrics, chords));
            }
        }
    }

    // Push the last section
    if !current_section.lines.is_empty() {
        sections.push(current_section);
    }

    // Ensure at least one section exists
    if sections.is_empty() {
        sections.push(FetchedSection::new("Main"));
    }

    sheet.sections = sections;
    Ok(sheet)
}

/// Extract artist name from subtitle like "歌：レミオロメン　作詞・作曲：藤巻亮太"
fn extract_artist(subtitle: &str) -> String {
    let trimmed = subtitle.trim();

    // Try to extract after "歌：" or "歌:"
    if let Some(pos) = trimmed.find("歌：").or_else(|| trimmed.find("歌:")) {
        let after_prefix = &trimmed[pos + "歌：".len()..];
        // Take until the next delimiter (space, tab, 　, 作詞, 作曲)
        let end_pos = after_prefix
            .find(|c| c == '　' || c == '\t' || c == ' ')
            .or_else(|| after_prefix.find("作詞"))
            .or_else(|| after_prefix.find("作曲"))
            .unwrap_or(after_prefix.len());
        return after_prefix[..end_pos].trim().to_string();
    }

    // Fallback: return the whole subtitle
    trimmed.to_string()
}

/// Extract text from comment line (inside <strong> or <i> tags)
fn extract_comment_text(el: &ElementRef) -> String {
    // First try to get text from <strong> tag
    if let Ok(strong_sel) = Selector::parse("strong") {
        if let Some(strong_el) = el.select(&strong_sel).next() {
            let text = strong_el.text().collect::<String>().trim().to_string();
            if !text.is_empty() {
                return text;
            }
        }
    }

    // Fallback to all text content
    el.text().collect::<String>().trim().to_string()
}

/// Parse a line element to extract lyrics and chords with positions
fn parse_line_content(el: &ElementRef) -> (String, Vec<FetchedChord>) {
    let mut lyrics = String::new();
    let mut chords: Vec<FetchedChord> = Vec::new();

    // Iterate through child elements in order
    for child in el.children() {
        if let Some(element) = child.value().as_element() {
            let tag_name = element.name();

            if tag_name == "span" {
                let classes: Vec<&str> = element.classes().collect();
                let child_ref = ElementRef::wrap(child).unwrap();
                let text = child_ref.text().collect::<String>();

                if classes.contains(&"chord") {
                    // Chord span - extract chord name
                    let chord_name = text.trim();
                    // Skip bar lines, accent marks, and empty chords
                    if !chord_name.is_empty()
                        && chord_name != "|"
                        && chord_name != ">"
                        && chord_name != "<"
                        && !chord_name.starts_with('|')
                    {
                        let position = lyrics.chars().count() as i32;
                        chords.push(FetchedChord::new(chord_name, position));
                    }
                } else if classes.contains(&"word") || classes.contains(&"wordtop") {
                    // Word/lyrics span
                    lyrics.push_str(&text);
                }
            }
        } else if let Some(text_node) = child.value().as_text() {
            // Direct text node (like &nbsp;)
            let text = text_node.trim();
            if !text.is_empty() {
                lyrics.push_str(text);
            }
        }
    }

    // Trim the lyrics but preserve internal spacing
    let lyrics = lyrics.trim().to_string();

    (lyrics, chords)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_artist_standard() {
        let subtitle = "歌：レミオロメン　作詞・作曲：藤巻亮太";
        assert_eq!(extract_artist(subtitle), "レミオロメン");
    }

    #[test]
    fn test_extract_artist_with_space() {
        let subtitle = "歌：Mr.Children 作詞・作曲：桜井和寿";
        assert_eq!(extract_artist(subtitle), "Mr.Children");
    }

    #[test]
    fn test_extract_artist_no_prefix() {
        let subtitle = "BUMP OF CHICKEN";
        assert_eq!(extract_artist(subtitle), "BUMP OF CHICKEN");
    }

    #[test]
    fn test_parse_simple_html() {
        let html = r#"
        <html>
        <body>
        <div class="main">
            <h1 class="title">テスト曲</h1>
            <h2 class="subtitle">歌：テストアーティスト　作詞・作曲：テスト作者</h2>
            <p class="line">
                <span class="chord">C</span>
                <span class="word">こんにちは</span>
                <span class="chord">G</span>
                <span class="word">世界</span>
            </p>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        assert_eq!(result.title, Some("テスト曲".to_string()));
        assert_eq!(result.artist, Some("テストアーティスト".to_string()));
        assert_eq!(result.sections.len(), 1);
        assert_eq!(result.sections[0].lines.len(), 1);

        let line = &result.sections[0].lines[0];
        assert_eq!(line.lyrics, "こんにちは世界");
        assert_eq!(line.chords.len(), 2);
        assert_eq!(line.chords[0].chord, "C");
        assert_eq!(line.chords[0].position, 0);
        assert_eq!(line.chords[1].chord, "G");
        assert_eq!(line.chords[1].position, 5); // After "こんにちは" (5 chars)
    }

    #[test]
    fn test_parse_with_sections() {
        let html = r#"
        <html>
        <body>
        <div class="main">
            <h1 class="title">セクションテスト</h1>
            <p class="line comment"><strong>イントロ</strong></p>
            <p class="line">
                <span class="chord">Am</span>
                <span class="word">----</span>
            </p>
            <p class="line comment"><strong>Aメロ</strong></p>
            <p class="line">
                <span class="chord">C</span>
                <span class="word">歌詞です</span>
            </p>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        assert_eq!(result.sections.len(), 2);
        assert_eq!(result.sections[0].name, "イントロ");
        assert_eq!(result.sections[1].name, "Aメロ");
    }

    #[test]
    fn test_parse_bar_lines() {
        let html = r#"
        <html>
        <body>
        <div class="main">
            <p class="line">
                <span class="wordtop">|</span>
                <span class="chord">Gadd9</span>
                <span class="word">---- --</span>
                <span class="chord">Gsus4</span>
                <span class="word">--|</span>
            </p>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        let line = &result.sections[0].lines[0];
        assert_eq!(line.chords.len(), 2);
        assert_eq!(line.chords[0].chord, "Gadd9");
        assert_eq!(line.chords[1].chord, "Gsus4");
    }

    #[test]
    fn test_parse_complex_chords() {
        let html = r#"
        <html>
        <body>
        <div class="main">
            <p class="line">
                <span class="chord">F#m7</span>
                <span class="word">テスト</span>
                <span class="chord">Bb/D</span>
                <span class="word">歌詞</span>
                <span class="chord">C#dim</span>
                <span class="word">です</span>
            </p>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        let line = &result.sections[0].lines[0];
        assert_eq!(line.chords.len(), 3);
        assert_eq!(line.chords[0].chord, "F#m7");
        assert_eq!(line.chords[1].chord, "Bb/D");
        assert_eq!(line.chords[2].chord, "C#dim");
    }

    #[test]
    fn test_parse_lyrics_with_chords_positions() {
        let html = r#"
        <html>
        <body>
        <div class="main">
            <p class="line">
                <span class="chord">|</span>&nbsp;
                <span class="chord">Gadd9</span>
                <span class="word">粉雪舞</span>
                <span class="chord">|</span>
                <span class="word">う季節はい</span>
                <span class="chord">|</span>&nbsp;
                <span class="chord">Em7</span>
                <span class="word">つもすれ</span>
            </p>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        let line = &result.sections[0].lines[0];

        // Should have Gadd9 and Em7 chords (| is skipped)
        assert_eq!(line.chords.len(), 2);
        assert_eq!(line.chords[0].chord, "Gadd9");
        assert_eq!(line.chords[1].chord, "Em7");

        // Lyrics should contain the words
        assert!(line.lyrics.contains("粉雪舞"));
        assert!(line.lyrics.contains("う季節はい"));
        assert!(line.lyrics.contains("つもすれ"));
    }

    #[test]
    fn test_parse_empty_main() {
        let html = r#"
        <html>
        <body>
        <div class="main">
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        assert_eq!(result.sections.len(), 1);
        assert_eq!(result.sections[0].name, "Main");
    }

    #[test]
    fn test_parse_no_main_div() {
        let html = r#"
        <html>
        <body>
        <p>No main div</p>
        </body>
        </html>
        "#;

        let result = parse(html);
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_comment_with_bpm() {
        let html = r#"
        <html>
        <body>
        <div class="main">
            <p class="line comment"><strong>BPM=82　4/4拍子</strong></p>
            <p class="line">
                <span class="chord">C</span>
                <span class="word">歌詞</span>
            </p>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        assert_eq!(result.sections[0].name, "BPM=82　4/4拍子");
    }

    #[test]
    fn test_parse_full_example() {
        let html = r#"
        <html>
        <body>
        <div class="main">
            <h1 class="title">粉雪　(ドラマ「1リットルの涙」挿入歌)</h1>
            <h2 class="subtitle">歌：レミオロメン　作詞・作曲：藤巻亮太</h2>
            <p class="line comment"><strong>BPM=82　4/4拍子</strong></p>
            <p class="line comment"><strong><i>E.Gt &amp; Pf &amp; Synth Only</i></strong></p>
            <p class="line">
                <span class="wordtop">|</span>
                <span class="chord" onclick="javascript:popupImage('/cd/Gadd9.png', event);">Gadd9</span>
                <span class="word">---- --</span>
                <span class="chord" onclick="javascript:popupImage('/cd/Gsus4.png', event);">Gsus4</span>
                <span class="word">--|</span>
            </p>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();

        assert_eq!(result.title, Some("粉雪　(ドラマ「1リットルの涙」挿入歌)".to_string()));
        assert_eq!(result.artist, Some("レミオロメン".to_string()));

        // First section should be BPM comment, second should be instrument comment
        assert!(result.sections.len() >= 1);

        // Check that we have chord data
        let mut found_chords = false;
        for section in &result.sections {
            for line in &section.lines {
                if !line.chords.is_empty() {
                    found_chords = true;
                    // Verify we found Gadd9 and Gsus4
                    let chord_names: Vec<&str> = line.chords.iter().map(|c| c.chord.as_str()).collect();
                    assert!(chord_names.contains(&"Gadd9") || chord_names.contains(&"Gsus4"));
                }
            }
        }
        assert!(found_chords, "Should have found chords in the parsed result");
    }
}
