pub mod ufret;
pub mod chordwiki;
pub mod jtotal;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FetchedChordSheet {
    pub title: Option<String>,
    pub artist: Option<String>,
    pub key: Option<String>,
    pub capo: Option<i32>,
    pub sections: Vec<FetchedSection>,
    pub source_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FetchedSection {
    pub name: String,
    pub lines: Vec<FetchedLine>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FetchedLine {
    pub lyrics: String,
    pub chords: Vec<FetchedChord>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FetchedChord {
    pub chord: String,
    pub position: i32,
}

impl FetchedChordSheet {
    pub fn new(source_url: String) -> Self {
        Self {
            title: None,
            artist: None,
            key: None,
            capo: None,
            sections: Vec::new(),
            source_url,
        }
    }
}

impl FetchedSection {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            lines: Vec::new(),
        }
    }
}

impl FetchedLine {
    pub fn new(lyrics: &str) -> Self {
        Self {
            lyrics: lyrics.to_string(),
            chords: Vec::new(),
        }
    }

    pub fn with_chords(lyrics: &str, chords: Vec<FetchedChord>) -> Self {
        Self {
            lyrics: lyrics.to_string(),
            chords,
        }
    }
}

impl FetchedChord {
    pub fn new(chord: &str, position: i32) -> Self {
        Self {
            chord: chord.to_string(),
            position,
        }
    }
}
