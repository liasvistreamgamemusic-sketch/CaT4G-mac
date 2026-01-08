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

    let chord_regex = Regex::new(r"\[([A-G][#♯b♭]?[^\]]*)\]")
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
        let chord_regex = Regex::new(r"\[([A-G][#♯b♭]?[^\]]*)\]").unwrap();
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
}
