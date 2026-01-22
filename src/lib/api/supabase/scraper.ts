/**
 * CaT4G Supabase Scraper Implementation
 * Chord sheet scraping via Edge Functions
 *
 * NOTE: This is a stub implementation for Phase 4.
 * Full implementation will be added when Edge Functions are deployed.
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { ScraperAPI } from '../types';
import type {
  FetchedChordSheet,
  SupportedSite,
  UfretSearchResponse,
  UfretSearchResult,
} from '@/lib/scraper';

/**
 * Fetch and parse chord sheet from URL via Edge Function
 * @param url - URL of the chord sheet page
 * @returns Parsed chord sheet data
 * @throws Error if Edge Function fails or URL is unsupported
 */
export async function fetchChordSheet(url: string): Promise<FetchedChordSheet> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.functions.invoke<{
    success: boolean;
    data?: FetchedChordSheet;
    error?: string;
  }>('fetch-chord-sheet', {
    body: { url },
  });

  if (error) {
    throw new Error(`Failed to fetch chord sheet: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from Edge Function');
  }

  if (!data.success) {
    throw new Error(data.error || 'Edge Function returned an error');
  }

  if (!data.data) {
    throw new Error('No chord sheet data in response');
  }

  return data.data;
}

/**
 * Parse HTML content into chord sheet via Edge Function
 * @param url - Source URL (for parser selection)
 * @param html - HTML content to parse
 * @returns Parsed chord sheet data
 */
export async function parseChordSheetHtml(
  url: string,
  html: string
): Promise<FetchedChordSheet> {
  const supabase = getSupabaseClient();

  // Note: fetch-chord-sheet handles both URL fetching and HTML parsing
  const { data, error } = await supabase.functions.invoke<{
    success: boolean;
    data?: FetchedChordSheet;
    error?: string;
  }>('fetch-chord-sheet', {
    body: { url, html },
  });

  if (error) {
    throw new Error(`Failed to parse chord sheet: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from Edge Function');
  }

  if (!data.success) {
    throw new Error(data.error || 'Edge Function returned an error');
  }

  if (!data.data) {
    throw new Error('No chord sheet data in response');
  }

  return data.data;
}

/**
 * Get list of supported chord sheet sites
 * @returns Array of supported site information
 */
export async function getSupportedSites(): Promise<SupportedSite[]> {
  // Static list - same as Tauri implementation
  // Could be moved to Edge Function if dynamic configuration is needed
  return [
    {
      name: 'U-Fret',
      domain: 'ufret.jp',
      example_url: 'https://www.ufret.jp/song.php?data=12345',
    },
    {
      name: 'ChordWiki',
      domain: 'chordwiki.org',
      example_url: 'https://chordwiki.org/wiki/曲名',
    },
    {
      name: 'J-Total',
      domain: 'j-total.net',
      example_url: 'https://music.j-total.net/data/xxx/yyy.html',
    },
    {
      name: '楽器.me',
      domain: 'gakufu.gakki.me',
      example_url: 'https://gakufu.gakki.me/m/data/xxx.html',
    },
  ];
}

/**
 * U-Fretで曲を検索
 */
export async function searchUfret(
  query: string,
  page: number = 1
): Promise<UfretSearchResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.functions.invoke<{
    success: boolean;
    data?: UfretSearchResponse;
    error?: string;
  }>('search-ufret', {
    body: { query, page },
  });

  if (error) {
    throw new Error(`検索エラー: ${error.message}`);
  }

  if (!data?.success || !data.data) {
    throw new Error(data?.error || '検索結果の取得に失敗しました');
  }

  return data.data;
}

/**
 * U-Fretアーティストの曲一覧を取得
 */
export async function fetchArtistSongs(
  artistUrl: string,
  artistName: string
): Promise<UfretSearchResult[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.functions.invoke<{
    success: boolean;
    data?: UfretSearchResult[];
    error?: string;
  }>('fetch-artist-songs', {
    body: { artistUrl, artistName },
  });

  if (error) {
    throw new Error(`アーティスト曲一覧取得エラー: ${error.message}`);
  }

  if (!data?.success || !data.data) {
    throw new Error(data?.error || 'アーティスト曲一覧の取得に失敗しました');
  }

  return data.data;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if a URL is from a supported site
 * @param url - URL to check
 * @returns true if the URL is from a supported site
 */
export function isSupportedUrl(url: string): boolean {
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

export const supabaseScraper: ScraperAPI = {
  fetchChordSheet,
  parseChordSheetHtml,
  getSupportedSites,
  searchUfret,
  fetchArtistSongs,
};
