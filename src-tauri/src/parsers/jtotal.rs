use crate::error::FetchError;
use crate::parsers::{FetchedChord, FetchedChordSheet, FetchedLine, FetchedSection};
use regex::Regex;
use scraper::{Html, Selector};

pub fn parse(html: &str) -> Result<FetchedChordSheet, FetchError> {
    let document = Html::parse_document(html);
    let mut sheet = FetchedChordSheet::new(String::new());

    // Title - J-Total uses h2 or .title
    let title_selector = Selector::parse(".title, h2, .song-title")
        .map_err(|_| FetchError::ParseError("Invalid title selector".to_string()))?;
    sheet.title = document
        .select(&title_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // Artist - usually in h3 or .artist
    let artist_selector = Selector::parse(".artist, h3, .singer")
        .map_err(|_| FetchError::ParseError("Invalid artist selector".to_string()))?;
    sheet.artist = document
        .select(&artist_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // Chord content - J-Total uses pre or .chord-content
    let content_selector = Selector::parse("pre, .chord-content, .chord-text")
        .map_err(|_| FetchError::ParseError("Invalid content selector".to_string()))?;

    let chord_area = document
        .select(&content_selector)
        .next()
        .ok_or_else(|| FetchError::ElementNotFound("Chord content not found".to_string()))?;

    let text = chord_area.text().collect::<String>();
    sheet.sections = parse_jtotal_text(&text)?;

    Ok(sheet)
}

fn parse_jtotal_text(text: &str) -> Result<Vec<FetchedSection>, FetchError> {
    let lines: Vec<&str> = text.lines().collect();
    let mut sections = Vec::new();
    let mut current_section = FetchedSection::new("Intro");

    for line in lines {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        // Section detection
        if is_section_header(line) {
            if !current_section.lines.is_empty() {
                sections.push(current_section);
            }
            current_section = FetchedSection::new(normalize_section_name(line));
            continue;
        }

        // Chord/lyrics processing
        if is_chord_line(line) {
            let chords = parse_chord_positions(line);
            current_section.lines.push(FetchedLine::with_chords("", chords));
        } else {
            // Lyrics line - try to pair with previous chord line
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

    if sections.is_empty() {
        sections.push(FetchedSection::new("Main"));
    }

    Ok(sections)
}

fn is_section_header(line: &str) -> bool {
    // Bracketed sections
    if line.starts_with('[') && line.ends_with(']') {
        return true;
    }

    // Japanese section markers
    let markers = [
        "イントロ", "Aメロ", "Bメロ", "Cメロ", "サビ",
        "間奏", "アウトロ", "エンディング", "ソロ",
        "1番", "2番", "3番", "ラスト",
    ];

    markers.iter().any(|m| line.contains(m))
}

fn normalize_section_name(line: &str) -> &str {
    let line = line.trim();

    // Remove brackets if present
    if line.starts_with('[') && line.ends_with(']') {
        return &line[1..line.len() - 1];
    }

    line
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
    let chord_pattern = Regex::new(
        r"^[A-G][#♯b♭]?(m|M|maj|min|dim|aug|sus[24]?|add\d+|\d+|7|9|11|13)?(/[A-G][#♯b♭]?)?$"
    ).unwrap();
    chord_pattern.is_match(token)
}

fn parse_chord_positions(line: &str) -> Vec<FetchedChord> {
    let mut chords = Vec::new();
    let mut byte_pos = 0;

    for segment in line.split_whitespace() {
        // Find actual byte position in original line
        if let Some(pos) = line[byte_pos..].find(segment) {
            let actual_byte_pos = byte_pos + pos;
            // Convert byte position to character position for proper Japanese text handling
            let char_position = line[..actual_byte_pos].chars().count();

            if is_valid_chord(segment) {
                chords.push(FetchedChord::new(segment, char_position as i32));
            }

            byte_pos = actual_byte_pos + segment.len();
        }
    }

    chords
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_section_header() {
        assert!(is_section_header("[Intro]"));
        assert!(is_section_header("イントロ"));
        assert!(is_section_header("Aメロ"));
        assert!(is_section_header("サビ"));
        assert!(!is_section_header("C  G  Am  F"));
    }

    #[test]
    fn test_is_chord_line() {
        assert!(is_chord_line("C  G  Am  F"));
        assert!(is_chord_line("D  A  E"));
        assert!(!is_chord_line("今日も空は青い"));
    }

    #[test]
    fn test_parse_chord_positions() {
        let chords = parse_chord_positions("C    G    Am   F");
        assert_eq!(chords.len(), 4);
        assert_eq!(chords[0].chord, "C");
        assert_eq!(chords[0].position, 0);
        assert_eq!(chords[1].chord, "G");
        assert_eq!(chords[1].position, 5);
        assert_eq!(chords[2].chord, "Am");
        assert_eq!(chords[2].position, 10);
        assert_eq!(chords[3].chord, "F");
        assert_eq!(chords[3].position, 15);
    }

    #[test]
    fn test_parse_chord_positions_with_japanese() {
        // Test with Japanese text mixed with chords
        // "あいう C えお G" - Japanese chars are 3 bytes each, but should count as 1 char
        // Character breakdown:
        //   0='あ', 1='い', 2='う', 3=' ', 4='C', 5=' ', 6='え', 7='お', 8=' ', 9='G'
        let line = "あいう C えお G";
        let chords = parse_chord_positions(line);

        assert_eq!(chords.len(), 2);
        // "あいう " = 4 chars (3 Japanese + 1 space), so C is at char position 4
        assert_eq!(chords[0].chord, "C");
        assert_eq!(chords[0].position, 4);
        // "あいう C えお " = 9 chars, so G is at char position 9
        assert_eq!(chords[1].chord, "G");
        assert_eq!(chords[1].position, 9);
    }

    #[test]
    fn test_parse_chord_positions_japanese_padding() {
        // Simulate typical J-Total format with Japanese and spaced chords
        // Full-width spaces or mixed padding
        let line = "    Am      G       C";
        let chords = parse_chord_positions(line);

        assert_eq!(chords.len(), 3);
        assert_eq!(chords[0].chord, "Am");
        assert_eq!(chords[0].position, 4);
        assert_eq!(chords[1].chord, "G");
        assert_eq!(chords[1].position, 12);
        assert_eq!(chords[2].chord, "C");
        assert_eq!(chords[2].position, 20);
    }
}
