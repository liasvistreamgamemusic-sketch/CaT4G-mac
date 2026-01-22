/**
 * Fetched chord sheet data from external sources
 */
export interface FetchedChordSheet {
  title: string | null;
  artist: string | null;
  key: string | null;
  capo: number | null;
  sections: FetchedSection[];
  source_url: string;
}

/**
 * A section in the chord sheet (e.g., Intro, Verse, Chorus)
 */
export interface FetchedSection {
  name: string;
  lines: FetchedLine[];
}

/**
 * A line containing lyrics and chord positions
 */
export interface FetchedLine {
  lyrics: string;
  chords: FetchedChord[];
}

/**
 * A chord with its position in the lyrics
 */
export interface FetchedChord {
  chord: string;
  position: number;
}

/**
 * Supported site information
 */
export interface SupportedSite {
  name: string;
  domain: string;
  example_url: string;
  notes?: string;
}

/**
 * Parser result with error handling
 */
export type ParseResult =
  | { success: true; data: FetchedChordSheet }
  | { success: false; error: string };

/**
 * Fetch request body
 */
export interface FetchRequest {
  url: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  code?: string;
}

// U-Fretアーティスト検索結果
export interface UfretArtistResult {
  name: string;
  url: string; // https://www.ufret.jp/artist.php?data=XXX
}

// U-Fret検索結果
export interface UfretSearchResult {
  song_id: string;
  title: string;
  artist: string;
  url: string;
  version: string | null; // 初心者向け簡単コード、動画プラス等
}

export interface UfretSearchResponse {
  artists: UfretArtistResult[];
  results: UfretSearchResult[];
  has_more: boolean;
  current_page: number;
}
