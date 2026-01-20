/**
 * Parser for J-Total (j-total.net)
 *
 * J-Total uses a simple text format with chord lines followed by lyrics lines.
 * Structure:
 * - Title: .title, h2, .song-title
 * - Artist: .artist, h3, .singer
 * - Content: pre, .chord-content, .chord-text
 */

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import type {
  FetchedChord,
  FetchedChordSheet,
  FetchedLine,
  FetchedSection,
} from "../types.ts";

/**
 * Parse J-Total HTML to extract chord sheet data
 */
export function parse(html: string, sourceUrl: string): FetchedChordSheet {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) {
    throw new Error("Failed to parse HTML document");
  }

  const sheet: FetchedChordSheet = {
    title: null,
    artist: null,
    key: null,
    capo: null,
    sections: [],
    source_url: sourceUrl,
  };

  // Title - J-Total uses h2 or .title
  const titleEl =
    doc.querySelector(".title") ||
    doc.querySelector("h2") ||
    doc.querySelector(".song-title");
  if (titleEl) {
    sheet.title = (titleEl.textContent || "").trim() || null;
  }

  // Artist - usually in h3 or .artist
  const artistEl =
    doc.querySelector(".artist") ||
    doc.querySelector("h3") ||
    doc.querySelector(".singer");
  if (artistEl) {
    sheet.artist = (artistEl.textContent || "").trim() || null;
  }

  // Chord content - J-Total uses pre or .chord-content
  const contentEl =
    doc.querySelector("pre") ||
    doc.querySelector(".chord-content") ||
    doc.querySelector(".chord-text");

  if (!contentEl) {
    throw new Error("Chord content not found");
  }

  const text = contentEl.textContent || "";
  sheet.sections = parseJtotalText(text);

  return sheet;
}

/**
 * Parse J-Total text content
 */
function parseJtotalText(text: string): FetchedSection[] {
  const lines = text.split("\n");
  const sections: FetchedSection[] = [];
  let currentSection: FetchedSection = { name: "Intro", lines: [] };

  for (const lineStr of lines) {
    const line = lineStr.trim();
    if (!line) continue;

    // Section detection
    if (isSectionHeader(line)) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { name: normalizeSectionName(line), lines: [] };
      continue;
    }

    // Chord/lyrics processing
    if (isChordLine(line)) {
      const chords = parseChordPositions(lineStr);
      currentSection.lines.push({ lyrics: "", chords });
    } else {
      // Lyrics line - try to pair with previous chord line
      const lastLine =
        currentSection.lines[currentSection.lines.length - 1];
      if (lastLine && !lastLine.lyrics && lastLine.chords.length > 0) {
        lastLine.lyrics = line;
      } else {
        currentSection.lines.push({ lyrics: line, chords: [] });
      }
    }
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    sections.push({ name: "Main", lines: [] });
  }

  return sections;
}

/**
 * Check if line is a section header
 */
function isSectionHeader(line: string): boolean {
  // Bracketed sections
  if (line.startsWith("[") && line.endsWith("]")) {
    return true;
  }

  // Japanese section markers
  const markers = [
    "イントロ",
    "Aメロ",
    "Bメロ",
    "Cメロ",
    "サビ",
    "間奏",
    "アウトロ",
    "エンディング",
    "ソロ",
    "1番",
    "2番",
    "3番",
    "ラスト",
  ];

  return markers.some((m) => line.includes(m));
}

/**
 * Normalize section name
 */
function normalizeSectionName(line: string): string {
  const trimmed = line.trim();

  // Remove brackets if present
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

/**
 * Check if a line contains mostly chords
 */
function isChordLine(line: string): boolean {
  const tokens = line.split(/\s+/).filter((t) => t);
  if (tokens.length === 0) return false;

  const chordCount = tokens.filter(isValidChord).length;
  return chordCount / tokens.length > 0.5;
}

/**
 * Validate if a token is a chord
 */
function isValidChord(token: string): boolean {
  const chordPattern =
    /^[A-G][#\u266fb\u266d]?(m|M|maj|min|dim|aug|sus[24]?|add\d+|\d+|7|9|11|13)?(\/[A-G][#\u266fb\u266d]?)?$/;
  return chordPattern.test(token);
}

/**
 * Parse chord positions from a line, accounting for Japanese characters
 */
function parseChordPositions(line: string): FetchedChord[] {
  const chords: FetchedChord[] = [];
  let bytePos = 0;

  for (const segment of line.split(/\s+/).filter((s) => s)) {
    // Find actual position in original line
    const pos = line.indexOf(segment, bytePos);
    if (pos !== -1) {
      // Convert byte position to character position for proper Japanese text handling
      const charPosition = [...line.slice(0, pos)].length;

      if (isValidChord(segment)) {
        chords.push({ chord: segment, position: charPosition });
      }

      bytePos = pos + segment.length;
    }
  }

  return chords;
}
