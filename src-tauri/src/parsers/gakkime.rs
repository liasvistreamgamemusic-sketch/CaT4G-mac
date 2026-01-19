//! Parser for 楽器.me (gakufu.gakki.me)
//!
//! HTML structure (actual):
//! - Title/Artist: `<h2 class="tit"><span>「タイトル」</span><small>アーティスト</small></h2>`
//! - Chord area: `<div id="chord_area">`
//! - Each chord unit: `<div class="cd_1line">`
//!   - Chord: `<div class="cd_pic cd_font"><span class="cd_fontpos">C<br /><img ...></span></div>`
//!   - Lyrics: `<div class="cd_pic blue"><div class="cd_txt">歌</div><div class="cd_txt">詞</div></div>`
//! - Paragraph separator: `<div style='clear: both;'></div>`
//!
//! Important: Multiple cd_1line elements are concatenated into a single line.
//! Paragraph breaks are marked by elements with `clear: both` style.

use crate::error::FetchError;
use crate::parsers::{FetchedChord, FetchedChordSheet, FetchedLine, FetchedSection};
use scraper::{Html, Selector};

/// Parse HTML from 楽器.me (gakufu.gakki.me)
pub fn parse(html: &str) -> Result<FetchedChordSheet, FetchError> {
    let document = Html::parse_document(html);
    let mut sheet = FetchedChordSheet::new(String::new());

    // Title: h2.tit > span (remove 「」 brackets)
    let title_selector = Selector::parse("h2.tit > span")
        .map_err(|_| FetchError::ParseError("Invalid title selector".to_string()))?;
    sheet.title = document.select(&title_selector).next().map(|el| {
        let text = el.text().collect::<String>();
        // Remove 「」 brackets
        text.trim()
            .trim_start_matches('「')
            .trim_end_matches('」')
            .to_string()
    });

    // Artist: h2.tit > small
    let artist_selector = Selector::parse("h2.tit > small")
        .map_err(|_| FetchError::ParseError("Invalid artist selector".to_string()))?;
    sheet.artist = document
        .select(&artist_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // Chord area: #chord_area
    let chord_area_selector = Selector::parse("#chord_area")
        .map_err(|_| FetchError::ParseError("Invalid chord_area selector".to_string()))?;
    let chord_area = document
        .select(&chord_area_selector)
        .next()
        .ok_or_else(|| FetchError::ElementNotFound("#chord_area not found".to_string()))?;

    // Selectors for parsing
    let chord_selector = Selector::parse(".cd_fontpos")
        .map_err(|_| FetchError::ParseError("Invalid chord selector".to_string()))?;
    let cd_txt_selector = Selector::parse(".cd_txt")
        .map_err(|_| FetchError::ParseError("Invalid cd_txt selector".to_string()))?;

    // Create a single "Main" section
    let mut main_section = FetchedSection::new("Main");

    // State for accumulating line content across multiple cd_1line elements
    let mut current_lyrics = String::new();
    let mut current_chords: Vec<FetchedChord> = Vec::new();

    // Process each child element in #chord_area in order
    for child in chord_area.children() {
        if let Some(element) = child.value().as_element() {
            let child_ref = match scraper::ElementRef::wrap(child) {
                Some(r) => r,
                None => continue,
            };

            // Check for paragraph separator: elements with `clear: both` in style
            if let Some(style) = element.attr("style") {
                if style.contains("clear") {
                    // Save current line and reset
                    save_line_if_not_empty(
                        &mut main_section.lines,
                        &mut current_lyrics,
                        &mut current_chords,
                    );
                    continue;
                }
            }

            // Process cd_1line elements
            let classes: Vec<&str> = element.classes().collect();
            if classes.contains(&"cd_1line") {
                // Extract chord from cd_fontpos
                if let Some(chord_span) = child_ref.select(&chord_selector).next() {
                    let chord_name = extract_chord_name(&chord_span);
                    if !chord_name.is_empty() && chord_name != "／" && chord_name != "/" {
                        let position = current_lyrics.chars().count() as i32;
                        current_chords.push(FetchedChord::new(&chord_name, position));
                    }
                }

                // Extract lyrics from cd_txt elements (nested inside cd_pic blue)
                for txt_el in child_ref.select(&cd_txt_selector) {
                    let text = txt_el.text().collect::<String>();
                    // Handle &nbsp; as space
                    let text = text.replace('\u{00A0}', " ");
                    current_lyrics.push_str(&text);
                }
            }
        }
    }

    // Save the last line
    save_line_if_not_empty(
        &mut main_section.lines,
        &mut current_lyrics,
        &mut current_chords,
    );

    // Ensure we have at least one section
    if main_section.lines.is_empty() {
        main_section = FetchedSection::new("Main");
    }

    sheet.sections = vec![main_section];

    // key and capo are None (not provided by this site)
    sheet.key = None;
    sheet.capo = None;

    Ok(sheet)
}

/// Save the current line to the lines vector if it has content, then reset
fn save_line_if_not_empty(
    lines: &mut Vec<FetchedLine>,
    lyrics: &mut String,
    chords: &mut Vec<FetchedChord>,
) {
    let trimmed = lyrics.trim().to_string();
    if !trimmed.is_empty() || !chords.is_empty() {
        lines.push(FetchedLine::with_chords(&trimmed, std::mem::take(chords)));
    }
    lyrics.clear();
    chords.clear();
}

/// Extract chord name from span.cd_fontpos
/// The span contains: "C<br /><img src="...">" - we only want text before <br>
fn extract_chord_name(el: &scraper::ElementRef) -> String {
    // Get all text nodes and only take the first one (before <br>)
    for child in el.children() {
        if let Some(text) = child.value().as_text() {
            let chord = text.trim();
            if !chord.is_empty() {
                return chord.to_string();
            }
        }
    }

    // Fallback: get inner_html and split by <br
    let inner = el.inner_html();
    if let Some(pos) = inner.to_lowercase().find("<br") {
        let chord = inner[..pos].trim();
        if !chord.is_empty() {
            return chord.to_string();
        }
    }

    // Last resort: get first text
    el.text().next().map(|s| s.trim().to_string()).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_basic_structure_new_format() {
        // New HTML structure where lyrics are inside cd_pic blue
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「真夏の果実」</span><small>サザンオールスターズ</small></h2>
        <div id="chord_area">
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">C<br /><img src="test.png"></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt cd_width cd_style">涙</div>
                </div>
            </div>
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">GonB<br /><img src="test.png"></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt cd_width cd_style">が</div>
                    <div class="cd_txt cd_width cd_style">あ</div>
                    <div class="cd_txt cd_width cd_style">ふ</div>
                    <div class="cd_txt cd_width cd_style">れ</div>
                </div>
            </div>
            <div style='clear: both;'></div>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();

        assert_eq!(result.title, Some("真夏の果実".to_string()));
        assert_eq!(result.artist, Some("サザンオールスターズ".to_string()));
        assert_eq!(result.sections.len(), 1);
        assert_eq!(result.sections[0].name, "Main");
        assert_eq!(result.sections[0].lines.len(), 1);

        let line = &result.sections[0].lines[0];
        assert_eq!(line.lyrics, "涙があふれ");
        assert_eq!(line.chords.len(), 2);
        assert_eq!(line.chords[0].chord, "C");
        assert_eq!(line.chords[0].position, 0);
        assert_eq!(line.chords[1].chord, "GonB");
        assert_eq!(line.chords[1].position, 1); // After "涙"
    }

    #[test]
    fn test_parse_intro_without_lyrics() {
        // Intro section typically has only chords, no lyrics
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「テスト曲」</span><small>テストアーティスト</small></h2>
        <div id="chord_area">
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <div class="cd_width4 cd_style cd_font">
                        <span class="cd_fontpos">C<br /><img src="test.png"></span>
                    </div>
                    <div class="cd_width cd_style cd_height">／</div>
                </div>
                <div class="cd_pic blue"></div>
            </div>
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <div class="cd_width4 cd_style cd_font">
                        <span class="cd_fontpos">Am<br /><img src="test.png"></span>
                    </div>
                </div>
                <div class="cd_pic blue"></div>
            </div>
            <div style='clear: both;'></div>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();

        assert_eq!(result.sections[0].lines.len(), 1);
        let line = &result.sections[0].lines[0];
        assert_eq!(line.lyrics, ""); // No lyrics
        assert_eq!(line.chords.len(), 2);
        assert_eq!(line.chords[0].chord, "C");
        assert_eq!(line.chords[0].position, 0);
        assert_eq!(line.chords[1].chord, "Am");
        assert_eq!(line.chords[1].position, 0);
    }

    #[test]
    fn test_parse_multiple_paragraphs() {
        // Multiple paragraphs separated by clear:both
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「複数段落」</span><small>テスト</small></h2>
        <div id="chord_area">
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">C<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">1</div>
                    <div class="cd_txt">行</div>
                    <div class="cd_txt">目</div>
                </div>
            </div>
            <div style='clear: both;'></div>
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">G<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">2</div>
                    <div class="cd_txt">行</div>
                    <div class="cd_txt">目</div>
                </div>
            </div>
            <div style='clear: both;'></div>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();

        assert_eq!(result.sections[0].lines.len(), 2);

        let line1 = &result.sections[0].lines[0];
        assert_eq!(line1.lyrics, "1行目");
        assert_eq!(line1.chords[0].chord, "C");

        let line2 = &result.sections[0].lines[1];
        assert_eq!(line2.lyrics, "2行目");
        assert_eq!(line2.chords[0].chord, "G");
    }

    #[test]
    fn test_parse_chord_position_calculation() {
        // Test that chord positions are calculated correctly across multiple cd_1line
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「位置テスト」</span><small>テスト</small></h2>
        <div id="chord_area">
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">Am<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">こ</div>
                    <div class="cd_txt">の</div>
                    <div class="cd_txt">街</div>
                </div>
            </div>
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">G<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">で</div>
                </div>
            </div>
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">F<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">出</div>
                    <div class="cd_txt">会</div>
                    <div class="cd_txt">っ</div>
                    <div class="cd_txt">た</div>
                </div>
            </div>
            <div style='clear: both;'></div>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();

        let line = &result.sections[0].lines[0];
        assert_eq!(line.lyrics, "この街で出会った");
        assert_eq!(line.chords.len(), 3);

        // Am at position 0
        assert_eq!(line.chords[0].chord, "Am");
        assert_eq!(line.chords[0].position, 0);

        // G at position 3 (after "この街")
        assert_eq!(line.chords[1].chord, "G");
        assert_eq!(line.chords[1].position, 3);

        // F at position 4 (after "この街で")
        assert_eq!(line.chords[2].chord, "F");
        assert_eq!(line.chords[2].position, 4);
    }

    #[test]
    fn test_parse_with_nbsp() {
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「スペーステスト」</span><small>テスト</small></h2>
        <div id="chord_area">
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">C<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">&nbsp;</div>
                    <div class="cd_txt">歌</div>
                </div>
            </div>
            <div style='clear: both;'></div>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        let line = &result.sections[0].lines[0];

        // nbsp should be converted to space and lyrics should be trimmed
        assert_eq!(line.lyrics, "歌");
    }

    #[test]
    fn test_parse_no_chord_area() {
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「エラーテスト」</span><small>テスト</small></h2>
        </body>
        </html>
        "#;

        let result = parse(html);
        assert!(result.is_err());

        if let Err(FetchError::ElementNotFound(msg)) = result {
            assert!(msg.contains("chord_area"));
        } else {
            panic!("Expected ElementNotFound error");
        }
    }

    #[test]
    fn test_parse_key_capo_none() {
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「キーテスト」</span><small>テスト</small></h2>
        <div id="chord_area">
            <div class="cd_1line">
                <div class="cd_pic blue">
                    <div class="cd_txt">歌</div>
                </div>
            </div>
            <div style='clear: both;'></div>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();

        assert!(result.key.is_none());
        assert!(result.capo.is_none());
    }

    #[test]
    fn test_skip_separator_slash() {
        // Separator characters like ／ should not be treated as chords
        let html = r#"
        <html>
        <body>
        <h2 class="tit"><span>「区切りテスト」</span><small>テスト</small></h2>
        <div id="chord_area">
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">C<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">歌</div>
                </div>
            </div>
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <div class="cd_width cd_style cd_height">／</div>
                </div>
                <div class="cd_pic blue"></div>
            </div>
            <div class="cd_1line">
                <div class="cd_pic cd_font">
                    <span class="cd_fontpos">G<br /></span>
                </div>
                <div class="cd_pic blue">
                    <div class="cd_txt">詞</div>
                </div>
            </div>
            <div style='clear: both;'></div>
        </div>
        </body>
        </html>
        "#;

        let result = parse(html).unwrap();
        let line = &result.sections[0].lines[0];

        assert_eq!(line.lyrics, "歌詞");
        assert_eq!(line.chords.len(), 2); // Only C and G, not ／
        assert_eq!(line.chords[0].chord, "C");
        assert_eq!(line.chords[1].chord, "G");
    }
}
