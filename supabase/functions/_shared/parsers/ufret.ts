/**
 * Parser for U-Fret (ufret.jp)
 *
 * U-Fret stores chord data in JavaScript variable: var ufret_chord_datas = [...]
 * Format: "[Chord]lyrics[Chord]lyrics..." or "[Chord]　[Chord]　[Chord]" (chord only)
 */

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import type {
  FetchedChord,
  FetchedChordSheet,
  FetchedLine,
  FetchedSection,
  UfretArtistResult,
  UfretSearchResponse,
  UfretSearchResult,
} from "../types.ts";

/**
 * Parse U-Fret HTML to extract chord sheet data
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

  // Title and Artist - U-Fret uses "曲名 / アーティスト名" format in h1
  const titleEl =
    doc.querySelector("h1") ||
    doc.querySelector(".song_title") ||
    doc.querySelector("title");
  if (titleEl) {
    const text = titleEl.textContent || "";
    // U-Fret format: "曲名 / アーティスト名"
    const parts = text.split("/");
    if (parts.length >= 2) {
      sheet.title = parts[0].trim() || null;
      // Artist from h1 (second part after "/")
      sheet.artist = parts[1].trim() || null;
    } else {
      sheet.title = text.trim() || null;
    }
  }

  // Artist fallback - Try other selectors if not found in h1
  if (!sheet.artist) {
    const artistEl =
      doc.querySelector("h2 a") ||
      doc.querySelector(".artist a") ||
      doc.querySelector("a[href*='/artist']");
    if (artistEl) {
      sheet.artist = (artistEl.textContent || "").trim() || null;
    }
  }

  // Key - Try to extract from page
  const keyEl =
    doc.querySelector(".key-info") ||
    doc.querySelector(".original-key") ||
    doc.querySelector("select[name='keyselect'] option[selected]");
  if (keyEl) {
    sheet.key = (keyEl.textContent || "").trim() || null;
  }

  // Capo - U-Fret uses select[name='key_capo'] with values like "-4（Capo 4）"
  const capoEl = doc.querySelector(
    "select[name='key_capo'] option[selected]"
  );
  if (capoEl) {
    const val = capoEl.getAttribute("value");
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num < 0) {
        // Negative value means Capo position (e.g., -4 = Capo 4)
        sheet.capo = -num;
      }
    }
    if (sheet.capo === null) {
      const text = capoEl.textContent || "";
      sheet.capo = extractCapoFromText(text);
    }
  }

  // U-Fret stores chord data in JavaScript variable: var ufret_chord_datas = [...]
  const sections = extractUfretChordDatas(html);
  if (sections) {
    sheet.sections = sections;
    return sheet;
  }

  // Fallback: Try to parse from DOM elements
  const contentSelectors = [
    "#ufret-chord-data",
    "#chord_area",
    ".chord-area",
    "#contents",
    ".hiragana",
  ];

  for (const selector of contentSelectors) {
    const el = doc.querySelector(selector);
    if (el) {
      const text = el.textContent || "";
      sheet.sections = parseChordText(text);
      return sheet;
    }
  }

  // Last resort: parse all text content
  const bodyText = doc.body?.textContent || "";
  sheet.sections = parseChordText(bodyText);

  return sheet;
}

/**
 * Extract chord data from U-Fret's JavaScript variable
 */
function extractUfretChordDatas(html: string): FetchedSection[] | null {
  // Match: var ufret_chord_datas = [...] (greedy to get full array)
  const match = html.match(
    /var\s+ufret_chord_datas\s*=\s*\[([^\]]*(?:\][^\];]*)*)\]/
  );
  if (!match) {
    return null;
  }

  const arrayContent = match[1];

  // Parse the array items (they are quoted strings)
  const itemRegex = /"((?:[^"\\]|\\.)*)"/g;
  const lines: string[] = [];
  let itemMatch;

  while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
    const unescaped = unescapeJsString(itemMatch[1]);
    lines.push(unescaped);
  }

  if (lines.length === 0) {
    return null;
  }

  return parseUfretLines(lines);
}

/**
 * Unescape JavaScript string escapes
 */
function unescapeJsString(s: string): string {
  let result = "";
  let i = 0;

  while (i < s.length) {
    if (s[i] === "\\" && i + 1 < s.length) {
      const next = s[i + 1];
      switch (next) {
        case "n":
          result += "\n";
          i += 2;
          break;
        case "r":
          result += "\r";
          i += 2;
          break;
        case "t":
          result += "\t";
          i += 2;
          break;
        case "\\":
          result += "\\";
          i += 2;
          break;
        case '"':
          result += '"';
          i += 2;
          break;
        case "/":
          result += "/";
          i += 2;
          break;
        case "'":
          result += "'";
          i += 2;
          break;
        case "u":
          // Unicode escape: \uXXXX
          if (i + 5 < s.length) {
            const hex = s.substring(i + 2, i + 6);
            const code = parseInt(hex, 16);
            if (!isNaN(code)) {
              result += String.fromCharCode(code);
              i += 6;
            } else {
              result += s[i];
              i++;
            }
          } else {
            result += s[i];
            i++;
          }
          break;
        default:
          result += next;
          i += 2;
          break;
      }
    } else {
      result += s[i];
      i++;
    }
  }

  return result;
}

