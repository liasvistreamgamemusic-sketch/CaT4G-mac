/**
 * SearchTab - U-Fret search functionality for HomePage
 *
 * Extracted from AddSongModal's search tab logic.
 * Allows searching, previewing, and saving songs from U-Fret.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  scraper,
  getSiteName,
} from '@/lib/api';
import type { FetchedChordSheet, UfretSearchResult, UfretArtistResult } from '@/lib/api';
import type { CreateSongInput, CreateSectionInput } from '@/types/database';
import { useAppData } from '@/contexts/AppDataContext';

export function SearchTab() {
  const navigate = useNavigate();
  const { handleSaveSong } = useAppData();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<FetchedChordSheet | null>(null);

  // U-Fret search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UfretSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  // Artist & multi-select state
  const [artistResults, setArtistResults] = useState<UfretArtistResult[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [bulkSaveProgress, setBulkSaveProgress] = useState({ current: 0, total: 0 });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    setSelectedArtist(null);
    setSelectedSongs(new Set());
    try {
      const response = await scraper.searchUfret(searchQuery, 1);
      setArtistResults(response.artists);
      setSearchResults(response.results);
      setHasMoreResults(response.has_more);
      setSearchPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = searchPage + 1;
    try {
      const response = await scraper.searchUfret(searchQuery, nextPage);
      setSearchResults([...searchResults, ...response.results]);
      setHasMoreResults(response.has_more);
      setSearchPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    }
  };

  const handleSelectSearchResult = async (result: UfretSearchResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const sheet = await scraper.fetchChordSheet(result.url);
      sheet.artist = result.artist || sheet.artist;
      setPreview(sheet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'コード譜の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectArtist = async (artist: UfretArtistResult) => {
    setSelectedArtist(artist.name);
    setIsLoading(true);
    setError(null);
    setSelectedSongs(new Set());
    try {
      const songs = await scraper.fetchArtistSongs(artist.url, artist.name);
      setSearchResults(songs);
      setArtistResults([]);
      setHasMoreResults(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アーティストの曲一覧取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedSongs.size === searchResults.length) {
      setSelectedSongs(new Set());
    } else {
      setSelectedSongs(new Set(searchResults.map((r) => r.song_id)));
    }
  };

  const handleBulkSave = async () => {
    const songsToSave = searchResults.filter((r) => selectedSongs.has(r.song_id));
    if (songsToSave.length === 0) return;

    setIsBulkSaving(true);
    setBulkSaveProgress({ current: 0, total: songsToSave.length });
    setError(null);

    try {
      let lastSavedId: string | null = null;
      for (let i = 0; i < songsToSave.length; i++) {
        const song = songsToSave[i];
        setBulkSaveProgress({ current: i + 1, total: songsToSave.length });

        const sheet = await scraper.fetchChordSheet(song.url);
        sheet.artist = song.artist || sheet.artist;

        const songInput: CreateSongInput = {
          title: sheet.title || '無題',
          artistName: sheet.artist || undefined,
          originalKey: sheet.key || undefined,
          capo: sheet.capo || 0,
          sourceUrl: sheet.source_url,
          sections: sheet.sections.map((s) => ({
            name: s.name,
            lines: s.lines.map((l) => ({
              lyrics: l.lyrics,
              chords: l.chords.map((c) => ({ chord: c.chord, position: c.position })),
            })),
          })),
        };

        lastSavedId = await handleSaveSong(songInput);
      }

      // Navigate to the last saved song
      if (lastSavedId) {
        navigate(`/songs?id=${lastSavedId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '一括保存に失敗しました');
    } finally {
      setIsBulkSaving(false);
      setBulkSaveProgress({ current: 0, total: 0 });
    }
  };

  const handleSave = async () => {
    if (!preview) return;

    const songInput: CreateSongInput = {
      title: preview.title || '無題',
      artistName: preview.artist || undefined,
      originalKey: preview.key || undefined,
      capo: preview.capo || 0,
      sourceUrl: preview.source_url,
      sections: preview.sections.map((s): CreateSectionInput => ({
        name: s.name,
        lines: s.lines.map((l) => ({
          lyrics: l.lyrics,
          chords: l.chords.map((c) => ({
            chord: c.chord,
            position: c.position,
          })),
        })),
      })),
    };

    try {
      const songId = await handleSaveSong(songInput);
      navigate(`/songs?id=${songId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-secondary">
          曲名・アーティスト名で検索
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="曲名やアーティスト名を入力..."
            className="input-glass flex-1"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="btn-glass btn-glass-primary px-5"
          >
            {isSearching ? '検索中...' : '検索'}
          </button>
        </div>
      </div>

      {/* Selected artist display */}
      {selectedArtist && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">アーティスト:</span>
          <span className="font-medium">{selectedArtist}</span>
          <button
            onClick={() => {
              setSelectedArtist(null);
              setSearchResults([]);
              setSelectedSongs(new Set());
            }}
            className="text-text-secondary hover:text-text-primary"
          >
            x クリア
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Artist results */}
      {artistResults.length > 0 && !preview && (
        <div className="space-y-2">
          <div className="text-sm text-text-secondary">
            アーティスト ({artistResults.length}件)
          </div>
          <div className="flex flex-wrap gap-2">
            {artistResults.map((artist) => (
              <button
                key={artist.name}
                onClick={() => handleSelectArtist(artist)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30
                           hover:bg-orange-500/30 text-sm transition-colors disabled:opacity-50"
              >
                {artist.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Song search results with multi-select */}
      {searchResults.length > 0 && !preview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              曲 ({searchResults.length}件)
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="text-xs text-orange-400 hover:text-orange-300"
              >
                {selectedSongs.size === searchResults.length ? '選択解除' : '全選択'}
              </button>
              {selectedSongs.size > 0 && (
                <button
                  onClick={handleBulkSave}
                  disabled={isBulkSaving}
                  className="px-3 py-1 rounded-lg bg-orange-500 text-white text-sm
                             hover:bg-orange-600 disabled:opacity-50"
                >
                  {isBulkSaving
                    ? `保存中... (${bulkSaveProgress.current}/${bulkSaveProgress.total})`
                    : `選択した曲を保存 (${selectedSongs.size}曲)`}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result.song_id}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]
                           border border-white/[0.06] hover:bg-white/[0.06]"
              >
                <input
                  type="checkbox"
                  checked={selectedSongs.has(result.song_id)}
                  onChange={() => toggleSongSelection(result.song_id)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5
                             accent-orange-500"
                />
                <button
                  onClick={() => handleSelectSearchResult(result)}
                  disabled={isLoading || isBulkSaving}
                  className="flex-1 text-left disabled:opacity-50"
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-text-secondary">
                    {result.artist}
                    {result.version && (
                      <span className="ml-2 text-xs text-orange-400">
                        {result.version}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {hasMoreResults && (
            <button
              onClick={handleLoadMore}
              className="w-full py-2 text-sm text-text-secondary hover:text-text-primary"
            >
              もっと見る...
            </button>
          )}
        </div>
      )}

      {/* No results */}
      {searchResults.length === 0 && artistResults.length === 0 && searchQuery && !isSearching && !preview && (
        <p className="text-sm text-text-secondary text-center py-4">
          検索結果がありません
        </p>
      )}

      {/* Preview */}
      {preview && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4 space-y-3 bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{preview.title || '無題'}</h3>
                <p className="text-text-secondary">{preview.artist || '不明'}</p>
              </div>
              <span className="badge-glass-primary">
                {getSiteName(preview.source_url)}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-text-secondary">
              {preview.key && <span>Key: {preview.key}</span>}
              {preview.capo !== null && preview.capo > 0 && <span>Capo: {preview.capo}</span>}
              <span>{preview.sections.length} セクション</span>
            </div>
            {/* Preview content */}
            <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] max-h-40 overflow-y-auto">
              <pre className="text-xs text-text-muted font-mono">
                {preview.sections.slice(0, 2).map((s, i) => (
                  <div key={i}>
                    [{s.name}]
                    {'\n'}
                    {s.lines.slice(0, 3).map((l, j) => (
                      <span key={j}>
                        {l.chords.map((c) => c.chord).join(' ')}
                        {'\n'}
                        {l.lyrics}
                        {'\n'}
                      </span>
                    ))}
                    {s.lines.length > 3 && '...\n'}
                  </div>
                ))}
                {preview.sections.length > 2 && '...'}
              </pre>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setPreview(null)}
              className="btn-glass btn-glass-ghost px-5"
            >
              戻る
            </button>
            <button
              onClick={handleSave}
              className="btn-glass btn-glass-primary px-6"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
