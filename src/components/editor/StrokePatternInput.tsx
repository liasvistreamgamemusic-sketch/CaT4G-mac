import type { StrokeDirection, TimeSignature } from '@/types/database';

interface StrokePatternInputProps {
  value?: StrokeDirection[];
  onChange?: (pattern: StrokeDirection[]) => void;
  timeSignature?: TimeSignature;
  disabled?: boolean;
}

// Maximum number of strokes allowed
const MAX_STROKES = 16;

// Preset stroke patterns (templates)
interface StrokeTemplate {
  name: string;
  pattern: StrokeDirection[];
  description: string;
}

const STROKE_TEMPLATES: StrokeTemplate[] = [
  { name: '基本4拍', pattern: ['down', 'down', 'down', 'down'], description: '全てダウン' },
  { name: 'オルタネイト', pattern: ['down', 'up', 'down', 'up'], description: '交互' },
  { name: '8ビート', pattern: ['down', 'down', 'up', 'up', 'down', 'up', 'down', 'up'], description: '定番パターン' },
  { name: '16ビート基本', pattern: ['down', 'up', 'down', 'up', 'down', 'up', 'down', 'up', 'down', 'up', 'down', 'up', 'down', 'up', 'down', 'up'], description: '16分' },
  { name: 'カッティング', pattern: ['down', 'mute', 'up', 'mute'], description: 'ミュート混じり' },
  { name: 'スカ風', pattern: ['mute', 'up', 'mute', 'up'], description: 'アップ強調' },
  { name: 'レゲエ', pattern: ['rest', 'down', 'up', 'rest'], description: '裏拍強調' },
  { name: '3拍子', pattern: ['down', 'up', 'up'], description: 'ワルツ風' },
];

/**
 * StrokePatternInput
 * ストロークパターン（↑↓×−）を視覚的に入力するコンポーネント
 * Based on the patterns from ControlBar.tsx
 *
 * 新機能: 4拍以上のストロークパターンに対応
 * - + ボタンでストロークを追加
 * - - ボタンでストロークを削除
 * - 最大16ストロークまで設定可能
 */
