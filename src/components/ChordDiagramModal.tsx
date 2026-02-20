/**
 * ChordDiagramModal - コードダイアグラム表示モーダル
 * クリックしたコードの押さえ方を表示
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChordDiagramHorizontal } from './ChordDiagramHorizontal';
import { getChordDefinition, getDefaultFingering, generateChordFingerings } from '@/lib/chords';
import { useChordPreferencesContextSafe } from '@/contexts/ChordPreferencesContext';
import type { ChordFingering } from '@/lib/chords/types';

interface ChordDiagramModalProps {
  chord: string | null;
  onClose: () => void;
}

/**
 * フィンガリングIDからCAGEDフォーム名を抽出
 * 例: "C-E-barre" -> "E", "Am-C-open" -> "C", "C-open" -> "C"
 */
function extractFormName(fingeringId: string): string | null {
  // パターン: {root}{quality}-{form}-{variant} または {root}-{form}
  // 例: "C-E-barre", "Am-Cm-open", "C-open"
  const parts = fingeringId.split('-');
  if (parts.length >= 2) {
    const formPart = parts[1];
    // CAGEDフォーム名を検出（大文字の場合）
    if (['E', 'A', 'G', 'C', 'D'].includes(formPart)) {
      return formPart;
    }
    // マイナーフォーム名を検出（Em, Am等）
    if (formPart.length <= 3 && formPart.match(/^[A-G][mb]?$/)) {
      return formPart[0]; // 最初の文字だけ返す（E, A, G, C, D）
    }
    // openやbarreが直接続く場合はルートがフォーム
    if (['open', 'barre', 'easy'].includes(formPart)) {
      // 最初のパートがルート音+フォーム（例: "C-open" -> C form）
      const rootMatch = parts[0].match(/^([A-G][#b]?)/);
      if (rootMatch) {
        return rootMatch[1][0]; // ルートの最初の文字
      }
    }
  }
  return null;
}

/**
 * フォーム名の表示用ラベルを取得
 */
function getFormLabel(fingeringId: string, baseFret: number): string {
  const form = extractFormName(fingeringId);
  const isOpen = baseFret === 1 && (fingeringId.includes('open') || !fingeringId.includes('barre'));

  if (form) {
    if (isOpen) {
      return `${form}フォーム`;
    }
    return `${form}フォーム (${baseFret}f)`;
  }

  // フォームが特定できない場合
  if (fingeringId.startsWith('generated-')) {
    return `その他 (${baseFret}f)`;
  }
  return baseFret === 1 ? 'オープン' : `${baseFret}f`;
}

export function ChordDiagramModal({ chord, onClose }: ChordDiagramModalProps) {
  const [selectedFingeringIndex, setSelectedFingeringIndex] = useState(0);
  const [fingerings, setFingerings] = useState<ChordFingering[]>([]);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  // Get chord preferences context (may be null if not wrapped in provider)
  const chordPreferencesContext = useChordPreferencesContextSafe();

  const { getPreferred, setDefault } = chordPreferencesContext ?? {
    getPreferred: () => null,
    setDefault: async () => {},
  };

  // コードが変わったらフィンガリングを取得
  // データベースのフィンガリングとCAGED生成のフィンガリングを結合
  useEffect(() => {
    if (!chord) {
      setFingerings([]);
      return;
    }

    // generateChordFingerings は以下を結合する:
    // 1. データベースのフィンガリング（分数コード等）
    // 2. CAGEDシステムによる全5フォーム（C, A, G, E, D）
    // 3. 標準コードライブラリ
    // 4. 動的生成（フォールバック）
    const allFingerings = generateChordFingerings(chord);

    if (allFingerings.length > 0) {
      setFingerings(allFingerings);

      // ユーザー設定を優先
      const userPref = getPreferred(chord);
      if (userPref) {
        // ユーザーの好みのフィンガリングをリストから検索
        const prefIndex = allFingerings.findIndex(
          (f) => JSON.stringify(f.frets) === JSON.stringify(userPref.frets)
        );
        if (prefIndex >= 0) {
          setSelectedFingeringIndex(prefIndex);
          return;
        }
      }

      // デフォルトを選択（最初のものがデフォルト）
      const defaultIndex = allFingerings.findIndex((f) => f.isDefault);
      setSelectedFingeringIndex(defaultIndex >= 0 ? defaultIndex : 0);
    } else {
      // 動的生成できなかった場合、データベースから直接取得を試す
      const def = getChordDefinition(chord);
      if (def) {
        setFingerings(def.fingerings);
        const defaultIndex = def.fingerings.findIndex((f) => f.isDefault);
        setSelectedFingeringIndex(defaultIndex >= 0 ? defaultIndex : 0);
      } else {
        // 最終フォールバック
        const fallback = getDefaultFingering(chord);
        setFingerings(fallback ? [fallback] : []);
        setSelectedFingeringIndex(0);
      }
    }
  }, [chord, getPreferred]);

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

  // 現在のフィンガリングがユーザーのデフォルトかどうかチェック
  const currentFingering = fingerings[selectedFingeringIndex];
  const isCurrentDefault = useMemo(() => {
    if (!currentFingering || !chord) return false;
    const userPref = getPreferred(chord);
    if (!userPref) return false;
    return JSON.stringify(userPref.frets) === JSON.stringify(currentFingering.frets);
  }, [currentFingering, chord, getPreferred]);

  // デフォルト設定ハンドラ
  const handleSetDefault = useCallback(async () => {
    if (!currentFingering || !chord) return;
    setIsSettingDefault(true);
    try {
      await setDefault(chord, currentFingering);
    } finally {
      setIsSettingDefault(false);
    }
  }, [currentFingering, chord, setDefault]);

  // モーダルが閉じている場合は何も表示しない
  if (!chord) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="border border-white/10 rounded-xl p-6 w-[480px] max-h-[85vh] overflow-y-auto shadow-2xl"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
        }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{chord}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
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
              <span className="text-sm text-text-secondary">難易度:</span>
              <span
                className={`text-sm font-medium px-2 py-0.5 rounded ${
                  currentFingering.difficulty === 'easy'
                    ? 'bg-accent-green/20 text-accent-green'
                    : currentFingering.difficulty === 'medium'
                      ? 'bg-accent-yellow/20 text-accent-yellow'
                      : 'bg-accent-red/20 text-accent-red'
                }`}
              >
                {currentFingering.difficulty === 'easy'
                  ? '簡単'
                  : currentFingering.difficulty === 'medium'
                    ? '普通'
                    : '難しい'}
              </span>
            </div>

            {/* 複数の押さえ方がある場合の切り替え（CAGEDフォーム名を表示） */}
            {fingerings.length > 1 && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>ポジション:</span>
                <div className="flex flex-wrap justify-center gap-1">
                  {fingerings.map((fingering, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFingeringIndex(index)}
                      className="px-2 py-1 rounded text-xs font-medium transition-colors"
                      style={{
                        background: index === selectedFingeringIndex
                          ? 'var(--color-accent-primary)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: index === selectedFingeringIndex
                          ? '#ffffff'
                          : 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        if (index !== selectedFingeringIndex) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index !== selectedFingeringIndex) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      title={fingering.id}
                    >
                      {getFormLabel(fingering.id, fingering.baseFret)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* デフォルト設定ボタン */}
            {chordPreferencesContext && currentFingering && (
              <button
                onClick={handleSetDefault}
                disabled={isSettingDefault}
                className={`mt-4 text-xs px-3 py-1.5 rounded-lg transition-all ${
                  isCurrentDefault
                    ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                    : 'bg-background-hover/50 text-text-secondary hover:text-text-primary hover:bg-background-hover'
                } ${isSettingDefault ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isCurrentDefault ? '\u2713 デフォルト設定済み' : 'デフォルトに設定'}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
            <p>このコードのダイアグラムはまだ登録されていません</p>
            <p className="text-sm mt-2 opacity-70">
              将来のアップデートで追加予定です
            </p>
          </div>
        )}

        {/* フッター */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            コードをクリックするとダイアグラムが表示されます
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChordDiagramModal;
