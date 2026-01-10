/**
 * DraggableChord - ドラッグ可能なコードコンポーネント
 *
 * 編集画面用の改良版コードコンポーネント。
 * - ドラッグ&ドロップで位置調整
 * - 3つの表示モード対応 (compact/standard/detailed)
 * - 拍数表示バー
 * - テクニックインジケーター
 * - 演奏方法バッジ (St/Ar)
 * - forwardRef対応
 * - memo最適化
 */

import React, {
  useMemo,
  useCallback,
  forwardRef,
  memo,
} from 'react';
import type { ExtendedChordPosition, PlayingTechnique } from '@/types/database';
import type { ChordFingering } from '@/lib/chords/types';
import { ChordDiagramHorizontal } from '@/components/ChordDiagramHorizontal';

// ============================================
// Constants
// ============================================

/** テクニックインジケーターのマッピング */
const TECHNIQUE_ICONS: Record<PlayingTechnique, string> = {
  'hammer-on': 'h',
  'pull-off': 'p',
  'slide-up': '/',
  'slide-down': '\\',
  'bend': 'b',
  'vibrato': '~',
  'palm-mute': 'PM',
  'harmonic': '*',
  'let-ring': '\u25CB', // ◯
  'accent': '>',
};

/** テクニックの日本語名（ツールチップ用） */
const TECHNIQUE_NAMES: Record<PlayingTechnique, string> = {
  'hammer-on': 'ハンマリング',
  'pull-off': 'プリングオフ',
  'slide-up': 'スライドアップ',
  'slide-down': 'スライドダウン',
  'bend': 'ベンド',
  'vibrato': 'ビブラート',
  'palm-mute': 'パームミュート',
  'harmonic': 'ハーモニクス',
  'let-ring': 'レットリング',
  'accent': 'アクセント',
};

// ============================================
// Types
// ============================================

/** 表示モード */
export type ViewMode = 'compact' | 'standard' | 'detailed';

/** DraggableChord Props */
export interface DraggableChordProps {
  /** コード情報 */
  chord: ExtendedChordPosition;
  /** コードのインデックス（行内での位置） */
  index: number;
  /** 選択状態 */
  isSelected: boolean;
  /** ドラッグ中かどうか */
  isDragging: boolean;
  /** 表示モード */
  viewMode: ViewMode;

  // ドラッグ関連
  /** ドラッグ開始時のハンドラ */
  onDragStart: (index: number, e: React.MouseEvent) => void;
  /** ドラッグ終了時のハンドラ */
  onDragEnd: () => void;

  // インタラクション
  /** クリック時のハンドラ */
  onClick: (index: number) => void;
  /** ダブルクリック時のハンドラ */
  onDoubleClick: (index: number) => void;

  // 表示オプション
  /** ダイアグラムを表示するか */
  showDiagram?: boolean;
  /** 演奏方法を表示するか */
  showPlayingMethod?: boolean;
  /** 拍数を表示するか */
  showDuration?: boolean;
  /** テクニックを表示するか */
  showTechniques?: boolean;

  // スタイル
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** 追加CSSクラス */
  className?: string;

  // 表示用データ
  /** コードの押さえ方データ */
  fingering?: ChordFingering | null;
}

// ============================================
// Sub Components
// ============================================

/**
 * ChordBadge - コード名表示バッジ
 */
const ChordBadge = memo(function ChordBadge({
  chordName,
  isSelected,
}: {
  chordName: string;
  isSelected: boolean;
}) {
  return (
    <span
      className={`
        font-mono text-sm font-semibold leading-none
        transition-colors duration-150
        ${isSelected
          ? 'text-[var(--color-accent-primary-light)]'
          : 'text-[var(--color-accent-primary)]'
        }
      `}
    >
      {chordName}
    </span>
  );
});

/**
 * DiagramPreview - 小さなダイアグラム表示
 */
const DiagramPreview = memo(function DiagramPreview({
  fingering,
  showFingers,
}: {
  fingering: ChordFingering;
  showFingers: boolean;
}) {
  return (
    <div className="flex items-center justify-center flex-shrink-0">
      <ChordDiagramHorizontal
        fingering={fingering}
        size="xs"
        showFingers={showFingers}
      />
    </div>
  );
});

/**
 * DurationIndicator - 拍数表示バー
 */