/**
 * Parse U-Fret chord lines
 * Format: "[Chord]lyrics[Chord]lyrics..." or "[Chord]　[Chord]　[Chord]" (chord only)
 */
function parseUfretLines(lines: string[]): FetchedSection[] {
  const sections: FetchedSection[] = [];
  let currentSection: FetchedSection = { name: "Main", lines: [] };

  // Regex to match chord markers like [Am], [G7], [B/D#], etc.
  const chordRegex = /\[([A-G][#\u266f b\u266d]?[^\]]*)\]/g;

  for (const lineStr of lines) {
    const line = lineStr.trim();
    if (!line) continue;

    // Check if this is a section marker
    if (isSectionMarker(line)) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { name: line, lines: [] };
      continue;
    }

    // Extract chords and lyrics from the line
    const lineChords: FetchedChord[] = [];
    let lyrics = "";
    let lastEnd = 0;
    let charPosition = 0;

    // Check if this is a chord-only line (no lyrics between chords)
    const withoutChords = line.replace(chordRegex, "");
    const cleaned = withoutChords
      .replace(/\u3000/g, "")
      .replace(/ /g, "")
      .replace(/\r/g, "")
      .replace(/\n/g, "");
    const isChordOnly = cleaned.length === 0;

    // Reset regex
    chordRegex.lastIndex = 0;

    let match;
    while ((match = chordRegex.exec(line)) !== null) {
      const chordName = match[1];
      const before = line.substring(lastEnd, match.index);
      const beforeClean = before.replace(/\u3000/g, " ").replace(/\r/g, "");

      if (isChordOnly) {
        // For chord-only lines, add spacing between chords
        const spaceCount = (before.match(/[ \u3000]/g) || []).length;
        if (spaceCount > 0) {
          lyrics += " ".repeat(spaceCount * 2);
          charPosition += spaceCount * 2;
        }
      } else {
        // For lines with lyrics, add the actual text
        lyrics += beforeClean;
        charPosition += [...beforeClean].length;
      }

      // Add chord at current position
      if (chordName) {
        lineChords.push({ chord: chordName, position: charPosition });

        if (isChordOnly) {
          // For chord-only lines, add placeholder space for chord width
          const chordWidth = Math.max([...chordName].length, 2);
          lyrics += " ".repeat(chordWidth);
          charPosition += chordWidth;
        }
      }

      lastEnd = match.index + match[0].length;
    }

    // Add remaining lyrics after last chord
    if (lastEnd < line.length && !isChordOnly) {
      const after = line.substring(lastEnd);
      const afterClean = after.replace(/\u3000/g, " ").replace(/\r/g, "");
      lyrics += afterClean;
    }

    // Clean up lyrics (but preserve spaces for chord-only lines)
    const finalLyrics = isChordOnly ? lyrics : lyrics.trim();

    // Add line if it has content
    if (finalLyrics || lineChords.length > 0) {
      currentSection.lines.push({ lyrics: finalLyrics, chords: lineChords });
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
 * Extract capo number from text
 */
function extractCapoFromText(text: string): number | null {
  // Match patterns like "Capo 4", "カポ4", "(Capo 4)"
  const match = text.match(/[Cc]apo\s*(\d+)|カポ\s*(\d+)/);
  if (match) {
    const num = match[1] || match[2];
    return parseInt(num, 10);
  }
  // Fallback: just extract any number
  const numMatch = text.match(/\d+/);
  return numMatch ? parseInt(numMatch[0], 10) : null;
}

/**
 * Parse chord text content (fallback)
 */
function parseChordText(text: string): FetchedSection[] {
  const lines = text.split("\n");
  const sections: FetchedSection[] = [];
  let currentSection: FetchedSection = { name: "Intro", lines: [] };

  for (const lineStr of lines) {
    const line = lineStr.trim();
    if (!line) continue;

    // Section marker detection [Intro], [Verse], etc.
    if (line.startsWith("[") && line.endsWith("]")) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      const sectionName = line.slice(1, -1);
      currentSection = { name: sectionName, lines: [] };
      continue;
    }

    // Section markers without brackets
    if (isSectionMarker(line)) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { name: line, lines: [] };
      continue;
    }

    // Determine if chord line or lyrics line
    if (isChordLine(line)) {
      const chords = parseChordLine(line);
      currentSection.lines.push({ lyrics: "", chords });
    } else {
      // Lyrics line - attach to previous chord line if exists
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
 * Check if a line is a section marker
 */
function isSectionMarker(line: string): boolean {
  const markers = [
    "Intro",
    "イントロ",
    "Verse",
    "Aメロ",
    "Bメロ",
    "Cメロ",
    "Chorus",
    "サビ",
    "Bridge",
    "ブリッジ",
    "間奏",
    "Outro",
    "アウトロ",
    "エンディング",
    "Solo",
    "ソロ",
    "ギターソロ",
  ];
  const lowerLine = line.toLowerCase();
  return markers.some(
    (m) => lowerLine === m.toLowerCase() || line.includes(m)
  );
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
 * Parse a chord line to extract chord positions
 */
function parseChordLine(line: string): FetchedChord[] {
  const chords: FetchedChord[] = [];
  let position = 0;

  for (const token of line.split(/\s+/)) {
    if (isValidChord(token)) {
      chords.push({ chord: token, position });
    }
    position += token.length + 1;
  }

  return chords;
}

/** Extract song ID from href like "/song.php?data=174" */
function extractSongId(href: string): string | null {
  const match = href.match(/data=(\d+)/);
  return match ? match[1] : null;
}

/** Extract version suffix from title
 * e.g., "粉雪 初心者ver" → { cleanTitle: "粉雪", version: "初心者ver" }
 */
function extractVersion(title: string): { cleanTitle: string; version: string | null } {
  const patterns = ["初心者向け簡単コード", "初心者ver", "動画プラス", "動画プラスver", "U-FRETver", "かんたんver"];
  for (const p of patterns) {
    if (title.includes(p)) {
      return { cleanTitle: title.replace(p, "").trim(), version: p };
    }
  }
  return { cleanTitle: title, version: null };
}

/**
 * U-Fret検索結果HTMLをパース
 * 検索URL形式: https://www.ufret.jp/search.php?key=検索語&p=ページ番号
 */
export function parseSearchResults(
  html: string,
  page: number
): UfretSearchResponse {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) {
    return { artists: [], results: [], has_more: false, current_page: page };
  }

  const results: UfretSearchResult[] = [];

  // New U-Fret structure: <li><a href="/song.php?data=ID"><div>title</div><div>artist</div></a></li>
  const songLinks = doc.querySelectorAll('a[href*="/song.php?data="]');

  for (let i = 0; i < songLinks.length; i++) {
    const link = songLinks[i];
    const href = link.getAttribute("href") || "";
    const songId = extractSongId(href);
    if (!songId) continue;

    // Get child elements (div or span) - first is title, second is artist
    const children = link.querySelectorAll("div, span");
    let rawTitle = "";
    let artist = "";

    if (children.length >= 2) {
      rawTitle = (children[0].textContent || "").trim();
      artist = (children[1].textContent || "").trim();
    } else {
      // Fallback: U-Fret may use plain text with title and artist separated by newline
      const fullText = (link.textContent || "").trim();
      const lines = fullText.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      if (lines.length >= 2) {
        rawTitle = lines[0];
        artist = lines[1];
      } else if (lines.length === 1) {
        rawTitle = lines[0];
      } else {
        rawTitle = fullText;
      }
    }

    if (!rawTitle) continue;

    const { cleanTitle, version } = extractVersion(rawTitle);

    results.push({
      song_id: songId,
      title: cleanTitle,
      artist,
      url: `https://www.ufret.jp/song.php?data=${songId}`,
      version,
    });
  }

  // Extract unique artists from results
  const seenArtists = new Set<string>();
  const artists: UfretArtistResult[] = [];
  for (const r of results) {
    if (r.artist && !seenArtists.has(r.artist)) {
      seenArtists.add(r.artist);
      artists.push({
        name: r.artist,
        url: `https://www.ufret.jp/artist.php?data=${encodeURIComponent(r.artist)}`,
      });
    }
  }

  // Detect pagination - check for next page link
  const hasMore =
    html.includes(`p=${page + 1}`) || html.includes(`&p=${page + 1}`);

  return {
    artists,
    results,
    has_more: hasMore,
    current_page: page,
  };
}

/**
 * U-Fretアーティストページから曲一覧をパース
 * URL形式: https://www.ufret.jp/artist.php?data=アーティスト名
 */
export function parseArtistPage(
  html: string,
  artistName: string
): UfretSearchResult[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) {
    return [];
  }

  const results: UfretSearchResult[] = [];
  const seenIds = new Set<string>();

  // New U-Fret structure: <li><a href="/song.php?data=ID"><span>title</span><span>artist</span></a></li>
  const songLinks = doc.querySelectorAll('a[href*="/song.php?data="]');

  for (let i = 0; i < songLinks.length; i++) {
    const link = songLinks[i];
    const href = link.getAttribute("href") || "";
    const songId = extractSongId(href);
    if (!songId || seenIds.has(songId)) continue;
    seenIds.add(songId);

    // Get child elements (span or div) - first is title
    const children = link.querySelectorAll("span, div");
    let rawTitle = "";

    if (children.length >= 1) {
      rawTitle = (children[0].textContent || "").trim();
    } else {
      // Fallback: extract first line from plain text
      const fullText = (link.textContent || "").trim();
      const lines = fullText.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      rawTitle = lines[0] || fullText;
    }

    if (!rawTitle) continue;

    const { cleanTitle, version } = extractVersion(rawTitle);

    results.push({
      song_id: songId,
      title: cleanTitle,
      artist: artistName,
      url: `https://www.ufret.jp/song.php?data=${songId}`,
      version,
    });
  }

  return results;
}
