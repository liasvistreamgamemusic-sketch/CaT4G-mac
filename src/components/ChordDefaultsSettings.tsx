/**
 * ChordDefaultsSettings - Modal for managing default chord fingerings
 * Shows ALL available chords, with double-click to edit
 */

import { useState, useMemo, useCallback } from 'react';
import { X, Search, RotateCcw, Star } from 'lucide-react';
import { useChordPreferencesContext } from '@/contexts/ChordPreferencesContext';
import { ChordDiagramHorizontal } from './ChordDiagramHorizontal';
import { ChordFingeringEditor } from './ChordFingeringEditor';
import { getAllCommonChordNames, generateChordFingering } from '@/lib/chords';
import type { ChordFingering as DatabaseChordFingering } from '@/types/database';
import type { ChordFingering as LibChordFingering } from '@/lib/chords/types';

interface ChordDefaultsSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Convert database ChordFingering to lib ChordFingering format
 * The lib type has additional fields (muted, barreStrings) required by ChordDiagramHorizontal
 */
function toLibFingering(dbFingering: DatabaseChordFingering): LibChordFingering {
  return {
    id: dbFingering.id ?? crypto.randomUUID(),
    frets: dbFingering.frets,
    fingers: dbFingering.fingers,
    barreAt: dbFingering.barreAt,
    barreStrings: dbFingering.barreAt !== null
      ? deriveBarreStrings(dbFingering.frets, dbFingering.barreAt)
      : null,
    baseFret: dbFingering.baseFret,
    muted: dbFingering.frets.map(f => f === null),
    isDefault: dbFingering.isDefault ?? false,
    difficulty: dbFingering.difficulty ?? 'medium',
  };
}

/**
 * Derive barre string range from frets and barre position
 */
function deriveBarreStrings(frets: (number | null)[], barreAt: number): [number, number] {
  let start = -1;
  let end = -1;

  for (let i = 0; i < frets.length; i++) {
    if (frets[i] === barreAt) {
      if (start === -1) start = i;
      end = i;
    }
  }

  if (start === -1) return [0, 5];
  return [start, end];
}

