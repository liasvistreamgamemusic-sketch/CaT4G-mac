/**
 * Parser for 楽器.me (gakufu.gakki.me)
 *
 * HTML structure:
 * - Title/Artist: `<h2 class="tit"><span>「タイトル」</span><small>アーティスト</small></h2>`
 * - Chord area: `<div id="chord_area">`
 * - Each chord unit: `<div class="cd_1line">`
 *   - Chord: `<div class="cd_pic cd_font"><span class="cd_fontpos">C<br /><img ...></span></div>`
 *   - Lyrics: `<div class="cd_pic blue"><div class="cd_txt">歌</div><div class="cd_txt">詞</div></div>`
 * - Paragraph separator: `<div style='clear: both;'></div>`
 *
 * Important: Multiple cd_1line elements are concatenated into a single line.
 * Paragraph breaks are marked by elements with `clear: both` style.
 */

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import type {
  FetchedChord,
  FetchedChordSheet,
  FetchedLine,
  FetchedSection,
} from "../types.ts";

/**
 * Parse 楽器.me HTML to extract chord sheet data
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

  // Title: h2.tit > span (remove 「」 brackets)
  const titleEl = doc.querySelector("h2.tit > span");
  if (titleEl) {
    const text = titleEl.textContent || "";
    // Remove 「」 brackets
    sheet.title =
      text
        .trim()
        .replace(/^「/, "")
        .replace(/」$/, "") || null;
  }

  // Artist: h2.tit > small
  const artistEl = doc.querySelector("h2.tit > small");
  if (artistEl) {
    sheet.artist = (artistEl.textContent || "").trim() || null;
  }

  // Chord area: #chord_area
  const chordArea = doc.querySelector("#chord_area");
  if (!chordArea) {
    throw new Error("#chord_area not found");
  }

  // Create a single "Main" section
  const mainSection: FetchedSection = { name: "Main", lines: [] };

  // State for accumulating line content across multiple cd_1line elements
  let currentLyrics = "";
  let currentChords: FetchedChord[] = [];

  // Process each child element in #chord_area in order
  for (const child of chordArea.children) {
    // Check for paragraph separator: elements with `clear: both` in style
    const style = child.getAttribute("style") || "";
    if (style.includes("clear")) {
      // Save current line and reset
      saveLineIfNotEmpty(mainSection.lines, currentLyrics, currentChords);
      currentLyrics = "";
      currentChords = [];
      continue;
    }

    // Process cd_1line elements
    if (child.classList.contains("cd_1line")) {
      // Extract chord from cd_fontpos
      const chordSpan = child.querySelector(".cd_fontpos");
      if (chordSpan) {
        const chordName = extractChordName(chordSpan);
        if (chordName && chordName !== "／" && chordName !== "/") {
          const position = [...currentLyrics].length;
          currentChords.push({ chord: chordName, position });
        }
      }

      // Extract lyrics from cd_txt elements (nested inside cd_pic blue)
      const txtEls = child.querySelectorAll(".cd_txt");
      for (const txtEl of txtEls) {
        const text = txtEl.textContent || "";
        // Handle &nbsp; as space (Unicode non-breaking space)
        const normalized = text.replace(/\u00A0/g, " ");
        currentLyrics += normalized;
      }
    }
  }

  // Save the last line
  saveLineIfNotEmpty(mainSection.lines, currentLyrics, currentChords);

  // Ensure we have at least one section
  if (mainSection.lines.length === 0) {
    mainSection.lines = [];
  }

  sheet.sections = [mainSection];

  // key and capo are None (not provided by this site)
  sheet.key = null;
  sheet.capo = null;

  return sheet;
}

/**
 * Save the current line to the lines array if it has content, then reset
 */
function saveLineIfNotEmpty(
  lines: FetchedLine[],
  lyrics: string,
  chords: FetchedChord[]
): void {
  const trimmed = lyrics.trim();
  if (trimmed || chords.length > 0) {
    lines.push({ lyrics: trimmed, chords: [...chords] });
  }
}

/**
 * Extract chord name from span.cd_fontpos
 * The span contains: "C<br /><img src="...">" - we only want text before <br>
 */
function extractChordName(el: Element): string {
  // Get innerHTML and split by <br
  const inner = el.innerHTML || "";
  const brIndex = inner.toLowerCase().indexOf("<br");

  if (brIndex !== -1) {
    const chord = inner.slice(0, brIndex).trim();
    if (chord) {
      // Clean any HTML entities
      return decodeHtmlEntities(chord);
    }
  }

  // Fallback: get text content
  const text = el.textContent || "";
  // Take only the first line/word
  const firstWord = text.split(/[\n\r\s]/)[0];
  return firstWord.trim();
}

/**
 * Decode common HTML entities
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}
