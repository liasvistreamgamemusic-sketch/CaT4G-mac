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
        className="absolute inset-0 bg-black/70 backdrop-blur-[8px]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-premium-elevated rounded-[24px] overflow-hidden highlight-line animate-modal-in">
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
            className={`tab-glass flex-1 py-3 text-sm ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            URLから取得
          </button>
          <button
            className={`tab-glass flex-1 py-3 text-sm ${activeTab === 'manual' ? 'active' : ''}`}
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
                  対応: U-Fret, ChordWiki, J-Total
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  {error}
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="rounded-2xl p-4 space-y-3 bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(0,0,0,0.1)]">
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
                  <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] max-h-40 overflow-y-auto">
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
                <label className="block text-sm font-medium mb-2 text-text-secondary">曲名 *</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="曲名を入力"
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
