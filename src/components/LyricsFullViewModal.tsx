/**
 * LyricsFullViewModal - 歌詞全文表示モーダル
 * 歌詞全体を1画面に収めて表示
 */

import { useEffect, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import type { SongWithDetails } from '@/types/database';

interface LyricsFullViewModalProps {
  /** 曲データ */
  song: SongWithDetails | null;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
}

/**
 * 行数に応じたフォントサイズを計算
 */
function calculateFontSize(totalLines: number): number {
  if (totalLines <= 20) return 14;
  if (totalLines <= 40) return 12;
  if (totalLines <= 60) return 10;
  if (totalLines <= 80) return 9;
  return 8;
}

export function LyricsFullViewModal({ song, onClose }: LyricsFullViewModalProps) {
  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 背景クリックで閉じる
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // 歌詞データを整形
  const lyricsData = useMemo(() => {
    if (!song) return { sections: [], totalLines: 0 };

    const sections = song.sections.map(({ section, lines }) => ({
      name: section.name,
      lyrics: lines.map((line) => line.lyrics || ''),
    }));

    const totalLines = sections.reduce((sum, s) => sum + s.lyrics.length, 0);

    return { sections, totalLines };
  }, [song]);

  // フォントサイズを計算
  const fontSize = useMemo(
    () => calculateFontSize(lyricsData.totalLines),
    [lyricsData.totalLines]
  );

  // モーダルが閉じている場合は何も表示しない
  if (!song) return null;

  const { song: songData, artist } = song;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="border border-white/10 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        style={{
          background: 'var(--glass-premium-bg)',
          backgroundColor: 'var(--color-bg-surface)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {songData.title}
            </h2>
            {artist && (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {artist.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 歌詞コンテンツ */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
            {lyricsData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* セクション名 */}
                <div
                  className="font-semibold mb-1 px-2 py-0.5 rounded inline-block"
                  style={{
                    color: 'var(--color-accent-primary)',
                    backgroundColor: 'var(--color-accent-primary)',
                    opacity: 0.15,
                  }}
                >
                  <span style={{ opacity: 1, color: 'var(--color-accent-primary)' }}>
                    [{section.name}]
                  </span>
                </div>
                {/* 歌詞行 */}
                <div className="space-y-0.5 pl-2">
                  {section.lyrics.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className="leading-relaxed"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {line || <span style={{ color: 'var(--color-text-muted)' }}>&nbsp;</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="p-3 border-t border-white/10 text-center flex-shrink-0">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            全 {lyricsData.totalLines} 行
          </p>
        </div>
      </div>
    </div>
  );
}

export default LyricsFullViewModal;
