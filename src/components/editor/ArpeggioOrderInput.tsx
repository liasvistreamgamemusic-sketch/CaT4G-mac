/**
 * ArpeggioOrderInput - アルペジオ弦順序入力コンポーネント
 * ギターの6弦をクリックして演奏順序を設定する
 * Based on patterns from ChordDiagram.tsx
 *
 * 新機能: 同時弾き（複数弦を同時に弾く）のサポート
 * - 通常クリック: 単音として追加
 * - Shift+クリック: 現在選択中のグループに追加（同時弾き）
 */

import { useState } from 'react';
import type { ArpeggioElement } from '@/types/database';

interface ArpeggioOrderInputProps {
  value?: ArpeggioElement[];
  onChange?: (order: ArpeggioElement[]) => void;
  disabled?: boolean;
}

// 弦の情報（6弦=低E, 1弦=高e）
const STRINGS = [
  { number: 6, name: 'E (低)', note: 'E' },
  { number: 5, name: 'A', note: 'A' },
  { number: 4, name: 'D', note: 'D' },
  { number: 3, name: 'G', note: 'G' },
  { number: 2, name: 'B', note: 'B' },
  { number: 1, name: 'e (高)', note: 'e' },
];

// Preset arpeggio patterns (templates)
interface ArpeggioTemplate {
  name: string;
  order: ArpeggioElement[];
  description: string;
}

const ARPEGGIO_TEMPLATES: ArpeggioTemplate[] = [
  { name: 'ベース→高音', order: [6, 3, 2, 1], description: '定番パターン' },
  { name: '上昇', order: [6, 5, 4, 3, 2, 1], description: '低→高' },
  { name: '下降', order: [1, 2, 3, 4, 5, 6], description: '高→低' },
  { name: '3フィンガー', order: [5, 3, 2, 3], description: 'ベース+3本' },
  { name: 'クラシカル', order: [6, 3, 2, 3, 1, 3, 2, 3], description: '古典風' },
  { name: 'ピンチ', order: [[6, 1], 2, 3], description: '同時弾き含む' },
  { name: 'カノン風', order: [5, 3, 1, 3, 2, 3], description: 'パッヘルベル風' },
  { name: 'フォーク', order: [5, [3, 2, 1]], description: 'ベース+コード' },
];

/**
 * ArpeggioOrderInput
 * アルペジオの弦順序を視覚的に入力するコンポーネント
 */
