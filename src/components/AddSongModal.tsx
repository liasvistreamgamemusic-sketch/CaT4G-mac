import { useState } from 'react';
import { fetchChordSheet, isSupportedUrl, getSiteName } from '@/lib/scraper';
import type { FetchedChordSheet } from '@/lib/scraper';
import type { CreateSongInput, CreateSectionInput } from '@/types/database';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (song: CreateSongInput) => Promise<void>;
}

type TabType = 'url' | 'manual';

export function AddSongModal({ isOpen, onClose, onSave }: AddSongModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('url');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<FetchedChordSheet | null>(null);

  // 手動入力用
  const [manualTitle, setManualTitle] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualContent, setManualContent] = useState('');

  if (!isOpen) return null;

  const handleUrlFetch = async () => {
    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }

    if (!isSupportedUrl(url)) {
      setError('対応サイト: U-Fret, ChordWiki, J-Total');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchChordSheet(url);
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    let songInput: CreateSongInput;

    if (activeTab === 'url' && preview) {
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
      const sections = parseManualContent(manualContent);
      songInput = {
        title: manualTitle || '無題',
        artistName: manualArtist || undefined,
        sections,
      };
    }

    try {
      await onSave(songInput);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    }
  };

  const handleClose = () => {
    setUrl('');
    setPreview(null);
    setError(null);
    setManualTitle('');
    setManualArtist('');
    setManualContent('');
    setActiveTab('url');
    onClose();
  };

  const canSave =
    (activeTab === 'url' && preview) ||
    (activeTab === 'manual' && manualTitle.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-background-surface rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">曲を追加</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('url')}
          >
            URLから取得
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'manual'
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('manual')}
          >
            手動入力
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'url' ? (
            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  コード譜サイトのURL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.ufret.jp/song.php?data=..."
                    className="flex-1 bg-background-primary border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-accent-primary"
                  />
                  <button
                    onClick={handleUrlFetch}
                    disabled={isLoading}
                    className="btn-primary px-4 disabled:opacity-50"
                  >
                    {isLoading ? '取得中...' : '取得'}
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  対応: U-Fret, ChordWiki, J-Total
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="bg-background-primary rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{preview.title || '無題'}</h3>
                      <p className="text-text-secondary">{preview.artist || '不明'}</p>
                    </div>
                    <span className="text-xs bg-accent-primary/20 text-accent-primary px-2 py-1 rounded">
                      {getSiteName(preview.source_url)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-text-secondary">
                    {preview.key && <span>Key: {preview.key}</span>}
                    {preview.capo && preview.capo > 0 && <span>Capo: {preview.capo}</span>}
                    <span>{preview.sections.length} セクション</span>
                  </div>
                  {/* Preview content */}
                  <div className="mt-3 p-3 bg-background-surface rounded border border-white/5 max-h-40 overflow-y-auto">
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
          ) : (
            <div className="space-y-4">
              {/* Manual Input */}
              <div>
                <label className="block text-sm font-medium mb-2">曲名 *</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="曲名を入力"
                  className="w-full bg-background-primary border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">アーティスト</label>
                <input
                  type="text"
                  value={manualArtist}
                  onChange={(e) => setManualArtist(e.target.value)}
                  placeholder="アーティスト名"
                  className="w-full bg-background-primary border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  コード譜（[セクション名]で区切り）
                </label>
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder={`[Intro]\nC  G  Am  F\n\n[Verse]\nC        G\n歌詞を入力\nAm       F\n続きの歌詞`}
                  rows={10}
                  className="w-full bg-background-primary border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-accent-primary font-mono text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
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
