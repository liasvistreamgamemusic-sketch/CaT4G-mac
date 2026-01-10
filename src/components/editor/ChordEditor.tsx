/**
 * ChordEditor - 個別コード編集ポップオーバー
 * コードの演奏方法、パターン、注釈、押さえ方を編集
 * Based on patterns from ChordDiagramModal.tsx
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { ExtendedChordPosition, PlayingMethod, StrokeDirection, TimeSignature, ArpeggioElement } from '@/types/database';
import { PlayingMethodSelector } from './PlayingMethodSelector';
import { StrokePatternInput } from './StrokePatternInput';
import { ArpeggioOrderInput } from './ArpeggioOrderInput';
import { ChordDiagramHorizontal } from '@/components/ChordDiagramHorizontal';
import { generateChordFingerings, getDefaultFingering, getAllChordNames } from '@/lib/chords';
import type { ChordFingering } from '@/lib/chords/types';

// Common chord suggestions for autocomplete
const COMMON_CHORD_NAMES = getAllChordNames();

interface ChordEditorProps {
  /** 編集対象のコード（null の場合は非表示） */
  chord: ExtendedChordPosition | null;
  /** コードのインデックス（行内での位置） */
  chordIndex: number | null;
  /** 閉じる際のコールバック */
  onClose: () => void;
  /** 変更保存時のコールバック */
  onSave: (updatedChord: ExtendedChordPosition) => void;
  /** コード削除時のコールバック */
  onDelete?: () => void;
  /** 現在の拍子（ストロークパターンの拍数に影響） */
  timeSignature?: TimeSignature;
  /** ポップオーバーの表示位置（オプション） */
  anchorPosition?: { x: number; y: number };
}

/**
 * ChordEditor
 * コードの詳細設定を行うポップオーバーコンポーネント
 */