export function ArpeggioOrderInput({
  value,
  onChange,
  disabled = false,
}: ArpeggioOrderInputProps) {
  // 現在の順序（空配列でなければそのまま使用）
  const order = value ?? [];

  // 同時弾きグループ構築中かどうか
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<number[]>([]);

  // 弦をクリックした時の処理
  const handleStringClick = (stringNumber: number, isShiftClick: boolean) => {
    if (disabled) return;

    // Shift+クリックでグループモードに入る/グループに追加
    if (isShiftClick) {
      if (!isGroupMode) {
        // グループモード開始
        setIsGroupMode(true);
        setCurrentGroup([stringNumber]);
      } else {
        // 既存グループに追加（重複しないように）
        if (!currentGroup.includes(stringNumber)) {
          setCurrentGroup([...currentGroup, stringNumber]);
        } else {
          // 既にある場合は削除
          setCurrentGroup(currentGroup.filter(s => s !== stringNumber));
        }
      }
      return;
    }

    // 通常クリック
    if (isGroupMode) {
      // グループモード終了してグループを確定
      finishGroup(stringNumber);
      return;
    }

    // 既に選択されている場合は削除（単音の場合）
    const existingIndex = findElementIndex(order, stringNumber);
    if (existingIndex !== -1) {
      const newOrder = order.filter((_, i) => i !== existingIndex);
      onChange?.(newOrder);
    } else {
      // 新しく追加（単音）
      const newOrder = [...order, stringNumber];
      onChange?.(newOrder);
    }
  };

  // グループを確定して追加
  const finishGroup = (additionalString?: number) => {
    const group = [...currentGroup];
    if (additionalString && !group.includes(additionalString)) {
      group.push(additionalString);
    }

    if (group.length > 0) {
      // 弦番号でソート（6→1の順）
      group.sort((a, b) => b - a);

      // グループが1つだけなら単音、複数なら配列
      const newElement: ArpeggioElement = group.length === 1 ? group[0] : group;
      const newOrder = [...order, newElement];
      onChange?.(newOrder);
    }

    setIsGroupMode(false);
    setCurrentGroup([]);
  };

  // グループモードをキャンセル
  const cancelGroup = () => {
    setIsGroupMode(false);
    setCurrentGroup([]);
  };

  // 最後の要素を削除
  const handleUndo = () => {
    if (disabled || order.length === 0) return;
    const newOrder = order.slice(0, -1);
    onChange?.(newOrder);
  };

  // 順序をクリアする
  const handleClear = () => {
    if (disabled) return;
    onChange?.([]);
    setIsGroupMode(false);
    setCurrentGroup([]);
  };

  // Apply a template pattern
  const handleApplyTemplate = (template: ArpeggioTemplate) => {
    if (disabled) return;
    // Deep copy the template order to avoid mutations
    const newOrder = template.order.map(el => Array.isArray(el) ? [...el] : el);
    onChange?.(newOrder);
    setIsGroupMode(false);
    setCurrentGroup([]);
  };

  // 要素の中に特定の弦番号があるかチェック
  const findElementIndex = (elements: ArpeggioElement[], stringNumber: number): number => {
    return elements.findIndex(el => {
      if (Array.isArray(el)) {
        return el.includes(stringNumber);
      }
      return el === stringNumber;
    });
  };

  // 弦がどの位置にあるか、またはグループ構築中かを取得
  const getStringStatus = (stringNumber: number): { orderIndex: number | null; inCurrentGroup: boolean } => {
    const inCurrentGroup = currentGroup.includes(stringNumber);
    const index = findElementIndex(order, stringNumber);
    return {
      orderIndex: index !== -1 ? index + 1 : null,
      inCurrentGroup,
    };
  };

  // SVG設定
  const svgWidth = 240;
  const svgHeight = 100;
  const padding = { left: 50, right: 20, top: 10, bottom: 10 };
  const gridWidth = svgWidth - padding.left - padding.right;
  const gridHeight = svgHeight - padding.top - padding.bottom;
  const stringSpacing = gridWidth / 5; // 6弦間のスペース

  // 弦のX座標を取得（左から 6弦, 5弦, ..., 1弦）
  const getStringX = (stringIndex: number) =>
    padding.left + stringIndex * stringSpacing;

  return (
    <div className="flex flex-col gap-3">
      {/* Template selector */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-secondary">テンプレート</span>
        <div className="flex flex-wrap gap-1">
          {ARPEGGIO_TEMPLATES.map((template) => (
            <button
              key={template.name}
              type="button"
              className={`
                text-xs px-2 py-1 rounded border
                transition-colors duration-150
                ${disabled
                  ? 'opacity-50 cursor-not-allowed border-[var(--glass-premium-border)] bg-background-surface text-text-muted'
                  : 'border-[var(--glass-premium-border)] bg-background-surface hover:bg-accent-primary/20 hover:border-accent-primary/50 text-text-secondary hover:text-text-primary'
                }
              `}
              onClick={() => handleApplyTemplate(template)}
              disabled={disabled}
              title={template.description}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">
          弦順序 {isGroupMode && <span className="text-accent-primary">(同時弾きグループ作成中)</span>}
        </span>
        <div className="flex items-center gap-1">
          {isGroupMode && (
            <>
              <button
                type="button"
                className="text-xs px-2 py-0.5 rounded bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 transition-colors"
                onClick={() => finishGroup()}
                disabled={disabled}
              >
                確定
              </button>
              <button
                type="button"
                className="text-xs px-2 py-0.5 rounded text-text-secondary hover:text-text-primary hover:bg-background-surface/50 transition-colors"
                onClick={cancelGroup}
                disabled={disabled}
              >
                キャンセル
              </button>
            </>
          )}
          {order.length > 0 && !isGroupMode && (
            <>
              <button
                type="button"
                className={`
                  text-xs px-2 py-0.5 rounded
                  transition-colors duration-150
                  ${disabled
                    ? 'text-text-muted cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-surface/50'
                  }
                `}
                onClick={handleUndo}
                disabled={disabled}
              >
                戻す
              </button>
              <button
                type="button"
                className={`
                  text-xs px-2 py-0.5 rounded
                  transition-colors duration-150
                  ${disabled
                    ? 'text-text-muted cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-surface/50'
                  }
                `}
                onClick={handleClear}
                disabled={disabled}
              >
                クリア
              </button>
            </>
          )}
        </div>
      </div>

      {/* SVG 弦図 */}
      <svg
        width={svgWidth}
        height={svgHeight}
        className="bg-background-surface rounded border border-border"
      >
        {/* 弦（縦線） */}
        {STRINGS.map((string, index) => {
          const x = getStringX(index);
          const status = getStringStatus(string.number);
          const isSelected = status.orderIndex !== null;
          const inGroup = status.inCurrentGroup;

          return (
            <g key={string.number}>
              {/* クリック領域（透明な矩形） */}
              <rect
                x={x - 15}
                y={padding.top}
                width={30}
                height={gridHeight}
                fill="transparent"
                className={disabled ? '' : 'cursor-pointer'}
                onClick={(e) => handleStringClick(string.number, e.shiftKey)}
              />

              {/* 弦（縦線） */}
              <line
                x1={x}
                y1={padding.top + 15}
                x2={x}
                y2={svgHeight - padding.bottom - 15}
                stroke={inGroup ? '#22c55e' : isSelected ? '#a855f7' : '#4b5563'}
                strokeWidth={string.number >= 4 ? 2 : 1.5}
                className={disabled ? '' : 'cursor-pointer'}
                onClick={(e) => handleStringClick(string.number, e.shiftKey)}
              />

              {/* 弦番号（上部） */}
              <text
                x={x}
                y={padding.top + 8}
                fontSize={10}
                fill="#9ca3af"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {string.number}
              </text>

              {/* グループ構築中インジケーター */}
              {inGroup && (
                <>
                  <circle
                    cx={x}
                    cy={padding.top + gridHeight / 2 + 7}
                    r={12}
                    fill="#22c55e"
                    className={disabled ? '' : 'cursor-pointer'}
                    onClick={(e) => handleStringClick(string.number, e.shiftKey)}
                  />
                  <text
                    x={x}
                    y={padding.top + gridHeight / 2 + 8}
                    fontSize={10}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight="bold"
                  >
                    +
                  </text>
                </>
              )}

              {/* 順序番号（円の中） - グループ構築中でない場合 */}
              {isSelected && !inGroup && (
                <>
                  <circle
                    cx={x}
                    cy={padding.top + gridHeight / 2 + 7}
                    r={12}
                    fill="#a855f7"
                    className={disabled ? '' : 'cursor-pointer'}
                    onClick={(e) => handleStringClick(string.number, e.shiftKey)}
                  />
                  <text
                    x={x}
                    y={padding.top + gridHeight / 2 + 8}
                    fontSize={12}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight="bold"
                    className={disabled ? '' : 'cursor-pointer'}
                    onClick={(e) => handleStringClick(string.number, e.shiftKey)}
                  >
                    {status.orderIndex}
                  </text>
                </>
              )}

              {/* 弦の音名（下部） */}
              <text
                x={x}
                y={svgHeight - padding.bottom - 3}
                fontSize={9}
                fill="#6b7280"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {string.note}
              </text>
            </g>
          );
        })}
      </svg>

      {/* グループ構築中の表示 */}
      {isGroupMode && currentGroup.length > 0 && (
        <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded border border-green-500/30">
          <span className="text-xs text-green-400">同時弾き:</span>
          <span className="text-sm font-mono text-green-400">
            [{currentGroup.sort((a, b) => b - a).join('')}]
          </span>
          <span className="text-xs text-text-muted">
            (他の弦をShift+クリックで追加、通常クリックで確定)
          </span>
        </div>
      )}

      {/* 現在の順序表示 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">順序:</span>
        {order.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap">
            {order.map((element, idx) => (
              <span key={idx} className="flex items-center">
                <span className={`text-sm font-mono ${Array.isArray(element) ? 'px-1 py-0.5 bg-accent-primary/20 rounded text-accent-primary' : 'text-accent-primary'}`}>
                  {Array.isArray(element) ? `[${element.join('')}]` : element}
                </span>
                {idx < order.length - 1 && (
                  <span className="text-text-muted mx-0.5">→</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-text-muted italic">
            弦をクリックして順序を設定
          </span>
        )}
      </div>

      {/* ヘルプテキスト */}
      <div className="text-xs text-text-muted space-y-0.5">
        <div>6=低E, 5=A, 4=D, 3=G, 2=B, 1=高e</div>
        <div className="text-green-400">Shift+クリック: 同時弾きグループを作成</div>
      </div>
    </div>
  );
}