// Root notes for tab filtering
const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function ChordDefaultsSettings({
  isOpen,
  onClose,
}: ChordDefaultsSettingsProps): JSX.Element | null {
  const {
    preferences,
    preferencesArray,
    setDefault,
    clearAll,
    isLoading,
    getPreferred
  } = useChordPreferencesContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [editingChord, setEditingChord] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Get all available chord names
  const allChordNames = useMemo(() => getAllCommonChordNames(), []);

  // Filter chords by root note and search query
  const filteredChords = useMemo(() => {
    let chords = allChordNames;

    // Filter by root note (including slash chords with matching root)
    chords = chords.filter(name => {
      // Extract root from chord name (handles both regular and slash chords)
      // For slash chords like "Cm/G", the root is "C"
      const slashIndex = name.indexOf('/');
      const baseName = slashIndex >= 0 ? name.substring(0, slashIndex) : name;

      // Extract root note from base name
      let root: string;
      if (baseName.length >= 2 && baseName[1] === '#') {
        root = baseName.substring(0, 2);
      } else {
        root = baseName[0];
      }

      return root === selectedRoot;
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      chords = chords.filter(name => name.toLowerCase().includes(query));
    }

    return chords;
  }, [allChordNames, selectedRoot, searchQuery]);

  // Split chords into major and minor categories
  const { majorChords, minorChords } = useMemo(() => {
    const major: string[] = [];
    const minor: string[] = [];

    filteredChords.forEach(name => {
      // Extract the quality part (after root note)
      const slashIndex = name.indexOf('/');
      const baseName = slashIndex >= 0 ? name.substring(0, slashIndex) : name;

      // Get quality by removing root
      let quality: string;
      if (baseName.length >= 2 && baseName[1] === '#') {
        quality = baseName.substring(2);
      } else {
        quality = baseName.substring(1);
      }

      // Check if it's a minor chord (starts with 'm' but not 'M')
      // Minor chords: m, m7, m9, mM7, m7-5, m-5, m6, m69, m7+5
      const isMinor = quality.startsWith('m') && !quality.startsWith('M');

      if (isMinor) {
        minor.push(name);
      } else {
        major.push(name);
      }
    });

    return { majorChords: major, minorChords: minor };
  }, [filteredChords]);

  // Get fingering for a chord (user preference or system default)
  const getFingeringForChord = useCallback((chordName: string): LibChordFingering | null => {
    // Check user preference first
    const userPref = getPreferred(chordName);
    if (userPref) {
      return toLibFingering(userPref);
    }

    // Fall back to system default
    const systemDefault = generateChordFingering(chordName);
    return systemDefault;
  }, [getPreferred]);

  // Check if chord has custom setting
  const hasCustomSetting = useCallback((chordName: string): boolean => {
    return preferences.has(chordName);
  }, [preferences]);

  // Handle double-click to edit
  const handleDoubleClick = useCallback((chordName: string) => {
    setEditingChord(chordName);
  }, []);

  // Handle save from editor
  const handleSave = useCallback(async (fingering: DatabaseChordFingering) => {
    if (!editingChord) return;
    await setDefault(editingChord, fingering);
    setEditingChord(null);
  }, [editingChord, setDefault]);

  // Handle reset all
  const handleResetAll = useCallback(async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    await clearAll();
    setConfirmReset(false);
  }, [confirmReset, clearAll]);

  // Cancel reset confirmation when clicking elsewhere
  const handleCancelReset = useCallback(() => {
    setConfirmReset(false);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-[1200px] max-h-[85vh] bg-background-surface rounded-2xl shadow-2xl border border-border/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <h2 className="text-lg font-semibold text-text-primary">
              コードデフォルト設定
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[var(--btn-glass-hover)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Root Tabs & Search */}
          <div className="px-6 py-3 border-b border-border/30 space-y-3">
            {/* Root note tabs */}
            <div className="flex flex-wrap gap-1">
              {roots.map((root) => (
                <button
                  key={root}
                  onClick={() => setSelectedRoot(root)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedRoot === root
                      ? 'text-white'
                      : 'bg-background-hover text-text-secondary hover:bg-background-elevated hover:text-text-primary'
                  }`}
                  style={selectedRoot === root ? { backgroundColor: 'var(--color-accent-primary)' } : undefined}
                >
                  {root}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="コード名で検索..."
                className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-border text-sm
                           focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none
                           transition-all placeholder:text-text-muted"
              />
            </div>

            <p className="text-xs text-text-muted flex items-center gap-2">
              <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" />
              <span>= カスタム設定済み</span>
              <span className="mx-2">|</span>
              <span>ダブルクリックで押さえ方を変更</span>
            </p>
          </div>

          {/* Content - Two Column Layout (Major | Minor) */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-text-muted">
                読み込み中...
              </div>
            ) : filteredChords.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-text-muted">
                該当するコードが見つかりません
              </div>
            ) : (
              <div className="flex gap-6">
                {/* Left Column - Major Chords */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-text-secondary mb-3 pb-2 border-b border-border/30">
                    メジャー系 ({majorChords.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {majorChords.map((chordName) => {
                      const fingering = getFingeringForChord(chordName);
                      const isCustom = hasCustomSetting(chordName);

                      return (
                        <button
                          key={chordName}
                          onDoubleClick={() => handleDoubleClick(chordName)}
                          className={`relative p-2 rounded-xl border transition-all cursor-pointer
                            hover:border-primary/50 hover:bg-primary/5
                            ${isCustom
                              ? 'border-accent-yellow/30 bg-accent-yellow/5'
                              : 'border-border/30 bg-background/50'
                            }`}
                          title="ダブルクリックで編集"
                        >
                          {isCustom && (
                            <Star className="absolute top-1 right-1 w-3 h-3 text-accent-yellow fill-accent-yellow" />
                          )}
                          <div className="text-sm font-bold text-primary mb-1 text-center">
                            {chordName}
                          </div>
                          {fingering ? (
                            <ChordDiagramHorizontal
                              fingering={fingering}
                              size="xs"
                            />
                          ) : (
                            <div className="h-12 flex items-center justify-center text-xs text-text-muted">
                              なし
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column - Minor Chords */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-text-secondary mb-3 pb-2 border-b border-border/30">
                    マイナー系 ({minorChords.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {minorChords.map((chordName) => {
                      const fingering = getFingeringForChord(chordName);
                      const isCustom = hasCustomSetting(chordName);

                      return (
                        <button
                          key={chordName}
                          onDoubleClick={() => handleDoubleClick(chordName)}
                          className={`relative p-2 rounded-xl border transition-all cursor-pointer
                            hover:border-primary/50 hover:bg-primary/5
                            ${isCustom
                              ? 'border-accent-yellow/30 bg-accent-yellow/5'
                              : 'border-border/30 bg-background/50'
                            }`}
                          title="ダブルクリックで編集"
                        >
                          {isCustom && (
                            <Star className="absolute top-1 right-1 w-3 h-3 text-accent-yellow fill-accent-yellow" />
                          )}
                          <div className="text-sm font-bold text-primary mb-1 text-center">
                            {chordName}
                          </div>
                          {fingering ? (
                            <ChordDiagramHorizontal
                              fingering={fingering}
                              size="xs"
                            />
                          ) : (
                            <div className="h-12 flex items-center justify-center text-xs text-text-muted">
                              なし
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/30 flex items-center justify-between">
            <div className="text-xs text-text-muted">
              {allChordNames.length} コード中 {preferencesArray.length} 件カスタム設定
            </div>
            {preferencesArray.length > 0 && (
              confirmReset ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">本当にリセットしますか？</span>
                  <button
                    onClick={handleCancelReset}
                    className="px-3 py-1.5 text-sm rounded-lg text-text-secondary hover:text-text-primary"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleResetAll}
                    className="px-3 py-1.5 text-sm rounded-lg bg-accent-red/20 text-accent-red hover:bg-accent-red/30"
                  >
                    リセット
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleResetAll}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-accent-red hover:bg-accent-red/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  すべてリセット
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Fingering Editor Modal */}
      {editingChord && (() => {
        const dbFingering = getPreferred(editingChord);
        const libFingering = dbFingering ? toLibFingering(dbFingering) : undefined;
        return (
          <ChordFingeringEditor
            chordName={editingChord}
            currentFingering={libFingering}
            isOpen={!!editingChord}
            onClose={() => setEditingChord(null)}
            onSave={handleSave}
          />
        );
      })()}
    </>
  );
}
