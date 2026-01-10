use crate::error::FetchError;
use crate::parsers::{FetchedChord, FetchedChordSheet, FetchedLine, FetchedSection};
use regex::Regex;
use scraper::{Html, Selector};

pub fn parse(html: &str) -> Result<FetchedChordSheet, FetchError> {
    let document = Html::parse_document(html);
    let mut sheet = FetchedChordSheet::new(String::new());

    // Title
    let title_selector = Selector::parse(".song-title h1, h1")
        .map_err(|_| FetchError::ParseError("Invalid title selector".to_string()))?;
    sheet.title = document
        .select(&title_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // Artist
    let artist_selector = Selector::parse(".song-artist, .artist")
        .map_err(|_| FetchError::ParseError("Invalid artist selector".to_string()))?;
    sheet.artist = document
        .select(&artist_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string());

    // Chord content - ChordWiki uses pre or chord-lyrics class
    let content_selector = Selector::parse(".chord-lyrics, pre, .wikibody")
        .map_err(|_| FetchError::ParseError("Invalid content selector".to_string()))?;

    let content = document
        .select(&content_selector)
        .next()
        .map(|el| el.text().collect::<String>())
        .ok_or_else(|| FetchError::ElementNotFound("Chord content not found".to_string()))?;

    // Parse ChordPro-style metadata and content
    parse_chordpro_content(&content, &mut sheet)?;

    Ok(sheet)
}

fn parse_chordpro_content(content: &str, sheet: &mut FetchedChordSheet) -> Result<(), FetchError> {
    let mut sections = Vec::new();
    let mut current_section = FetchedSection::new("Verse");

    let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]")
        .map_err(|_| FetchError::ParseError("Invalid chord regex".to_string()))?;

    for line in content.lines() {
        let line = line.trim();

        // ChordPro metadata directives
        if line.starts_with('{') && line.ends_with('}') {
            let directive = &line[1..line.len() - 1];
            if let Some((key, value)) = parse_directive(directive) {
                match key.to_lowercase().as_str() {
                    "title" | "t" => sheet.title = Some(value.to_string()),
                    "artist" | "a" | "subtitle" | "st" => sheet.artist = Some(value.to_string()),
                    "key" | "k" => sheet.key = Some(value.to_string()),
                    "capo" => sheet.capo = value.parse().ok(),
                    _ => {}
                }
            }
            continue;
        }

        // Section markers
        if line.starts_with('[') && line.ends_with(']') && !chord_regex.is_match(line) {
            if !current_section.lines.is_empty() {
                sections.push(current_section);
            }
            let section_name = &line[1..line.len() - 1];
            current_section = FetchedSection::new(section_name);
            continue;
        }

        if line.is_empty() {
            continue;
        }

        // Parse inline chords [C]lyrics[G]more
        let (lyrics, chords) = parse_inline_chords(line, &chord_regex);

        if !lyrics.is_empty() || !chords.is_empty() {
            current_section.lines.push(FetchedLine::with_chords(&lyrics, chords));
        }
    }

    if !current_section.lines.is_empty() {
        sections.push(current_section);
    }

    if sections.is_empty() {
        sections.push(FetchedSection::new("Main"));
    }

    sheet.sections = sections;
    Ok(())
}

fn parse_directive(directive: &str) -> Option<(&str, &str)> {
    let parts: Vec<&str> = directive.splitn(2, ':').collect();
    if parts.len() == 2 {
        Some((parts[0].trim(), parts[1].trim()))
    } else {
        None
    }
}

