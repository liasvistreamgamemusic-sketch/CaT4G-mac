/**
 * CaT4G Tauri Scraper Implementation
 * Chord sheet scraping via Rust backend
 */

import { invoke } from '@tauri-apps/api/core';
import type { ScraperAPI } from '../types';
import type { FetchedChordSheet, SupportedSite } from '@/lib/scraper';

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
 * Parse HTML content into chord sheet (for manual HTML input)
 * @param url - Source URL (for parser selection)
 * @param html - HTML content to parse
 * @returns Parsed chord sheet data
 */
export async function parseChordSheetHtml(
  url: string,
  html: string
): Promise<FetchedChordSheet> {
  return await invoke<FetchedChordSheet>('parse_chord_sheet', { url, html });
}

/**
 * Get list of supported chord sheet sites
 * @returns Array of supported site information
 */
export async function getSupportedSites(): Promise<SupportedSite[]> {
  return await invoke<SupportedSite[]>('get_supported_sites');
}

// ============================================
// Utility Functions (re-exported for convenience)
// ============================================

/**
 * Check if a URL is from a supported site
 * @param url - URL to check
 * @returns true if the URL is from a supported site
 */
export function isSupportedUrl(url: string): boolean {
  // ChordWiki is excluded due to Cloudflare protection - use manual HTML input instead
  const supportedDomains = ['ufret.jp', 'j-total.net', 'gakufu.gakki.me'];
  return supportedDomains.some((domain) => url.includes(domain));
}

/**
 * Check if URL requires manual HTML input (Cloudflare protected sites)
 */
export function requiresManualInput(url: string): boolean {
  return url.includes('chordwiki.org');
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
  if (url.includes('gakufu.gakki.me')) return '楽器.me';
  return 'Unknown';
}

// ============================================
// Export as ScraperAPI implementation
// ============================================

export const tauriScraper: ScraperAPI = {
  fetchChordSheet,
  parseChordSheetHtml,
  getSupportedSites,
};
