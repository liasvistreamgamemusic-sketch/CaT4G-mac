import { useState, useRef, useEffect, useCallback } from 'react';
import { MetronomeBeatIndicator } from './MetronomeBeatIndicator';

export type TimeSignature = '4/4' | '3/4' | '6/8' | '2/4';

interface FloatingControlBarProps {
  transpose?: number;
  onTransposeChange?: (value: number) => void;
  capo?: number;
  onCapoChange?: (value: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onPlayFromBeginning?: () => void;
  metronomeEnabled?: boolean;
  onMetronomeToggle?: () => void;
  bpm?: number;
  onBpmChange?: (value: number) => void;
  timeSignature?: TimeSignature;
  onTimeSignatureChange?: (value: TimeSignature) => void;
  metronomeVolume?: number;
  onMetronomeVolumeChange?: (value: number) => void;
  currentBeat?: number;
  containerRef?: React.RefObject<HTMLElement>;
}

export function FloatingControlBar({
  transpose = 0,
  onTransposeChange,
  capo = 0,
  onCapoChange,
  isPlaying = false,
  onPlayPause,
  onPlayFromBeginning,
  metronomeEnabled = false,
  onMetronomeToggle,
  bpm = 120,
  onBpmChange,
  timeSignature = '4/4',
  onTimeSignatureChange,
  metronomeVolume = 0.7,
  onMetronomeVolumeChange,
  currentBeat = 0,
  containerRef,
}: FloatingControlBarProps) {
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10);

  // Hover state for expansion
  const [isExpanded, setIsExpanded] = useState(false);

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  // Handlers for transpose
  const handleTransposeDown = () => {
    if (transpose > -12) {
      onTransposeChange?.(transpose - 1);
    }
  };

  const handleTransposeUp = () => {
    if (transpose < 12) {
      onTransposeChange?.(transpose + 1);
    }
  };

  // Handlers for capo
  const handleCapoDown = () => {
    if (capo > -2) {
      onCapoChange?.(capo - 1);
    }
  };

  const handleCapoUp = () => {
    if (capo < 12) {
      onCapoChange?.(capo + 1);
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input, select')) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      let newX = dragRef.current.startPosX + deltaX;
      let newY = dragRef.current.startPosY - deltaY;

      // Constrain to container bounds if containerRef is provided
      if (containerRef?.current && barRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const barRect = barRef.current.getBoundingClientRect();

        const maxX = (containerRect.width - barRect.width) / 2;
        const minX = -maxX;
        const maxY = containerRect.height - barRect.height - 24;
        const minY = 0;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
      }

      setPosition({ x: newX, y: newY });
    },
    [isDragging, containerRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragRef.current = null;
  }, []);

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Keep expanded state while dragging
  const effectiveIsExpanded = isExpanded || isDragging;

