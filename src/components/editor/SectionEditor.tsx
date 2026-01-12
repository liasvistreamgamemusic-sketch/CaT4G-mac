import { useState, useRef, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import type { ExtendedChordPosition } from '@/types/database';
import { LineEditor, type EditableLine } from './LineEditor';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SectionSettingsPanel } from './SectionSettingsPanel';

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
  capoOverride: number | null;
  bpmOverride: number | null;
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
  onAddLine: (insertAtIndex?: number) => void;  // Add line at end (no index) or insert at specific position
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
  // Split section at a specific line (creates new section from that line onward)
  onSplitSection?: (atLineIndex: number) => void;
  // Display toggle settings for chord components
  showDiagram?: boolean;        // 押さえ方の図
  showPlayingMethod?: boolean;  // 引き方 (ストローク/アルペジオパターン)
  showMemo?: boolean;           // メモ
  // 移調量（表示用）
  transpose?: number;
  // セクション設定用
  songBpm?: number | null;
  songCapo?: number;
  onSectionSettingsChange?: (settings: {
    capoOverride: number | null;
    bpmOverride: number | null;
    transposeChords?: boolean;
  }) => void;
}

// Re-export EditableLine type for use in parent components
export type { EditableLine, EditableSection };

/**
 * 行間挿入ボタンコンポーネント
 * ホバー時にのみ表示される薄い「+」ボタン
 */
function InsertLineButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-1 opacity-0 hover:opacity-100 transition-opacity text-text-muted/50 hover:text-accent-primary text-xs group/insert"
      title={label}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-[var(--glass-premium-border)] group-hover/insert:bg-accent-primary/30 transition-colors" />
        <span className="px-2">+ 行を挿入</span>
        <div className="h-px flex-1 bg-[var(--glass-premium-border)] group-hover/insert:bg-accent-primary/30 transition-colors" />
      </div>
    </button>
  );
}

/**
 * セクション分割ボタンコンポーネント
 * ホバー時にのみ表示される薄い「✂」ボタン
 * この行から下を新しいセクションに分割する
 */
function SplitSectionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover/line:opacity-100 transition-opacity
                 text-orange-400/70 hover:text-orange-400 hover:bg-orange-500/20 rounded"
      title="ここでセクションを分割"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    </button>
  );
}

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
  onSplitSection,
  showDiagram = true,
  showPlayingMethod = true,
  showMemo = true,
  transpose = 0,
  songBpm = null,
  songCapo = 0,
  onSectionSettingsChange,
}: SectionEditorProps) {
  // Section name combo box state
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const sectionNameRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  // Check if section has custom settings
  const hasCustomSettings =
    section.capoOverride !== null ||
    section.bpmOverride !== null;

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

  // Close settings panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsPanelRef.current &&
        !settingsPanelRef.current.contains(e.target as Node) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(e.target as Node)
      ) {
        setShowSettingsPanel(false);
      }
    };
    if (showSettingsPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSettingsPanel]);

  // Filter section names based on input
  const filteredSectionNames = COMMON_SECTION_NAMES.filter((name) =>
    name.toLowerCase().includes(section.name.toLowerCase())
  );

  return (
    <div className="bg-background-surface rounded-xl p-4 border border-[var(--glass-premium-border)]">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        {/* Collapse Toggle Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 hover:bg-[var(--btn-glass-hover)] rounded transition-colors flex-shrink-0"
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
              className="flex-1 bg-background-primary border border-[var(--glass-premium-border)] rounded-l-lg px-3 py-1.5 text-text-primary font-medium focus:outline-none focus:border-accent-primary"
              placeholder="セクション名"
            />
            <button
              type="button"
              onClick={() => setShowSectionDropdown(!showSectionDropdown)}
              className="bg-background-primary border border-l-0 border-[var(--glass-premium-border)] rounded-r-lg px-2 py-1.5 hover:bg-[var(--btn-glass-hover)] transition-colors"
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
              className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-background-surface border border-[var(--glass-premium-border)] rounded-lg shadow-lg"
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
            className="w-12 bg-background-primary border border-[var(--glass-premium-border)] rounded px-2 py-1 text-center text-text-primary focus:outline-none focus:border-accent-primary"
          />
        </div>

        {/* Section Settings Button */}
        <div className="relative">
          <button
            ref={settingsButtonRef}
            type="button"
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            className={`p-1 rounded transition-colors ${
              hasCustomSettings
                ? 'text-accent-primary hover:bg-accent-primary/20'
                : 'text-text-secondary hover:bg-[var(--btn-glass-hover)]'
            }`}
            title="セクション設定"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Settings Panel Popover */}
          {showSettingsPanel && onSectionSettingsChange && (
            <div
              ref={settingsPanelRef}
              className="absolute z-50 top-full right-0 mt-2"
            >
              <SectionSettingsPanel
                capoOverride={section.capoOverride}
                bpmOverride={section.bpmOverride}
                songBpm={songBpm}
                songCapo={songCapo}
                onCapoChange={(value, transposeChords) =>
                  onSectionSettingsChange({
                    capoOverride: value,
                    bpmOverride: section.bpmOverride,
                    transposeChords,
                  })
                }
                onBpmChange={(value) =>
                  onSectionSettingsChange({
                    capoOverride: section.capoOverride,
                    bpmOverride: value,
                  })
                }
                onClose={() => setShowSettingsPanel(false)}
              />
            </div>
          )}
        </div>

        {/* Section Controls */}
        <div className="flex items-center gap-1">
          {/* Move Up */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 hover:bg-[var(--btn-glass-hover)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
            className="p-1 hover:bg-[var(--btn-glass-hover)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
            onClick={() => setShowDeleteConfirm(true)}
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
        <div className="space-y-6 overflow-x-auto">
          {section.lines.length === 0 ? (
            <div className="text-center py-4 text-text-muted text-sm">
              行がありません
            </div>
          ) : (
            section.lines.map((line, lineIndex) => (
              <div key={line.id ?? `new-line-${sectionIndex}-${lineIndex}`} className="group/line relative">
                {/* 最初の行の上に挿入ボタン */}
                {lineIndex === 0 && (
                  <InsertLineButton
                    onClick={() => onAddLine(0)}
                    label="上に行を挿入"
                  />
                )}

                {/* セクション分割ボタン（2行以上あり、最初の行以外に表示） */}
                {onSplitSection && section.lines.length > 1 && lineIndex > 0 && (
                  <SplitSectionButton onClick={() => onSplitSection(lineIndex)} />
                )}

                <LineEditor
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
                  transpose={transpose}
                />

                {/* 行の下に挿入ボタン */}
                <InsertLineButton
                  onClick={() => onAddLine(lineIndex + 1)}
                  label="下に行を挿入"
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Collapsed state summary */}
      {isCollapsed && section.lines.length > 0 && (
        <div className="text-sm text-text-muted">
          {section.lines.length}行
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="セクションを削除"
        message={`「${section.name}」（${section.lines.length}行）を削除しますか？この操作は取り消せません。`}
        confirmLabel="削除"
        cancelLabel="キャンセル"
        variant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
