/**
 * ChordDiagramModal - コードダイアグラム表示モーダル
 * クリックしたコードの押さえ方を表示
 */

import { useState, useEffect, useCallback } from 'react';
import { ChordDiagramHorizontal } from './ChordDiagramHorizontal';
import { getChordDefinition, getDefaultFingering, generateChordFingerings } from '@/lib/chords';
import type { ChordFingering } from '@/lib/chords/types';

interface ChordDiagramModalProps {
  chord: string | null;
  onClose: () => void;
}

export function ChordDiagramModal({ chord, onClose }: ChordDiagramModalProps) {
  const [selectedFingeringIndex, setSelectedFingeringIndex] = useState(0);
  const [fingerings, setFingerings] = useState<ChordFingering[]>([]);

  // コードが変わったらフィンガリングを取得
  useEffect(() => {
    if (!chord) {
      setFingerings([]);
      return;
    }

    const def = getChordDefinition(chord);
    if (def) {
      setFingerings(def.fingerings);
      // デフォルトを選択
      const defaultIndex = def.fingerings.findIndex((f) => f.isDefault);
      setSelectedFingeringIndex(defaultIndex >= 0 ? defaultIndex : 0);
    } else {
      // データベースにない場合は動的生成（複数の押さえ方を生成）
      const generated = generateChordFingerings(chord);
      if (generated.length > 0) {
        setFingerings(generated);
      } else {
        // 動的生成できなかった場合、デフォルトフィンガリングを試す
        const fallback = getDefaultFingering(chord);
        setFingerings(fallback ? [fallback] : []);
      }
      setSelectedFingeringIndex(0);
    }
  }, [chord]);

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

  // モーダルが閉じている場合は何も表示しない
  if (!chord) return null;

  const currentFingering = fingerings[selectedFingeringIndex];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-background-surface border border-white/10 rounded-xl p-6 min-w-[280px] max-w-md shadow-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">{chord}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ダイアグラム表示（横向き） */}
        {currentFingering ? (
          <div className="flex flex-col items-center">
            <ChordDiagramHorizontal
              fingering={currentFingering}
              size="lg"
              showFingers={true}
            />

            {/* 難易度表示 */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-text-secondary text-sm">難易度:</span>
              <span
                className={`text-sm font-medium px-2 py-0.5 rounded ${
                  currentFingering.difficulty === 'easy'
                    ? 'bg-green-500/20 text-green-400'
                    : currentFingering.difficulty === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                }`}
              >
                {currentFingering.difficulty === 'easy'
                  ? '簡単'
                  : currentFingering.difficulty === 'medium'
                    ? '普通'
                    : '難しい'}
              </span>
            </div>

            {/* 複数の押さえ方がある場合の切り替え */}
            {fingerings.length > 1 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-text-secondary text-sm">押さえ方:</span>
                <div className="flex gap-1">
                  {fingerings.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFingeringIndex(index)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        index === selectedFingeringIndex
                          ? 'bg-accent-primary text-white'
                          : 'bg-white/10 text-text-secondary hover:bg-white/20'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            <p>このコードのダイアグラムはまだ登録されていません</p>
            <p className="text-sm mt-2 opacity-70">
              将来のアップデートで追加予定です
            </p>
          </div>
        )}

        {/* フッター */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-text-secondary">
            コードをクリックするとダイアグラムが表示されます
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChordDiagramModal;
