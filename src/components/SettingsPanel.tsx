/**
 * SettingsPanel - 編集モード用左側サイドバー
 * EditorSidebar を基に、左側表示・折りたたみ対応に修正
 *
 * Features:
 * - 折りたたみ可能（展開時280px、折りたたみ時48px）
 * - 左側に配置（折りたたみボタンは右端）
 * - メタデータ編集（BPM, 拍子, Capo, 移調）
 * - セクションナビゲーション
 * - ガラスモーフィズム効果
 */

import { useState, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Music,
  List,
  FileText,
  Hash,
} from 'lucide-react';
import type { TimeSignature } from '@/types/database';

// ============================================
// 定数
// ============================================

const TIME_SIGNATURES: TimeSignature[] = ['4/4', '3/4', '6/8', '2/4'];

// Capo オプション: -2（全音下げ）〜 12
const CAPO_OPTIONS = [
  { value: -2, label: '全音下げ' },
  { value: -1, label: '半音下げ' },
  { value: 0, label: 'なし' },
  ...Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}f` })),
];

// 移調オプション: -12 〜 +12
const TRANSPOSE_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const value = i - 12;
  const label = value === 0 ? '0' : value > 0 ? `+${value}` : `${value}`;
  return { value, label };
});

// ============================================
// 型定義
// ============================================

export interface SettingsPanelProps {
  // メタデータ
  artistName?: string;
  bpm: number | null;
  timeSignature: TimeSignature;
  capo: number;
  transpose: number;
  notes: string | null;
  onMetadataChange: (key: string, value: unknown) => void;

  // セクションナビ
  sections: { id: string; name: string; isCollapsed: boolean }[];
  onSectionClick: (id: string) => void;

  // サイドバー状態
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// ============================================
// サブコンポーネント
// ============================================

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string | number;
}

function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  badge,
}: CollapsibleSectionProps) {
  return (
    <div className="border-b border-border/50">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5
                   hover:bg-background-hover
                   transition-colors duration-150"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          {icon}
          <span>{title}</span>
          {badge !== undefined && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full
                           bg-primary/20 text-primary-light">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-text-muted transition-transform duration-200" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted transition-transform duration-200" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3 pb-3">{children}</div>
      </div>
    </div>
  );
}

interface MetadataPanelProps {
  artistName?: string;
  bpm: number | null;
  timeSignature: TimeSignature;
  capo: number;
  transpose: number;
  notes: string | null;
  onMetadataChange: (key: string, value: unknown) => void;
}

function MetadataPanel({
  artistName,
  bpm,
  timeSignature,
  capo,
  transpose,
  notes,
  onMetadataChange,
}: MetadataPanelProps) {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  // BPM入力用のローカル状態（入力中は自由に、blur時に検証）
  const [bpmInput, setBpmInput] = useState<string>(bpm?.toString() ?? '');

  // bpmプロップが変更されたら入力も更新
  useEffect(() => {
    setBpmInput(bpm?.toString() ?? '');
  }, [bpm]);

  const handleBpmInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 入力中は数字のみ許可（空文字も許可）
    if (value === '' || /^\d*$/.test(value)) {
      setBpmInput(value);
      // 空の場合はnullを送信
      if (value === '') {
        onMetadataChange('bpm', null);
      } else {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed)) {
          onMetadataChange('bpm', parsed);
        }
      }
    }
  }, [onMetadataChange]);

  const handleBpmBlur = useCallback(() => {
    // blur時に範囲を強制
    if (bpmInput === '') {
      onMetadataChange('bpm', null);
    } else {
      const parsed = parseInt(bpmInput, 10);
      if (!isNaN(parsed)) {
        const clamped = Math.max(20, Math.min(300, parsed));
        setBpmInput(clamped.toString());
        onMetadataChange('bpm', clamped);
      }
    }
  }, [bpmInput, onMetadataChange]);

  return (
    <div className="space-y-3">
      {/* アーティスト名 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-muted">アーティスト</label>
        <input
          type="text"
          value={artistName || ''}
          onChange={(e) => onMetadataChange('artistName', e.target.value)}
          placeholder="アーティスト名"
          className="w-full px-2 py-1.5 bg-background rounded-lg border border-border
                     text-sm
                     focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none
                     transition-all duration-200"
        />
      </div>

      {/* 2x2 グリッド: BPM, 拍子 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* BPM */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted flex items-center gap-1">
            <Hash className="w-3 h-3" />
            BPM
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={bpmInput}
            onChange={handleBpmInputChange}
            onBlur={handleBpmBlur}
            placeholder="120"
            className="w-full px-2 py-1.5 bg-background rounded-lg border border-border
                       text-center font-mono text-sm
                       focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none
                       transition-all duration-200"
          />
        </div>

        {/* 拍子 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">拍子</label>
          <select
            value={timeSignature}
            onChange={(e) => onMetadataChange('timeSignature', e.target.value as TimeSignature)}
            className="w-full bg-background rounded-lg px-2 py-1.5 text-sm border border-border
                       focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none
                       transition-all duration-200 cursor-pointer"
          >
            {TIME_SIGNATURES.map((ts) => (
              <option key={ts} value={ts}>{ts}</option>
            ))}
          </select>
        </div>

        {/* Capo */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">Capo</label>
          <select
            value={capo}
            onChange={(e) => onMetadataChange('capo', parseInt(e.target.value, 10))}
            className={`w-full bg-background rounded-lg px-2 py-1.5 text-sm border border-border
                       focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none
                       transition-all duration-200 cursor-pointer ${
                         capo > 0 ? 'text-orange-400' : capo < 0 ? 'text-blue-400' : ''
                       }`}
          >
            {CAPO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 移調 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">移調</label>
          <select
            value={transpose}
            onChange={(e) => onMetadataChange('transpose', parseInt(e.target.value, 10))}
            className={`w-full bg-background rounded-lg px-2 py-1.5 text-sm border border-border
                       focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none
                       transition-all duration-200 cursor-pointer ${
                         transpose !== 0 ? 'text-blue-400' : ''
                       }`}
          >
            {TRANSPOSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* メモ */}
      <div className="pt-2 border-t border-border/30">
        <button
          onClick={() => setIsNotesExpanded(!isNotesExpanded)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary
                     transition-colors duration-150 mb-2"
        >
          <FileText className="w-3 h-3" />
          <span>メモ</span>
          {notes && <span className="text-primary">*</span>}
          {isNotesExpanded ? (
            <ChevronUp className="w-3 h-3 ml-auto" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-auto" />
          )}
        </button>
        {isNotesExpanded && (
          <textarea
            value={notes ?? ''}
            onChange={(e) => onMetadataChange('notes', e.target.value || null)}
            placeholder="曲に関するメモを入力..."
            rows={3}
            className="w-full px-2 py-1.5 bg-background rounded-lg border border-border text-sm
                       focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none
                       resize-none transition-all duration-200 placeholder:text-text-muted"
          />
        )}
      </div>
    </div>
  );
}

interface SectionNavigatorProps {
  sections: SettingsPanelProps['sections'];
  onSectionClick: (id: string) => void;
}

function SectionNavigator({ sections, onSectionClick }: SectionNavigatorProps) {
  if (sections.length === 0) {
    return (
      <div className="text-center py-6 text-text-muted text-sm">
        <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
        セクションがありません
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {sections.map((section) => (
        <li key={section.id}>
          <button
            onClick={() => onSectionClick(section.id)}
            className="w-full text-left px-3 py-2 rounded-lg transition-all duration-150
                       flex items-center justify-between group
                       hover:bg-background-hover/50 text-text-secondary
                       border border-transparent hover:border-border/30"
          >
            <span className="text-sm font-medium truncate group-hover:text-text-primary transition-colors">
              {section.name}
            </span>
            <span title={section.isCollapsed ? '折りたたまれています' : '展開されています'}>
              {section.isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              )}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// メインコンポーネント
// ============================================

export function SettingsPanel({
  artistName,
  bpm,
  timeSignature,
  capo,
  transpose,
  notes,
  onMetadataChange,
  sections,
  onSectionClick,
  isCollapsed,
  onToggleCollapse,
}: SettingsPanelProps) {
  const [openSections, setOpenSections] = useState({
    metadata: true,
    sections: true,
  });

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // 折りたたまれた状態（左側に配置）
  if (isCollapsed) {
    return (
      <aside
        className="w-12 h-full bg-background-surface/95 backdrop-blur-glass
                   border-r border-border flex flex-col items-center py-3
                   transition-all duration-300 ease-out"
      >
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-background-hover transition-colors duration-150 mb-4"
          title="サイドバーを展開"
        >
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        </button>

        {/* アイコンのみのナビゲーション */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onToggleCollapse();
              setOpenSections((prev) => ({ ...prev, metadata: true }));
            }}
            className="p-2 rounded-lg hover:bg-background-hover transition-colors duration-150"
            title="メタデータ"
          >
            <Music className="w-5 h-5 text-text-muted" />
          </button>

          <button
            onClick={() => {
              onToggleCollapse();
              setOpenSections((prev) => ({ ...prev, sections: true }));
            }}
            className="p-2 rounded-lg hover:bg-background-hover transition-colors duration-150"
            title="セクション"
          >
            <List className="w-5 h-5 text-text-muted" />
          </button>
        </div>
      </aside>
    );
  }

  // 展開された状態（左側に配置）
  return (
    <aside
      className="w-[280px] h-full bg-background-surface/95 backdrop-blur-glass
                 border-r border-border flex flex-col
                 transition-all duration-300 ease-out"
    >
      {/* ヘッダー（折りたたみボタンは右端） */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
        <span className="text-sm font-medium text-text-secondary">設定パネル</span>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-background-hover transition-colors duration-150"
          title="サイドバーを折りたたむ"
        >
          <ChevronLeft className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      {/* スクロール可能なコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        {/* メタデータセクション */}
        <CollapsibleSection
          title="メタデータ"
          icon={<Music className="w-4 h-4" />}
          isOpen={openSections.metadata}
          onToggle={() => toggleSection('metadata')}
        >
          <MetadataPanel
            artistName={artistName}
            bpm={bpm}
            timeSignature={timeSignature}
            capo={capo}
            transpose={transpose}
            notes={notes}
            onMetadataChange={onMetadataChange}
          />
        </CollapsibleSection>

        {/* セクションナビゲーター */}
        <CollapsibleSection
          title="セクション"
          icon={<List className="w-4 h-4" />}
          isOpen={openSections.sections}
          onToggle={() => toggleSection('sections')}
          badge={sections.length > 0 ? sections.length : undefined}
        >
          <SectionNavigator
            sections={sections}
            onSectionClick={onSectionClick}
          />
        </CollapsibleSection>
      </div>

      {/* フッター */}
      <div className="px-3 py-2 border-t border-border/30 text-[10px] text-text-muted/50 text-center">
        CaT4G Editor
      </div>
    </aside>
  );
}

export default SettingsPanel;
