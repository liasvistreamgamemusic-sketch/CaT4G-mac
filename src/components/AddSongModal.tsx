import { useState } from 'react';
import {
  scraper,
  isSupportedUrl,
  requiresManualInput,
  getSiteName,
} from '@/lib/api';
import type { FetchedChordSheet, UfretSearchResult, UfretArtistResult } from '@/lib/api';
import type { CreateSongInput, CreateSectionInput } from '@/types/database';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (song: CreateSongInput) => Promise<string>;
  onSaveAndEdit?: (songId: string) => void;
}

type TabType = 'search' | 'url' | 'chordwiki' | 'manual';

function generateDefaultTitle(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `Song${y}${m}${d}`;
}

export function AddSongModal({ isOpen, onClose, onSave, onSaveAndEdit }: AddSongModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<FetchedChordSheet | null>(null);

  // 手動入力用
  const [manualTitle, setManualTitle] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualContent, setManualContent] = useState('');

  // ChordWiki HTML入力用
  const [chordwikiHtml, setChordwikiHtml] = useState('');

  // U-Fret検索用
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UfretSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  // アーティスト・複数選択用
  const [artistResults, setArtistResults] = useState<UfretArtistResult[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [bulkSaveProgress, setBulkSaveProgress] = useState({ current: 0, total: 0 });

  if (!isOpen) return null;

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
      // アーティスト名を検索結果から上書き
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

        await onSave(songInput);
      }

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '一括保存に失敗しました');
    } finally {
      setIsBulkSaving(false);
      setBulkSaveProgress({ current: 0, total: 0 });
    }
  };

  const handleUrlFetch = async () => {
    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    if (requiresManualInput(url)) {
      setError('ChordWikiはCloudflare保護のため、「ChordWiki」タブからHTML貼り付けで取得してください');
      return;
    }

    if (!isSupportedUrl(url)) {
      setError('対応サイト: U-Fret, J-Total（ChordWikiはHTML貼り付けで対応）');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await scraper.fetchChordSheet(url);
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChordwikiParse = async () => {
    if (!chordwikiHtml.trim()) {
      setError('HTMLを貼り付けてください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // ChordWikiはCloudFlare保護のためURLスクレイピング不可
      // パーサー選択用にダミーURLを使用
      const result = await scraper.parseChordSheetHtml('https://chordwiki.org/manual', chordwikiHtml);
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パースに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    let songInput: CreateSongInput;

    if ((activeTab === 'search' || activeTab === 'url' || activeTab === 'chordwiki') && preview) {
      songInput = {
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
    } else {
      // 手動入力
      const sections = manualContent.trim()
        ? parseManualContent(manualContent)
        : [{ name: 'Main', lines: [] }];
      songInput = {
        title: manualTitle.trim() || generateDefaultTitle(),
        artistName: manualArtist.trim() || undefined,
        sections,
      };
    }

    try {
      const songId = await onSave(songInput);
      // 手動入力タブの場合は編集画面へ遷移
      if (activeTab === 'manual' && onSaveAndEdit) {
        handleClose();
        onSaveAndEdit(songId);
      } else {
        handleClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  const handleClose = () => {
    setActiveTab('search');
    setUrl('');
    setError(null);
    setPreview(null);
    setSearchQuery('');
    setSearchResults([]);
    setArtistResults([]);
    setSelectedArtist(null);
    setSelectedSongs(new Set());
    setHasMoreResults(false);
    setSearchPage(1);
    setManualTitle('');
    setManualArtist('');
    setManualContent('');
    setChordwikiHtml('');
    onClose();
  };

  const canSave =
    ((activeTab === 'search' || activeTab === 'url' || activeTab === 'chordwiki') && preview) ||
    activeTab === 'manual';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[8px]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-[800px] h-[calc(100vh-80px)] glass-premium-elevated rounded-[24px] overflow-hidden highlight-line animate-modal-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">曲を追加</h2>
          <button
            onClick={handleClose}
            className="btn-glass btn-glass-icon-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            className={`tab-glass flex-1 py-3 text-sm ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            検索
          </button>
          <button
            className={`tab-glass flex-1 py-3 text-sm ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            URL
          </button>
          <button
            className={`tab-glass flex-1 py-3 text-sm ${activeTab === 'chordwiki' ? 'active' : ''}`}
            onClick={() => setActiveTab('chordwiki')}
          >
            ChordWiki
          </button>
          <button
            className={`tab-glass flex-1 py-3 text-sm ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            手動入力
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {activeTab === 'search' ? (
            <div className="space-y-4">
              {/* 検索入力 */}
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

              {/* 選択中のアーティスト表示 */}
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
                    × クリア
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* アーティスト検索結果 */}
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

              {/* 曲検索結果（複数選択対応） */}
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

                  <div className="space-y-1 max-h-60 overflow-y-auto">
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

              {/* 検索結果が0件の場合 */}
              {searchResults.length === 0 && artistResults.length === 0 && searchQuery && !isSearching && !preview && (
                <p className="text-sm text-text-secondary text-center py-4">
                  検索結果がありません
                </p>
              )}

              {/* Preview */}
              {preview && (
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
              )}
            </div>
          ) : activeTab === 'url' ? (
            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">
                  コード譜サイトのURL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.ufret.jp/song.php?data=..."
                    className="input-glass flex-1"
                  />
                  <button
                    onClick={handleUrlFetch}
                    disabled={isLoading}
                    className="btn-glass btn-glass-primary px-5 disabled:opacity-50"
                  >
                    {isLoading ? '取得中...' : '取得'}
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  対応: U-Fret, J-Total（ChordWikiは専用タブへ）
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Preview */}
              {preview && (
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
                    {preview.capo && preview.capo > 0 && <span>Capo: {preview.capo}</span>}
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
              )}
            </div>
          ) : activeTab === 'chordwiki' ? (
            <div className="space-y-4">
              {/* ChordWiki HTML Input */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm">
                <p className="font-medium mb-1">ChordWikiはHTML貼り付けで対応</p>
                <ol className="list-decimal list-inside text-xs text-amber-300/80 space-y-1">
                  <li>ChordWikiの曲ページをブラウザで開く</li>
                  <li>右クリック→「ページのソースを表示」</li>
                  <li>全選択(Ctrl+A)してコピー</li>
                  <li>下のテキストエリアに貼り付け</li>
                </ol>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">
                  HTMLソース
                </label>
                <textarea
                  value={chordwikiHtml}
                  onChange={(e) => setChordwikiHtml(e.target.value)}
                  placeholder="ページのHTMLソースを貼り付け..."
                  rows={8}
                  className="input-glass font-mono text-xs resize-none"
                />
              </div>
              <button
                onClick={handleChordwikiParse}
                disabled={isLoading}
                className="btn-glass btn-glass-primary w-full disabled:opacity-50"
              >
                {isLoading ? 'パース中...' : 'HTMLをパース'}
              </button>

              {/* Error */}
              {error && (
                <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="rounded-2xl p-4 space-y-3 bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{preview.title || '無題'}</h3>
                      <p className="text-text-secondary">{preview.artist || '不明'}</p>
                    </div>
                    <span className="badge-glass-primary">ChordWiki</span>
                  </div>
                  <div className="flex gap-4 text-sm text-text-secondary">
                    <span>{preview.sections.length} セクション</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Manual Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">曲名</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="空の場合は自動命名（例: Song20260123）"
                  className="input-glass"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">アーティスト</label>
                <input
                  type="text"
                  value={manualArtist}
                  onChange={(e) => setManualArtist(e.target.value)}
                  placeholder="アーティスト名"
                  className="input-glass"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">
                  コード譜（[セクション名]で区切り）
                </label>
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder={`[Intro]\nC  G  Am  F\n\n[Verse]\nC        G\n歌詞を入力\nAm       F\n続きの歌詞`}
                  rows={10}
                  className="input-glass font-mono text-sm resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="btn-glass btn-glass-ghost px-5"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-glass btn-glass-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeTab === 'manual' ? '編集へ' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 手動入力コンテンツをパース
function parseManualContent(content: string): CreateSectionInput[] {
  const lines = content.split('\n');
  const sections: CreateSectionInput[] = [];
  let currentSection: CreateSectionInput = { name: 'Main', lines: [] };

  for (const line of lines) {
    const trimmed = line.trim();

    // セクションマーカー
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { name: trimmed.slice(1, -1), lines: [] };
      continue;
    }

    if (trimmed === '') continue;

    // 簡易パース: コード行かどうかを判定
    const tokens = trimmed.split(/\s+/);
    const chordCount = tokens.filter(isChord).length;
    const isChordLine = tokens.length > 0 && chordCount / tokens.length > 0.5;

    if (isChordLine) {
      // コード行
      let position = 0;
      const chords = tokens
        .filter(isChord)
        .map((chord) => {
          const pos = trimmed.indexOf(chord, position);
          position = pos + chord.length;
          return { chord, position: pos };
        });
      currentSection.lines.push({ lyrics: '', chords });
    } else {
      // 歌詞行 - 前のコード行に追加するか新規作成
      const lastLine = currentSection.lines[currentSection.lines.length - 1];
      if (lastLine && lastLine.lyrics === '' && lastLine.chords.length > 0) {
        lastLine.lyrics = trimmed;
      } else {
        currentSection.lines.push({ lyrics: trimmed, chords: [] });
      }
    }
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return sections.length > 0 ? sections : [{ name: 'Main', lines: [] }];
}

function isChord(token: string): boolean {
  return /^[A-G][#♯b♭]?(m|M|maj|min|dim|aug|sus[24]?|add\d+|\d+|7|9|11|13)?(\/[A-G][#♯b♭]?)?$/.test(
    token
  );
}