export function StrokePatternInput({
  value,
  onChange,
  timeSignature = '4/4',
  disabled = false,
}: StrokePatternInputProps) {
  // Get default number of beats based on time signature
  const defaultBeats = parseInt(timeSignature.split('/')[0], 10);

  // Use provided pattern length or default to time signature beats
  const pattern = value && value.length > 0
    ? value
    : Array(defaultBeats).fill('down' as StrokeDirection);

  // Cycle through stroke directions on click
  const handleBeatClick = (index: number) => {
    if (disabled) return;

    const directions: StrokeDirection[] = ['down', 'up', 'mute', 'rest'];
    const currentDirection = pattern[index];
    const currentIndex = directions.indexOf(currentDirection);
    const nextDirection = directions[(currentIndex + 1) % directions.length];

    const newPattern = [...pattern];
    newPattern[index] = nextDirection;
    onChange?.(newPattern);
  };

  // Add a new beat at the end
  const handleAddBeat = () => {
    if (disabled || pattern.length >= MAX_STROKES) return;
    const newPattern = [...pattern, 'down' as StrokeDirection];
    onChange?.(newPattern);
  };

  // Remove the last beat
  const handleRemoveBeat = () => {
    if (disabled || pattern.length <= 1) return;
    const newPattern = pattern.slice(0, -1);
    onChange?.(newPattern);
  };

  // Reset to default beats based on time signature
  const handleReset = () => {
    if (disabled) return;
    const newPattern = Array(defaultBeats).fill('down' as StrokeDirection);
    onChange?.(newPattern);
  };

  // Apply a template pattern
  const handleApplyTemplate = (template: StrokeTemplate) => {
    if (disabled) return;
    onChange?.([...template.pattern]);
  };

  // Get visual representation of stroke direction
  const getDirectionSymbol = (direction: StrokeDirection): string => {
    switch (direction) {
      case 'down': return '↓';
      case 'up': return '↑';
      case 'mute': return '×';
      case 'rest': return '−';
      default: return '↓';
    }
  };

  // Get color class based on stroke direction
  const getDirectionColorClass = (direction: StrokeDirection): string => {
    switch (direction) {
      case 'down': return 'text-accent-primary';
      case 'up': return 'text-green-400';
      case 'mute': return 'text-orange-400';
      case 'rest': return 'text-text-muted';
      default: return 'text-text-primary';
    }
  };

  // Get tooltip text for stroke direction
  const getDirectionTooltip = (direction: StrokeDirection): string => {
    switch (direction) {
      case 'down': return 'ダウンストローク';
      case 'up': return 'アップストローク';
      case 'mute': return 'ミュート';
      case 'rest': return '休み';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Template selector */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-secondary">テンプレート</span>
        <div className="flex flex-wrap gap-1">
          {STROKE_TEMPLATES.map((template) => (
            <button
              key={template.name}
              type="button"
              className={`
                text-xs px-2 py-1 rounded border
                transition-colors duration-150
                ${disabled
                  ? 'opacity-50 cursor-not-allowed border-white/5 bg-background-surface text-text-muted'
                  : 'border-white/10 bg-background-surface hover:bg-accent-primary/20 hover:border-accent-primary/50 text-text-secondary hover:text-text-primary'
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">パターン</span>
          <span className="text-xs text-text-muted">({pattern.length}拍)</span>
        </div>
        <div className="flex items-center gap-1">
          {pattern.length !== defaultBeats && (
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
              onClick={handleReset}
              disabled={disabled}
              title={`${defaultBeats}拍に戻す`}
            >
              リセット
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {pattern.map((direction, index) => (
          <button
            key={index}
            type="button"
            className={`
              w-8 h-8 rounded border border-border
              flex items-center justify-center
              text-lg font-bold
              transition-all duration-150
              ${getDirectionColorClass(direction)}
              ${disabled
                ? 'opacity-50 cursor-not-allowed bg-background-surface'
                : 'hover:bg-background-surface/80 hover:border-accent-primary cursor-pointer bg-background-surface'
              }
            `}
            onClick={() => handleBeatClick(index)}
            disabled={disabled}
            title={`${index + 1}拍目: ${getDirectionTooltip(direction)} (クリックで変更)`}
          >
            {getDirectionSymbol(direction)}
          </button>
        ))}

        {/* Add/Remove beat buttons */}
        <div className="flex flex-col gap-0.5 ml-1">
          <button
            type="button"
            className={`
              w-6 h-4 rounded border border-border
              flex items-center justify-center
              text-xs font-bold
              transition-all duration-150
              ${disabled || pattern.length >= MAX_STROKES
                ? 'opacity-30 cursor-not-allowed bg-background-surface text-text-muted'
                : 'hover:bg-accent-primary/20 hover:border-accent-primary cursor-pointer bg-background-surface text-accent-primary'
              }
            `}
            onClick={handleAddBeat}
            disabled={disabled || pattern.length >= MAX_STROKES}
            title="拍を追加"
          >
            +
          </button>
          <button
            type="button"
            className={`
              w-6 h-4 rounded border border-border
              flex items-center justify-center
              text-xs font-bold
              transition-all duration-150
              ${disabled || pattern.length <= 1
                ? 'opacity-30 cursor-not-allowed bg-background-surface text-text-muted'
                : 'hover:bg-red-500/20 hover:border-red-500 cursor-pointer bg-background-surface text-red-400'
              }
            `}
            onClick={handleRemoveBeat}
            disabled={disabled || pattern.length <= 1}
            title="拍を削除"
          >
            −
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
        <span className="flex items-center gap-1">
          <span className="text-accent-primary">↓</span> ダウン
        </span>
        <span className="flex items-center gap-1">
          <span className="text-green-400">↑</span> アップ
        </span>
        <span className="flex items-center gap-1">
          <span className="text-orange-400">×</span> ミュート
        </span>
        <span className="flex items-center gap-1">
          <span className="text-text-muted">−</span> 休み
        </span>
        <span className="text-text-muted/50 ml-2">
          (+/−で拍を追加/削除、最大{MAX_STROKES}拍)
        </span>
      </div>
    </div>
  );
}