const DurationIndicator = memo(function DurationIndicator({
  duration,
}: {
  duration: number;
}) {
  // 最大4拍を基準として幅を計算
  const widthPercent = Math.min(100, (duration / 4) * 100);

  return (
    <div
      className="w-full h-1.5 rounded-full overflow-hidden mt-1"
      style={{ backgroundColor: 'var(--color-bg-hover)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-200"
        style={{
          width: `${widthPercent}%`,
          background: `linear-gradient(90deg,
            var(--color-accent-primary) 0%,
            var(--color-accent-secondary) 100%
          )`,
        }}
        title={`${duration}拍`}
      />
    </div>
  );
});

/**
 * TechniqueIndicator - 特殊奏法アイコン表示
 */
const TechniqueIndicator = memo(function TechniqueIndicator({
  techniques,
}: {
  techniques: PlayingTechnique[];
}) {
  if (!techniques || techniques.length === 0) return null;

  // 最大3つまで表示
  const displayTechniques = techniques.slice(0, 3);
  const remainingCount = techniques.length - 3;

  return (
    <div className="flex flex-wrap gap-0.5 mt-1">
      {displayTechniques.map((technique, idx) => (
        <span
          key={idx}
          className="
            inline-flex items-center justify-center
            min-w-[14px] h-[14px] px-0.5
            text-[8px] font-mono font-bold
            bg-blue-500/20 text-blue-300
            rounded
          "
          title={TECHNIQUE_NAMES[technique]}
        >
          {TECHNIQUE_ICONS[technique]}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className="
            inline-flex items-center justify-center
            min-w-[14px] h-[14px] px-0.5
            text-[8px] font-mono
            bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]
            rounded
          "
          title={techniques.slice(3).map(t => TECHNIQUE_NAMES[t]).join(', ')}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
});

/**
 * PlayingMethodBadge - 演奏方法バッジ (St/Ar)
 */
const PlayingMethodBadge = memo(function PlayingMethodBadge({
  chord,
}: {
  chord: ExtendedChordPosition;
}) {
  if (!chord.method) return null;

  const isStroke = chord.method === 'stroke';
  const label = isStroke ? 'St' : 'Ar';

  // パターンプレビュー生成
  let patternPreview = '';
  if (isStroke && chord.strokePattern && chord.strokePattern.length > 0) {
    patternPreview = chord.strokePattern
      .slice(0, 4)
      .map((dir) => {
        switch (dir) {
          case 'down': return '\u2193'; // ↓
          case 'up': return '\u2191';   // ↑
          case 'mute': return '\u00D7'; // ×
          case 'rest': return '\u2212'; // −
          default: return '';
        }
      })
      .join('');
    if (chord.strokePattern.length > 4) patternPreview += '...';
  } else if (!isStroke && chord.arpeggioOrder && chord.arpeggioOrder.length > 0) {
    patternPreview = chord.arpeggioOrder
      .slice(0, 3)
      .map((el) => (Array.isArray(el) ? `[${el.join('')}]` : String(el)))
      .join('-');
    if (chord.arpeggioOrder.length > 3) patternPreview += '...';
  }

  return (
    <div className="flex items-center gap-1 mt-0.5">
      <span
        className={`
          text-[8px] px-1 py-0.5 rounded font-medium
          ${isStroke
            ? 'bg-green-500/20 text-green-300'
            : 'bg-blue-500/20 text-blue-300'
          }
        `}
      >
        {label}
      </span>
      {patternPreview && (
        <span
          className={`
            text-[8px] font-mono leading-none
            ${isStroke ? 'text-green-300/80' : 'text-blue-300/80'}
          `}
        >
          {patternPreview}
        </span>
      )}
    </div>
  );
});

// ============================================
// Main Component
// ============================================

/**
 * DraggableChord - ドラッグ可能なコードコンポーネント
 */
export const DraggableChord = memo(
  forwardRef<HTMLDivElement, DraggableChordProps>(function DraggableChord(
    {
      chord,
      index,
      isSelected,
      isDragging,
      viewMode,
      onDragStart,
      onDragEnd,
      onClick,
      onDoubleClick,
      showDiagram = true,
      showPlayingMethod = true,
      showDuration = true,
      showTechniques = true,
      style,
      className,
      fingering,
    },
    ref
  ) {
    // ============================================
    // Event Handlers
    // ============================================

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (e.button !== 0) return; // 左クリックのみ
        e.preventDefault();
        e.stopPropagation();
        onDragStart(index, e);
      },
      [index, onDragStart]
    );

    const handleMouseUp = useCallback(() => {
      if (isDragging) {
        onDragEnd();
      }
    }, [isDragging, onDragEnd]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(index);
      },
      [index, onClick]
    );

    const handleDoubleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onDoubleClick(index);
      },
      [index, onDoubleClick]
    );

    // ============================================
    // Computed Values
    // ============================================

    // 表示する内容を決定
    const shouldShowDiagram = showDiagram && viewMode !== 'compact' && fingering;
    const shouldShowPlayingMethod = showPlayingMethod && viewMode !== 'compact' && chord.method;
    const shouldShowDuration = showDuration && viewMode === 'detailed' && chord.duration && chord.duration > 0;
    const shouldShowTechniques = showTechniques && viewMode === 'detailed' && chord.techniques && chord.techniques.length > 0;
    const shouldShowAnnotation = viewMode !== 'compact' && chord.annotation && chord.annotation.trim();
    const shouldShowDynamics = viewMode === 'detailed' && chord.dynamics;

    // コンポーネントサイズ
    const dimensions = useMemo(() => {
      switch (viewMode) {
        case 'compact':
          return { width: 'auto', minWidth: undefined, minHeight: '24px' };
        case 'standard':
          return { width: '80px', minWidth: '80px', minHeight: '70px' };
        case 'detailed':
          return { width: '100px', minWidth: '100px', minHeight: '100px' };
        default:
          return { width: 'auto', minWidth: undefined, minHeight: '24px' };
      }
    }, [viewMode]);

    // コンテナスタイル
    const containerStyle: React.CSSProperties = useMemo(
      () => ({
        ...style,
        width: dimensions.width,
        minWidth: dimensions.minWidth,
        minHeight: dimensions.minHeight,
        // ドラッグ中のスタイル
        ...(isDragging && {
          transform: 'scale(1.05)',
          opacity: 0.8,
          zIndex: 50,
        }),
      }),
      [style, dimensions, isDragging]
    );

    // CSSクラス
    const containerClasses = useMemo(() => {
      const baseClasses = [
        // レイアウト
        'flex flex-col',
        'select-none',
        // 形状
        'border rounded',
        // パディング
        viewMode === 'compact' ? 'px-1.5 py-0.5' : 'p-1.5',
        // トランジション
        'transition-all duration-150 ease-out',
        // カーソル
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
      ];

      // 背景
      baseClasses.push('bg-[var(--color-bg-surface)]/50');

      // ボーダー
      if (isSelected) {
        baseClasses.push(
          'border-[var(--color-accent-primary)]',
          'ring-2 ring-[var(--color-accent-primary)]/40'
        );
      } else if (isDragging) {
        baseClasses.push('border-[var(--color-accent-primary)]/50');
      } else {
        baseClasses.push(
          'border-[var(--color-border-default)]',
          'hover:border-[var(--color-accent-primary)]/30',
          'hover:bg-[var(--color-bg-hover)]'
        );
      }

      // シャドウ
      if (isDragging) {
        baseClasses.push('shadow-lg shadow-[var(--color-accent-primary)]/30');
      } else if (isSelected) {
        baseClasses.push('shadow-md shadow-[var(--color-accent-primary)]/20');
      }

      // カスタムクラス
      if (className) {
        baseClasses.push(className);
      }

      return baseClasses.join(' ');
    }, [viewMode, isSelected, isDragging, className]);

    // ============================================
    // Render
    // ============================================

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        data-chord-element="true"
        data-chord-index={index}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        aria-label={`コード ${chord.chord}${chord.annotation ? ` - ${chord.annotation}` : ''}`}
        title={`${chord.chord}${chord.annotation ? `\n${chord.annotation}` : ''}\n(ダブルクリックで編集)`}
      >
        {/* ヘッダー: コード名 + ダイナミクス */}
        <div className="flex items-center justify-between gap-1">
          <ChordBadge chordName={chord.chord} isSelected={isSelected} />

          {/* ダイナミクス表示 */}
          {shouldShowDynamics && (
            <span
              className="text-[9px] font-serif italic text-yellow-400/80"
              title={`ダイナミクス: ${chord.dynamics}`}
            >
              {chord.dynamics}
            </span>
          )}
        </div>

        {/* ダイアグラムプレビュー */}
        {shouldShowDiagram && (
          <div className="my-1">
            <DiagramPreview
              fingering={fingering!}
              showFingers={viewMode === 'detailed'}
            />
          </div>
        )}

        {/* 演奏方法バッジ */}
        {shouldShowPlayingMethod && (
          <PlayingMethodBadge chord={chord} />
        )}

        {/* テクニックインジケーター */}
        {shouldShowTechniques && (
          <TechniqueIndicator techniques={chord.techniques!} />
        )}

        {/* 拍数バー */}
        {shouldShowDuration && (
          <DurationIndicator duration={chord.duration!} />
        )}

        {/* アノテーション */}
        {shouldShowAnnotation && (
          <div
            className="
              text-[9px] text-yellow-400/80
              leading-tight mt-1 truncate
            "
            title={chord.annotation}
          >
            {chord.annotation!.length > 15
              ? chord.annotation!.slice(0, 15) + '...'
              : chord.annotation}
          </div>
        )}

        {/* タイ表示（次のコードとつなぐ場合） */}
        {chord.tieToNext && (
          <div
            className="
              absolute -right-2 top-1/2 -translate-y-1/2
              text-[var(--color-accent-primary)] text-lg font-light
            "
            aria-label="次のコードとタイで接続"
          >
            {'\u23DC'} {/* tie arc symbol ⏜ */}
          </div>
        )}
      </div>
    );
  })
);

// Default export
export default DraggableChord;
