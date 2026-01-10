import { invoke } from '@tauri-apps/api/core';

// Types matching Rust backend structures
export interface FetchedChordSheet {
  title: string | null;
  artist: string | null;
  key: string | null;
  capo: number | null;
  sections: FetchedSection[];
  source_url: string;
}

export interface FetchedSection {
  name: string;
  lines: FetchedLine[];
}

export interface FetchedLine {
  lyrics: string;
  chords: FetchedChord[];
}

export interface FetchedChord {
  chord: string;
  position: number;
}

export interface SupportedSite {
  name: string;
  domain: string;
  example_url: string;
}

/**
 * Fetch and parse chord sheet from URL
 * @param url - URL of the chord sheet page
 * @returns Parsed chord sheet data
 * @throws Error if URL is unsupported or parsing fails
 */
export async function fetchChordSheet(url: string): Promise<FetchedChordSheet> {
  return await invoke<FetchedChordSheet>('fetch_chord_sheet', { url });
}

/**
 * Get list of supported chord sheet sites
 * @returns Array of supported site information
 */
export async function getSupportedSites(): Promise<SupportedSite[]> {
  return await invoke<SupportedSite[]>('get_supported_sites');
}

/**
 * Check if a URL is from a supported site
 * @param url - URL to check
 * @returns true if the URL is from a supported site
 */
export function isSupportedUrl(url: string): boolean {
  // Note: 'chordwiki.org' matches both chordwiki.org and ja.chordwiki.org (actual site domain)
  const supportedDomains = ['ufret.jp', 'chordwiki.org', 'j-total.net'];
  return supportedDomains.some((domain) => url.includes(domain));
}

/**
 * Extract domain name from URL for display
 * @param url - Full URL
 * @returns Site name or 'Unknown'
 */
export function getSiteName(url: string): string {
  if (url.includes('ufret.jp')) return 'U-Fret';
  if (url.includes('chordwiki.org')) return 'ChordWiki';
  if (url.includes('j-total.net')) return 'J-Total';
  return 'Unknown';
}