  // Control button component for consistent styling
  const ControlButton = ({
    onClick,
    disabled,
    active,
    title,
    children,
    className = '',
  }: {
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    title?: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative p-2 rounded-xl
        transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      style={active
        ? {
            background: 'var(--btn-glass-active)',
            borderColor: 'var(--btn-glass-active-border)',
            color: 'var(--color-accent-primary-light)',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)',
          }
        : {
            color: 'var(--color-text-secondary)',
          }
      }
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'var(--btn-glass-hover)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }
      }}
    >
      {children}
    </button>
  );

  // Divider component
  const Divider = () => (
    <div
      className="w-px self-stretch my-1 opacity-0 transition-opacity duration-300"
      style={{
        background: 'var(--glass-premium-divider)',
        opacity: effectiveIsExpanded ? 1 : 0,
      }}
    />
  );

  return (
    <div
      ref={barRef}
      className="absolute select-none"
      style={{
        bottom: `${24 + position.y}px`,
        left: '50%',
        transform: `translateX(calc(-50% + ${position.x}px))`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 50,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => !isDragging && setIsExpanded(false)}
      onMouseDown={handleMouseDown}
    >
      {/* Outer glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15), transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.2)',
          opacity: isPlaying ? 0.8 : 0,
        }}
      />

      {/* Main container */}
      <div
        className="relative flex items-center overflow-hidden"
        style={{
          // Premium glassmorphism with CSS variables for theme support
          background: 'var(--glass-premium-bg)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          // Layered borders for depth
          border: '1px solid var(--glass-premium-border)',
          boxShadow: `
            var(--glass-premium-shadow),
            inset 0 1px 0 var(--glass-premium-highlight),
            inset 0 -1px 0 var(--glass-premium-inner-border)
          `,
          borderRadius: '24px',
          padding: effectiveIsExpanded ? '12px 24px' : '10px 18px',
          gap: effectiveIsExpanded ? '12px' : '8px',
          transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Inner highlight line */}
        <div
          className="absolute top-0 left-4 right-4 h-px pointer-events-none"
          style={{
            background: 'var(--glass-premium-divider)',
          }}
        />

        {/* Core controls - always visible */}
        <div className="flex items-center gap-2">
          {/* Play from Beginning - only visible when not playing */}
          {!isPlaying && (
            <ControlButton
              onClick={onPlayFromBeginning}
              title="最初から再生"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </ControlButton>
          )}

          {/* Play/Pause Button */}
          <ControlButton
            onClick={onPlayPause}
            active={isPlaying}
            title={isPlaying ? 'スクロール停止' : 'オートスクロール開始'}
            className={isPlaying ? 'animate-pulse' : ''}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </ControlButton>

          {/* Beat Indicator with enhanced styling */}
          <div className="px-2">
            <MetronomeBeatIndicator
              beatsPerMeasure={beatsPerMeasure}
              currentBeat={currentBeat}
              isPlaying={isPlaying}
            />
          </div>
        </div>

        {/* Expanded Controls */}
        <div
          className="flex items-center overflow-hidden transition-all duration-350"
          style={{
            maxWidth: effectiveIsExpanded ? '800px' : '0px',
            opacity: effectiveIsExpanded ? 1 : 0,
            gap: '12px',
            transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <Divider />

          {/* Capo */}
          <div
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              transform: effectiveIsExpanded ? 'translateX(0)' : 'translateX(-10px)',
              opacity: effectiveIsExpanded ? 1 : 0,
              transitionDelay: '50ms',
            }}
          >
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Capo</span>
            <div className="flex items-center gap-0.5 rounded-lg px-1" style={{ background: 'var(--input-bg)' }}>
              <button
                className="w-6 h-6 flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={handleCapoDown}
                disabled={capo <= -2}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.background = 'var(--btn-glass-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-sm">−</span>
              </button>
              <span
                className={`w-8 text-center font-mono text-sm font-semibold`}
                style={{
                  color: capo > 0 ? '#fb923c' : capo < 0 ? '#60a5fa' : 'var(--color-text-secondary)',
                }}
              >
                {capo === -1 ? '半↓' : capo === -2 ? '全↓' : capo}
              </span>
              <button
                className="w-6 h-6 flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={handleCapoUp}
                disabled={capo >= 12}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.background = 'var(--btn-glass-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-sm">+</span>
              </button>
            </div>
          </div>

          {/* Transpose */}
          <div
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              transform: effectiveIsExpanded ? 'translateX(0)' : 'translateX(-10px)',
              opacity: effectiveIsExpanded ? 1 : 0,
              transitionDelay: '100ms',
            }}
          >
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>移調</span>
            <div className="flex items-center gap-0.5 rounded-lg px-1" style={{ background: 'var(--input-bg)' }}>
              <button
                className="w-6 h-6 flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={handleTransposeDown}
                disabled={transpose <= -12}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.background = 'var(--btn-glass-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-sm">−</span>
              </button>
              <span
                className="w-8 text-center font-mono text-sm font-semibold"
                style={{
                  color: transpose !== 0 ? 'var(--color-accent-primary-light)' : 'var(--color-text-secondary)',
                }}
              >
                {transpose > 0 ? `+${transpose}` : transpose}
              </span>
              <button
                className="w-6 h-6 flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={handleTransposeUp}
                disabled={transpose >= 12}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.background = 'var(--btn-glass-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-sm">+</span>
              </button>
            </div>
          </div>

          {/* Reset Button */}
          {(capo !== 0 || transpose !== 0) && (
            <button
              className="text-xs px-2 py-1 rounded transition-all"
              onClick={() => {
                onCapoChange?.(0);
                onTransposeChange?.(0);
              }}
              style={{
                color: 'var(--color-text-muted)',
                transitionDelay: '150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.background = 'var(--btn-glass-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Reset
            </button>
          )}

          <Divider />

          {/* BPM */}
          <div
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              transform: effectiveIsExpanded ? 'translateX(0)' : 'translateX(-10px)',
              opacity: effectiveIsExpanded ? 1 : 0,
              transitionDelay: '200ms',
            }}
          >
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>BPM</span>
            <input
              type="number"
              value={bpm}
              onChange={(e) => onBpmChange?.(parseInt(e.target.value) || 120)}
              min={40}
              max={240}
              className="w-14 px-2 py-1 rounded-lg text-center font-mono text-sm transition-all duration-200"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--color-text-secondary)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--input-border-focus)';
                e.currentTarget.style.boxShadow = 'var(--input-shadow-focus)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--input-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Time Signature */}
          <div
            className="transition-all duration-300"
            style={{
              transform: effectiveIsExpanded ? 'translateX(0)' : 'translateX(-10px)',
              opacity: effectiveIsExpanded ? 1 : 0,
              transitionDelay: '250ms',
            }}
          >
            <select
              value={timeSignature}
              onChange={(e) => onTimeSignatureChange?.(e.target.value as TimeSignature)}
              className="rounded-lg px-2 py-1 text-sm cursor-pointer transition-all duration-200"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--color-text-secondary)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--input-border-focus)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--input-border)';
              }}
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="6/8">6/8</option>
              <option value="2/4">2/4</option>
            </select>
          </div>

          <Divider />

          {/* Metronome Toggle */}
          <div
            className="transition-all duration-300"
            style={{
              transform: effectiveIsExpanded ? 'translateX(0)' : 'translateX(-10px)',
              opacity: effectiveIsExpanded ? 1 : 0,
              transitionDelay: '300ms',
            }}
          >
            <ControlButton
              onClick={onMetronomeToggle}
              active={metronomeEnabled}
              title={metronomeEnabled ? 'メトロノーム停止 (M)' : 'メトロノーム開始 (M)'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </ControlButton>
          </div>

          {/* Volume Slider */}
          <div
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              transform: effectiveIsExpanded ? 'translateX(0)' : 'translateX(-10px)',
              opacity: effectiveIsExpanded ? 1 : 0,
              transitionDelay: '350ms',
            }}
          >
            <svg className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={metronomeVolume}
              onChange={(e) => onMetronomeVolumeChange?.(parseFloat(e.target.value))}
              className="w-16 h-1 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-3
                         [&::-webkit-slider-thumb]:h-3
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-purple-400
                         [&::-webkit-slider-thumb]:shadow-lg
                         [&::-webkit-slider-thumb]:shadow-purple-500/30
                         [&::-webkit-slider-thumb]:transition-transform
                         [&::-webkit-slider-thumb]:hover:scale-125"
              style={{
                background: 'var(--input-border)',
              }}
              title="メトロノーム音量"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
