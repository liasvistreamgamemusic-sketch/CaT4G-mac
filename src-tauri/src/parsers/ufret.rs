use crate::error::FetchError;
use crate::parsers::{FetchedChord, FetchedChordSheet, FetchedLine, FetchedSection};
use regex::Regex;
use scraper::{Html, Selector, ElementRef};
use std::sync::LazyLock;

/// Matches U-Fret's JavaScript variable: var ufret_chord_datas = [...]
static UFRET_CHORD_DATAS_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r#"var\s+ufret_chord_datas\s*=\s*\[([^\]]*(?:\][^\];]*)*)\]"#).unwrap()
});

/// Matches quoted string items within a JavaScript array
static JS_QUOTED_STRING_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r#""((?:[^"\\]|\\.)*)""#).unwrap()
});

/// Matches chord markers like [Am], [G7], [B/D#], etc.
static CHORD_MARKER_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"\[([A-G][#♯b♭]?[^\]]*)\]").unwrap()
});

/// Matches capo indicators like "Capo 4", "カポ4"
static CAPO_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"[Cc]apo\s*(\d+)|カポ\s*(\d+)").unwrap()
});

/// Matches any digit sequence (fallback for capo extraction)
static DIGITS_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"\d+").unwrap()
});

/// Validates chord names like C, Am, G7, F#m, Bb, Dm/F, Cmaj7
static CHORD_PATTERN_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(
        r"^[A-G][#♯b♭]?(m|M|maj|min|dim|aug|sus[24]?|add\d+|\d+|7|9|11|13)?(/[A-G][#♯b♭]?)?$"
    ).unwrap()
});

