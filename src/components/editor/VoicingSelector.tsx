/**
 * VoicingSelector - コードの押さえ方選択コンポーネント
 * 複数の押さえ方（ボイシング）から選択可能
 * Based on patterns from ChordDiagramModal.tsx and ChordEditor.tsx
 */

import { useState, useEffect, useCallback } from 'react';
import { ChordDiagramHorizontal } from '@/components/ChordDiagramHorizontal';
import { generateChordFingerings, getDefaultFingering } from '@/lib/chords';
import type { ChordFingering } from '@/lib/chords/types';

interface VoicingSelectorProps {
  /** コード名（例: "C", "Am", "G7"） */
  chord: string;
  /** 現在選択されているボイシングID */
  selectedVoicingId?: string;
  /** ボイシング選択時のコールバック */
  onSelect: (voicingId: string, fingering: ChordFingering) => void;
  /** サイズ（ダイアグラムのサイズ） */
  size?: 'sm' | 'md' | 'lg';
  /** 指番号を表示するか */
  showFingers?: boolean;
  /** コンパクト表示（ボタンのみ、ダイアグラムなし） */
  compact?: boolean;
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

/**
 * 難易度の日本語ラベルを取得
 */
function getDifficultyLabel(difficulty: ChordFingering['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return '簡単';
    case 'medium':
      return '普通';
    case 'hard':
      return '難しい';
    default:
      return '普通';
  }
}

/**
 * 難易度に応じたスタイルクラスを取得
 */
function getDifficultyStyle(difficulty: ChordFingering['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-400';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'hard':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-yellow-500/20 text-yellow-400';
  }
}

/**
 * VoicingSelector
 * コードの押さえ方を選択するコンポーネント
 */
export function VoicingSelector({
  chord,
  selectedVoicingId,
  onSelect,
  size = 'md',
  showFingers = true,
  compact = false,
}: VoicingSelectorProps) {
  const [fingerings, setFingerings] = useState<ChordFingering[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // コードが変わったらフィンガリングを取得
  useEffect(() => {
    if (!chord) {
      setFingerings([]);
      setSelectedIndex(0);
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

      // selectedVoicingId が指定されていればそれを選択
      if (selectedVoicingId) {
        const voicingIndex = allFingerings.findIndex(f => f.id === selectedVoicingId);
        setSelectedIndex(voicingIndex >= 0 ? voicingIndex : 0);
      } else {
        // デフォルトを選択
        const defaultIndex = allFingerings.findIndex(f => f.isDefault);
        setSelectedIndex(defaultIndex >= 0 ? defaultIndex : 0);
      }
    } else {
      // フォールバック
      const fallback = getDefaultFingering(chord);
      setFingerings(fallback ? [fallback] : []);
      setSelectedIndex(0);
    }
  }, [chord, selectedVoicingId]);

  // ボイシング選択ハンドラー
  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
    const fingering = fingerings[index];
    if (fingering) {
      onSelect(fingering.id, fingering);
    }
  }, [fingerings, onSelect]);

  // フィンガリングが無い場合
  if (fingerings.length === 0) {
    return (
      <div className="text-center py-4 text-text-muted text-sm">
        このコードのダイアグラムはありません
      </div>
    );
  }

  const currentFingering = fingerings[selectedIndex];

  // コンパクトモード：ボタンのみ
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {fingerings.map((fingering, index) => (
          <button
            key={fingering.id}
            type="button"
            onClick={() => handleSelect(index)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              index === selectedIndex
                ? 'bg-accent-primary text-white'
                : 'bg-[var(--btn-glass-hover)] text-text-secondary hover:bg-[var(--glass-premium-hover)]'
            }`}
            title={`${fingering.id} - ${getDifficultyLabel(fingering.difficulty)}`}
          >
            {getFormLabel(fingering.id, fingering.baseFret)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* ダイアグラム表示 */}
      {currentFingering && (
        <ChordDiagramHorizontal
          fingering={currentFingering}
          size={size}
          showFingers={showFingers}
        />
      )}

      {/* 難易度表示 */}
      {currentFingering && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-secondary">難易度:</span>
          <span className={`px-1.5 py-0.5 rounded ${getDifficultyStyle(currentFingering.difficulty)}`}>
            {getDifficultyLabel(currentFingering.difficulty)}
          </span>
        </div>
      )}

      {/* ボイシング選択ボタン */}
      {fingerings.length > 1 && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-secondary text-xs">ポジション:</span>
          <div className="flex flex-wrap justify-center gap-1">
            {fingerings.map((fingering, index) => (
              <button
                key={fingering.id}
                type="button"
                onClick={() => handleSelect(index)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  index === selectedIndex
                    ? 'bg-accent-primary text-white'
                    : 'bg-[var(--btn-glass-hover)] text-text-secondary hover:bg-[var(--glass-premium-hover)]'
                }`}
                title={fingering.id}
              >
                {getFormLabel(fingering.id, fingering.baseFret)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 単一のボイシングの場合は位置情報のみ表示 */}
      {fingerings.length === 1 && currentFingering && (
        <div className="text-xs text-text-secondary">
          ポジション: {getFormLabel(currentFingering.id, currentFingering.baseFret)}
        </div>
      )}
    </div>
  );
}

export default VoicingSelector;
