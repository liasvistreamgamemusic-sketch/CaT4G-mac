import { useState, useRef, useEffect } from 'react';
import type { ExtendedChordPosition } from '@/types/database';
import { LineEditor, type EditableLine } from './LineEditor';

// Common section names used in songs
const COMMON_SECTION_NAMES = [
  'イントロ',
  'Aメロ',
  'Bメロ',
  'Cメロ',
  'サビ',
  '間奏',
  'ギターソロ',
  'Dメロ',
  '大サビ',
  '落ちサビ',
  'アウトロ',
  'ブリッジ',
  'プレコーラス',
  'Intro',
  'Verse',
  'Pre-Chorus',
  'Chorus',
  'Bridge',
  'Solo',
  'Outro',
];

// Editor state for a single section
interface EditableSection {
  id?: string;
  name: string;
  repeatCount: number;
  lines: EditableLine[];
}

interface SectionEditorProps {
  section: EditableSection;
  sectionIndex: number;
  isFirst: boolean;
  isLast: boolean;
  isCollapsed?: boolean;  // Section collapse state
  onToggleCollapse?: () => void;  // Toggle collapse callback
  onSectionChange: (updates: Partial<EditableSection>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onCopy: () => void;  // Copy/duplicate section
  onAddLine: () => void;
  onLineChange: (lineIndex: number, updates: Partial<EditableLine>) => void;
  onDeleteLine: (lineIndex: number) => void;
  onChordClick?: (lineIndex: number, chordIndex: number, chord: ExtendedChordPosition) => void;
  onAddChord?: (lineIndex: number, position: number) => void;
  // Move chord between lines (within section)
  onMoveChordBetweenLines?: (
    fromLineIndex: number,
    toLineIndex: number,
    chord: ExtendedChordPosition
  ) => void;
  // Display toggle settings for chord components
  showDiagram?: boolean;        // 押さえ方の図
  showPlayingMethod?: boolean;  // 引き方 (ストローク/アルペジオパターン)
  showMemo?: boolean;           // メモ
}

// Re-export EditableLine type for use in parent components
export type { EditableLine, EditableSection };

/**
 * セクション編集コンポーネント
 * セクション名、リピート回数、行の編集を行う
 */
export function SectionEditor({
  section,
  sectionIndex,
  isFirst,
  isLast,
  isCollapsed = false,
  onToggleCollapse,
  onSectionChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  onCopy,
  onAddLine,
  onLineChange,
  onDeleteLine,
  onChordClick,
  onAddChord,
  onMoveChordBetweenLines,
  showDiagram = true,
  showPlayingMethod = true,
  showMemo = true,
}: SectionEditorProps) {
  // Section name combo box state
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const sectionNameRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        sectionNameRef.current &&
        !sectionNameRef.current.contains(e.target as Node)
      ) {
        setShowSectionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter section names based on input
  const filteredSectionNames = COMMON_SECTION_NAMES.filter((name) =>
    name.toLowerCase().includes(section.name.toLowerCase())
  );

  return (
    <div className="bg-background-surface rounded-xl p-4 border border-white/5">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        {/* Collapse Toggle Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
            title={isCollapsed ? '展開' : '折りたたみ'}
          >
            <svg
              className={`w-4 h-4 text-text-secondary transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Section Name Combo Box */}
        <div className="flex-1 relative">
          <div className="flex">
            <input
              ref={sectionNameRef}
              type="text"
              value={section.name}
              onChange={(e) => {
                onSectionChange({ name: e.target.value });
                setShowSectionDropdown(true);
              }}
              onFocus={() => setShowSectionDropdown(true)}
              className="flex-1 bg-background-primary border border-white/10 rounded-l-lg px-3 py-1.5 text-black font-medium focus:outline-none focus:border-accent-primary"
              placeholder="セクション名"
            />
            <button
              type="button"
              onClick={() => setShowSectionDropdown(!showSectionDropdown)}
              className="bg-background-primary border border-l-0 border-white/10 rounded-r-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {/* Dropdown List */}
          {showSectionDropdown && filteredSectionNames.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-background-surface border border-white/10 rounded-lg shadow-lg"
            >
              {filteredSectionNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onSectionChange({ name });
                    setShowSectionDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm text-black hover:bg-accent-primary/20 transition-colors ${
                    section.name === name ? 'bg-accent-primary/10' : ''
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Repeat Count */}
        <div className="flex items-center gap-1 text-sm text-black">
          <span>×</span>
          <input
            type="number"
            value={section.repeatCount}
            onChange={(e) =>
              onSectionChange({
                repeatCount: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)),
              })
            }
            min={1}
            max={10}
            className="w-12 bg-background-primary border border-white/10 rounded px-2 py-1 text-center text-black focus:outline-none focus:border-accent-primary"
          />
        </div>

        {/* Section Controls */}
        <div className="flex items-center gap-1">
          {/* Move Up */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="上へ移動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Move Down */}
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="下へ移動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Copy Section */}
          <button
            type="button"
            onClick={onCopy}
            className="p-1 hover:bg-accent-primary/20 text-accent-primary rounded transition-colors"
            title="セクションをコピー"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* Delete Section */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
            title="セクション削除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Lines - Using LineEditor for full chord editing functionality (collapsible) */}
      {!isCollapsed && (
        <div className="space-y-6">
          {section.lines.length === 0 ? (
            <div className="text-center py-4 text-text-muted text-sm">
              行がありません
            </div>
          ) : (
            section.lines.map((line, lineIndex) => (
              <LineEditor
                key={line.id ?? `new-line-${sectionIndex}-${lineIndex}`}
                line={line}
                lineIndex={lineIndex}
                onLineChange={(updates) => onLineChange(lineIndex, updates)}
                onDelete={() => onDeleteLine(lineIndex)}
                onChordClick={(chordIndex, chord) => onChordClick?.(lineIndex, chordIndex, chord)}
                onAddChord={(position) => onAddChord?.(lineIndex, position)}
                canMoveUp={lineIndex > 0}
                canMoveDown={lineIndex < section.lines.length - 1}
                onMoveChordToLine={(direction, _chordIndex, chord) => {
                  const targetLineIndex = direction === 'up' ? lineIndex - 1 : lineIndex + 1;
                  if (targetLineIndex >= 0 && targetLineIndex < section.lines.length) {
                    onMoveChordBetweenLines?.(lineIndex, targetLineIndex, chord);
                  }
                }}
                showDiagram={showDiagram}
                showPlayingMethod={showPlayingMethod}
                showMemo={showMemo}
              />
            ))
          )}

          {/* Add Line Button */}
          <button
            type="button"
            onClick={onAddLine}
            className="w-full py-2 border border-dashed border-white/10 rounded-lg text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors text-sm"
          >
            + 行を追加
          </button>
        </div>
      )}

      {/* Collapsed state summary */}
      {isCollapsed && section.lines.length > 0 && (
        <div className="text-sm text-text-muted">
          {section.lines.length}行
        </div>
      )}
    </div>
  );
}