pub fn parse(html: &str) -> Result<FetchedChordSheet, FetchError> {
    let document = Html::parse_document(html);
    let mut sheet = FetchedChordSheet::new(String::new());

    // Title - Try multiple selectors
    let title_selector = Selector::parse("h1, .song_title, title")
        .map_err(|_| FetchError::ParseError("Invalid title selector".to_string()))?;
    sheet.title = document
        .select(&title_selector)
        .next()
        .map(|el| {
            let text = el.text().collect::<String>();
            // Clean up title - remove " / アーティスト名" part if present
            let cleaned = text.split('/').next().unwrap_or(&text);
            cleaned.trim().to_string()
        });

    // Artist - Try multiple selectors
    let artist_selector = Selector::parse("h2 a, .artist a, a[href*='/artist/']")
        .map_err(|_| FetchError::ParseError("Invalid artist selector".to_string()))?;
    sheet.artist = document
        .select(&artist_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // Key - Try to extract from page
    let key_selector = Selector::parse(".key-info, .original-key, select[name='keyselect'] option[selected]")
        .map_err(|_| FetchError::ParseError("Invalid key selector".to_string()))?;
    sheet.key = document
        .select(&key_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // Capo - U-Fret uses select[name='key_capo'] with values like "-4（Capo 4）"
    // The value attribute contains the numeric offset, text contains "Capo X"
    let capo_selector = Selector::parse("select[name='key_capo'] option[selected]")
        .map_err(|_| FetchError::ParseError("Invalid capo selector".to_string()))?;
    sheet.capo = document
        .select(&capo_selector)
        .next()
        .and_then(|el| {
            // First try the value attribute (e.g., "-4")
            if let Some(val) = el.value().attr("value") {
                if let Ok(num) = val.parse::<i32>() {
                    // Negative value means Capo position (e.g., -4 = Capo 4)
                    if num < 0 {
                        return Some(-num);
                    }
                }
            }
            // Fallback: extract from text like "Capo 4"
            let text = el.text().collect::<String>();
            extract_capo_from_text(&text)
        });

    // U-Fret stores chord data in JavaScript variable: var ufret_chord_datas = [...]
    // We need to extract this from script tags
    if let Some(sections) = extract_ufret_chord_datas(html)? {
        sheet.sections = sections;
        return Ok(sheet);
    }

    // Fallback: Try to parse from DOM elements (for static HTML)
    let content_selectors = [
        "#ufret-chord-data",
        "#chord_area",
        ".chord-area",
        "#contents",
        ".hiragana",
    ];

    let mut chord_area: Option<ElementRef> = None;
    for selector_str in content_selectors {
        if let Ok(selector) = Selector::parse(selector_str) {
            if let Some(el) = document.select(&selector).next() {
                chord_area = Some(el);
                break;
            }
        }
    }

    if let Some(area) = chord_area {
        sheet.sections = parse_ufret_chord_content(area)?;
    } else {
        // Last resort: try to parse all text content
        let text = document.root_element().text().collect::<String>();
        sheet.sections = parse_chord_text(&text)?;
    }

    Ok(sheet)
}

/// Extract chord data from U-Fret's JavaScript variable
/// Format: var ufret_chord_datas = ["[E]\u3000[B\/D#]...", "歌詞行...", ...]
fn extract_ufret_chord_datas(html: &str) -> Result<Option<Vec<FetchedSection>>, FetchError> {
    let captures = match UFRET_CHORD_DATAS_RE.captures(html) {
        Some(c) => c,
        None => return Ok(None),
    };

    let array_content = captures.get(1)
        .ok_or_else(|| FetchError::ParseError("Failed to extract array content".to_string()))?
        .as_str();

    let mut lines: Vec<String> = Vec::new();
    for cap in JS_QUOTED_STRING_RE.captures_iter(array_content) {
        if let Some(m) = cap.get(1) {
            // Unescape the string
            let unescaped = unescape_js_string(m.as_str());
            lines.push(unescaped);
        }
    }

    if lines.is_empty() {
        return Ok(None);
    }

    // Parse the extracted lines
    let sections = parse_ufret_lines(&lines)?;
    Ok(Some(sections))
}

/// Unescape JavaScript string escapes
fn unescape_js_string(s: &str) -> String {
    let mut result = String::new();
    let mut chars = s.chars().peekable();

    while let Some(c) = chars.next() {
        if c == '\\' {
            match chars.next() {
                Some('n') => result.push('\n'),
                Some('r') => result.push('\r'),
                Some('t') => result.push('\t'),
                Some('\\') => result.push('\\'),
                Some('"') => result.push('"'),
                Some('/') => result.push('/'),  // \/ -> /
                Some('\'') => result.push('\''),
                Some('u') => {
                    // Unicode escape: \uXXXX
                    let mut hex = String::new();
                    for _ in 0..4 {
                        if let Some(h) = chars.next() {
                            hex.push(h);
                        }
                    }
                    if let Ok(code) = u32::from_str_radix(&hex, 16) {
                        if let Some(ch) = char::from_u32(code) {
                            result.push(ch);
                        }
                    }
                }
                Some(other) => {
                    // For any other escape, just use the character itself
                    result.push(other);
                }
                None => result.push('\\'),
            }
        } else {
            result.push(c);
        }
    }

    result
}

/// Parse U-Fret chord lines
/// Format: "[Chord]歌詞[Chord]歌詞..." or "[Chord]　[Chord]　[Chord]" (chord only)
fn parse_ufret_lines(lines: &[String]) -> Result<Vec<FetchedSection>, FetchError> {
    let mut sections = Vec::new();
    let mut current_section = FetchedSection::new("Main");
    let chord_re = &*CHORD_MARKER_RE;

    for line in lines {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        // Check if this is a section marker
        if is_section_marker(line) {
            if !current_section.lines.is_empty() {
                sections.push(current_section);
            }
            current_section = FetchedSection::new(line);
            continue;
        }

        // Extract chords and lyrics from the line
        let mut line_chords: Vec<FetchedChord> = Vec::new();
        let mut lyrics = String::new();
        let mut last_end = 0;
        let mut char_position = 0;

        // Check if this is a chord-only line (no lyrics between chords)
        let is_chord_only = {
            let without_chords = chord_re.replace_all(line, "");
            let cleaned = without_chords
                .replace('\u{3000}', "")
                .replace(' ', "")
                .replace('\r', "")
                .replace('\n', "");
            cleaned.is_empty()
        };

        for cap in chord_re.captures_iter(line) {
            let m = cap.get(0).unwrap();
            let chord_name = cap.get(1).unwrap().as_str();

            // Add lyrics/spacing before this chord
            let before = &line[last_end..m.start()];
            let before_clean = before.replace('\u{3000}', " ").replace('\r', "");

            if is_chord_only {
                // For chord-only lines, add spacing between chords
                // Each space or 全角スペース counts as position
                let space_count = before.chars()
                    .filter(|c| *c == ' ' || *c == '\u{3000}')
                    .count();
                if space_count > 0 {
                    // Add spaces to lyrics for visual spacing
                    lyrics.push_str(&" ".repeat(space_count * 2));
                    char_position += space_count * 2;
                }
            } else {
                // For lines with lyrics, add the actual text
                lyrics.push_str(&before_clean);
                char_position += before_clean.chars().count();
            }

            // Add chord at current position
            if !chord_name.is_empty() {
                line_chords.push(FetchedChord::new(chord_name, char_position as i32));

                if is_chord_only {
                    // For chord-only lines, add placeholder space for chord width
                    let chord_width = chord_name.chars().count().max(2);
                    lyrics.push_str(&" ".repeat(chord_width));
                    char_position += chord_width;
                }
            }

            last_end = m.end();
        }

        // Add remaining lyrics after last chord
        if last_end < line.len() {
            let after = &line[last_end..];
            let after_clean = after.replace('\u{3000}', " ").replace('\r', "");
            if !is_chord_only {
                lyrics.push_str(&after_clean);
            }
        }

        // Clean up lyrics (but preserve spaces for chord-only lines)
        let lyrics = if is_chord_only {
            lyrics // Keep spaces for alignment
        } else {
            lyrics.trim().to_string()
        };

        // Add line if it has content
        if !lyrics.is_empty() || !line_chords.is_empty() {
            current_section.lines.push(FetchedLine::with_chords(&lyrics, line_chords));
        }
    }

    if !current_section.lines.is_empty() {
        sections.push(current_section);
    }

    if sections.is_empty() {
        sections.push(FetchedSection::new("Main"));
    }

    Ok(sections)
}

/// Parse U-Fret's chord content
/// U-Fret structure:
/// - .chord-row contains one line of chord/lyrics
/// - p.chord contains one chord+lyrics unit
/// - ruby > rt contains chord name
/// - .col spans contain individual lyrics characters
fn parse_ufret_chord_content(element: ElementRef) -> Result<Vec<FetchedSection>, FetchError> {
    let mut sections = Vec::new();
    let mut current_section = FetchedSection::new("Main");

    // Try to find chord rows first (modern U-Fret structure)
    let row_selector = Selector::parse(".chord-row, .row").ok();
    let chord_unit_selector = Selector::parse("p.chord, .chord").ok();
    let rt_selector = Selector::parse("rt").ok();
    let col_selector = Selector::parse(".col").ok();

    if let Some(ref row_sel) = row_selector {
        let rows: Vec<_> = element.select(row_sel).collect();

        if !rows.is_empty() {
            for row in rows {
                let mut line_lyrics = String::new();
                let mut line_chords: Vec<FetchedChord> = Vec::new();
                let mut char_position = 0;

                // Find chord units within this row
                if let Some(ref unit_sel) = chord_unit_selector {
                    for unit in row.select(unit_sel) {
                        // Extract chord name from rt element
                        let chord_name = if let Some(ref rt_sel) = rt_selector {
                            unit.select(rt_sel)
                                .next()
                                .map(|el| el.text().collect::<String>().trim().to_string())
                        } else {
                            None
                        };

                        // Extract lyrics from .col elements
                        let lyrics_part = if let Some(ref col_sel) = col_selector {
                            unit.select(col_sel)
                                .map(|el| el.text().collect::<String>())
                                .collect::<String>()
                        } else {
                            String::new()
                        };

                        // Add chord if present and valid
                        if let Some(ref chord) = chord_name {
                            if !chord.is_empty() && is_valid_chord(chord) {
                                line_chords.push(FetchedChord::new(chord, char_position as i32));
                            }
                        }

                        // Add lyrics characters
                        line_lyrics.push_str(&lyrics_part);
                        char_position += lyrics_part.chars().count();
                    }
                }

                // Add line if it has content
                if !line_lyrics.is_empty() || !line_chords.is_empty() {
                    current_section.lines.push(FetchedLine::with_chords(
                        line_lyrics.trim(),
                        line_chords,
                    ));
                }
            }

            if !current_section.lines.is_empty() {
                sections.push(current_section);
            }

            if !sections.is_empty() {
                return Ok(sections);
            }
        }
    }

    // Alternative: Try direct rt/ruby parsing (simpler structure)
    if let Some(ref rt_sel) = rt_selector {
        let rt_elements: Vec<_> = element.select(rt_sel).collect();

        if !rt_elements.is_empty() {
            let mut alt_section = FetchedSection::new("Main");
            let mut line_chords: Vec<FetchedChord> = Vec::new();
            let mut position = 0;

            for rt in rt_elements {
                let chord_text = rt.text().collect::<String>();
                let chord_text = chord_text.trim();

                if !chord_text.is_empty() && is_valid_chord(chord_text) {
                    line_chords.push(FetchedChord::new(chord_text, position));
                    position += 4; // Approximate spacing
                }
            }

            // Get all lyrics text from .col or direct text
            let lyrics = if let Some(ref col_sel) = col_selector {
                element.select(col_sel)
                    .map(|el| el.text().collect::<String>())
                    .collect::<String>()
            } else {
                // Fallback to all text content, filtering out chord names
                element.text()
                    .filter(|t| !t.trim().is_empty())
                    .filter(|t| !is_valid_chord(t.trim()))
                    .collect::<String>()
            };

            if !lyrics.is_empty() || !line_chords.is_empty() {
                alt_section.lines.push(FetchedLine::with_chords(
                    lyrics.trim(),
                    line_chords,
                ));
            }

            if !alt_section.lines.is_empty() {
                sections.push(alt_section);
                return Ok(sections);
            }
        }
    }

    // Final fallback: Parse as plain text
    let text = element.text().collect::<String>();
    sections = parse_chord_text(&text)?;

    Ok(sections)
}

fn extract_capo_from_text(text: &str) -> Option<i32> {
    if let Some(cap) = CAPO_RE.captures(text) {
        return cap.get(1).or(cap.get(2))
            .and_then(|m| m.as_str().parse().ok());
    }
    // Fallback: just extract any number
    DIGITS_RE.find(text).and_then(|m| m.as_str().parse().ok())
}

fn parse_chord_text(text: &str) -> Result<Vec<FetchedSection>, FetchError> {
    let lines: Vec<&str> = text.lines().collect();
    let mut sections = Vec::new();
    let mut current_section = FetchedSection::new("Intro");

    for line in lines {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        // Section marker detection [Intro], [Verse], etc.
        if line.starts_with('[') && line.ends_with(']') {
            if !current_section.lines.is_empty() {
                sections.push(current_section);
            }
            let section_name = &line[1..line.len() - 1];
            current_section = FetchedSection::new(section_name);
            continue;
        }

        // Section markers without brackets
        if is_section_marker(line) {
            if !current_section.lines.is_empty() {
                sections.push(current_section);
            }
            current_section = FetchedSection::new(line);
            continue;
        }

        // Determine if chord line or lyrics line
        if is_chord_line(line) {
            let chords = parse_chord_line(line);
            current_section.lines.push(FetchedLine::with_chords("", chords));
        } else {
            // Lyrics line - attach to previous chord line if exists
            if let Some(last_line) = current_section.lines.last_mut() {
                if last_line.lyrics.is_empty() && !last_line.chords.is_empty() {
                    last_line.lyrics = line.to_string();
                } else {
                    current_section.lines.push(FetchedLine::new(line));
                }
            } else {
                current_section.lines.push(FetchedLine::new(line));
            }
        }
    }

    if !current_section.lines.is_empty() {
        sections.push(current_section);
    }

    // Default section if empty
    if sections.is_empty() {
        sections.push(FetchedSection::new("Main"));
    }

    Ok(sections)
}

fn is_section_marker(line: &str) -> bool {
    let markers = [
        "Intro", "イントロ",
        "Verse", "Aメロ", "Bメロ", "Cメロ",
        "Chorus", "サビ",
        "Bridge", "ブリッジ", "間奏",
        "Outro", "アウトロ", "エンディング",
        "Solo", "ソロ", "ギターソロ",
    ];
    markers.iter().any(|m| line.eq_ignore_ascii_case(m) || line.contains(m))
}

fn is_chord_line(line: &str) -> bool {
    let tokens: Vec<&str> = line.split_whitespace().collect();
    if tokens.is_empty() {
        return false;
    }
    let chord_count = tokens.iter().filter(|t| is_valid_chord(t)).count();
    tokens.len() > 0 && (chord_count as f32 / tokens.len() as f32) > 0.5
}

fn is_valid_chord(token: &str) -> bool {
    CHORD_PATTERN_RE.is_match(token)
}

fn parse_chord_line(line: &str) -> Vec<FetchedChord> {
    let mut chords = Vec::new();
    let mut position = 0;

    for token in line.split_whitespace() {
        if is_valid_chord(token) {
            chords.push(FetchedChord::new(token, position as i32));
        }
        position += token.len() + 1;
    }

    chords
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_valid_chord() {
        assert!(is_valid_chord("C"));
        assert!(is_valid_chord("Am"));
        assert!(is_valid_chord("G7"));
        assert!(is_valid_chord("F#m"));
        assert!(is_valid_chord("Bb"));
        assert!(is_valid_chord("Dm/F"));
        assert!(is_valid_chord("Cmaj7"));
        assert!(!is_valid_chord("Hello"));
        assert!(!is_valid_chord("123"));
    }

    #[test]
    fn test_is_chord_line() {
        assert!(is_chord_line("C  G  Am  F"));
        assert!(is_chord_line("D   A   Bm   G"));
        assert!(!is_chord_line("この街で生きている"));
        assert!(!is_chord_line(""));
    }
}
