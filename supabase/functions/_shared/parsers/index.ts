/**
 * Parser index - Site detection and parser selection
 */

import { fetchPage, extractDomain } from "../http.ts";
import type { FetchedChordSheet, SupportedSite, ParseResult } from "../types.ts";
import { parse as parseUfret } from "./ufret.ts";
import { parse as parseJtotal } from "./jtotal.ts";
import { parse as parseGakkime } from "./gakkime.ts";
import { parse as parseChordwiki } from "./chordwiki.ts";

/**
 * Supported sites configuration
 */
export const SUPPORTED_SITES: SupportedSite[] = [
  {
    name: "U-Fret",
    domain: "ufret.jp",
    example_url: "https://www.ufret.jp/song.php?data=12345",
  },
  {
    name: "J-Total",
    domain: "j-total.net",
    example_url: "https://music.j-total.net/data/012/345_sample/",
  },
  {
    name: "楽器.me",
    domain: "gakufu.gakki.me",
    example_url: "https://gakufu.gakki.me/m/data/12345.html",
  },
  {
    name: "ChordWiki",
    domain: "chordwiki.org",
    example_url: "https://ja.chordwiki.org/wiki/SampleSong",
    notes: "Cloudflare protection may require manual HTML input",
  },
];

/**
 * Site type enum for parser selection
 */
type SiteType = "ufret" | "jtotal" | "gakkime" | "chordwiki" | null;

/**
 * Detect site type from URL
 */
function detectSiteType(url: string): SiteType {
  const domain = extractDomain(url).toLowerCase();

  if (domain.includes("ufret.jp")) {
    return "ufret";
  }
  if (domain.includes("j-total.net") || domain.includes("music.j-total.net")) {
    return "jtotal";
  }
  if (domain.includes("gakki.me") || domain.includes("gakufu.gakki.me")) {
    return "gakkime";
  }
  if (domain.includes("chordwiki.org")) {
    return "chordwiki";
  }

  return null;
}

/**
 * Parse HTML using the appropriate parser
 */
function parseHtml(
  siteType: SiteType,
  html: string,
  sourceUrl: string
): FetchedChordSheet {
  switch (siteType) {
    case "ufret":
      return parseUfret(html, sourceUrl);
    case "jtotal":
      return parseJtotal(html, sourceUrl);
    case "gakkime":
      return parseGakkime(html, sourceUrl);
    case "chordwiki":
      return parseChordwiki(html, sourceUrl);
    default:
      throw new Error("Unsupported site");
  }
}

/**
 * Fetch and parse a chord sheet from URL
 */
export async function fetchAndParse(url: string): Promise<ParseResult> {
  try {
    // Validate URL
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return { success: false, error: "Invalid URL format" };
    }

    // Detect site type
    const siteType = detectSiteType(url);
    if (!siteType) {
      return {
        success: false,
        error: `Unsupported site. Supported sites: ${SUPPORTED_SITES.map(
          (s) => s.domain
        ).join(", ")}`,
      };
    }

    // Special handling for ChordWiki (Cloudflare protected)
    if (siteType === "chordwiki") {
      return {
        success: false,
        error:
          "ChordWiki requires manual HTML input due to Cloudflare protection. Use parseHtmlOnly endpoint instead.",
      };
    }

    // Fetch the page
    let html: string;
    try {
      html = await fetchPage(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Failed to fetch page: ${message}` };
    }

    // Parse the HTML
    try {
      const data = parseHtml(siteType, html, url);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Failed to parse page: ${message}` };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Unexpected error: ${message}` };
  }
}

/**
 * Parse HTML content directly (for ChordWiki or cached content)
 */
export function parseHtmlOnly(
  url: string,
  html: string
): ParseResult {
  try {
    // Detect site type
    const siteType = detectSiteType(url);
    if (!siteType) {
      return {
        success: false,
        error: `Unsupported site. Supported sites: ${SUPPORTED_SITES.map(
          (s) => s.domain
        ).join(", ")}`,
      };
    }

    // Parse the HTML
    const data = parseHtml(siteType, html, url);
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Failed to parse: ${message}` };
  }
}

/**
 * Check if a URL is from a supported site
 */
export function isSupportedUrl(url: string): boolean {
  return detectSiteType(url) !== null;
}

/**
 * Get site info for a URL
 */
export function getSiteInfo(url: string): SupportedSite | null {
  const siteType = detectSiteType(url);
  if (!siteType) return null;

  return SUPPORTED_SITES.find((site) => {
    const domain = extractDomain(url).toLowerCase();
    return domain.includes(site.domain);
  }) || null;
}
