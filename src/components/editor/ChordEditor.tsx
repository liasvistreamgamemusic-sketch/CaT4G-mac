/**
 * ChordEditor - 個別コード編集ポップオーバー
 * コードの演奏方法、パターン、注釈、押さえ方を編集
 * Based on patterns from ChordDiagramModal.tsx
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { ExtendedChordPosition, PlayingMethod, StrokeDirection, TimeSignature, ArpeggioElement, PlayingTechnique, Dynamics } from '@/types/database';
import { PlayingMethodSelector } from './PlayingMethodSelector';
import { StrokePatternInput } from './StrokePatternInput';
import { ArpeggioOrderInput } from './ArpeggioOrderInput';
import { ChordDetailSettings } from './ChordDetailSettings';
import { ChordDiagramHorizontal } from '@/components/ChordDiagramHorizontal';
import { generateChordFingerings, getDefaultFingering, getAllCommonChordNames } from '@/lib/chords';
import type { ChordFingering } from '@/lib/chords/types';
import { useChordPreferencesContext } from '@/contexts/ChordPreferencesContext';
import { transposeChord } from '@/lib/chords/transpose';

// Common chord suggestions for autocomplete
const COMMON_CHORD_NAMES = getAllCommonChordNames();

// タブの種類
type EditorTab = 'voicing' | 'playing' | 'advanced';

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
  /** 移調量（CAPO考慮済み、表示・押さえ方検索用） */
  transpose?: number;
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
  transpose = 0,
}: ChordEditorProps) {
  // ローカル編集状態
  const [editedChord, setEditedChord] = useState<ExtendedChordPosition | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const chordPreferences = useChordPreferencesContext();
  const [fingerings, setFingerings] = useState<ChordFingering[]>([]);
  const [selectedFingeringIndex, setSelectedFingeringIndex] = useState(0);
  const [showChordSuggestions, setShowChordSuggestions] = useState(false);
  const [chordSearchQuery, setChordSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<EditorTab>('voicing');
  const popoverRef = useRef<HTMLDivElement>(null);
  const chordInputRef = useRef<HTMLInputElement>(null);

  // 表示用コード名（editedChord.chord が表示用コード名そのもの）
  // 保存時に逆移調して保存用コード名に変換する
  const displayChordName = useMemo(() => {
    if (!editedChord) return '';
    return editedChord.chord;
  }, [editedChord]);

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
      // 表示用コード名（移調適用済み）を editedChord.chord にセット
      const displayName = transpose !== 0
        ? transposeChord(chord.chord, transpose)
        : chord.chord;
      setEditedChord({ ...chord, chord: displayName });
      setShowChordSuggestions(false);
      setChordSearchQuery('');
      setActiveTab('voicing');

      // フィンガリング情報を取得（表示用コード名で直接検索）
      const allFingerings = generateChordFingerings(displayName);
      if (allFingerings.length > 0) {
        setFingerings(allFingerings);

        // Priority 1: voicingId が設定されていればそれを選択
        if (chord.voicingId) {
          const voicingIndex = allFingerings.findIndex(f => f.id === chord.voicingId);
          if (voicingIndex >= 0) {
            setSelectedFingeringIndex(voicingIndex);
            return;
          }
        }

        // Priority 2: ユーザーのデフォルト設定
        const userPref = chordPreferences.getPreferred(displayName);
        if (userPref) {
          const prefIndex = allFingerings.findIndex(
            f => JSON.stringify(f.frets) === JSON.stringify(userPref.frets)
          );
          if (prefIndex >= 0) {
            setSelectedFingeringIndex(prefIndex);
            return;
          }
        }

        // Priority 3: システムデフォルト
        const defaultIndex = allFingerings.findIndex(f => f.isDefault);
        setSelectedFingeringIndex(defaultIndex >= 0 ? defaultIndex : 0);
      } else {
        // フォールバック
        const fallback = getDefaultFingering(displayName);
        setFingerings(fallback ? [fallback] : []);
        setSelectedFingeringIndex(0);
      }
    } else {
      setEditedChord(null);
      setFingerings([]);
      setChordSearchQuery('');
    }
  }, [chord, transpose, chordPreferences]);

  // Update fingerings when chord name changes (with user preference priority)
  const updateFingeringsForChord = useCallback((chordName: string) => {
    const allFingerings = generateChordFingerings(chordName);
    if (allFingerings.length > 0) {
      setFingerings(allFingerings);

      // Priority: ユーザーのデフォルト設定 → システムデフォルト
      const userPref = chordPreferences.getPreferred(chordName);
      if (userPref) {
        const prefIndex = allFingerings.findIndex(
          f => JSON.stringify(f.frets) === JSON.stringify(userPref.frets)
        );
        if (prefIndex >= 0) {
          setSelectedFingeringIndex(prefIndex);
          return;
        }
      }

      const defaultIndex = allFingerings.findIndex(f => f.isDefault);
      setSelectedFingeringIndex(defaultIndex >= 0 ? defaultIndex : 0);
    } else {
      const fallback = getDefaultFingering(chordName);
      setFingerings(fallback ? [fallback] : []);
      setSelectedFingeringIndex(0);
    }
  }, [chordPreferences]);

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

  // 保存処理（表示用コード名を保存用に逆移調して変換）
  const handleSave = useCallback(() => {
    if (editedChord) {
      const updatedChord = { ...editedChord };
      // 逆移調して保存用コード名に変換
      if (transpose !== 0) {
        updatedChord.chord = transposeChord(editedChord.chord, -transpose);
      }
      // voicingId を設定（選択されたフィンガリングのID）
      if (fingerings.length > 0 && fingerings[selectedFingeringIndex]) {
        updatedChord.voicingId = fingerings[selectedFingeringIndex].id;
      }
      onSave(updatedChord);
    }
    onClose();
  }, [editedChord, fingerings, selectedFingeringIndex, onSave, onClose, transpose]);

  // 演奏方法の変更
  const handleMethodChange = useCallback((method: PlayingMethod | null) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        method: method ?? undefined,
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
    // 入力値がそのまま表示用コード名なので移調不要
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
    // 入力値がそのまま表示用コード名なので移調不要
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

  // 詳細設定の変更ハンドラー（ChordDetailSettings用）
  const handleDetailSettingsChange = useCallback((updates: Partial<{
    duration: number;
    techniques: PlayingTechnique[];
    dynamics: Dynamics;
    tieToNext: boolean;
  }>) => {
    setEditedChord(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  // ポップオーバーが閉じている場合は何も表示しない
  if (!chord || !editedChord) return null;

  const currentFingering = fingerings[selectedFingeringIndex];

  return (
    <div
      className="fixed inset-0 bg-[var(--backdrop-bg)] backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={popoverRef}
        className="border border-[var(--glass-premium-border)] rounded-xl p-6 w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{
          background: 'var(--glass-premium-bg)',
          backgroundColor: 'var(--color-bg-surface)',
          ...(anchorPosition ? {
            position: 'absolute' as const,
            left: anchorPosition.x,
            top: anchorPosition.y,
          } : {}),
        }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2
              className="text-lg font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {chordIndex === -1 ? 'コード追加' : 'コード編集'}
            </h2>
            {chordIndex !== null && chordIndex >= 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-bg-primary)',
                }}
              >
                #{chordIndex + 1}
              </span>
            )}
            {/* コード名表示（移調適用済み） */}
            <span
              className="text-lg font-bold ml-2"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              {displayChordName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--btn-glass-hover)] transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex mb-4 rounded-lg p-1" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('voicing')}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--btn-glass-hover)]"
            style={activeTab === 'voicing'
              ? { backgroundColor: 'var(--color-accent-primary)', color: '#ffffff' }
              : { color: 'var(--color-text-secondary)' }
            }
          >
            押さえ方
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('playing')}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--btn-glass-hover)]"
            style={activeTab === 'playing'
              ? { backgroundColor: 'var(--color-accent-primary)', color: '#ffffff' }
              : { color: 'var(--color-text-secondary)' }
            }
          >
            演奏方法
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--btn-glass-hover)]"
            style={activeTab === 'advanced'
              ? { backgroundColor: 'var(--color-accent-primary)', color: '#ffffff' }
              : { color: 'var(--color-text-secondary)' }
            }
          >
            詳細設定
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="min-h-[300px]">
          {/* 押さえ方タブ */}
          {activeTab === 'voicing' && (
            <div className="flex gap-4">
              {/* 左側: コード設定 */}
              <div className="flex-1 min-w-0">
                {/* コード名入力 with サジェスト */}
                <div className="mb-4 relative">
                  <label
                    className="block text-xs mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    コード名（入力または選択）
                  </label>
                  <input
                    ref={chordInputRef}
                    type="text"
                    value={editedChord.chord}
                    onChange={(e) => handleChordNameChange(e.target.value)}
                    onFocus={() => setShowChordSuggestions(editedChord.chord.length > 0)}
                    onBlur={() => setTimeout(() => setShowChordSuggestions(false), 150)}
                    className="w-full border border-[var(--glass-premium-border)] rounded px-3 py-2 text-lg font-bold focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--color-accent-primary)',
                    }}
                    placeholder="C, Am, G7..."
                  />
                  {/* コードサジェスト一覧 */}
                  {showChordSuggestions && chordSuggestions.length > 0 && (
                    <div
                      className="absolute left-0 right-0 top-full mt-1 border border-[var(--glass-premium-border)] rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto"
                      style={{ backgroundColor: 'var(--color-bg-surface)' }}
                    >
                      {chordSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleChordSelect(suggestion);
                          }}
                          className="w-full text-left px-3 py-2 text-sm transition-colors"
                          style={suggestion === editedChord.chord
                            ? { backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--color-accent-primary)' }
                            : { color: 'var(--color-text-primary)' }
                          }
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = suggestion === editedChord.chord
                              ? 'rgba(249, 115, 22, 0.1)'
                              : 'transparent';
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 位置調整 */}
                <div className="mb-4">
                  <label
                    className="block text-xs mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    位置
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePositionChange(-1)}
                      className="px-3 py-1.5 border border-[var(--glass-premium-border)] rounded hover:bg-[var(--btn-glass-hover)] transition-colors"
                      style={{ backgroundColor: 'var(--color-bg-primary)' }}
                      title="左に移動"
                    >
                      <span style={{ color: 'var(--color-text-primary)' }}>←</span>
                    </button>
                    <span
                      className="w-12 text-center font-mono"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {editedChord.position}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePositionChange(1)}
                      className="px-3 py-1.5 border border-[var(--glass-premium-border)] rounded hover:bg-[var(--btn-glass-hover)] transition-colors"
                      style={{ backgroundColor: 'var(--color-bg-primary)' }}
                      title="右に移動"
                    >
                      <span style={{ color: 'var(--color-text-primary)' }}>→</span>
                    </button>
                  </div>
                </div>

                {/* 注釈入力 */}
                <div className="mb-4">
                  <label
                    className="block text-xs mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    メモ・注釈
                  </label>
                  <textarea
                    value={editedChord.annotation || ''}
                    onChange={(e) => handleAnnotationChange(e.target.value)}
                    className="w-full border border-[var(--glass-premium-border)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors resize-none"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--color-text-primary)',
                    }}
                    rows={2}
                    placeholder="演奏のヒントやメモを入力..."
                  />
                </div>
              </div>

              {/* 右側: 押さえ方表示 */}
              <div className="w-[280px] flex-shrink-0">
                <label
                  className="block text-xs mb-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  押さえ方
                </label>
                <div
                  className="p-3 rounded-lg border border-[var(--glass-premium-border)]"
                  style={{ backgroundColor: 'var(--color-bg-elevated)' }}
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
                        <div
                          className="text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
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
                    </div>
                  ) : (
                    <div
                      className="text-center py-4 text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      ダイアグラムなし
                    </div>
                  )}
                </div>

                {/* ボイシング選択パネル（常時表示） */}
                {fingerings.length > 1 && (
                  <div
                    className="mt-2 p-2 rounded-lg border border-[var(--glass-premium-border)]"
                    style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                  >
                    <div
                      className="text-xs mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      押さえ方を選択 ({fingerings.length}種類)
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {fingerings.map((fingering, index) => (
                        <button
                          key={fingering.id}
                          onClick={() => handleVoicingSelect(index)}
                          className="px-2 py-1 rounded text-xs font-medium transition-colors"
                          style={index === selectedFingeringIndex
                            ? { backgroundColor: 'var(--color-accent-primary)', color: '#ffffff' }
                            : { backgroundColor: 'var(--btn-glass-hover)', color: 'var(--color-text-secondary)' }
                          }
                          title={fingering.id}
                        >
                          {fingering.baseFret === 1 ? 'オープン' : `${fingering.baseFret}f`}
                        </button>
                      ))}
                    </div>
                    {/* デフォルトに設定ボタン（移調後のコード名で設定） */}
                    <button
                      onClick={async () => {
                        if (!displayChordName || !fingerings[selectedFingeringIndex]) return;
                        setIsSettingDefault(true);
                        try {
                          await chordPreferences.setDefault(displayChordName, fingerings[selectedFingeringIndex]);
                        } finally {
                          setIsSettingDefault(false);
                        }
                      }}
                      disabled={isSettingDefault || chordPreferences.hasPreference(displayChordName) &&
                        chordPreferences.getPreferred(displayChordName)?.id === fingerings[selectedFingeringIndex]?.id}
                      className="mt-2 w-full px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: chordPreferences.hasPreference(displayChordName) &&
                          chordPreferences.getPreferred(displayChordName)?.id === fingerings[selectedFingeringIndex]?.id
                          ? 'var(--color-success)'
                          : 'var(--btn-glass-hover)',
                        color: chordPreferences.hasPreference(displayChordName) &&
                          chordPreferences.getPreferred(displayChordName)?.id === fingerings[selectedFingeringIndex]?.id
                          ? '#ffffff'
                          : 'var(--color-text-secondary)',
                      }}
                    >
                      {isSettingDefault
                        ? '設定中...'
                        : chordPreferences.hasPreference(displayChordName) &&
                          chordPreferences.getPreferred(displayChordName)?.id === fingerings[selectedFingeringIndex]?.id
                          ? '✓ デフォルトに設定済み'
                          : 'デフォルトに設定'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 演奏方法タブ */}
          {activeTab === 'playing' && (
            <div className="space-y-4">
              {/* 演奏方法セレクター */}
              <div>
                <PlayingMethodSelector
                  value={editedChord.method}
                  onChange={handleMethodChange}
                />
              </div>

              {/* ストロークパターン入力（ストロークの場合のみ） */}
              {editedChord.method === 'stroke' && (
                <div
                  className="p-3 rounded-lg border border-[var(--glass-premium-border)]"
                  style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                >
                  <StrokePatternInput
                    value={editedChord.strokePattern}
                    onChange={handleStrokePatternChange}
                    timeSignature={timeSignature}
                  />
                </div>
              )}

              {/* アルペジオ順序入力（アルペジオの場合のみ） */}
              {editedChord.method === 'arpeggio' && (
                <div
                  className="p-3 rounded-lg border border-[var(--glass-premium-border)]"
                  style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                >
                  <ArpeggioOrderInput
                    value={editedChord.arpeggioOrder}
                    onChange={handleArpeggioOrderChange}
                  />
                </div>
              )}

              {/* 演奏方法未設定時のヒント */}
              {!editedChord.method && (
                <div
                  className="text-center py-8"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <p className="text-sm">演奏方法を選択してください</p>
                  <p className="text-xs mt-2">ストロークまたはアルペジオを選んで詳細なパターンを設定できます</p>
                </div>
              )}
            </div>
          )}

          {/* 詳細設定タブ */}
          {activeTab === 'advanced' && (
            <ChordDetailSettings
              duration={editedChord.duration}
              techniques={editedChord.techniques}
              dynamics={editedChord.dynamics}
              tieToNext={editedChord.tieToNext}
              timeSignature={timeSignature}
              onChange={handleDetailSettingsChange}
            />
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-[var(--glass-premium-border)]">
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
              className="px-4 py-1.5 text-sm hover:bg-[var(--btn-glass-hover)] rounded transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-sm text-white rounded hover:opacity-90 transition-colors"
              style={{ backgroundColor: 'var(--color-accent-primary)' }}
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
