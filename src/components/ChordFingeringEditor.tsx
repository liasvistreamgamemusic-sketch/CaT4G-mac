/**
 * ChordFingeringEditor - Modal for selecting or creating chord fingerings
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import { ChordDiagramHorizontal } from './ChordDiagramHorizontal';
import { generateChordFingerings } from '@/lib/chords';
import type { ChordFingering } from '@/lib/chords/types';

interface ChordFingeringEditorProps {
  /** Chord name to edit */
  chordName: string;
  /** Current fingering (if any) */
  currentFingering?: ChordFingering | null;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Save callback with selected fingering */
  onSave: (fingering: ChordFingering) => void;
}

type TabType = 'select' | 'custom';

export function ChordFingeringEditor({
  chordName,
  currentFingering,
  isOpen,
  onClose,
  onSave,
}: ChordFingeringEditorProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState<TabType>('select');
  const [selectedFingering, setSelectedFingering] = useState<ChordFingering | null>(null);
  const [customFrets, setCustomFrets] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [customBaseFret, setCustomBaseFret] = useState(1);

  // Get available fingerings for this chord
  const availableFingerings = useMemo((): ChordFingering[] => {
    if (!chordName) return [];
    return generateChordFingerings(chordName);
  }, [chordName]);

  // Initialize selected fingering
  useEffect(() => {
    if (currentFingering) {
      setSelectedFingering(currentFingering);
      setCustomFrets(currentFingering.frets);
      setCustomBaseFret(currentFingering.baseFret);
    } else if (availableFingerings.length > 0) {
      setSelectedFingering(availableFingerings[0]);
    }
  }, [currentFingering, availableFingerings]);

  // Build custom fingering from fret grid
  const customFingering = useMemo((): ChordFingering => {
    const muted = customFrets.map((fret) => fret === null);
    return {
      id: `custom-${chordName}-${Date.now()}`,
      frets: customFrets,
      fingers: [null, null, null, null, null, null],
      barreAt: null,
      barreStrings: null,
      baseFret: customBaseFret,
      muted,
      isDefault: false,
      difficulty: 'medium',
    };
  }, [chordName, customFrets, customBaseFret]);

  // Current preview fingering based on tab
  const previewFingering = activeTab === 'select' ? selectedFingering : customFingering;

  // Handle save
  const handleSave = useCallback((): void => {
    if (previewFingering) {
      onSave(previewFingering);
    }
    onClose();
  }, [previewFingering, onSave, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent): void => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle custom fret change
  const handleCustomFretChange = useCallback((index: number, value: number | null): void => {
    setCustomFrets((prev) => {
      const newFrets = [...prev];
      newFrets[index] = value;
      return newFrets;
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-xl max-h-[85vh] bg-surface rounded-2xl shadow-2xl border border-border/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-lg font-semibold text-text-primary">
            <span className="text-primary">{chordName}</span> の押さえ方を編集
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/30">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'select'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            選択
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            カスタム作成
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'select' ? (
            /* Select Tab */
            <div className="space-y-4">
              <p className="text-sm text-text-muted">既存の押さえ方から選択してください</p>
              {availableFingerings.length === 0 ? (
                <p className="text-center py-8 text-text-muted">
                  このコードの押さえ方が見つかりません
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableFingerings.map((f, index) => (
                    <button
                      key={f.id || index}
                      onClick={() => setSelectedFingering(f)}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedFingering?.id === f.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 bg-background/50 hover:border-border'
                      }`}
                    >
                      <ChordDiagramHorizontal fingering={f} size="sm" />
                      <div className="mt-2 text-xs text-text-muted">
                        {f.baseFret > 1 ? `${f.baseFret}フレット〜` : 'オープン'}
                        {f.difficulty && (
                          <span
                            className={`ml-2 ${
                              f.difficulty === 'easy'
                                ? 'text-accent-green'
                                : f.difficulty === 'medium'
                                  ? 'text-accent-yellow'
                                  : 'text-accent-red'
                            }`}
                          >
                            {f.difficulty === 'easy'
                              ? '易'
                              : f.difficulty === 'medium'
                                ? '中'
                                : '難'}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Custom Tab */
            <div className="space-y-6">
              <p className="text-sm text-text-muted">
                フレットをクリックして押さえ方を作成してください
              </p>

              {/* Base fret selector */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-text-secondary">開始フレット:</label>
                <select
                  value={customBaseFret}
                  onChange={(e) => setCustomBaseFret(Number(e.target.value))}
                  className="px-3 py-1.5 bg-background rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Simple fret input (placeholder for ChordFretGrid) */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted">
                  各弦のフレット番号を入力 (空欄 = ミュート, 0 = 開放弦)
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {['1弦', '2弦', '3弦', '4弦', '5弦', '6弦'].map((label, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-text-muted">{label}</span>
                      <input
                        type="number"
                        min={0}
                        max={24}
                        value={customFrets[index] ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleCustomFretChange(index, val === '' ? null : Number(val));
                        }}
                        className="w-12 px-2 py-1 bg-background rounded border border-border text-center text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
                        placeholder="×"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview & Footer */}
        <div className="px-6 py-4 border-t border-border/30 bg-background/50">
          <div className="flex items-center justify-between">
            {/* Preview */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-muted">プレビュー:</span>
              {previewFingering && <ChordDiagramHorizontal fingering={previewFingering} size="sm" />}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg text-text-secondary hover:text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={!previewFingering}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChordFingeringEditor;
