/**
 * NumberStepper - Dark mode compatible number input with increment/decrement buttons
 * Uses CSS variables from the project theme system for consistent styling
 */

import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
  disabled?: boolean;
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
}: NumberStepperProps) {
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

      {/* Value display */}
      <span className="text-text-primary text-sm font-medium min-w-[2.5rem] text-center select-none">
        {value}
        {suffix && <span className="text-text-secondary ml-0.5">{suffix}</span>}
      </span>

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
