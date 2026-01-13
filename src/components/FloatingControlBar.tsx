import { useState, useRef, useEffect, useCallback } from 'react';
import { MetronomeBeatIndicator } from './MetronomeBeatIndicator';
import { NumberStepper } from '@/components/ui/NumberStepper';

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
  /** スケール係数（0.6〜1.0、デフォルト1.0） */
  scale?: number;
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
  scale = 1.0,
}: FloatingControlBarProps) {
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10);

  // スケーリングされたサイズ
  const iconSizeLg = 20 * scale;
  const iconSizeMd = 16 * scale;
  const btnSize = 24 * scale;
  const fontSize = {
    xs: 12 * scale,
    sm: 14 * scale,
  };
  const spacing = {
    xs: 4 * scale,
    sm: 8 * scale,
    md: 12 * scale,
    lg: 24 * scale,
  };

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [shouldWrap, setShouldWrap] = useState(false);
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
      let newY = dragRef.current.startPosY + deltaY;

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

  // リサイズ時にバーの位置を制約内に収める
  useEffect(() => {
    const constrainPosition = () => {
      if (!containerRef?.current || !barRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const barRect = barRef.current.getBoundingClientRect();

      // バーがコンテナより大きい場合は中央に配置
      if (barRect.width >= containerRect.width) {
        setPosition(prev => ({ ...prev, x: 0 }));
        return;
      }

      const maxX = (containerRect.width - barRect.width) / 2;
      const minX = -maxX;
      const maxY = Math.max(0, containerRect.height - barRect.height - 24);
      const minY = 0;

      setPosition(prev => ({
        x: Math.max(minX, Math.min(maxX, prev.x)),
        y: Math.max(minY, Math.min(maxY, prev.y)),
      }));
    };

    // 初回実行
    constrainPosition();

    // ウィンドウリサイズ時
    window.addEventListener('resize', constrainPosition);

    // ResizeObserver でコンテナサイズ変更を監視
    const observer = new ResizeObserver(constrainPosition);
    if (containerRef?.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', constrainPosition);
      observer.disconnect();
    };
  }, [containerRef]);

  // バーがコンテナ幅を超えたら2行に分割
  const group1Ref = useRef<HTMLDivElement>(null);
  const group2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef?.current;
    const group1 = group1Ref.current;
    const group2 = group2Ref.current;
    if (!container || !group1 || !group2) return;

    const checkOverflow = () => {
      const containerWidth = container.clientWidth;
      // 2つのグループの幅を合計（gap + padding込み）
      const totalWidth = group1.offsetWidth + group2.offsetWidth + 80; // 80 = gaps + padding
      const needsWrap = totalWidth > containerWidth;
      setShouldWrap(needsWrap);
    };

    // 初回チェック（レンダリング後）
    requestAnimationFrame(checkOverflow);

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

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
        relative rounded-xl
        transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      style={{
        padding: `${spacing.sm}px`,
        ...(active
          ? {
              background: 'var(--btn-glass-active)',
              borderColor: 'var(--btn-glass-active-border)',
              color: 'var(--color-accent-primary-light)',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)',
            }
          : {
              color: 'var(--color-text-secondary)',
            }
        ),
      }}
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
      className="w-px self-stretch my-1"
      style={{
        background: 'var(--glass-premium-divider)',
        opacity: 1,
      }}
    />
  );

  return (
    <div
      ref={barRef}
      className="absolute select-none"
      style={{
        top: `${80 + position.y}px`,
        left: '50%',
        transform: `translateX(calc(-50% + ${position.x}px))`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 50,
      }}
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
        className={`relative flex items-center ${shouldWrap ? 'flex-wrap justify-center' : ''}`}
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
          borderRadius: `${24 * scale}px`,
          padding: `${spacing.md}px ${spacing.lg}px`,
          gap: shouldWrap ? `${spacing.sm}px ${spacing.md}px` : `${spacing.md}px`,
        }}
      >
        {/* Inner highlight line */}
        <div
          className="absolute top-0 left-4 right-4 h-px pointer-events-none"
          style={{
            background: 'var(--glass-premium-divider)',
          }}
        />

        {/* 1行目グループ: Capo, 移調, 再生コントロール */}
        <div ref={group1Ref} className="flex items-center" style={{ gap: `${spacing.md}px` }}>
          {/* Capo */}
          <div className="flex items-center" style={{ gap: `${spacing.sm}px` }}>
            <span
              className="font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-text-muted)', fontSize: `${fontSize.xs}px` }}
            >
              Capo
            </span>
            <div
              className="flex items-center rounded-lg"
              style={{ background: 'var(--input-bg)', gap: `${2 * scale}px`, padding: `0 ${spacing.xs}px` }}
            >
              <button
                className="flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)', width: `${btnSize}px`, height: `${btnSize}px` }}
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
                <span style={{ fontSize: `${fontSize.sm}px` }}>−</span>
              </button>
              <span
                className="text-center font-mono font-semibold"
                style={{
                  width: `${32 * scale}px`,
                  fontSize: `${fontSize.sm}px`,
                  color: capo > 0 ? '#fb923c' : capo < 0 ? '#60a5fa' : 'var(--color-text-secondary)',
                }}
              >
                {capo === -1 ? '半↓' : capo === -2 ? '全↓' : capo}
              </span>
              <button
                className="flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)', width: `${btnSize}px`, height: `${btnSize}px` }}
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
                <span style={{ fontSize: `${fontSize.sm}px` }}>+</span>
              </button>
            </div>
          </div>

          {/* Transpose */}
          <div className="flex items-center" style={{ gap: `${spacing.sm}px` }}>
            <span
              className="font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-text-muted)', fontSize: `${fontSize.xs}px` }}
            >
              移調
            </span>
            <div
              className="flex items-center rounded-lg"
              style={{ background: 'var(--input-bg)', gap: `${2 * scale}px`, padding: `0 ${spacing.xs}px` }}
            >
              <button
                className="flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)', width: `${btnSize}px`, height: `${btnSize}px` }}
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
                <span style={{ fontSize: `${fontSize.sm}px` }}>−</span>
              </button>
              <span
                className="text-center font-mono font-semibold"
                style={{
                  width: `${32 * scale}px`,
                  fontSize: `${fontSize.sm}px`,
                  color: transpose !== 0 ? 'var(--color-accent-primary-light)' : 'var(--color-text-secondary)',
                }}
              >
                {transpose > 0 ? `+${transpose}` : transpose}
              </span>
              <button
                className="flex items-center justify-center rounded transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-muted)', width: `${btnSize}px`, height: `${btnSize}px` }}
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
                <span style={{ fontSize: `${fontSize.sm}px` }}>+</span>
              </button>
            </div>
          </div>

          <Divider />

          {/* Play from Beginning - only visible when not playing */}
          {!isPlaying && (
            <ControlButton
              onClick={onPlayFromBeginning}
              title="最初から再生"
            >
              <svg style={{ width: `${iconSizeLg}px`, height: `${iconSizeLg}px` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg style={{ width: `${iconSizeLg}px`, height: `${iconSizeLg}px` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg style={{ width: `${iconSizeLg}px`, height: `${iconSizeLg}px` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </ControlButton>

          {/* Beat Indicator with enhanced styling */}
          <div style={{ padding: `0 ${spacing.sm}px` }}>
            <MetronomeBeatIndicator
              beatsPerMeasure={beatsPerMeasure}
              currentBeat={currentBeat}
              isPlaying={isPlaying}
              scale={scale}
            />
          </div>
        </div>

        {/* 2行目グループ: BPM, メトロノーム, 音量 */}
        <div ref={group2Ref} className="flex items-center" style={{ gap: `${spacing.md}px` }}>
          {/* BPM */}
          <div className="flex items-center" style={{ gap: `${spacing.sm}px` }}>
            <span
              className="font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-text-muted)', fontSize: `${fontSize.xs}px` }}
            >
              BPM
            </span>
            <NumberStepper
              value={bpm}
              onChange={(value) => onBpmChange?.(value)}
              min={40}
              max={240}
              step={10}
              editable={true}
              scale={scale}
            />
          </div>

          {/* Metronome Toggle */}
          <ControlButton
            onClick={onMetronomeToggle}
            active={metronomeEnabled}
            title={metronomeEnabled ? 'メトロノーム停止 (M)' : 'メトロノーム開始 (M)'}
          >
            <svg style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </ControlButton>

          {/* Time Signature */}
          <select
            value={timeSignature}
            onChange={(e) => onTimeSignatureChange?.(e.target.value as TimeSignature)}
            className="rounded-lg cursor-pointer transition-all duration-200"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--color-text-secondary)',
              fontSize: `${fontSize.sm}px`,
              padding: `${spacing.xs}px ${spacing.sm}px`,
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

          {/* Volume Slider */}
          <div className="flex items-center" style={{ gap: `${spacing.sm}px` }}>
            <svg style={{ width: `${iconSizeMd}px`, height: `${iconSizeMd}px`, color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={metronomeVolume}
              onChange={(e) => onMetronomeVolumeChange?.(parseFloat(e.target.value))}
              className="volume-slider rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-purple-400
                         [&::-webkit-slider-thumb]:shadow-lg
                         [&::-webkit-slider-thumb]:shadow-purple-500/30
                         [&::-webkit-slider-thumb]:transition-transform
                         [&::-webkit-slider-thumb]:hover:scale-125"
              style={{
                background: 'var(--input-border)',
                width: `${64 * scale}px`,
                height: `${4 * scale}px`,
              }}
              ref={(el) => {
                if (el) {
                  const thumbSize = `${12 * scale}px`;
                  el.style.setProperty('--thumb-w', thumbSize);
                  el.style.setProperty('--thumb-h', thumbSize);
                }
              }}
              title="メトロノーム音量"
            />
          </div>

          {/* Reset Button */}
          {(capo !== 0 || transpose !== 0) && (
            <button
              className="rounded transition-all"
              onClick={() => {
                onCapoChange?.(0);
                onTransposeChange?.(0);
              }}
              style={{
                color: 'var(--color-text-muted)',
                fontSize: `${fontSize.xs}px`,
                padding: `${spacing.xs}px ${spacing.sm}px`,
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
        </div>
      </div>
    </div>
  );
}
