/**
 * Parser for ChordWiki (chordwiki.org)
 *
 * Note: ChordWiki uses Cloudflare protection, so direct fetching may not work.
 * This parser is designed to work with manually provided HTML content.
 *
 * HTML structure:
 * - Title: h1.title
 * - Artist: h2.subtitle - extract from "歌：アーティスト名　作詞・作曲：..."
 * - Main content: div.main
 * - Each line: p.line
 *   - Comment/section: p.line.comment with <strong> tag
 *   - Chord: span.chord
 *   - Lyrics: span.word or span.wordtop
 */

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import type {
  FetchedChord,
  FetchedChordSheet,
  FetchedLine,
  FetchedSection,
} from "../types.ts";

/**
 * Parse ChordWiki HTML to extract chord sheet data
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

  // Title: h1.title
  const titleEl = doc.querySelector("h1.title");
  if (titleEl) {
    sheet.title = (titleEl.textContent || "").trim() || null;
  }

  // Artist: h2.subtitle - extract from "歌：アーティスト名　作詞・作曲：..."
  const subtitleEl = doc.querySelector("h2.subtitle");
  if (subtitleEl) {
    sheet.artist = extractArtist(subtitleEl.textContent || "");
  }

  // Parse main content
  const mainDiv = doc.querySelector("div.main");
  if (!mainDiv) {
    throw new Error("div.main not found");
  }

  // Parse all p.line elements
  const lineEls = mainDiv.querySelectorAll("p.line");

  const sections: FetchedSection[] = [];
  let currentSection: FetchedSection = { name: "Intro", lines: [] };

  for (const lineEl of lineEls) {
    const isComment = lineEl.classList.contains("comment");

    if (isComment) {
      // Comment line - could be a section marker
      const text = extractCommentText(lineEl);
      if (text) {
        // Save current section if it has lines
        if (currentSection.lines.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { name: text, lines: [] };
      }
    } else {
      // Regular chord/lyrics line
      const { lyrics, chords } = parseLineContent(lineEl);
      if (lyrics || chords.length > 0) {
        currentSection.lines.push({ lyrics, chords });
      }
    }
  }

  // Push the last section
  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  // Ensure at least one section exists
  if (sections.length === 0) {
    sections.push({ name: "Main", lines: [] });
  }

  sheet.sections = sections;
  return sheet;
}

/**
 * Extract artist name from subtitle like "歌：レミオロメン　作詞・作曲：藤巻亮太"
 */
function extractArtist(subtitle: string): string | null {
  const trimmed = subtitle.trim();

  // Try to extract after "歌：" or "歌:"
  const singMatch = trimmed.match(/歌[：:]\s*([^　\t ]+)/);
  if (singMatch) {
    let artist = singMatch[1];
    // Remove any trailing 作詞/作曲 content
    const endPos = artist.search(/作詞|作曲/);
    if (endPos !== -1) {
      artist = artist.slice(0, endPos);
    }
    return artist.trim() || null;
  }

  // Fallback: return the whole subtitle
  return trimmed || null;
}

/**
 * Extract text from comment line (inside <strong> or <i> tags)
 */
function extractCommentText(el: Element): string {
  // First try to get text from <strong> tag
  const strongEl = el.querySelector("strong");
  if (strongEl) {
    const text = (strongEl.textContent || "").trim();
    if (text) return text;
  }

  // Fallback to all text content
  return (el.textContent || "").trim();
}

/**
 * Parse a line element to extract lyrics and chords with positions
 */
function parseLineContent(el: Element): { lyrics: string; chords: FetchedChord[] } {
  let lyrics = "";
  const chords: FetchedChord[] = [];

  // Iterate through child elements in order
  for (const child of el.children) {
    const tagName = child.tagName.toLowerCase();

    if (tagName === "span") {
      const text = child.textContent || "";

      if (child.classList.contains("chord")) {
        // Chord span - extract chord name
        const chordName = text.trim();
        // Skip bar lines and empty chords
        if (chordName && chordName !== "|" && !chordName.startsWith("|")) {
          const position = [...lyrics].length;
          chords.push({ chord: chordName, position });
        }
      } else if (
        child.classList.contains("word") ||
        child.classList.contains("wordtop")
      ) {
        // Word/lyrics span
        lyrics += text;
      }
    }
  }

  // Also check for direct text nodes (like &nbsp;)
  // Note: deno_dom doesn't easily expose text nodes between elements,
  // so we handle this by getting full text and subtracting known parts
  const fullText = el.textContent || "";
  const chordTexts = [...el.querySelectorAll(".chord")].map(
    (c) => c.textContent || ""
  );
  const wordTexts = [...el.querySelectorAll(".word, .wordtop")].map(
    (c) => c.textContent || ""
  );

  // If we didn't get lyrics from spans, try full text minus chords
  if (!lyrics && fullText) {
    let remaining = fullText;
    for (const chord of chordTexts) {
      remaining = remaining.replace(chord, "");
    }
    lyrics = remaining.trim();
  }

  return { lyrics: lyrics.trim(), chords };
}
