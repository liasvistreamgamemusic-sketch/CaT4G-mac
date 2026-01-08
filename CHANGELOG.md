# Changelog

All notable changes to CaT4G will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-08

### Added

#### Core Features
- **Chord Sheet Fetching**: Import chord sheets from U-Fret, ChordWiki, and J-Total
- **Manual Entry**: Create chord sheets manually with section-based editor
- **Song Management**: Add, delete, and favorite songs
- **Search**: Filter songs by title or artist name

#### Transpose & Chords
- **Transpose**: Shift key up/down by semitones (-6 to +6)
- **Chord Diagrams**: SVG-based fingering diagrams with barre chord support
- **Chord Database**: 30+ chord definitions with multiple fingering options

#### Auto-Scroll
- **Speed Control**: Adjustable speed from 0.5x to 2.0x
- **BPM Sync**: Optional synchronization with song BPM
- **Keyboard Shortcuts**: Space (play/pause), Arrow keys (speed), Home (top)

#### Metronome
- **Time Signatures**: 4/4, 3/4, 6/8, 2/4 support
- **Web Audio API**: Precise timing with accent beats
- **Visual Indicator**: Beat indicator with accent highlighting
- **Volume Control**: Adjustable metronome volume

#### Playlists
- **Create Playlists**: Organize songs into custom playlists
- **Drag & Drop**: Reorder songs within playlists
- **Continuous Playback**: Play through playlist sequentially

#### UI/UX
- **Dark Theme**: Modern dark UI with purple accent
- **Glassmorphism**: Subtle glass effects and animations
- **Settings Modal**: Customize default BPM, scroll speed, metronome settings
- **Toast Notifications**: Feedback for user actions
- **Icon Library**: 20+ custom SVG icons

### Technical
- Tauri 2.0 + React 18 + TypeScript + Vite + Tailwind CSS
- SQLite database with 10 tables
- Rust backend for web scraping
- Docker development environment support

---

## [Unreleased]

### Planned
- macOS/Windows installer distribution
- Application icon
- Additional chord sites support
- Export/import functionality
