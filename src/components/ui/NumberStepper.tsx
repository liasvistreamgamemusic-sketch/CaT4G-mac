import { Minus, Plus } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
  disabled?: boolean;
  editable?: boolean;  // 新規追加
}

export function NumberStepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  suffix,
  className = '',
  disabled = false,
  editable = false,  // 新規追加
}: NumberStepperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // valueが外部から変更された場合にinputValueも更新
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  // 編集モード開始時にフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDecrement = () => {
    if (disabled) return;
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    if (disabled) return;
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const handleValueClick = () => {
    if (editable && !disabled) {
      setIsEditing(true);
      setInputValue(value.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const commitValue = useCallback(() => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min === -Infinity ? -99999 : min, Math.min(max === Infinity ? 99999 : max, parsed));
      onChange(clamped);
    }
    setIsEditing(false);
  }, [inputValue, min, max, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitValue();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  const isDecrementDisabled = disabled || value <= min;
  const isIncrementDisabled = disabled || value >= max;

  return (
    <div
      className={`
        flex items-center gap-2
        bg-background
        border border-[var(--glass-premium-border)]
        rounded-lg
        px-1 py-1
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {/* Decrement button */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        className={`
          flex items-center justify-center
          w-7 h-7
          rounded-md
          transition-colors duration-150
          ${isDecrementDisabled
            ? 'text-text-muted cursor-not-allowed opacity-50'
            : 'text-text-secondary hover:text-text-primary hover:bg-[var(--btn-glass-hover)]'
          }
        `}
        aria-label="Decrease value"
      >
        <Minus size={14} />
      </button>

      {/* Value display / input */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={commitValue}
          onKeyDown={handleKeyDown}
          className="w-12 text-center text-sm font-medium bg-transparent border-none outline-none text-text-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      ) : (
        <span
          onClick={handleValueClick}
          className={`text-text-primary text-sm font-medium min-w-[2.5rem] text-center select-none ${editable && !disabled ? 'cursor-pointer hover:text-accent-primary' : ''}`}
        >
          {value}
          {suffix && <span className="text-text-secondary ml-0.5">{suffix}</span>}
        </span>
      )}

      {/* Increment button */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        className={`
          flex items-center justify-center
          w-7 h-7
          rounded-md
          transition-colors duration-150
          ${isIncrementDisabled
            ? 'text-text-muted cursor-not-allowed opacity-50'
            : 'text-text-secondary hover:text-text-primary hover:bg-[var(--btn-glass-hover)]'
          }
        `}
        aria-label="Increase value"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default NumberStepper;
