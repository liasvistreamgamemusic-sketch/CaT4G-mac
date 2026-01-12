/**
 * AnnotationDisplay - 注釈の表示専用コンポーネント（ホバー対応）
 * 特定の行またはコードの注釈をアイコンとツールチップで表示
 * Based on patterns from ChordLine.tsx
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Annotation, UUID } from '@/types/database';
import { getAnnotations } from '@/lib/database';

interface AnnotationDisplayProps {
  /** 対象の行ID（注釈をフェッチする場合） */
  lineId?: UUID;
  /** 対象のコードインデックス（null = 行全体への注釈） */
  chordIndex?: number | null;
  /** 直接注釈を渡す場合（フェッチ不要） */
  annotations?: Annotation[];
  /** クリック時のコールバック（編集モードへの遷移等） */
  onClick?: () => void;
  /** 表示サイズ */
  size?: 'small' | 'medium' | 'large';
  /** インライン表示（アイコンのみ、他の要素と並べる用） */
  inline?: boolean;
  /** ツールチップの位置 */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * AnnotationDisplay
 * 注釈の存在を示すアイコンとホバーで内容を表示するコンポーネント
 */
export function AnnotationDisplay({
  lineId,
  chordIndex = null,
  annotations: propAnnotations,
  onClick,
  size = 'medium',
  inline = false,
  tooltipPosition = 'top',
}: AnnotationDisplayProps) {
  // 内部でフェッチした注釈
  const [fetchedAnnotations, setFetchedAnnotations] = useState<Annotation[]>([]);
  // ホバー状態
  const [isHovered, setIsHovered] = useState(false);
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  // ツールチップの位置調整用ref
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 使用する注釈（propsから渡されたものか、フェッチしたもの）
  const annotations = propAnnotations ?? fetchedAnnotations;

  // chordIndexでフィルタリング
  const filteredAnnotations = annotations.filter(
    (a) => a.chordIndex === chordIndex
  );

  // 注釈をフェッチ（lineIdが指定され、propsから注釈が渡されていない場合）
  const loadAnnotations = useCallback(async () => {
    if (!lineId || propAnnotations) return;

    try {
      setIsLoading(true);
      const allAnnotations = await getAnnotations(lineId);
      setFetchedAnnotations(allAnnotations);
    } catch (err) {
      console.error('Failed to load annotations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lineId, propAnnotations]);

  // lineIdが変更されたら注釈を再フェッチ
  useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  // 注釈がない場合は何も表示しない
  if (!isLoading && filteredAnnotations.length === 0) {
    return null;
  }

  // サイズに応じたクラス
  const sizeClasses = {
    small: 'w-3.5 h-3.5 text-[10px]',
    medium: 'w-4 h-4 text-xs',
    large: 'w-5 h-5 text-sm',
  };

  // ツールチップの位置クラス
  const tooltipPositionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1',
  };

  // 矢印の位置クラス
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-yellow-500/80',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-yellow-500/80',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-yellow-500/80',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-yellow-500/80',
  };

  // ローディング表示
  if (isLoading) {
    return (
      <div
        className={`${inline ? 'inline-flex' : 'flex'} items-center justify-center ${sizeClasses[size]} text-text-muted animate-pulse`}
      >
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${inline ? 'inline-flex' : 'flex'} items-center justify-center relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 注釈アイコン */}
      <div
        className={`
          ${sizeClasses[size]}
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
          text-yellow-500 hover:text-yellow-400 transition-colors
          ${filteredAnnotations.length > 1 ? 'relative' : ''}
        `}
        title={onClick ? '注釈を表示・編集' : '注釈があります'}
      >
        {/* コメントアイコン */}
        <svg
          className="w-full h-full"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        </svg>

        {/* 複数の注釈がある場合はバッジを表示 */}
        {filteredAnnotations.length > 1 && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-background-primary text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
            {filteredAnnotations.length > 9 ? '9+' : filteredAnnotations.length}
          </span>
        )}
      </div>

      {/* ツールチップ（ホバー時に表示） */}
      {isHovered && filteredAnnotations.length > 0 && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50
            ${tooltipPositionClasses[tooltipPosition]}
            bg-yellow-500/10 backdrop-blur-sm
            border border-yellow-500/30
            rounded-lg shadow-lg
            min-w-[200px] max-w-[300px]
            animate-fade-in
          `}
        >
          {/* 矢印 */}
          <div
            className={`
              absolute w-0 h-0
              border-4
              ${arrowClasses[tooltipPosition]}
            `}
          />

          {/* 内容 */}
          <div className="p-2 space-y-2">
            {/* ヘッダー */}
            <div className="flex items-center gap-1.5 text-yellow-500 text-xs font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>
                {chordIndex !== null && chordIndex !== undefined
                  ? `コード #${chordIndex + 1} の注釈`
                  : '行の注釈'}
              </span>
            </div>

            {/* 注釈リスト */}
            <div className="space-y-1.5">
              {filteredAnnotations.map((annotation, index) => (
                <div
                  key={annotation.id}
                  className="bg-background-primary/50 rounded px-2 py-1.5"
                >
                  <p className="text-text-primary text-xs whitespace-pre-wrap leading-relaxed">
                    {annotation.content}
                  </p>
                  {filteredAnnotations.length > 1 && (
                    <p className="text-text-muted text-[10px] mt-1">
                      {index + 1}/{filteredAnnotations.length}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* クリックヒント（onClick がある場合） */}
            {onClick && (
              <p className="text-text-muted text-[10px] text-center pt-1 border-t border-[var(--glass-premium-border)]">
                クリックで編集
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * AnnotationIndicator - シンプルな注釈インジケーター
 * 注釈の有無のみを表示する軽量版
 */
export function AnnotationIndicator({
  hasAnnotation,
  count = 1,
  onClick,
  size = 'small',
}: {
  hasAnnotation: boolean;
  count?: number;
  onClick?: () => void;
  size?: 'small' | 'medium';
}) {
  if (!hasAnnotation) return null;

  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
  };

  return (
    <span
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        text-yellow-500 hover:text-yellow-400
        ${onClick ? 'cursor-pointer' : ''}
        transition-colors relative
      `}
      onClick={onClick}
      title="注釈があります"
    >
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
      </svg>
      {count > 1 && (
        <span className="absolute -top-0.5 -right-0.5 bg-yellow-500 text-background-primary text-[6px] font-bold rounded-full w-2.5 h-2.5 flex items-center justify-center">
          {count > 9 ? '+' : count}
        </span>
      )}
    </span>
  );
}

export default AnnotationDisplay;