fn parse_inline_chords(line: &str, chord_regex: &Regex) -> (String, Vec<FetchedChord>) {
    let mut chords = Vec::new();
    let mut lyrics = String::new();
    let mut last_end = 0;

    for cap in chord_regex.captures_iter(line) {
        let m = cap.get(0).unwrap();
        let chord_name = cap.get(1).unwrap().as_str();

        // Add lyrics before chord
        lyrics.push_str(&line[last_end..m.start()]);
        let position = lyrics.len() as i32;

        chords.push(FetchedChord::new(chord_name, position));

        last_end = m.end();
    }

    // Add remaining lyrics
    lyrics.push_str(&line[last_end..]);

    (lyrics, chords)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_inline_chords() {
        let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();
        let (lyrics, chords) = parse_inline_chords("[C]Hello [G]World", &chord_regex);
        assert_eq!(lyrics, "Hello World");
        assert_eq!(chords.len(), 2);
        assert_eq!(chords[0].chord, "C");
        assert_eq!(chords[0].position, 0);
        assert_eq!(chords[1].chord, "G");
        assert_eq!(chords[1].position, 6);
    }

    #[test]
    fn test_parse_directive() {
        assert_eq!(parse_directive("title:My Song"), Some(("title", "My Song")));
        assert_eq!(parse_directive("capo:3"), Some(("capo", "3")));
        assert_eq!(parse_directive("invalid"), None);
    }

    #[test]
    fn test_parse_sharp_chords() {
        let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();

        // F#m - common sharp minor chord
        let (_, chords) = parse_inline_chords("[F#m]サビの歌詞", &chord_regex);
        assert_eq!(chords.len(), 1);
        assert_eq!(chords[0].chord, "F#m");
        assert_eq!(chords[0].position, 0);

        // C# - sharp major
        let (_, chords) = parse_inline_chords("[C#]テスト", &chord_regex);
        assert_eq!(chords.len(), 1);
        assert_eq!(chords[0].chord, "C#");

        // G#m7 - sharp minor seventh
        let (_, chords) = parse_inline_chords("[G#m7]複雑なコード", &chord_regex);
        assert_eq!(chords.len(), 1);
        assert_eq!(chords[0].chord, "G#m7");
    }

    #[test]
    fn test_parse_flat_chords() {
        let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();

        // Bb - flat major
        let (_, chords) = parse_inline_chords("[Bb]フラットコード", &chord_regex);
        assert_eq!(chords.len(), 1);
        assert_eq!(chords[0].chord, "Bb");

        // Ebm - flat minor
        let (_, chords) = parse_inline_chords("[Ebm]テスト", &chord_regex);
        assert_eq!(chords.len(), 1);
        assert_eq!(chords[0].chord, "Ebm");

        // Ab7 - flat seventh
        let (_, chords) = parse_inline_chords("[Ab7]セブンス", &chord_regex);
        assert_eq!(chords.len(), 1);
        assert_eq!(chords[0].chord, "Ab7");
    }

    #[test]
    fn test_parse_complex_chords() {
        let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();

        // maj7 chord
        let (_, chords) = parse_inline_chords("[Cmaj7]メジャーセブン", &chord_regex);
        assert_eq!(chords[0].chord, "Cmaj7");

        // dim chord
        let (_, chords) = parse_inline_chords("[Bdim]ディミニッシュ", &chord_regex);
        assert_eq!(chords[0].chord, "Bdim");

        // aug chord
        let (_, chords) = parse_inline_chords("[Gaug]オーギュメント", &chord_regex);
        assert_eq!(chords[0].chord, "Gaug");

        // sus4 chord
        let (_, chords) = parse_inline_chords("[Dsus4]サスフォー", &chord_regex);
        assert_eq!(chords[0].chord, "Dsus4");

        // add9 chord
        let (_, chords) = parse_inline_chords("[Cadd9]アドナイン", &chord_regex);
        assert_eq!(chords[0].chord, "Cadd9");
    }

    #[test]
    fn test_parse_slash_chords() {
        let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();

        // G/B - slash chord with bass note
        let (_, chords) = parse_inline_chords("[G/B]スラッシュコード", &chord_regex);
        assert_eq!(chords[0].chord, "G/B");

        // C#m/G# - sharp slash chord
        let (_, chords) = parse_inline_chords("[C#m/G#]複雑なスラッシュ", &chord_regex);
        assert_eq!(chords[0].chord, "C#m/G#");

        // Am7/G - seventh slash chord
        let (_, chords) = parse_inline_chords("[Am7/G]セブンススラッシュ", &chord_regex);
        assert_eq!(chords[0].chord, "Am7/G");
    }

    #[test]
    fn test_parse_multiple_ascii_chords() {
        let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();

        // Multiple ASCII chords in one line
        let (lyrics, chords) = parse_inline_chords("[F#m]夜の[Bb]空を[C#m7]見上げて", &chord_regex);
        assert_eq!(lyrics, "夜の空を見上げて");
        assert_eq!(chords.len(), 3);
        assert_eq!(chords[0].chord, "F#m");
        assert_eq!(chords[0].position, 0);
        assert_eq!(chords[1].chord, "Bb");
        assert_eq!(chords[1].position, 6); // After "夜の" (2 chars * 3 bytes = 6)
        assert_eq!(chords[2].chord, "C#m7");
        assert_eq!(chords[2].position, 12); // After "夜の空を" (4 chars * 3 bytes = 12)
    }

    #[test]
    fn test_parse_chord_only_line() {
        let chord_regex = Regex::new(r"\[([A-G][#b]?[^\]]*)\]").unwrap();

        // Line with only chords (no lyrics)
        let (lyrics, chords) = parse_inline_chords("[F#m] [Bb] [C#]", &chord_regex);
        assert_eq!(lyrics, "   ");
        assert_eq!(chords.len(), 3);
        assert_eq!(chords[0].chord, "F#m");
        assert_eq!(chords[1].chord, "Bb");
        assert_eq!(chords[2].chord, "C#");
    }
}