export function ChordEditor({
  chord,
  chordIndex,
  onClose,
  onSave,
  onDelete,
  timeSignature = '4/4',
  anchorPosition,
}: ChordEditorProps) {
  // ローカル編集状態
  const [editedChord, setEditedChord] = useState<ExtendedChordPosition | null>(null);
  const [showVoicingSelector, setShowVoicingSelector] = useState(false);
  const [fingerings, setFingerings] = useState<ChordFingering[]>([]);
  const [selectedFingeringIndex, setSelectedFingeringIndex] = useState(0);
  const [showChordSuggestions, setShowChordSuggestions] = useState(false);
  const [chordSearchQuery, setChordSearchQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const chordInputRef = useRef<HTMLInputElement>(null);

  // Filter chord suggestions based on search query
  const chordSuggestions = useMemo(() => {
    if (!chordSearchQuery.trim()) return [];
    const query = chordSearchQuery.toLowerCase();
    return COMMON_CHORD_NAMES
      .filter(name => name.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 suggestions
  }, [chordSearchQuery]);

  // コードが変わったらローカル状態をリセット
  useEffect(() => {
    if (chord) {
      setEditedChord({ ...chord });
      setShowVoicingSelector(false);
      setShowChordSuggestions(false);
      setChordSearchQuery('');

      // フィンガリング情報を取得
      const allFingerings = generateChordFingerings(chord.chord);
      if (allFingerings.length > 0) {
        setFingerings(allFingerings);
        // voicingId が設定されていればそれを選択
        if (chord.voicingId) {
          const voicingIndex = allFingerings.findIndex(f => f.id === chord.voicingId);
          setSelectedFingeringIndex(voicingIndex >= 0 ? voicingIndex : 0);
        } else {
          const defaultIndex = allFingerings.findIndex(f => f.isDefault);
          setSelectedFingeringIndex(defaultIndex >= 0 ? defaultIndex : 0);
        }
      } else {
        // フォールバック
        const fallback = getDefaultFingering(chord.chord);
        setFingerings(fallback ? [fallback] : []);
        setSelectedFingeringIndex(0);
      }
    } else {
      setEditedChord(null);
      setFingerings([]);
      setChordSearchQuery('');
    }
  }, [chord]);

  // Update fingerings when chord name changes
  const updateFingeringsForChord = useCallback((chordName: string) => {
    const allFingerings = generateChordFingerings(chordName);
    if (allFingerings.length > 0) {
      setFingerings(allFingerings);
      const defaultIndex = allFingerings.findIndex(f => f.isDefault);
      setSelectedFingeringIndex(defaultIndex >= 0 ? defaultIndex : 0);
    } else {
      const fallback = getDefaultFingering(chordName);
      setFingerings(fallback ? [fallback] : []);
      setSelectedFingeringIndex(0);
    }
  }, []);

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

  // 保存処理
  const handleSave = useCallback(() => {
    if (editedChord) {
      // voicingId を設定（選択されたフィンガリングのID）
      const updatedChord = { ...editedChord };
      if (fingerings.length > 0 && fingerings[selectedFingeringIndex]) {
        updatedChord.voicingId = fingerings[selectedFingeringIndex].id;
      }
      onSave(updatedChord);
    }
    onClose();
  }, [editedChord, fingerings, selectedFingeringIndex, onSave, onClose]);

  // 演奏方法の変更
  const handleMethodChange = useCallback((method: PlayingMethod) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        method,
        // メソッド変更時にパターンをリセット
        strokePattern: method === 'stroke' ? prev.strokePattern || getDefaultStrokePattern(timeSignature) : undefined,
        arpeggioOrder: method === 'arpeggio' ? prev.arpeggioOrder || [] : undefined,
      };
    });
  }, [timeSignature]);

  // ストロークパターンの変更
  const handleStrokePatternChange = useCallback((pattern: StrokeDirection[]) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return { ...prev, strokePattern: pattern };
    });
  }, []);

  // アルペジオ順序の変更
  const handleArpeggioOrderChange = useCallback((order: ArpeggioElement[]) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return { ...prev, arpeggioOrder: order };
    });
  }, []);

  // 注釈の変更
  const handleAnnotationChange = useCallback((annotation: string) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return { ...prev, annotation: annotation || undefined };
    });
  }, []);

  // コード名の変更（入力フィールドから）
  const handleChordNameChange = useCallback((name: string) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return { ...prev, chord: name };
    });
    setChordSearchQuery(name);
    setShowChordSuggestions(name.length > 0);
    // Update fingerings after a short delay to avoid excessive recalculation
    if (name.length >= 1) {
      updateFingeringsForChord(name);
    }
  }, [updateFingeringsForChord]);

  // コードを選択（サジェストから）
  const handleChordSelect = useCallback((chordName: string) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return { ...prev, chord: chordName };
    });
    setChordSearchQuery('');
    setShowChordSuggestions(false);
    updateFingeringsForChord(chordName);
  }, [updateFingeringsForChord]);

  // 位置の変更
  const handlePositionChange = useCallback((delta: number) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      const newPosition = Math.max(0, prev.position + delta);
      return { ...prev, position: newPosition };
    });
  }, []);

  // ボイシング選択
  const handleVoicingSelect = useCallback((index: number) => {
    setSelectedFingeringIndex(index);
  }, []);

  // ポップオーバーが閉じている場合は何も表示しない
  if (!chord || !editedChord) return null;

  const currentFingering = fingerings[selectedFingeringIndex];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={popoverRef}
        className="bg-background-surface border border-white/10 rounded-xl p-6 w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl"
        style={anchorPosition ? {
          position: 'absolute',
          left: anchorPosition.x,
          top: anchorPosition.y,
        } : undefined}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">
              {chordIndex === -1 ? 'コード追加' : 'コード編集'}
            </h2>
            {chordIndex !== null && chordIndex >= 0 && (
              <span className="text-xs text-text-muted px-1.5 py-0.5 bg-background-primary rounded">
                #{chordIndex + 1}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* メインコンテンツ: 左右分割レイアウト */}
        <div className="flex gap-4">
          {/* 左側: コード設定 */}
          <div className="flex-1 min-w-0">
            {/* コード名入力 with サジェスト */}
            <div className="mb-4 relative">
              <label className="block text-xs text-text-secondary mb-1">コード名（入力または選択）</label>
              <input
                ref={chordInputRef}
                type="text"
                value={editedChord.chord}
                onChange={(e) => handleChordNameChange(e.target.value)}
                onFocus={() => setShowChordSuggestions(editedChord.chord.length > 0)}
                onBlur={() => setTimeout(() => setShowChordSuggestions(false), 150)}
                className="w-full bg-background-primary border border-white/10 rounded px-3 py-2 text-lg font-bold text-accent-primary focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="C, Am, G7..."
              />
              {/* コードサジェスト一覧 */}
              {showChordSuggestions && chordSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-background-surface border border-white/10 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                  {chordSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleChordSelect(suggestion);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-accent-primary/20 transition-colors ${
                        suggestion === editedChord.chord ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-primary'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 位置調整 */}
            <div className="mb-4">
              <label className="block text-xs text-text-secondary mb-1">位置</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePositionChange(-1)}
                  className="px-3 py-1.5 bg-background-primary border border-white/10 rounded hover:bg-white/10 transition-colors"
                  title="左に移動"
                >
                  ←
                </button>
                <span className="w-12 text-center font-mono text-text-primary">
                  {editedChord.position}
                </span>
                <button
                  type="button"
                  onClick={() => handlePositionChange(1)}
                  className="px-3 py-1.5 bg-background-primary border border-white/10 rounded hover:bg-white/10 transition-colors"
                  title="右に移動"
                >
                  →
                </button>
              </div>
            </div>

            {/* 演奏方法セレクター */}
            <div className="mb-4">
              <PlayingMethodSelector
                value={editedChord.method}
                onChange={handleMethodChange}
              />
            </div>

            {/* ストロークパターン入力（ストロークの場合のみ） */}
            {editedChord.method === 'stroke' && (
              <div className="mb-4 p-3 bg-background-primary/50 rounded-lg border border-white/5">
                <StrokePatternInput
                  value={editedChord.strokePattern}
                  onChange={handleStrokePatternChange}
                  timeSignature={timeSignature}
                />
              </div>
            )}

            {/* アルペジオ順序入力（アルペジオの場合のみ） */}
            {editedChord.method === 'arpeggio' && (
              <div className="mb-4 p-3 bg-background-primary/50 rounded-lg border border-white/5">
                <ArpeggioOrderInput
                  value={editedChord.arpeggioOrder}
                  onChange={handleArpeggioOrderChange}
                />
              </div>
            )}

            {/* 注釈入力 */}
            <div className="mb-4">
              <label className="block text-xs text-text-secondary mb-1">メモ・注釈</label>
              <textarea
                value={editedChord.annotation || ''}
                onChange={(e) => handleAnnotationChange(e.target.value)}
                className="w-full bg-background-primary border border-white/10 rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
                rows={2}
                placeholder="演奏のヒントやメモを入力..."
              />
            </div>
          </div>

          {/* 右側: 押さえ方表示（常に表示） */}
          <div className="w-[240px] flex-shrink-0">
            <label className="block text-xs text-text-secondary mb-1">押さえ方</label>
            <div
              className={`p-3 bg-background-primary/50 rounded-lg border transition-colors cursor-pointer ${
                showVoicingSelector ? 'border-accent-primary' : 'border-white/5 hover:border-white/20'
              }`}
              onClick={() => setShowVoicingSelector(!showVoicingSelector)}
              title="クリックして別の押さえ方を選択"
            >
              {currentFingering ? (
                <div className="flex flex-col items-center gap-2">
                  <ChordDiagramHorizontal
                    fingering={currentFingering}
                    size="md"
                    showFingers={true}
                  />
                  {/* 押さえ方の情報 */}
                  <div className="text-center">
                    <div className="text-xs text-text-muted">
                      {currentFingering.baseFret === 1 ? 'オープン' : `${currentFingering.baseFret}フレット`}
                    </div>
                    <div
                      className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block ${
                        currentFingering.difficulty === 'easy'
                          ? 'bg-green-500/20 text-green-400'
                          : currentFingering.difficulty === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {currentFingering.difficulty === 'easy' ? '簡単' : currentFingering.difficulty === 'medium' ? '普通' : '難しい'}
                    </div>
                  </div>
                  {fingerings.length > 1 && (
                    <div className="text-[10px] text-text-muted text-center">
                      クリックで他の押さえ方を選択
                      <br />
                      ({fingerings.length}種類)
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-text-muted text-sm">
                  ダイアグラムなし
                </div>
              )}
            </div>

            {/* ボイシング選択パネル（展開時） */}
            {showVoicingSelector && fingerings.length > 1 && (
              <div className="mt-2 p-2 bg-background-primary/50 rounded-lg border border-white/5">
                <div className="text-xs text-text-secondary mb-2 text-center">押さえ方を選択</div>
                <div className="flex flex-wrap justify-center gap-1">
                  {fingerings.map((fingering, index) => (
                    <button
                      key={fingering.id}
                      onClick={() => {
                        handleVoicingSelect(index);
                        setShowVoicingSelector(false);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        index === selectedFingeringIndex
                          ? 'bg-accent-primary text-white'
                          : 'bg-white/10 text-text-secondary hover:bg-white/20'
                      }`}
                      title={fingering.id}
                    >
                      {fingering.baseFret === 1 ? 'オープン' : `${fingering.baseFret}f`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/10">
          <div>
            {/* Hide delete button when adding new chord (chordIndex === -1) */}
            {onDelete && chordIndex !== -1 && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20 rounded transition-colors"
              >
                削除
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/10 rounded transition-colors"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-sm bg-accent-primary text-white rounded hover:bg-accent-hover transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * デフォルトのストロークパターンを取得
 */
function getDefaultStrokePattern(timeSignature: TimeSignature): StrokeDirection[] {
  const beats = parseInt(timeSignature.split('/')[0], 10);
  // 基本パターン: down-up の繰り返し
  return Array(beats).fill(null).map((_, i) =>
    i % 2 === 0 ? 'down' : 'up'
  ) as StrokeDirection[];
}

export default ChordEditor;
